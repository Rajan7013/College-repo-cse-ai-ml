'use server';

import { auth } from '@clerk/nextjs/server';
import { adminDb } from '@/lib/firebase-admin';
import { r2Client, R2_BUCKET_NAME } from '@/lib/r2';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getResourceById, type Resource } from './resources';

export interface Profile {
    displayName: string;
    rollNumber: string;
    year: number;
    branch: string;
    bio: string;
    photoURL: string;
}

export interface UserProfile {
    uid: string;
    email: string;
    role: string;
    profile: Profile;
    favorites: string[];
    recentlyViewed: string[];
    downloads: string[];
}

/**
 * Get current user's profile
 */
export async function getProfile(): Promise<UserProfile | null> {
    try {
        const { userId } = await auth();
        if (!userId) return null;

        const userDoc = await adminDb.collection('users').doc(userId).get();

        if (!userDoc.exists) return null;

        const data = userDoc.data();
        if (!data) return null;

        return {
            uid: data.uid,
            email: data.email,
            role: data.role,
            profile: data.profile || {
                displayName: data.email.split('@')[0],
                rollNumber: '',
                year: 1,
                branch: 'CSE_AI_ML',
                bio: '',
                photoURL: ''
            },
            favorites: data.favorites || [],
            recentlyViewed: data.recentlyViewed || [],
            downloads: data.downloads || []
        };
    } catch (error) {
        console.error('Error getting profile:', error);
        return null;
    }
}

/**
 * Update user profile
 */
export async function updateProfile(profileData: Partial<Profile>): Promise<{ success: boolean; message: string }> {
    try {
        const { userId } = await auth();
        if (!userId) {
            return { success: false, message: 'Not authenticated' };
        }

        await adminDb.collection('users').doc(userId).update({
            profile: profileData
        });

        return { success: true, message: 'Profile updated successfully' };
    } catch (error) {
        console.error('Error updating profile:', error);
        return { success: false, message: 'Failed to update profile' };
    }
}

/**
 * Upload profile picture to R2
 */
export async function uploadProfilePicture(formData: FormData): Promise<{ success: boolean; message: string; photoURL?: string }> {
    try {
        const { userId } = await auth();
        if (!userId) {
            return { success: false, message: 'Not authenticated' };
        }

        const file = formData.get('photo') as File;
        if (!file) {
            return { success: false, message: 'No file provided' };
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return { success: false, message: 'File must be an image' };
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return { success: false, message: 'File size must be less than 5MB' };
        }

        // Upload to R2
        const fileExt = file.name.split('.').pop();
        const key = `profile-pictures/${userId}.${fileExt}`;
        const fileBuffer = Buffer.from(await file.arrayBuffer());

        await r2Client.send(
            new PutObjectCommand({
                Bucket: R2_BUCKET_NAME,
                Key: key,
                Body: fileBuffer,
                ContentType: file.type,
            })
        );

        // Generate public URL
        const photoURL = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`;

        // Update user profile with photo URL using Admin SDK
        await adminDb.collection('users').doc(userId).update({
            'profile.photoURL': photoURL
        });

        return { success: true, message: 'Profile picture uploaded', photoURL };
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        return { success: false, message: 'Failed to upload picture' };
    }
}

/**
 * Add resource to favorites
 */
export async function addToFavorites(resourceId: string): Promise<{ success: boolean; message: string }> {
    try {
        const { userId } = await auth();
        if (!userId) {
            return { success: false, message: 'Not authenticated' };
        }

        const userRef = adminDb.collection('users').doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return { success: false, message: 'User not found' };
        }

        const favorites = userDoc.data()?.favorites || [];

        if (favorites.includes(resourceId)) {
            return { success: false, message: 'Already in favorites' };
        }

        await userRef.update({
            favorites: [...favorites, resourceId]
        });

        return { success: true, message: 'Added to favorites' };
    } catch (error) {
        console.error('Error adding to favorites:', error);
        return { success: false, message: 'Failed to add to favorites' };
    }
}

/**
 * Remove resource from favorites
 */
export async function removeFromFavorites(resourceId: string): Promise<{ success: boolean; message: string }> {
    try {
        const { userId } = await auth();
        if (!userId) {
            return { success: false, message: 'Not authenticated' };
        }

        const userRef = adminDb.collection('users').doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return { success: false, message: 'User not found' };
        }

        const favorites = userDoc.data()?.favorites || [];

        await userRef.update({
            favorites: favorites.filter((id: string) => id !== resourceId)
        });

        return { success: true, message: 'Removed from favorites' };
    } catch (error) {
        console.error('Error removing from favorites:', error);
        return { success: false, message: 'Failed to remove from favorites' };
    }
}

/**
 * Add resource to recently viewed (max 10)
 */
export async function addToRecentlyViewed(resourceId: string): Promise<void> {
    try {
        const { userId } = await auth();
        if (!userId) return;

        const userRef = adminDb.collection('users').doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) return;

        let recentlyViewed = userDoc.data()?.recentlyViewed || [];

        // Remove if already exists
        recentlyViewed = recentlyViewed.filter((id: string) => id !== resourceId);

        // Add to beginning
        recentlyViewed.unshift(resourceId);

        // Keep only last 10
        recentlyViewed = recentlyViewed.slice(0, 10);

        await userRef.update({ recentlyViewed });
    } catch (error) {
        console.error('Error adding to recently viewed:', error);
    }
}

/**
 * Add resource to download history
 */
export async function addToDownloads(resourceId: string): Promise<void> {
    try {
        const { userId } = await auth();
        if (!userId) return;

        const userRef = adminDb.collection('users').doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) return;

        const downloads = userDoc.data()?.downloads || [];

        // Add if not already in list
        if (!downloads.includes(resourceId)) {
            await userRef.update({
                downloads: [resourceId, ...downloads]
            });
        }
    } catch (error) {
        console.error('Error adding to downloads:', error);
    }
}

/**
 * Get favorite resources with full data
 */
export async function getFavoriteResources(): Promise<Resource[]> {
    try {
        const profile = await getProfile();
        if (!profile || !profile.favorites.length) return [];

        const resources = await Promise.all(
            profile.favorites.map(id => getResourceById(id))
        );

        return resources.filter((r): r is Resource => r !== null);
    } catch (error) {
        console.error('Error getting favorite resources:', error);
        return [];
    }
}

/**
 * Get recently viewed resources with full data
 */
export async function getRecentlyViewedResources(): Promise<Resource[]> {
    try {
        const profile = await getProfile();
        if (!profile || !profile.recentlyViewed.length) return [];

        const resources = await Promise.all(
            profile.recentlyViewed.map(id => getResourceById(id))
        );

        return resources.filter((r): r is Resource => r !== null);
    } catch (error) {
        console.error('Error getting recently viewed resources:', error);
        return [];
    }
}

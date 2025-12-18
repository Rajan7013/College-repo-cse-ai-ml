'use server';

import { adminDb } from '@/lib/firebase-admin';
import { auth } from '@clerk/nextjs/server';
import { UserProfile, UserProfileFormData, Feedback, FeedbackFormData } from '@/lib/types/profile';

/**
 * Get user profile by userId
 */
export async function getUserProfile(userId?: string): Promise<UserProfile | null> {
    try {
        const { userId: authUserId } = await auth();
        const targetUserId = userId || authUserId;

        if (!targetUserId) return null;

        const snapshot = await adminDb.collection('user_profiles')
            .where('userId', '==', targetUserId)
            .limit(1)
            .get();

        if (snapshot.empty) return null;

        const doc = snapshot.docs[0];
        const data = doc.data();

        return {
            id: doc.id,
            ...data,
            dateOfBirth: data.dateOfBirth?.toDate(),
            certifications: data.certifications?.map((cert: any) => ({
                ...cert,
                date: cert.date?.toDate()
            })),
            awards: data.awards?.map((award: any) => ({
                ...award,
                date: award.date?.toDate()
            })),
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate(),
        } as UserProfile;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
}

/**
 * Create or update user profile
 */
export async function upsertUserProfile(
    data: Partial<UserProfileFormData>
): Promise<{ success: boolean; error?: string }> {
    try {
        const { userId } = await auth();
        if (!userId) {
            return { success: false, error: 'Unauthorized' };
        }

        // Check if profile exists
        const existingProfile = await getUserProfile(userId);

        const profileData = {
            ...data,
            userId,
            updatedAt: new Date(),
        };

        if (existingProfile) {
            // Update existing profile
            await adminDb.collection('user_profiles').doc(existingProfile.id).update(profileData);
        } else {
            // Create new profile
            await adminDb.collection('user_profiles').add({
                ...profileData,
                createdAt: new Date(),
            });
        }

        return { success: true };
    } catch (error) {
        console.error('Error upserting profile:', error);
        return { success: false, error: 'Failed to save profile' };
    }
}

/**
 * Update profile photo
 */
export async function updateProfilePhoto(photoUrl: string): Promise<{ success: boolean; error?: string }> {
    try {
        const { userId } = await auth();
        if (!userId) {
            return { success: false, error: 'Unauthorized' };
        }

        const profile = await getUserProfile(userId);
        if (!profile) {
            return { success: false, error: 'Profile not found' };
        }

        await adminDb.collection('user_profiles').doc(profile.id).update({
            profilePhoto: photoUrl,
            updatedAt: new Date(),
        });

        return { success: true };
    } catch (error) {
        console.error('Error updating profile photo:', error);
        return { success: false, error: 'Failed to update photo' };
    }
}

/**
 * Submit feedback
 */
export async function submitFeedback(data: FeedbackFormData): Promise<{ success: boolean; error?: string }> {
    try {
        const { userId } = await auth();

        const feedbackData = {
            ...data,
            userId: userId || 'anonymous',
            status: 'pending' as const,
            createdAt: new Date(),
        };

        await adminDb.collection('feedback').add(feedbackData);

        return { success: true };
    } catch (error) {
        console.error('Error submitting feedback:', error);
        return { success: false, error: 'Failed to submit feedback' };
    }
}

/**
 * Get all feedback (admin only)
 */
export async function getAllFeedback(): Promise<Feedback[]> {
    try {
        const { userId } = await auth();
        if (!userId) {
            return [];
        }

        // TODO: Add admin check here
        const snapshot = await adminDb.collection('feedback')
            .orderBy('createdAt', 'desc')
            .get();

        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate(),
            } as Feedback;
        });
    } catch (error) {
        console.error('Error fetching feedback:', error);
        return [];
    }
}

/**
 * Update feedback status (admin only)
 */
export async function updateFeedbackStatus(
    id: string,
    status: 'pending' | 'reviewed' | 'resolved'
): Promise<{ success: boolean; error?: string }> {
    try {
        const { userId } = await auth();
        if (!userId) {
            return { success: false, error: 'Unauthorized' };
        }

        // TODO: Add admin check here
        await adminDb.collection('feedback').doc(id).update({ status });

        return { success: true };
    } catch (error) {
        console.error('Error updating feedback status:', error);
        return { success: false, error: 'Failed to update status' };
    }
}

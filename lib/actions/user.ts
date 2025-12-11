'use server';

import { auth, currentUser } from '@clerk/nextjs/server';
import { adminDb } from '@/lib/firebase-admin';

export type UserRole = 'student' | 'admin';

export interface UserData {
    uid: string;
    email: string;
    role: UserRole;
    createdAt: Date;
    lastLogin: Date;
}

/**
 * Syncs the current Clerk user with Firestore
 * Creates a new user document if it doesn't exist, or updates lastLogin if it does
 * @returns The user's role from Firestore, or null if not authenticated
 */
export async function syncUser(): Promise<UserRole | null> {
    try {
        // Get the current authenticated user from Clerk
        const { userId } = await auth();

        if (!userId) {
            return null;
        }

        const user = await currentUser();

        if (!user || !user.emailAddresses[0]?.emailAddress) {
            return null;
        }

        const email = user.emailAddresses[0].emailAddress;

        // Use Admin SDK to bypass security rules
        const userRef = adminDb.collection('users').doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            // Create new user document with profile structure
            const displayName = user.firstName || email.split('@')[0];

            const newUserData = {
                uid: userId,
                email: email,
                role: 'student' as UserRole,
                createdAt: new Date(),
                lastLogin: new Date(),
                profile: {
                    displayName: displayName,
                    rollNumber: '',
                    year: 1,
                    branch: 'CSE_AI_ML',
                    bio: '',
                    photoURL: ''
                },
                favorites: [],
                recentlyViewed: [],
                downloads: []
            };

            await userRef.set(newUserData);
            console.log(`Created new user in Firestore: ${email} with role: student`);
            return 'student';
        } else {
            // Update lastLogin for existing user
            await userRef.update({
                lastLogin: new Date(),
            });

            const userData = userDoc.data();
            const role = (userData?.role as UserRole) || 'student';

            // console.log(`Updated lastLogin for user: ${email}, role: ${role}`);
            return role;
        }
    } catch (error) {
        console.error('Error syncing user:', error);
        return null;
    }
}

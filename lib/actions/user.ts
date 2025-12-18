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
 * Role is determined by:
 * 1. Hardcoded SuperAdmin Check
 * 2. 'user_roles' whitelist collection
 * 3. Default to 'student'
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

        // --- ROLE DETERMINATION LOGIC ---
        let assignedRole: UserRole = 'student';

        // 1. SuperAdmin Hardcode
        if (email === 'rajanprasaila@gmail.com') {
            assignedRole = 'admin'; // We treat SuperAdmin as 'admin' in types, but with extra privileges in code
        } else {
            // 2. Check Whitelist
            const roleDoc = await adminDb.collection('user_roles').doc(email).get();
            if (roleDoc.exists) {
                assignedRole = roleDoc.data()?.role as UserRole || 'student';
            }
        }

        // Use Admin SDK to bypass security rules
        const userRef = adminDb.collection('users').doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            // Create new user document
            const displayName = user.firstName || email.split('@')[0];

            const newUserData = {
                uid: userId,
                email: email,
                role: assignedRole, // Use determined role
                createdAt: new Date(),
                lastLogin: new Date(),
                profile: {
                    displayName: displayName,
                    rollNumber: '',
                    year: 1,
                    branch: 'CSE_AI_ML',
                    bio: '',
                    photoURL: user.imageUrl || ''
                },
                favorites: [],
                recentlyViewed: [],
                downloads: []
            };

            await userRef.set(newUserData);
            console.log(`Created new user: ${email} -> Role: ${assignedRole}`);
            return assignedRole;
        } else {
            // Update lastLogin AND Ensure Role Sync (in case it changed in whitelist)
            // But only if we are forced to sync. 
            // Better strategy: If the DB role is different from assignedRole (and assignedRole comes from whitelist),
            // should we overwrite? Yes, whitelist is source of truth for Role.

            // However, we don't want to demote SuperAdmin if DB says student.
            // Let's rely on the logic:

            const currentDbRole = userDoc.data()?.role;

            // If calculated role differs from stored role, update it.
            // Exception: If manual change in DB vs whitelist? Whitelist wins.

            // Prepare update data
            const updateData: any = {
                lastLogin: new Date(),
                'profile.photoURL': user.imageUrl || '',
                // We could also sync displayName if we wanted: 'profile.displayName': user.firstName || ...
            };

            // If calculated role differs from stored role, update it.
            if (currentDbRole !== assignedRole) {
                updateData.role = assignedRole;
                console.log(`Updated user role & profile sync: ${email} -> ${assignedRole}`);
            }

            await userRef.update(updateData);

            return assignedRole;
        }
    } catch (error) {
        console.error('Error syncing user:', error);
        return null;
    }
}

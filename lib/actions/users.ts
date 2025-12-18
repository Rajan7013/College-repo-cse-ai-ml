'use server';

import { auth } from '@clerk/nextjs/server';
import { adminDb } from '@/lib/firebase-admin';

export interface UserData {
    id: string;
    email: string;
    role: 'admin' | 'student';
    profile: {
        displayName: string;
        rollNumber?: string;
        year?: number;
        branch?: string;
    };
    createdAt: Date;
    blocked?: boolean;
}

/**
 * Get all users (admin only)
 */
export async function getAllUsers(): Promise<UserData[]> {
    try {
        const { userId } = await auth();
        if (!userId) return [];

        // Check if user is admin
        const userDoc = await adminDb.collection('users').doc(userId).get();

        if (!userDoc.exists || userDoc.data()?.role !== 'admin') {
            return [];
        }

        const usersSnapshot = await adminDb.collection('users').get();
        const users: UserData[] = [];

        usersSnapshot.forEach((doc) => {
            const data = doc.data();
            users.push({
                id: doc.id,
                email: data.email,
                role: data.role || 'student',
                profile: data.profile || {
                    displayName: data.email.split('@')[0],
                    rollNumber: '',
                    year: 1,
                    branch: 'CSE_AI_ML'
                },
                createdAt: data.createdAt?.toDate() || new Date(),
                blocked: data.blocked || false
            });
        });

        return users.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
        console.error('Error getting users:', error);
        return [];
    }
}

/**
 * Get all whitelist rules (Admin only)
 */
export async function getManagedUsers() {
    try {
        const { userId } = await auth();
        if (!userId) return { users: [], isSuperAdmin: false };

        // Basic check
        const userDoc = await adminDb.collection('users').doc(userId).get();
        if (!userDoc.exists || userDoc.data()?.role !== 'admin') return { users: [], isSuperAdmin: false };

        const currentUserEmail = userDoc.data()?.email;
        const isSuperAdmin = currentUserEmail === 'rajanprasaila@gmail.com';

        const snapshot = await adminDb.collection('user_roles').get();
        const users = snapshot.docs.map(doc => {
            const data = doc.data();
            // Handle Firestore Timestamp or Date
            let addedAt = data.addedAt;
            if (addedAt && typeof addedAt.toDate === 'function') {
                addedAt = addedAt.toDate().toISOString();
            } else if (addedAt instanceof Date) {
                addedAt = addedAt.toISOString();
            } else {
                addedAt = new Date().toISOString();
            }

            return {
                email: doc.id,
                role: data.role,
                addedBy: data.addedBy,
                addedAt: addedAt
            };
        });

        return { users, isSuperAdmin };
    } catch (error) {
        console.error('Error getting managed users:', error);
        return { users: [], isSuperAdmin: false };
    }
}

/**
 * Add or Update a user's role by Email (Admin only)
 */
export async function addUserByEmail(targetEmail: string, role: 'admin' | 'student') {
    try {
        const { userId } = await auth();
        if (!userId) return { success: false, message: 'Not authenticated' };

        const currentUser = await adminDb.collection('users').doc(userId).get();
        if (!currentUser.exists || currentUser.data()?.role !== 'admin') {
            return { success: false, message: 'Unauthorized' };
        }

        const currentUserEmail = currentUser.data()?.email;
        const isSuperAdmin = currentUserEmail === 'rajanprasaila@gmail.com';

        // simple admin cannot add other admins, only students
        if (role === 'admin' && !isSuperAdmin) {
            return { success: false, message: 'Only SuperAdmin can add other Admins.' };
        }

        // Add to whitelist
        await adminDb.collection('user_roles').doc(targetEmail).set({
            email: targetEmail,
            role,
            addedBy: currentUserEmail,
            addedAt: new Date()
        });

        // Also try to update existing user doc if they are already logged in
        const userQuery = await adminDb.collection('users').where('email', '==', targetEmail).limit(1).get();
        if (!userQuery.empty) {
            await userQuery.docs[0].ref.update({ role });
        }

        return { success: true, message: `User ${targetEmail} set as ${role}` };
    } catch (error) {
        console.error('Error adding user:', error);
        return { success: false, message: 'Failed to add user' };
    }
}

/**
 * Remove a user from whitelist (Admin only)
 */
export async function removeUserByEmail(targetEmail: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { success: false, message: 'Not authenticated' };

        const currentUser = await adminDb.collection('users').doc(userId).get();
        if (!currentUser.exists || currentUser.data()?.role !== 'admin') {
            return { success: false, message: 'Unauthorized' };
        }

        const currentUserEmail = currentUser.data()?.email;
        const isSuperAdmin = currentUserEmail === 'rajanprasaila@gmail.com';

        // Check target role
        const targetDoc = await adminDb.collection('user_roles').doc(targetEmail).get();
        if (targetDoc.exists) {
            const targetRole = targetDoc.data()?.role;
            // Admin cannot delete Admin
            if (targetRole === 'admin' && !isSuperAdmin) {
                return { success: false, message: 'Only SuperAdmin can remove other Admins.' };
            }
        }

        // Remove from whitelist
        await adminDb.collection('user_roles').doc(targetEmail).delete();

        // Optional: Downgrade existing user to student? Or leave them?
        // Logic says "if nothing email id is not saved then default ... is count as student"
        // So deleting from whitelist effectively demotes them on next sync.
        // We can force update the live doc too.

        const userQuery = await adminDb.collection('users').where('email', '==', targetEmail).limit(1).get();
        if (!userQuery.empty) {
            await userQuery.docs[0].ref.update({ role: 'student' });
        }

        return { success: true, message: `Removed ${targetEmail} from managed list` };

    } catch (error) {
        console.error('Error removing user:', error);
        return { success: false, message: 'Failed to remove user' };
    }
}

/**
 * Change user role (admin only)
 */
export async function changeUserRole(
    targetUserId: string,
    newRole: 'admin' | 'student'
): Promise<{ success: boolean; message: string }> {
    try {
        const { userId } = await auth();
        if (!userId) {
            return { success: false, message: 'Not authenticated' };
        }

        // Check if current user is admin
        const currentUserDoc = await adminDb.collection('users').doc(userId).get();

        if (!currentUserDoc.exists || currentUserDoc.data()?.role !== 'admin') {
            return { success: false, message: 'Unauthorized: Admin access required' };
        }

        // Don't allow changing own role
        if (userId === targetUserId) {
            return { success: false, message: 'Cannot change your own role' };
        }

        // Update target user's role
        const targetUserDoc = await adminDb.collection('users').doc(targetUserId).get();
        if (targetUserDoc.exists && targetUserDoc.data()?.email === 'rajanprasaila@gmail.com') {
            return { success: false, message: 'Super Admin cannot be modified' };
        }

        await adminDb.collection('users').doc(targetUserId).update({ role: newRole });

        return {
            success: true,
            message: `User role changed to ${newRole} successfully`
        };
    } catch (error) {
        console.error('Error changing user role:', error);
        return { success: false, message: 'Failed to change user role' };
    }
}

/**
 * Block/unblock user (admin only)
 */
export async function toggleUserBlock(
    targetUserId: string,
    blocked: boolean
): Promise<{ success: boolean; message: string }> {
    try {
        const { userId } = await auth();
        if (!userId) {
            return { success: false, message: 'Not authenticated' };
        }

        // Check if current user is admin
        const currentUserDoc = await adminDb.collection('users').doc(userId).get();

        if (!currentUserDoc.exists || currentUserDoc.data()?.role !== 'admin') {
            return { success: false, message: 'Unauthorized: Admin access required' };
        }

        // Don't allow blocking self
        if (userId === targetUserId) {
            return { success: false, message: 'Cannot block yourself' };
        }

        // Update target user's blocked status
        const targetUserDoc = await adminDb.collection('users').doc(targetUserId).get();
        if (targetUserDoc.exists && targetUserDoc.data()?.email === 'rajanprasaila@gmail.com') {
            return { success: false, message: 'Super Admin cannot be blocked' };
        }

        await adminDb.collection('users').doc(targetUserId).update({ blocked });

        return {
            success: true,
            message: `User ${blocked ? 'blocked' : 'unblocked'} successfully`
        };
    } catch (error) {
        console.error('Error toggling user block:', error);
        return { success: false, message: 'Failed to update user status' };
    }
}

/**
 * Delete user (admin only)
 */
export async function deleteUser(
    targetUserId: string
): Promise<{ success: boolean; message: string }> {
    try {
        const { userId } = await auth();
        if (!userId) {
            return { success: false, message: 'Not authenticated' };
        }

        // Check if current user is admin
        const currentUserDoc = await adminDb.collection('users').doc(userId).get();

        if (!currentUserDoc.exists || currentUserDoc.data()?.role !== 'admin') {
            return { success: false, message: 'Unauthorized: Admin access required' };
        }

        // Don't allow deleting self
        if (userId === targetUserId) {
            return { success: false, message: 'Cannot delete yourself' };
        }

        // Delete user
        const targetUserDoc = await adminDb.collection('users').doc(targetUserId).get();
        if (targetUserDoc.exists && targetUserDoc.data()?.email === 'rajanprasaila@gmail.com') {
            return { success: false, message: 'Super Admin cannot be deleted' };
        }

        await adminDb.collection('users').doc(targetUserId).delete();

        return {
            success: true,
            message: 'User deleted successfully'
        };
    } catch (error) {
        console.error('Error deleting user:', error);
        return { success: false, message: 'Failed to delete user' };
    }
}

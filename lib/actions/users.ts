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

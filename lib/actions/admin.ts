'use server';

import { auth } from '@clerk/nextjs/server';
import { adminDb } from '@/lib/firebase-admin';
import { getResources, type Resource } from './resources';

export interface AdminStats {
    totalResources: number;
    totalUsers: number;
    resourcesByType: Record<string, number>;
    resourcesByRegulation: Record<string, number>;
    resourcesByBranch: Record<string, number>;
    recentResources: Resource[];
}

/**
 * Get admin dashboard statistics
 */
export async function getAdminStats(): Promise<AdminStats | null> {
    try {
        const { userId } = await auth();
        if (!userId) return null;

        // Get all resources
        const resources = await getResources();

        // Count by document type
        const resourcesByType: Record<string, number> = {};
        resources.forEach(r => {
            resourcesByType[r.documentType] = (resourcesByType[r.documentType] || 0) + 1;
        });

        // Count by regulation
        const resourcesByRegulation: Record<string, number> = {};
        resources.forEach(r => {
            resourcesByRegulation[r.regulation] = (resourcesByRegulation[r.regulation] || 0) + 1;
        });

        // Count by branch
        const resourcesByBranch: Record<string, number> = {};
        resources.forEach(r => {
            resourcesByBranch[r.branch] = (resourcesByBranch[r.branch] || 0) + 1;
        });

        // Get recent resources (last 10)
        const recentResources = resources
            .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())
            .slice(0, 10);

        // Get user count using Admin SDK
        // count() is available in newer Admin SDKs but fallback to getting all docs if needed.
        // Actually get() returning QuerySnapshot has size.
        const usersSnapshot = await adminDb.collection('users').get();
        const totalUsers = usersSnapshot.size;

        return {
            totalResources: resources.length,
            totalUsers,
            resourcesByType,
            resourcesByRegulation,
            resourcesByBranch,
            recentResources
        };
    } catch (error) {
        console.error('Error getting admin stats:', error);
        return null;
    }
}

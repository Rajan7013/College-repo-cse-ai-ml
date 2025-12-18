'use server';

import { auth } from '@clerk/nextjs/server';
import { adminDb } from '@/lib/firebase-admin';
import { unstable_cache } from 'next/cache';

export interface AdminStats {
    totalResources: number;
    totalUsers: number;
    resourcesByType: Record<string, number>;
    resourcesByRegulation: Record<string, number>;
    resourcesByBranch: Record<string, number>;
    recentResources: any[]; // Using any[] avoids Date/string type conflict, or we can update Resource
}

const getCachedGlobalStats = unstable_cache(
    async () => {
        try {
            // Parallel fetch
            const [resourcesSnap, usersSnap] = await Promise.all([
                adminDb.collection('resources').orderBy('uploadedAt', 'desc').get(),
                adminDb.collection('users').count().get()
            ]);

            const resources = resourcesSnap.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    uploadedAt: data.uploadedAt?.toDate?.().toISOString() || new Date().toISOString()
                };
            });

            // Aggregations
            const resourcesByType: Record<string, number> = {};
            const resourcesByRegulation: Record<string, number> = {};
            const resourcesByBranch: Record<string, number> = {};

            resources.forEach((r: any) => {
                const type = r.documentType || r.category || 'Notes';
                const reg = r.regulation || 'Unknown';
                const brand = r.branch || 'CSE_AI_ML';

                resourcesByType[type] = (resourcesByType[type] || 0) + 1;
                resourcesByRegulation[reg] = (resourcesByRegulation[reg] || 0) + 1;
                resourcesByBranch[brand] = (resourcesByBranch[brand] || 0) + 1;
            });

            const recentResources = resources.slice(0, 10);
            const totalUsers = usersSnap.data().count;

            return {
                totalResources: resources.length,
                totalUsers,
                resourcesByType,
                resourcesByRegulation,
                resourcesByBranch,
                recentResources
            };
        } catch (error) {
            console.error('Cached stats error:', error);
            return null;
        }
    },
    ['global-admin-stats'],
    { revalidate: 60, tags: ['resources', 'users'] }
);

/**
 * Get admin dashboard statistics
 */
export async function getAdminStats(): Promise<AdminStats | null> {
    try {
        const { userId } = await auth();
        if (!userId) return null;

        // Return cached stats
        return await getCachedGlobalStats();
    } catch (error) {
        console.error('Error getting admin stats:', error);
        return null;
    }
}

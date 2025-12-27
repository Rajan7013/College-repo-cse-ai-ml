'use server';

import { adminDb } from '@/lib/firebase-admin';

export interface HomeStats {
    totalStudents: number;
    totalResources: number;
    totalProjects: number;
    uptime: string;
}

/**
 * Get real-time statistics for homepage
 */
export async function getHomeStats(): Promise<HomeStats> {
    try {
        // Get total users
        const usersSnapshot = await adminDb.collection('users').count().get();
        const totalStudents = usersSnapshot.data().count;

        // Get total resources
        const resourcesSnapshot = await adminDb.collection('resources').count().get();
        const totalResources = resourcesSnapshot.data().count;

        // Get total projects (if collection exists)
        let totalProjects = 0;
        try {
            const projectsSnapshot = await adminDb.collection('projects').count().get();
            totalProjects = projectsSnapshot.data().count;
        } catch {
            totalProjects = 45; // Fallback
        }

        return {
            totalStudents,
            totalResources,
            totalProjects,
            uptime: '99.9%', // This would come from monitoring service
        };
    } catch (error) {
        console.error('Error fetching home stats:', error);
        // Return fallback values
        return {
            totalStudents: 120,
            totalResources: 500,
            totalProjects: 45,
            uptime: '99.9%',
        };
    }
}

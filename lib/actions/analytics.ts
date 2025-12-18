'use server';

import { auth } from '@clerk/nextjs/server';
import { adminDb } from '@/lib/firebase-admin';

export interface ActivityLog {
    id: string;
    userId: string;
    userEmail: string;
    action: 'view_document' | 'search_query' | 'download_document';
    resourceId?: string;
    resourceTitle?: string;
    details?: string; // Query string or extra info
    durationSeconds?: number;
    timestamp: string | Date;
}

/**
 * Log a user activity (View, Search, Download)
 */
export async function logActivity(data: {
    action: 'view_document' | 'search_query' | 'download_document';
    resourceId?: string;
    resourceTitle?: string;
    details?: string;
    durationSeconds?: number;
}) {
    try {
        const { userId } = await auth();
        // We allow logging even if not logged in (anonymous), but preferably logged in.
        // If not logged in, we might skip or log as 'anonymous'.
        // For this app, we assume mostly auth users.

        let userEmail = 'anonymous';

        if (userId) {
            const userDoc = await adminDb.collection('users').doc(userId).get();
            if (userDoc.exists) {
                userEmail = userDoc.data()?.email || 'unknown';
            }
        }

        await adminDb.collection('analytics_logs').add({
            userId: userId || 'anonymous',
            userEmail,
            action: data.action,
            resourceId: data.resourceId || null,
            resourceTitle: data.resourceTitle || null,
            details: data.details || null,
            durationSeconds: data.durationSeconds || 0,
            timestamp: new Date()
        });

        return { success: true };
    } catch (error) {
        console.error('Error logging activity:', error);
        return { success: false, error: 'Failed to log activity' };
    }
}

/**
 * Get Analytics Stats for Dashboard
 */
export async function getAnalyticsStats() {
    try {
        // This is a heavy operation for Firestore if unlimited.
        // For production, we should aggregate counters.
        // For this scale, reading last ~500 logs is okay.

        const logsSnapshot = await adminDb.collection('analytics_logs')
            .orderBy('timestamp', 'desc')
            .limit(200)
            .get();

        const logs = logsSnapshot.docs.map(doc => {
            const data = doc.data();
            // Handle Firestore Timestamp
            let timestamp = data.timestamp;
            if (timestamp && typeof timestamp.toDate === 'function') {
                timestamp = timestamp.toDate().toISOString();
            } else if (timestamp instanceof Date) {
                timestamp = timestamp.toISOString();
            } else {
                timestamp = new Date().toISOString();
            }

            return {
                id: doc.id,
                ...data,
                timestamp
            };
        }) as ActivityLog[];

        // Calculate simple stats
        const totalViews = logs.filter(l => l.action === 'view_document').length;
        const totalSearches = logs.filter(l => l.action === 'search_query').length;

        // aggregate top resources
        const resourceCounts: Record<string, number> = {};
        logs.filter(l => l.action === 'view_document' && l.resourceTitle).forEach(l => {
            const key = l.resourceTitle!;
            resourceCounts[key] = (resourceCounts[key] || 0) + 1;
        });

        const topResources = Object.entries(resourceCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([title, count]) => ({ title, count }));

        // aggregate active students
        const studentCounts: Record<string, number> = {};
        logs.forEach(l => {
            if (l.userEmail !== 'anonymous') {
                studentCounts[l.userEmail] = (studentCounts[l.userEmail] || 0) + 1;
            }
        });

        const activeStudents = Object.entries(studentCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([email, count]) => ({ email, count }));

        return {
            recentLogs: logs.slice(0, 20), // Only return recent 20 for list
            stats: {
                totalViews,
                totalSearches,
                topResources,
                activeStudents
            }
        };

    } catch (error) {
        console.error('Error fetching analytics:', error);
        return {
            recentLogs: [],
            stats: { totalViews: 0, totalSearches: 0, topResources: [], activeStudents: [] }
        };
    }
}

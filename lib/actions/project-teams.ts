'use server';

import { adminDb } from '@/lib/firebase-admin';
import { auth } from '@clerk/nextjs/server';
import {
    ProjectTeam,
    ProjectTeamFormData
} from '@/lib/types/projects';

/**
 * Create a new team for a project
 */
export async function createProjectTeam(
    projectId: string,
    data: ProjectTeamFormData
): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
        const { userId } = await auth();
        if (!userId) {
            return { success: false, error: 'Unauthorized' };
        }

        const teamData = {
            projectId,
            ...data,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const docRef = await adminDb.collection('project_teams').add(teamData);

        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Error creating team:', error);
        return { success: false, error: 'Failed to create team' };
    }
}

/**
 * Update a team
 */
export async function updateProjectTeam(
    id: string,
    data: Partial<ProjectTeamFormData>
): Promise<{ success: boolean; error?: string }> {
    try {
        const { userId } = await auth();
        if (!userId) {
            return { success: false, error: 'Unauthorized' };
        }

        await adminDb.collection('project_teams').doc(id).update({
            ...data,
            updatedAt: new Date()
        });

        return { success: true };
    } catch (error) {
        console.error('Error updating team:', error);
        return { success: false, error: 'Failed to update team' };
    }
}

/**
 * Delete a team
 */
export async function deleteProjectTeam(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        const { userId } = await auth();
        if (!userId) {
            return { success: false, error: 'Unauthorized' };
        }

        await adminDb.collection('project_teams').doc(id).delete();

        return { success: true };
    } catch (error) {
        console.error('Error deleting team:', error);
        return { success: false, error: 'Failed to delete team' };
    }
}

/**
 * Get all teams for a project
 */
export async function getProjectTeams(projectId: string): Promise<ProjectTeam[]> {
    try {
        const snapshot = await adminDb.collection('project_teams')
            .where('projectId', '==', projectId)
            .orderBy('teamNumber', 'asc')
            .get();

        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate(),
                updatedAt: data.updatedAt?.toDate(),
            } as ProjectTeam;
        });
    } catch (error) {
        console.error('Error fetching teams:', error);
        return [];
    }
}

/**
 * Get team by ID
 */
export async function getProjectTeamById(id: string): Promise<ProjectTeam | null> {
    try {
        const doc = await adminDb.collection('project_teams').doc(id).get();

        if (!doc.exists) {
            return null;
        }

        const data = doc.data();
        if (!data) return null;
        return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate(),
        } as ProjectTeam;
    } catch (error) {
        console.error('Error fetching team:', error);
        return null;
    }
}

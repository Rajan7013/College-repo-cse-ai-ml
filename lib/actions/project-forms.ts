'use server';

import { adminDb } from '@/lib/firebase-admin';
import { auth } from '@clerk/nextjs/server';
import {
    ProjectForm,
    ProjectFormFormData
} from '@/lib/types/projects';

/**
 * Create a new form for a project
 */
export async function createProjectForm(
    projectId: string,
    data: ProjectFormFormData
): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
        const { userId } = await auth();
        if (!userId) {
            return { success: false, error: 'Unauthorized' };
        }

        const formData = {
            projectId,
            ...data,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const docRef = await adminDb.collection('project_forms').add(formData);

        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Error creating form:', error);
        return { success: false, error: 'Failed to create form' };
    }
}

/**
 * Update a form
 */
export async function updateProjectForm(
    id: string,
    data: Partial<ProjectFormFormData>
): Promise<{ success: boolean; error?: string }> {
    try {
        const { userId } = await auth();
        if (!userId) {
            return { success: false, error: 'Unauthorized' };
        }

        await adminDb.collection('project_forms').doc(id).update({
            ...data,
            updatedAt: new Date()
        });

        return { success: true };
    } catch (error) {
        console.error('Error updating form:', error);
        return { success: false, error: 'Failed to update form' };
    }
}

/**
 * Delete a form
 */
export async function deleteProjectForm(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        const { userId } = await auth();
        if (!userId) {
            return { success: false, error: 'Unauthorized' };
        }

        await adminDb.collection('project_forms').doc(id).delete();

        return { success: true };
    } catch (error) {
        console.error('Error deleting form:', error);
        return { success: false, error: 'Failed to delete form' };
    }
}

/**
 * Get all forms for a project
 */
export async function getProjectForms(projectId: string): Promise<ProjectForm[]> {
    try {
        const snapshot = await adminDb.collection('project_forms')
            .where('projectId', '==', projectId)
            .orderBy('order', 'asc')
            .get();

        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate(),
                updatedAt: data.updatedAt?.toDate(),
            } as ProjectForm;
        });
    } catch (error) {
        console.error('Error fetching forms:', error);
        return [];
    }
}

/**
 * Get active forms for a project (student view)
 */
export async function getActiveProjectForms(projectId: string): Promise<ProjectForm[]> {
    try {
        const snapshot = await adminDb.collection('project_forms')
            .where('projectId', '==', projectId)
            .where('isActive', '==', true)
            .orderBy('order', 'asc')
            .get();

        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate(),
                updatedAt: data.updatedAt?.toDate(),
            } as ProjectForm;
        });
    } catch (error) {
        console.error('Error fetching active forms:', error);
        return [];
    }
}

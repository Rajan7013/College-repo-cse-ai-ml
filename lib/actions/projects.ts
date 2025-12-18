'use server';

import { adminDb } from '@/lib/firebase-admin';
import { auth } from '@clerk/nextjs/server';
import {
    Project,
    ProjectFormData,
    ProjectFilters
} from '@/lib/types/projects';

// Generate URL-friendly slug from title
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

/**
 * Create a new project
 */
export async function createProject(data: ProjectFormData): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
        const { userId } = await auth();
        if (!userId) {
            return { success: false, error: 'Unauthorized' };
        }

        const slug = generateSlug(data.title);
        const now = new Date();

        const projectData = {
            ...data,
            slug,
            createdBy: userId,
            createdAt: now,
            updatedAt: now,
            views: 0,
            currentRegistrations: 0,
            ...(data.status === 'published' && { publishedAt: now })
        };

        const docRef = await adminDb.collection('projects').add(projectData);

        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Error creating project:', error);
        return { success: false, error: 'Failed to create project' };
    }
}

/**
 * Update an existing project
 */
export async function updateProject(
    id: string,
    data: Partial<ProjectFormData>
): Promise<{ success: boolean; error?: string }> {
    try {
        const { userId } = await auth();
        if (!userId) {
            return { success: false, error: 'Unauthorized' };
        }

        const updateData: any = {
            ...data,
            updatedAt: new Date()
        };

        // Update slug if title changed
        if (data.title) {
            updateData.slug = generateSlug(data.title);
        }

        // Set publishedAt if publishing for first time
        if (data.status === 'published') {
            const doc = await adminDb.collection('projects').doc(id).get();
            if (doc.exists && !doc.data()?.publishedAt) {
                updateData.publishedAt = new Date();
            }
        }

        await adminDb.collection('projects').doc(id).update(updateData);

        return { success: true };
    } catch (error) {
        console.error('Error updating project:', error);
        return { success: false, error: 'Failed to update project' };
    }
}

/**
 * Delete a project
 */
export async function deleteProject(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        const { userId } = await auth();
        if (!userId) {
            return { success: false, error: 'Unauthorized' };
        }

        // Delete project
        await adminDb.collection('projects').doc(id).delete();

        // Delete related teams
        const teamsSnapshot = await adminDb.collection('project_teams')
            .where('projectId', '==', id)
            .get();

        const teamDeletes = teamsSnapshot.docs.map(doc => doc.ref.delete());
        await Promise.all(teamDeletes);

        // Delete related forms
        const formsSnapshot = await adminDb.collection('project_forms')
            .where('projectId', '==', id)
            .get();

        const formDeletes = formsSnapshot.docs.map(doc => doc.ref.delete());
        await Promise.all(formDeletes);

        return { success: true };
    } catch (error) {
        console.error('Error deleting project:', error);
        return { success: false, error: 'Failed to delete project' };
    }
}

/**
 * Get project by ID
 */
export async function getProjectById(id: string): Promise<Project | null> {
    try {
        const doc = await adminDb.collection('projects').doc(id).get();

        if (!doc.exists) {
            return null;
        }

        const data = doc.data();
        if (!data) return null;
        return {
            id: doc.id,
            ...data,
            registrationStartDate: data.registrationStartDate?.toDate(),
            registrationEndDate: data.registrationEndDate?.toDate(),
            submissionDate: data.submissionDate?.toDate(),
            publishedAt: data.publishedAt?.toDate(),
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate(),
        } as Project;
    } catch (error) {
        console.error('Error fetching project:', error);
        return null;
    }
}

/**
 * Get project by slug (for public view)
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
    try {
        const snapshot = await adminDb.collection('projects')
            .where('slug', '==', slug)
            .where('status', '==', 'published')
            .limit(1)
            .get();

        if (snapshot.empty) {
            return null;
        }

        const doc = snapshot.docs[0];
        const data = doc.data();
        if (!data) return null;

        // Increment view count
        await doc.ref.update({ views: (data.views || 0) + 1 });

        return {
            id: doc.id,
            ...data,
            registrationStartDate: data.registrationStartDate?.toDate(),
            registrationEndDate: data.registrationEndDate?.toDate(),
            submissionDate: data.submissionDate?.toDate(),
            publishedAt: data.publishedAt?.toDate(),
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate(),
        } as Project;
    } catch (error) {
        console.error('Error fetching project by slug:', error);
        return null;
    }
}

/**
 * Get all projects (admin view)
 */
export async function getAllProjects(filters?: ProjectFilters): Promise<Project[]> {
    try {
        let query: FirebaseFirestore.Query = adminDb.collection('projects');

        // Apply filters
        if (filters?.status) {
            query = query.where('status', '==', filters.status);
        }

        query = query.orderBy('createdAt', 'desc');

        const snapshot = await query.get();

        let projects: Project[] = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                registrationStartDate: data.registrationStartDate?.toDate(),
                registrationEndDate: data.registrationEndDate?.toDate(),
                submissionDate: data.submissionDate?.toDate(),
                publishedAt: data.publishedAt?.toDate(),
                createdAt: data.createdAt?.toDate(),
                updatedAt: data.updatedAt?.toDate(),
            } as Project;
        });

        // Client-side filtering for search and technology
        if (filters?.search) {
            const searchLower = filters.search.toLowerCase();
            projects = projects.filter(p =>
                p.title.toLowerCase().includes(searchLower) ||
                p.description.toLowerCase().includes(searchLower) ||
                p.technologies.some(t => t.toLowerCase().includes(searchLower))
            );
        }

        if (filters?.technology) {
            projects = projects.filter(p =>
                p.technologies.some(t => t.toLowerCase() === filters.technology!.toLowerCase())
            );
        }

        return projects;
    } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
}

/**
 * Get published projects (student view)
 */
export async function getPublishedProjects(filters?: ProjectFilters): Promise<Project[]> {
    try {
        let query: FirebaseFirestore.Query = adminDb.collection('projects')
            .where('status', '==', 'published');

        query = query.orderBy('publishedAt', 'desc');

        const snapshot = await query.get();

        let projects: Project[] = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                registrationStartDate: data.registrationStartDate?.toDate(),
                registrationEndDate: data.registrationEndDate?.toDate(),
                submissionDate: data.submissionDate?.toDate(),
                publishedAt: data.publishedAt?.toDate(),
                createdAt: data.createdAt?.toDate(),
                updatedAt: data.updatedAt?.toDate(),
            } as Project;
        });

        // Client-side filtering
        if (filters?.search) {
            const searchLower = filters.search.toLowerCase();
            projects = projects.filter(p =>
                p.title.toLowerCase().includes(searchLower) ||
                p.description.toLowerCase().includes(searchLower)
            );
        }

        if (filters?.technology) {
            projects = projects.filter(p =>
                p.technologies.some(t => t.toLowerCase() === filters.technology!.toLowerCase())
            );
        }

        return projects;
    } catch (error) {
        console.error('Error fetching published projects:', error);
        return [];
    }
}

/**
 * Publish/Unpublish a project
 */
export async function toggleProjectStatus(
    id: string,
    status: 'published' | 'draft'
): Promise<{ success: boolean; error?: string }> {
    try {
        const { userId } = await auth();
        if (!userId) {
            return { success: false, error: 'Unauthorized' };
        }

        const updateData: any = {
            status,
            updatedAt: new Date()
        };

        if (status === 'published') {
            const doc = await adminDb.collection('projects').doc(id).get();
            if (doc.exists && !doc.data()?.publishedAt) {
                updateData.publishedAt = new Date();
            }
        }

        await adminDb.collection('projects').doc(id).update(updateData);

        return { success: true };
    } catch (error) {
        console.error('Error toggling project status:', error);
        return { success: false, error: 'Failed to update status' };
    }
}

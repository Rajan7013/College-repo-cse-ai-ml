'use server';

import { auth } from '@clerk/nextjs/server';
import { adminDb } from '@/lib/firebase-admin';

export interface Resource {
    id: string;
    title: string;
    branch: string;
    regulation: string;
    year: number;
    semester: number;
    subjectCode: string;
    documentType: string;
    unit: number | 'all';
    tags: string[];
    description: string;
    fileUrl: string;
    filename: string;
    fileType?: string;
    mimeType?: string;
    fileSize?: number;
    uploadedBy: string;
    uploadedAt: Date;
}

export interface ResourceFilters {
    regulation?: string;
    year?: number;
    semester?: number;
    subjectCode?: string;
    unit?: number | string;
}

/**
 * Fetch resources from Firestore with optional filters
 */
export async function getResources(filters?: ResourceFilters): Promise<Resource[]> {
    try {
        // Explicitly check for authenticated user
        const { userId } = await auth();
        if (!userId) {
            console.log("getResources: No userId found");
            // If we strictly require auth to view resources
            return [];
        }

        let query: FirebaseFirestore.Query = adminDb.collection('resources');

        // Apply filters
        if (filters?.regulation) {
            query = query.where('regulation', '==', filters.regulation);
        }
        if (filters?.year) {
            query = query.where('year', '==', filters.year);
        }
        if (filters?.semester) {
            query = query.where('semester', '==', filters.semester);
        }
        if (filters?.subjectCode) {
            query = query.where('subjectCode', '==', filters.subjectCode);
        }
        // Note: 'unit' might need careful handling if mixed types (number vs string 'all') are stored
        if (filters?.unit !== undefined) {
            query = query.where('unit', '==', filters.unit);
        }

        // Order by uploadedAt desc
        query = query.orderBy('uploadedAt', 'desc');

        const snapshot = await query.get();

        const resources: Resource[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title,
                branch: data.branch || 'CSE_AI_ML',
                regulation: data.regulation,
                year: data.year,
                semester: data.semester,
                subjectCode: data.subjectCode,
                documentType: data.documentType || data.category || 'Notes',
                unit: data.unit || 'all',
                tags: data.tags || [],
                description: data.description || '',
                fileUrl: data.fileUrl,
                filename: data.filename,
                fileType: data.fileType || 'PDF',
                mimeType: data.mimeType,
                fileSize: data.fileSize,
                uploadedBy: data.uploadedBy,
                uploadedAt: data.uploadedAt?.toDate() || new Date(),
            };
        });

        return resources;
    } catch (error) {
        console.error('Error fetching resources:', error);
        return [];
    }
}

/**
 * Get the current user's role from Firestore
 */
export async function getUserRole(): Promise<string | null> {
    try {
        const { userId } = await auth();

        if (!userId) {
            return null;
        }

        const userDoc = await adminDb.collection('users').doc(userId).get();

        if (!userDoc.exists) {
            return null;
        }

        const data = userDoc.data();
        return data?.role || 'student';
    } catch (error) {
        console.error('Error fetching user role:', error);
        return null;
    }
}

/**
 * Get a single resource by ID for the viewer
 */
export async function getResourceById(id: string): Promise<Resource | null> {
    try {
        const { userId } = await auth();
        if (!userId) return null;

        const docSnap = await adminDb.collection('resources').doc(id).get();

        if (!docSnap.exists) {
            return null;
        }

        const data = docSnap.data();
        if (!data) return null;

        return {
            id: docSnap.id,
            title: data.title,
            branch: data.branch || 'CSE_AI_ML',
            regulation: data.regulation,
            year: data.year,
            semester: data.semester,
            subjectCode: data.subjectCode,
            documentType: data.documentType || data.category || 'Notes',
            unit: data.unit || 'all',
            tags: data.tags || [],
            description: data.description || '',
            fileUrl: data.fileUrl,
            filename: data.filename,
            fileType: data.fileType || 'PDF',
            mimeType: data.mimeType,
            fileSize: data.fileSize,
            uploadedBy: data.uploadedBy,
            uploadedAt: data.uploadedAt?.toDate() || new Date(),
        };
    } catch (error) {
        console.error('Error fetching resource by ID:', error);
        return null;
    }
}

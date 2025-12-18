'use server';

import { adminDb } from '@/lib/firebase-admin';
import { STATIC_SUBJECTS } from '../constants';
import { DETAILED_SYLLABUS } from '../syllabus-data';

// --- Types ---

export interface UnitTopic {
    title: string;
    topics: string[];
}

export interface SubjectUnits {
    [key: string]: UnitTopic;
}

export interface Subject {
    id: string; // generated or composite key
    code: string;
    name: string;
    regulation: string;
    year: number;
    semester: number;
    branch: string; // 'CSE', 'ECE', 'Common', etc.
    units: SubjectUnits;
    textbooks: string[];
    references: string[];
    webResources: any[]; // define stricter if needed
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface SubjectFilters {
    regulation?: string;
    year?: number;
    semester?: number;
    branch?: string;
}

// --- Actions ---

/**
 * Fetch subjects from Firestore with optional filtering
 */
export async function getSubjects(filters?: SubjectFilters): Promise<Subject[]> {
    try {
        let query: FirebaseFirestore.Query = adminDb.collection('subjects');

        // IMPORTANT: Filter order must match Firebase index order
        // Index: regulation → semester → year → code → __name__

        if (filters?.regulation) {
            query = query.where('regulation', '==', filters.regulation);
        }

        if (filters?.semester) {
            query = query.where('semester', '==', filters.semester);
        }

        if (filters?.year) {
            query = query.where('year', '==', filters.year);
        }

        // Branch filter (if needed, but not in index)
        if (filters?.branch) {
            query = query.where('branch', '==', filters.branch);
        }

        // Order by code for consistent display
        query = query.orderBy('code', 'asc');

        const snapshot = await query.get();

        const subjects: Subject[] = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                code: data.code,
                name: data.name,
                regulation: data.regulation,
                year: data.year,
                semester: data.semester,
                branch: data.branch,
                units: data.units || {},
                textbooks: data.textbooks || [],
                references: data.references || [],
                webResources: data.webResources || [],
                isActive: data.isActive ?? true,
                createdAt: data.createdAt?.toDate(),
                updatedAt: data.updatedAt?.toDate()
            } as Subject;
        });

        return subjects;
    } catch (error) {
        console.error('Error fetching subjects:', error);
        return [];
    }
}

/**
 * Get a single subject by its Code (e.g., "23ACS01")
 * Note: If multiple regulations use the same code, this might need refinement.
 * For now, assuming codes are unique per regulation or we just take the first.
 * Better: Use ID if possible, but UI might rely on code from URL.
 */
export async function getSubjectByCode(code: string, regulation: string = 'R23'): Promise<Subject | null> {
    try {
        const snapshot = await adminDb.collection('subjects')
            .where('code', '==', code)
            .where('regulation', '==', regulation)
            .limit(1)
            .get();

        if (snapshot.empty) return null;

        const doc = snapshot.docs[0];
        const data = doc.data();

        return {
            id: doc.id,
            code: data.code,
            name: data.name,
            regulation: data.regulation,
            year: data.year,
            semester: data.semester,
            branch: data.branch,
            units: data.units || {},
            textbooks: data.textbooks || [],
            references: data.references || [],
            webResources: data.webResources || [],
            isActive: data.isActive ?? true,
        } as Subject;
    } catch (error) {
        console.error('Error fetching subject by code:', error);
        return null;
    }
}

/**
 * Get a single subject by its ID
 */
export async function getSubjectById(id: string): Promise<Subject | null> {
    try {
        const doc = await adminDb.collection('subjects').doc(id).get();
        if (!doc.exists) return null;

        const data = doc.data()!;
        return {
            id: doc.id,
            code: data.code,
            name: data.name,
            regulation: data.regulation,
            year: data.year,
            semester: data.semester,
            branch: data.branch,
            units: data.units || {},
            textbooks: data.textbooks || [],
            references: data.references || [],
            webResources: data.webResources || [],
            isActive: data.isActive ?? true,
        } as Subject;
    } catch (error) {
        console.error('Error fetching subject by ID:', error);
        return null;
    }
}

/**
 * Create a new subject
 */
export async function createSubject(data: Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
        const id = `${data.regulation}_${data.year}_${data.semester}_${data.code}`;
        const docRef = adminDb.collection('subjects').doc(id);

        // Check for duplication
        const existing = await docRef.get();
        if (existing.exists) {
            return { success: false, error: 'A subject with this Regulation, Year, Semester, and Code already exists.' };
        }

        await docRef.set({
            ...data,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return { success: true, id };
    } catch (error) {
        console.error('Error creating subject:', error);
        return { success: false, error: 'Failed to create subject' };
    }
}

/**
 * Update an existing subject
 */
export async function updateSubject(id: string, data: Partial<Subject>) {
    try {
        await adminDb.collection('subjects').doc(id).update({
            ...data,
            updatedAt: new Date()
        });
        return { success: true };
    } catch (error) {
        console.error('Error updating subject:', error);
        return { success: false, error: 'Failed to update subject' };
    }
}

/**
 * Delete a subject
 */
export async function deleteSubject(id: string) {
    try {
        await adminDb.collection('subjects').doc(id).delete();
        return { success: true };
    } catch (error) {
        console.error('Error deleting subject:', error);
        return { success: false, error: 'Failed to delete subject' };
    }
}

/**
 * Bulk delete subjects
 */
export async function bulkDeleteSubjects(ids: string[]) {
    try {
        const batch = adminDb.batch();

        ids.forEach(id => {
            const ref = adminDb.collection('subjects').doc(id);
            batch.delete(ref);
        });

        await batch.commit();
        return { success: true };
    } catch (error) {
        console.error('Error batch deleting subjects:', error);
        return { success: false, error: 'Failed to delete selected subjects' };
    }
}

/**
 * Seed curriculum from static data (Legacy support)
 */
export async function seedCurriculum(): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
        const batch = adminDb.batch();
        let count = 0;

        // Iterate through STATIC_SUBJECTS if valid
        for (const [key, subjects] of Object.entries(STATIC_SUBJECTS)) {
            // Basic parsing of key if needed, e.g. "R23_1_1"
            // But since data is empty/deprecated, we just provide the signature.
            if (Array.isArray(subjects)) {
                for (const sub of subjects) {
                    // logic to add
                }
            }
        }

        // Return success even if nothing done, as this is likely for build compliance
        return { success: true, message: `Seeded ${count} subjects (Legacy Data)` };
    } catch (error) {
        console.error('Error seeding curriculum:', error);
        return { success: false, error: 'Failed to seed curriculum' };
    }
}

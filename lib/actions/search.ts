'use server';

import { adminDb } from '@/lib/firebase-admin';
import { Resource } from './resources';

export interface SearchFilters {
    query?: string;
    regulation?: string;
    year?: number;
    semester?: number;
    branch?: string;
    subject?: string;
    unit?: string;
    documentType?: string;
    fileType?: string;
}

export interface SearchSort {
    field: 'uploadedAt' | 'title' | 'fileSize';
    direction: 'asc' | 'desc';
}

export interface SearchResult {
    resources: Resource[];
    total: number;
    hasMore: boolean;
}

/**
 * Advanced search with multiple filters and sorting
 */
/**
 * Advanced search with multiple filters and sorting
 */
export async function searchResources(
    filters: SearchFilters,
    sort: SearchSort = { field: 'uploadedAt', direction: 'desc' },
    page: number = 1,
    limit: number = 50
): Promise<SearchResult> {
    try {
        let query: FirebaseFirestore.Query = adminDb.collection('resources');

        // Apply filters in order matching Firebase composite index

        if (filters.regulation) {
            query = query.where('regulation', '==', filters.regulation);
        }

        if (filters.year) {
            query = query.where('year', '==', filters.year);
        }

        if (filters.semester) {
            query = query.where('semester', '==', filters.semester);
        }

        if (filters.branch) {
            query = query.where('branch', '==', filters.branch);
        }

        if (filters.subject) {
            query = query.where('subjectCode', '==', filters.subject);
        }

        if (filters.unit) {
            query = query.where('unit', '==', filters.unit);
        }

        if (filters.documentType) {
            query = query.where('documentType', '==', filters.documentType);
        }

        if (filters.fileType) {
            query = query.where('fileType', '==', filters.fileType);
        }

        // Apply sorting
        query = query.orderBy(sort.field, sort.direction);

        // Get total count (approximation/snapshot based)
        // Note: For large collections, aggregation queries are better, but for now this works matching the previous patterns
        const countSnapshot = await query.count().get();
        const total = countSnapshot.data().count;

        // Apply pagination
        const offset = (page - 1) * limit;
        query = query.offset(offset).limit(limit);

        const snapshot = await query.get();

        const resources: Resource[] = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title,
                description: data.description || '',
                fileUrl: data.fileUrl,
                fileType: data.fileType,
                fileSize: data.fileSize,
                mimeType: data.mimeType,
                filename: data.filename || '',
                regulation: data.regulation,
                year: data.year,
                semester: data.semester,
                branch: data.branch || '',
                subjectCode: data.subjectCode,
                unit: data.unit,
                documentType: data.documentType,
                tags: data.tags || [],
                uploadedBy: data.uploadedBy,
                uploadedAt: data.uploadedAt?.toDate(),
            };
        });

        // Smart Text Search (Client-side filtering of the fetched page)
        // Supports: Title, Description, Subject Code, AND Subject Name
        let filteredResources = resources;
        if (filters.query) {
            const lowerQuery = filters.query.toLowerCase();

            // 1. Find subject codes that match the query (Subject Name -> Subject Code)
            // This allows searching for "Python" and finding resources with code "CS3201"
            const subjectsRef = adminDb.collection('subjects');
            const subjectSnapshot = await subjectsRef.get(); // Fetch all subjects to cache/check names (optimized for small-medium datasets)

            const matchingSubjectCodes = new Set<string>();
            subjectSnapshot.docs.forEach(doc => {
                const data = doc.data();
                if (data.name.toLowerCase().includes(lowerQuery) || data.code.toLowerCase().includes(lowerQuery)) {
                    matchingSubjectCodes.add(data.code);
                }
            });

            filteredResources = resources.filter(r =>
                r.title.toLowerCase().includes(lowerQuery) ||
                r.description?.toLowerCase().includes(lowerQuery) ||
                r.subjectCode?.toLowerCase().includes(lowerQuery) ||
                matchingSubjectCodes.has(r.subjectCode)
            );
        }

        return {
            resources: filteredResources,
            total: filters.query ? filteredResources.length : total,
            hasMore: (page * limit) < total
        };

    } catch (error) {
        console.error('Search error:', error);
        return {
            resources: [],
            total: 0,
            hasMore: false
        };
    }
}

/**
 * Get filter options for dropdowns (subjects that match current filters)
 */
export async function getFilterOptions(filters: Partial<SearchFilters>): Promise<{
    subjects: Array<{ code: string; name: string }>;
}> {
    try {
        let query: FirebaseFirestore.Query = adminDb.collection('subjects');

        if (filters.regulation) {
            query = query.where('regulation', '==', filters.regulation);
        }
        if (filters.year) {
            query = query.where('year', '==', filters.year);
        }
        if (filters.semester) {
            query = query.where('semester', '==', filters.semester);
        }

        query = query.orderBy('code', 'asc');

        const snapshot = await query.get();
        const subjects = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                code: data.code,
                name: data.name
            };
        });

        return { subjects };
    } catch (error) {
        console.error('Error fetching filter options:', error);
        return { subjects: [] };
    }
}

/**
 * Get search suggestions/autocomplete
 */
export async function getSearchSuggestions(query: string, limit: number = 10): Promise<string[]> {
    if (!query || query.length < 2) return [];

    try {
        const lowerQuery = query.toLowerCase();

        // Search in subjects
        const subjectsQuery = adminDb.collection('subjects')
            .orderBy('name')
            .limit(limit);

        const snapshot = await subjectsQuery.get();

        const suggestions = snapshot.docs
            .map(doc => {
                const data = doc.data();
                return [data.name, data.code];
            })
            .flat()
            .filter(name => name.toLowerCase().includes(lowerQuery))
            .slice(0, limit);

        return Array.from(new Set(suggestions)); // Remove duplicates
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        return [];
    }
}

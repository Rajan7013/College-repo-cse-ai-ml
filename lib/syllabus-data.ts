/**
 * Detailed Syllabus Data
 * 
 * NOTE: This file is now DEPRECATED.
 * All syllabus data is managed dynamically via Firestore and the Admin Panel.
 */

export interface UnitDetail {
    title: string;
    topics: string[];
}

export interface SubjectSyllabus {
    units: { [key: number]: UnitDetail };
    textbooks: string[];
    references: string[];
    webResources?: { title: string; url: string }[];
}

export const DETAILED_SYLLABUS: Record<string, SubjectSyllabus> = {};

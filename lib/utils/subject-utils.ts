/**
 * Utility functions for handling subject types (theory vs lab)
 */

export interface SubjectType {
    type?: 'theory' | 'lab';
}

/**
 * Get the label for a unit/week based on subject type
 * @param subject - Subject with optional type field
 * @param unitNumber - The unit/week number
 * @returns "Week X" for lab subjects, "Unit X" for theory subjects
 */
export function getUnitLabel(subject: SubjectType, unitNumber: number | string): string {
    return subject.type === 'lab' ? `Week ${unitNumber}` : `Unit ${unitNumber}`;
}

/**
 * Get the plural label for units/weeks based on subject type
 * @param subject - Subject with optional type field
 * @returns "Weeks" for lab subjects, "Units" for theory subjects
 */
export function getUnitLabelPlural(subject: SubjectType): string {
    return subject.type === 'lab' ? 'Weeks' : 'Units';
}

/**
 * Get the singular label for unit/week based on subject type
 * @param subject - Subject with optional type field
 * @returns "Week" for lab subjects, "Unit" for theory subjects
 */
export function getUnitLabelSingular(subject: SubjectType): string {
    return subject.type === 'lab' ? 'Week' : 'Unit';
}

/**
 * Get the filter label for unit/week dropdown
 * @param subject - Subject with optional type field (can be null if no subject selected)
 * @returns "Week" for lab subjects, "Unit" for theory subjects or when no subject selected
 */
export function getUnitFilterLabel(subject: SubjectType | null): string {
    return subject?.type === 'lab' ? 'Week' : 'Unit';
}

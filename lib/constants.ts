export const BRANCHES = [
    { value: '', label: 'All Branches' },
    { value: 'CSE_AI_ML', label: 'CSE (AI & ML)' },
    { value: 'CSE', label: 'Computer Science' },
    { value: 'ECE', label: 'Electronics & Communication' },
    { value: 'EEE', label: 'Electrical & Electronics' },
    { value: 'MECH', label: 'Mechanical' },
    { value: 'CIVIL', label: 'Civil' },
];

export const BRANCH_OPTIONS = [
    { value: 'CSE_AI_ML', label: 'CSE (AI & ML)' },
    { value: 'CSE', label: 'Computer Science' },
    { value: 'ECE', label: 'Electronics & Communication' },
    { value: 'EEE', label: 'Electrical & Electronics' },
    { value: 'MECH', label: 'Mechanical' },
    { value: 'CIVIL', label: 'Civil' },
];

export const REGULATIONS = ['R23', 'R25', 'R26', 'Other'];

export const DOCUMENT_TYPES = [
    'Notes',
    'MID-1 Question Paper',
    'MID-2 Question Paper',
    'Lab Manual',
    'Lab Exam Question Paper',
    'Internal Lab Exam',
    'External Lab Exam',
    'Final Semester Exam',
    'Assignment',
    'Project',
    'Study Material',
    'Syllabus',
];

export const UNITS = [
    { value: '1', label: 'Unit 1' },
    { value: '2', label: 'Unit 2' },
    { value: '3', label: 'Unit 3' },
    { value: '4', label: 'Unit 4' },
    { value: '5', label: 'Unit 5' },
    { value: '6', label: 'Unit 6' },
    { value: 'all', label: 'General (All Units)' },
];

export const FILE_TYPES = [
    { value: 'PDF', label: 'PDF' },
    { value: 'Image', label: 'Images' },
    { value: 'PPT', label: 'PowerPoint' },
    { value: 'Word', label: 'Word Documents' },
];

export const YEARS = [
    { value: 1, label: '1st Year', courses: 'B.Tech CSE (AI & ML)' },
    { value: 2, label: '2nd Year', courses: 'B.Tech CSE (AI & ML)' },
    { value: 3, label: '3rd Year', courses: 'B.Tech CSE (AI & ML)' },
    { value: 4, label: '4th Year', courses: 'B.Tech CSE (AI & ML)' },
];

export const SEMESTERS = ['1', '2'];

export const SORT_OPTIONS = [
    { value: 'date-desc', label: 'Latest First' },
    { value: 'date-asc', label: 'Oldest First' },
    { value: 'title-asc', label: 'Title (A-Z)' },
    { value: 'title-desc', label: 'Title (Z-A)' },
    { value: 'size-desc', label: 'Largest Files' },
    { value: 'size-asc', label: 'Smallest Files' },
];

export const STATIC_SUBJECTS: Record<string, Array<{ code: string; name: string }>> = {};

export const SUBJECT_UNIT_DETAILS: Record<string, Record<string, string>> = {};

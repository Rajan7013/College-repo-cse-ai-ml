export const BRANCHES = [
    { value: '', label: 'All Branches' },
    { value: 'CSE_AI_ML', label: 'CSE (AI & ML)' },
    { value: 'CSE', label: 'Computer Science' },
    { value: 'ECE', label: 'Electronics & Communication' },
    { value: 'EEE', label: 'Electrical & Electronics' },
    { value: 'MECH', label: 'Mechanical' },
    { value: 'CIVIL', label: 'Civil' },
];

// For Upload, we might need a version without "All Branches", but typically select dropdowns handle that. 
// We will export a generic list and let components filter/slice if they need "All" or not.
// Actually, to match existing exactly:
// Search uses "All Branches" as default. Upload uses "Select Branch" as default prompt.
// We can export the core data and let components add the default option, OR export consistent lists.
// Looking at previous code: 
// Search: { value: '', label: 'All Branches' } + others
// Upload: { value: 'CSE_AI_ML', label: 'CSE (AI & ML)' } ... (No empty value in list, just placeholder option)

// Decision: Export the core list of valid values. Components add their specific placeholder/all option.
export const BRANCH_OPTIONS = [
    { value: 'CSE_AI_ML', label: 'CSE (AI & ML)' },
    { value: 'CSE', label: 'Computer Science' },
    { value: 'ECE', label: 'Electronics & Communication' },
    { value: 'EEE', label: 'Electrical & Electronics' },
    { value: 'MECH', label: 'Mechanical' },
    { value: 'CIVIL', label: 'Civil' },
];

export const REGULATIONS = ['R23', 'R25', 'R27', 'R29', 'Others'];

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
];

export const UNITS = [
    { value: '1', label: 'Unit 1' },
    { value: '2', label: 'Unit 2' },
    { value: '3', label: 'Unit 3' },
    { value: '4', label: 'Unit 4' },
    { value: '5', label: 'Unit 5' },
    { value: 'all', label: 'General (All Units)' },
];

export const FILE_TYPES = [
    { value: 'PDF', label: 'PDF' },
    { value: 'Image', label: 'Images' },
    { value: 'PPT', label: 'PowerPoint' },
    { value: 'Word', label: 'Word Documents' },
];

export const YEARS = ['1', '2', '3', '4'];

export const SEMESTERS = ['1', '2'];

export const SORT_OPTIONS = [
    { value: 'date-desc', label: 'Latest First' },
    { value: 'date-asc', label: 'Oldest First' },
    { value: 'title-asc', label: 'Title (A-Z)' },
    { value: 'title-desc', label: 'Title (Z-A)' },
    { value: 'size-desc', label: 'Largest Files' },
    { value: 'size-asc', label: 'Smallest Files' },
];

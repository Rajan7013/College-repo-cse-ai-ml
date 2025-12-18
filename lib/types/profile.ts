export interface Address {
    street: string;
    city: string;
    state: string;
    pinCode: string;
    country: string;
}

export interface Certification {
    name: string;
    issuer: string;
    date: Date;
    credentialId?: string;
}

export interface Award {
    title: string;
    issuer: string;
    date: Date;
    description?: string;
}

export interface UserProfile {
    id: string;
    userId: string; // Clerk user ID

    // Personal Details
    fullName: string;
    dateOfBirth?: Date;
    gender?: 'Male' | 'Female' | 'Other';
    profilePhoto?: string;
    bio?: string;

    // Student Details
    rollNumber?: string;
    course?: string;
    branch?: string;
    yearOfStudy?: number;
    semester?: number;
    batch?: string;

    // Academic Details
    cgpa?: number;
    tenthMarks?: number;
    twelfthMarks?: number;
    universityRegNo?: string;
    academicAchievements?: string[];

    // Contact Information
    emailPrimary: string;
    emailSecondary?: string;
    phonePrimary?: string;
    phoneSecondary?: string;
    linkedIn?: string;
    github?: string;
    portfolio?: string;

    // Addresses
    permanentAddress?: Address;
    temporaryAddress?: Address;
    sameAddress?: boolean;

    // Goals & Aspirations
    shortTermGoals?: string[];
    longTermGoals?: string[];
    careerAim?: string;
    dreamCompany?: string;

    // Skills & Expertise
    technicalSkills?: string[];
    softSkills?: string[];
    languages?: string[];
    certifications?: Certification[];

    // Personal Development
    strengths?: string[];
    weaknesses?: string[];
    goodHabits?: string[];
    badHabits?: string[];
    hobbies?: string[];
    interests?: string[];

    // Awards & Recognition
    awards?: Award[];

    // Metadata
    createdAt: Date;
    updatedAt: Date;
}

export interface Feedback {
    id: string;
    userId: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    category: 'bug' | 'feature' | 'general' | 'complaint';
    status: 'pending' | 'reviewed' | 'resolved';
    createdAt: Date;
}

// Form data types (for create/update operations)
export type UserProfileFormData = Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>;
export type FeedbackFormData = Omit<Feedback, 'id' | 'createdAt' | 'status'>;

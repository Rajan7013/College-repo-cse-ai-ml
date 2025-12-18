// Projects Management System Types

export interface Project {
    id: string;
    title: string;
    slug: string; // URL-friendly version of title

    // Problem & Solution
    problemStatement: string;
    proposedSolution: string;

    // Details
    description: string;
    features: string[]; // Array of feature points
    advantages: string[]; // Array of advantages

    // Technical
    technologies: string[]; // React, Node.js, Firebase, etc.
    tools: string[]; // Git, GitHub, Figma, Jira, etc.

    // Team Requirements
    teamSize: {
        min: number;
        max: number;
        boysCount?: number;
        girlsCount?: number;
    };

    // Dates
    registrationStartDate: Date;
    registrationEndDate: Date;
    submissionDate: Date;
    publishedAt?: Date;

    // Rewards
    certificates: string; // Description of certificates
    awards: string; // Prizes, recognition, etc.

    // Rules
    rulesAndRegulations: string; // Can be markdown
    eligibility: string[]; // Array of eligibility criteria

    // Status
    status: 'draft' | 'published' | 'closed' | 'archived';

    // Registration
    registrationLink?: string; // Primary registration link
    maxRegistrations?: number;
    currentRegistrations?: number;

    // Media (optional)
    coverImage?: string;

    // Metadata
    createdBy: string; // Admin user ID
    createdAt: Date;
    updatedAt: Date;
    views: number;
}

export interface ProjectForm {
    id: string;
    projectId: string;

    title: string;
    description: string;
    purpose: string; // "Registration", "Feedback", "Query", "Submission"

    formType: 'google_form' | 'microsoft_form' | 'custom_link' | 'typeform';
    formUrl: string;

    isActive: boolean;
    order: number; // Display order

    createdAt: Date;
    updatedAt: Date;
}

export interface ProjectTeam {
    id: string;
    projectId: string;

    teamName: string;
    teamNumber: number;

    teamLeader: {
        name: string;
        rollNumber: string;
        email?: string;
    };

    members: Array<{
        name: string;
        rollNumber: string;
        role: string; // Frontend Dev, Backend Dev, Designer, Tester, etc.
        email?: string;
    }>;

    toolsUsed: string[]; // Git, GitHub, Figma, Jira, etc.

    createdAt: Date;
    updatedAt: Date;
}

// Form data types for creating/updating
export interface ProjectFormData {
    title: string;
    problemStatement: string;
    proposedSolution: string;
    description: string;
    features: string[];
    advantages: string[];
    technologies: string[];
    tools: string[];
    teamSize: {
        min: number;
        max: number;
        boysCount?: number;
        girlsCount?: number;
    };
    registrationStartDate: Date;
    registrationEndDate: Date;
    submissionDate: Date;
    certificates: string;
    awards: string;
    rulesAndRegulations: string;
    eligibility: string[];
    status: 'draft' | 'published' | 'closed' | 'archived';
    registrationLink?: string;
    maxRegistrations?: number;
    coverImage?: string;
}

export interface ProjectTeamFormData {
    teamName: string;
    teamNumber: number;
    teamLeader: {
        name: string;
        rollNumber: string;
        email?: string;
    };
    members: Array<{
        name: string;
        rollNumber: string;
        role: string;
        email?: string;
    }>;
    toolsUsed: string[];
}

export interface ProjectFormFormData {
    title: string;
    description: string;
    purpose: string;
    formType: 'google_form' | 'microsoft_form' | 'custom_link' | 'typeform';
    formUrl: string;
    isActive: boolean;
    order: number;
}

// Filter types
export interface ProjectFilters {
    status?: 'draft' | 'published' | 'closed' | 'archived';
    technology?: string;
    search?: string;
    startDate?: Date;
    endDate?: Date;
}

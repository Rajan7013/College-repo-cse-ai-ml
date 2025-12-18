'use server';



import { auth } from '@clerk/nextjs/server';
import { adminDb } from '@/lib/firebase-admin';
import { r2Client, R2_BUCKET_NAME } from '@/lib/r2';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export interface UploadResult {
    success: boolean;
    message: string;
    documentId?: string;
    fileUrl?: string;
}

// Allowed file types
const ALLOWED_MIME_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const ALLOWED_EXTENSIONS = [
    '.pdf',
    '.jpg', '.jpeg', '.png',
    '.ppt', '.pptx',
    '.doc', '.docx',
];

// File size limits (in bytes)
const MAX_FILE_SIZE: Record<string, number> = {
    'application/pdf': 100 * 1024 * 1024, // 100 MB
    'image/jpeg': 10 * 1024 * 1024, // 10 MB
    'image/png': 10 * 1024 * 1024, // 10 MB
    'application/vnd.ms-powerpoint': 100 * 1024 * 1024, // 100 MB
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 100 * 1024 * 1024, // 100 MB
    'application/msword': 25 * 1024 * 1024, // 25 MB
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 25 * 1024 * 1024, // 25 MB
};

/**
 * Determine file type category from MIME type
 */
function getFileType(mimeType: string): string {
    if (mimeType === 'application/pdf') return 'PDF';
    if (mimeType.startsWith('image/')) return 'Image';
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'PPT';
    if (mimeType.includes('word') || mimeType.includes('wordprocessingml')) return 'Word';
    return 'Other';
}

/**
 * Validate file metadata
 */
function isValidFileMetadata(name: string, type: string, size: number): { valid: boolean; error?: string } {
    // Check MIME type
    if (!ALLOWED_MIME_TYPES.includes(type)) {
        return {
            valid: false,
            error: 'File type not allowed. Supported: PDF, Images (JPG/PNG), PowerPoint (PPT/PPX), Word (DOC/DOCX)',
        };
    }

    // Check file extension
    const extension = '.' + name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
        return {
            valid: false,
            error: 'File extension not allowed',
        };
    }

    // Check file size
    const maxSize = MAX_FILE_SIZE[type] || 50 * 1024 * 1024;
    if (size > maxSize) {
        return {
            valid: false,
            error: `File size exceeds limit (${(maxSize / 1024 / 1024).toFixed(0)} MB)`,
        };
    }

    return { valid: true };
}

/**
 * Step 1: Generate a Presigned URL for direct client upload to R2
 * This bypasses Vercel's 4.5MB limit
 */
export async function getAdminPresignedUrl(
    filename: string,
    contentType: string,
    size: number
): Promise<{ success: boolean; uploadUrl?: string; publicUrl?: string; key?: string; error?: string }> {
    try {
        // 1. Check authentication & Admin Role
        const { userId } = await auth();
        if (!userId) return { success: false, error: 'Unauthorized' };

        const userDoc = await adminDb.collection('users').doc(userId).get();
        if (!userDoc.exists || userDoc.data()?.role !== 'admin') {
            return { success: false, error: 'Unauthorized: Admin access required' };
        }

        // 2. Validate file metadata
        const validation = isValidFileMetadata(filename, contentType, size);
        if (!validation.valid) {
            return { success: false, error: validation.error };
        }

        // 3. Generate Key
        const timestamp = Date.now();
        const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
        const key = `resources/${timestamp}-${sanitizedFilename}`;

        // 4. Generate Signed URL
        const command = new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: key,
            ContentType: contentType,
        });

        const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 });
        const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`;

        return { success: true, uploadUrl, publicUrl, key };

    } catch (error: any) {
        console.error('Presigned URL Error:', error);
        return { success: false, error: 'Failed to generate upload URL' };
    }
}

/**
 * Step 2: Save metadata to Firestore AFTER client upload is complete
 */
export async function saveResourceMetadata(data: {
    title: string;
    branch: string;
    regulation: string;
    year: number;
    semester: number;
    subjectCode: string;
    documentType: string;
    unit: string | number;
    tags: string[];
    description: string;
    fileUrl: string; // Provided by client after successful upload
    filename: string; // The R2 key or original filename
    fileType: string; // MIME type
    fileSize: number;
}): Promise<UploadResult> {
    try {
        // 1. Check authentication & Admin Role
        const { userId } = await auth();
        if (!userId) return { success: false, message: 'Unauthorized' };

        const userDoc = await adminDb.collection('users').doc(userId).get();
        if (!userDoc.exists || userDoc.data()?.role !== 'admin') {
            return { success: false, message: 'Unauthorized: Admin access required' };
        }

        // 2. Determine generalized file type
        const generalFileType = getFileType(data.fileType);

        // 3. Save to Firestore
        const docRef = await adminDb.collection('resources').add({
            title: data.title,
            branch: data.branch,
            regulation: data.regulation,
            year: data.year,
            semester: data.semester,
            subjectCode: data.subjectCode,
            documentType: data.documentType,
            unit: data.unit,
            tags: data.tags,
            description: data.description || '',
            fileUrl: data.fileUrl,
            filename: data.filename,
            fileType: generalFileType, // PDF, Image, etc.
            mimeType: data.fileType,
            fileSize: data.fileSize,
            uploadedBy: userId,
            uploadedAt: new Date(),
        });

        return {
            success: true,
            message: 'Resource saved successfully!',
            documentId: docRef.id,
            fileUrl: data.fileUrl,
        };

    } catch (error: any) {
        console.error('Metadata Save Error:', error);
        return { success: false, message: 'Failed to save resource metadata.' };
    }
}

/**
 * Deprecated: Original Server-Side Upload (Limited to 4.5MB on Vercel)
 * Kept for reference or small file fallbacks if needed, but UI should use new flow.
 */
export async function uploadResource(formData: FormData): Promise<UploadResult> {
    return { success: false, message: "Please use the new client-side upload flow." };
}

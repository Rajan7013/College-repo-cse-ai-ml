'use server';

import { auth } from '@clerk/nextjs/server';
import { adminDb } from '@/lib/firebase-admin';
import { r2Client, R2_BUCKET_NAME } from '@/lib/r2';
import { PutObjectCommand } from '@aws-sdk/client-s3';

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
 * Validate file type and extension
 */
function isValidFile(file: File): { valid: boolean; error?: string } {
    // Check MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return {
            valid: false,
            error: 'File type not allowed. Supported: PDF, Images (JPG/PNG), PowerPoint (PPT/PPX), Word (DOC/DOCX)',
        };
    }

    // Check file extension
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
        return {
            valid: false,
            error: 'File extension not allowed',
        };
    }

    // Check file size
    const maxSize = MAX_FILE_SIZE[file.type] || 50 * 1024 * 1024;
    if (file.size > maxSize) {
        return {
            valid: false,
            error: `File size exceeds limit (${(maxSize / 1024 / 1024).toFixed(0)} MB)`,
        };
    }

    return { valid: true };
}

/**
 * Upload a resource file to R2 and save metadata to Firestore
 * Only admins can upload files
 */
export async function uploadResource(formData: FormData): Promise<UploadResult> {
    try {
        // 1. Check authentication
        const { userId } = await auth();

        if (!userId) {
            return {
                success: false,
                message: 'Unauthorized: Please sign in',
            };
        }

        // 2. Check if user is admin
        const userDoc = await adminDb.collection('users').doc(userId).get();

        if (!userDoc.exists) {
            return {
                success: false,
                message: 'User not found. Please sign in again.',
            };
        }

        const userRole = userDoc.data()?.role;

        if (userRole !== 'admin') {
            return {
                success: false,
                message: 'Unauthorized: Admin access required',
            };
        }

        // 3. Extract form data
        const file = formData.get('file') as File;
        const title = formData.get('title') as string;
        const branch = formData.get('branch') as string;
        const regulation = formData.get('regulation') as string;
        const year = parseInt(formData.get('year') as string);
        const semester = parseInt(formData.get('semester') as string);
        const subjectCode = formData.get('subjectCode') as string;
        const documentType = formData.get('documentType') as string;
        const unitValue = formData.get('unit') as string;
        const tagsString = formData.get('tags') as string;
        const description = formData.get('description') as string;

        // Parse tags (comma-separated)
        const tags = tagsString ? tagsString.split(',').map(t => t.trim()).filter(t => t) : [];

        // Parse unit
        const unit = unitValue === 'all' ? 'all' : parseInt(unitValue);

        // 4. Validate required fields
        if (!file || !title || !branch || !regulation || !year || !semester || !subjectCode || !documentType || !unitValue) {
            return {
                success: false,
                message: 'All required fields must be filled',
            };
        }

        // 5. Validate file type and size
        const validation = isValidFile(file);
        if (!validation.valid) {
            return {
                success: false,
                message: validation.error || 'Invalid file',
            };
        }

        // 6. Upload to R2
        const timestamp = Date.now();
        const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const key = `resources/${timestamp}-${sanitizedFilename}`;

        const fileBuffer = Buffer.from(await file.arrayBuffer());

        await r2Client.send(
            new PutObjectCommand({
                Bucket: R2_BUCKET_NAME,
                Key: key,
                Body: fileBuffer,
                ContentType: file.type,
            })
        );

        // 7. Generate public URL
        const fileUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`;

        // 8. Determine file type
        const fileType = getFileType(file.type);

        // 9. Save metadata to Firestore
        const docRef = await adminDb.collection('resources').add({
            title,
            branch,
            regulation,
            year,
            semester,
            subjectCode,
            documentType,
            unit,
            tags,
            description: description || '',
            fileUrl,
            filename: sanitizedFilename,
            fileType,
            mimeType: file.type,
            fileSize: file.size,
            uploadedBy: userId,
            uploadedAt: new Date(),
        });

        return {
            success: true,
            message: 'Resource uploaded successfully!',
            documentId: docRef.id,
            fileUrl,
        };

    } catch (error) {
        console.error('Upload error:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Upload failed. Please try again.',
        };
    }
}

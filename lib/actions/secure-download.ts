'use server';

import { auth } from '@clerk/nextjs/server';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, R2_BUCKET_NAME } from '@/lib/r2-client';

/**
 * Generate a secure, time-limited download URL for a file in R2
 * @param fileKey - The key/path of the file in R2 bucket
 * @returns Signed URL that expires in 5 minutes
 * @throws Error if user is not authenticated
 */
export async function getSecureDownloadUrl(fileKey: string): Promise<string> {
    // 1. Authentication check
    const { userId } = await auth();
    if (!userId) {
        throw new Error('Authentication required. Please sign in to download files.');
    }

    // 2. Optional: Add permission checks here
    // Example: Check if user has access to this specific file
    // const hasPermission = await checkFilePermission(userId, fileKey);
    // if (!hasPermission) {
    //   throw new Error('You do not have permission to access this file.');
    // }

    try {
        // 3. Generate signed URL
        const command = new GetObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: fileKey,
        });

        const signedUrl = await getSignedUrl(r2Client, command, {
            expiresIn: 300, // 5 minutes
        });

        // 4. Optional: Log download for audit trail
        // await logDownload({
        //   userId,
        //   fileKey,
        //   timestamp: new Date(),
        // });

        return signedUrl;
    } catch (error) {
        console.error('Failed to generate signed URL:', error);
        throw new Error('Failed to generate download link. Please try again.');
    }
}

/**
 * Get secure download URL with custom expiration time
 * @param fileKey - The key/path of the file in R2 bucket
 * @param expiresIn - Expiration time in seconds (default: 300 = 5 minutes)
 */
export async function getSecureDownloadUrlWithExpiry(
    fileKey: string,
    expiresIn: number = 300
): Promise<string> {
    const { userId } = await auth();
    if (!userId) {
        throw new Error('Authentication required');
    }

    const command = new GetObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: fileKey,
    });

    return await getSignedUrl(r2Client, command, { expiresIn });
}

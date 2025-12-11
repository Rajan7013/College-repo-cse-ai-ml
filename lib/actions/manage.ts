'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { r2Client, R2_BUCKET_NAME } from '@/lib/r2';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';

/**
 * Delete a resource and its file from R2
 */
export async function deleteResource(resourceId: string): Promise<{ success: boolean; message: string }> {
    try {
        const { userId } = await auth();
        if (!userId) {
            return { success: false, message: 'Not authenticated' };
        }

        // Check if user is admin
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists() || userDoc.data().role !== 'admin') {
            return { success: false, message: 'Unauthorized: Admin access required' };
        }

        // Get resource to find file URL
        const resourceRef = doc(db, 'resources', resourceId);
        const resourceDoc = await getDoc(resourceRef);

        if (!resourceDoc.exists()) {
            return { success: false, message: 'Resource not found' };
        }

        const resourceData = resourceDoc.data();
        const fileUrl = resourceData.fileUrl;

        // Extract R2 key from URL
        if (fileUrl && process.env.NEXT_PUBLIC_R2_PUBLIC_URL) {
            const key = fileUrl.replace(`${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/`, '');

            // Delete from R2
            try {
                await r2Client.send(
                    new DeleteObjectCommand({
                        Bucket: R2_BUCKET_NAME,
                        Key: key,
                    })
                );
            } catch (error) {
                console.error('Error deleting from R2:', error);
                // Continue even if R2 deletion fails
            }
        }

        // Delete from Firestore
        await deleteDoc(resourceRef);

        return { success: true, message: 'Resource deleted successfully' };
    } catch (error) {
        console.error('Error deleting resource:', error);
        return { success: false, message: 'Failed to delete resource' };
    }
}

/**
 * Update resource metadata
 */
export async function updateResource(
    resourceId: string,
    data: {
        title?: string;
        branch?: string;
        regulation?: string;
        year?: number;
        semester?: number;
        subjectCode?: string;
        documentType?: string;
        unit?: number | 'all';
        tags?: string[];
        description?: string;
    }
): Promise<{ success: boolean; message: string }> {
    try {
        const { userId } = await auth();
        if (!userId) {
            return { success: false, message: 'Not authenticated' };
        }

        // Check if user is admin
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists() || userDoc.data().role !== 'admin') {
            return { success: false, message: 'Unauthorized: Admin access required' };
        }

        // Update resource
        const resourceRef = doc(db, 'resources', resourceId);
        const resourceDoc = await getDoc(resourceRef);

        if (!resourceDoc.exists()) {
            return { success: false, message: 'Resource not found' };
        }

        await updateDoc(resourceRef, {
            ...data,
            updatedAt: new Date()
        });

        return { success: true, message: 'Resource updated successfully' };
    } catch (error) {
        console.error('Error updating resource:', error);
        return { success: false, message: 'Failed to update resource' };
    }
}

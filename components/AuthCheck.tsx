'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { syncUser } from '@/lib/actions/user';

/**
 * AuthCheck Component
 * Automatically syncs authenticated Clerk users with Firestore
 * This component should be placed in the root layout
 */
export default function AuthCheck() {
    const { isLoaded, isSignedIn, user } = useUser();

    useEffect(() => {
        async function performSync() {
            if (isLoaded && isSignedIn && user) {
                try {
                    const role = await syncUser();
                    if (role) {
                        console.log(`User synced successfully. Role: ${role}`);
                    }
                } catch (error) {
                    console.error('Failed to sync user:', error);
                }
            }
        }

        performSync();
    }, [isLoaded, isSignedIn, user]);

    // This component doesn't render anything
    return null;
}

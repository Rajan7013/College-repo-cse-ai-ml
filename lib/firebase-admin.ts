import { initializeApp, getApps, getApp, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// CRITICAL: We load these from environment variables for security.
// Do NOT hardcode credentials here in production code.
const serviceAccount: ServiceAccount = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "college-db-b20cc",
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        : undefined,
};

function getFirebaseAdminApp() {
    const apps = getApps();
    if (apps.length > 0) {
        return apps[0];
    }

    // Ensure we have necessary credentials
    if (!serviceAccount.privateKey || !serviceAccount.clientEmail) {
        console.error("Firebase Admin SDK: Missing FIREBASE_PRIVATE_KEY or FIREBASE_CLIENT_EMAIL");
    }

    return initializeApp({
        credential: cert(serviceAccount),
    });
}

const adminApp = getFirebaseAdminApp();
export const adminDb = getFirestore(adminApp);
export const adminAuth = getAuth(adminApp);

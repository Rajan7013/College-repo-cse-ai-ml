import { initializeApp, getApps, getApp, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// CRITICAL: We load these from environment variables for security.
// Do NOT hardcode credentials here in production code.
const getServiceAccount = (): ServiceAccount => {
    // 1. Try Environment Variables
    if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
        return {
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "college-db-b20cc",
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        };
    }

    // 2. Try service-account.json file in root (Local Dev)
    try {
        // Dynamic require/fs to avoid webpack bundling issues in some environments, though standard import/fs is usually fine in server files.
        // We use process.cwd() to find the file in the project root.
        const fs = require('fs');
        const path = require('path');
        const filePath = path.join(process.cwd(), 'service-account.json');

        if (fs.existsSync(filePath)) {
            console.log("Loading Firebase Admin credentials from service-account.json");
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const json = JSON.parse(fileContent);
            return {
                projectId: json.project_id,
                clientEmail: json.client_email,
                privateKey: json.private_key,
            };
        }
    } catch (error) {
        console.warn("Failed to load service-account.json:", error);
    }

    // 3. Fail gracefully (will cause error downstream but explicit logging helps)
    return {
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: undefined,
        privateKey: undefined,
    };
};

function getFirebaseAdminApp() {
    const apps = getApps();
    if (apps.length > 0) {
        return apps[0];
    }

    const serviceAccount = getServiceAccount();

    // Ensure we have necessary credentials
    if (!serviceAccount.privateKey || !serviceAccount.clientEmail) {
        throw new Error(
            "Firebase Admin SDK Initialization Error: Missing FIREBASE_PRIVATE_KEY/FIREBASE_CLIENT_EMAIL env vars AND could not find service-account.json in project root."
        );
    }

    return initializeApp({
        credential: cert(serviceAccount),
    });
}

const adminApp = getFirebaseAdminApp();
export const adminDb = getFirestore(adminApp);
export const adminAuth = getAuth(adminApp);

/**
 * Migration Script: Add fileKey to Existing Resources
 * 
 * This script migrates existing resources from public URLs to file keys
 * for use with signed URLs.
 * 
 * What it does:
 * 1. Finds all resources with fileUrl but no fileKey
 * 2. Extracts the file key from the public URL
 * 3. Updates the Firestore document with the fileKey
 * 
 * Run: node scripts/migrate-to-file-keys.js
 */

const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });

// Initialize Firebase Admin using environment variables
if (!admin.apps.length) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!privateKey) {
        console.error('❌ Error: FIREBASE_PRIVATE_KEY not found in .env.local');
        console.error('Please make sure your .env.local file contains:');
        console.error('FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n..."');
        process.exit(1);
    }

    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            // Replace escaped newlines with actual newlines
            privateKey: privateKey.replace(/\\n/g, '\n')
        })
    });
}

const db = admin.firestore();

async function migrateToFileKeys() {
    console.log('🚀 Starting migration to file keys...\n');

    try {
        // Get all resources
        const resourcesSnapshot = await db.collection('resources').get();
        console.log(`📊 Found ${resourcesSnapshot.size} total resources\n`);

        let migratedCount = 0;
        let skippedCount = 0;
        let errorCount = 0;
        const errors = [];

        // Process each resource
        for (const doc of resourcesSnapshot.docs) {
            const data = doc.data();
            const docId = doc.id;

            // Skip if already has fileKey
            if (data.fileKey) {
                console.log(`⏭️  Skipping ${docId} - already has fileKey`);
                skippedCount++;
                continue;
            }

            // Skip if no fileUrl
            if (!data.fileUrl) {
                console.log(`⚠️  Skipping ${docId} - no fileUrl found`);
                skippedCount++;
                continue;
            }

            try {
                // Extract file key from public URL
                // Example URL: https://pub-xxx.r2.dev/resources/abc123.pdf
                // Extract: resources/abc123.pdf

                const fileUrl = data.fileUrl;
                let fileKey;

                // Check if it's an R2 public URL
                if (fileUrl.includes('.r2.dev/') || fileUrl.includes('r2.cloudflarestorage.com/')) {
                    // Extract everything after the domain
                    const urlParts = fileUrl.split('/');
                    const domainIndex = urlParts.findIndex(part => part.includes('.r2.dev') || part.includes('r2.cloudflarestorage.com'));
                    fileKey = urlParts.slice(domainIndex + 1).join('/');
                } else {
                    // Fallback: use filename if URL format is different
                    fileKey = data.filename || path.basename(fileUrl);
                }

                // Update the document
                await doc.ref.update({
                    fileKey: fileKey,
                    // Keep fileUrl for backward compatibility
                    migratedAt: admin.firestore.FieldValue.serverTimestamp()
                });

                console.log(`✅ Migrated ${docId}`);
                console.log(`   fileUrl: ${fileUrl}`);
                console.log(`   fileKey: ${fileKey}\n`);
                migratedCount++;

            } catch (error) {
                console.error(`❌ Error migrating ${docId}:`, error.message);
                errors.push({ docId, error: error.message, fileUrl: data.fileUrl });
                errorCount++;
            }
        }

        // Summary
        console.log('\n' + '='.repeat(60));
        console.log('📊 MIGRATION SUMMARY');
        console.log('='.repeat(60));
        console.log(`✅ Successfully migrated: ${migratedCount}`);
        console.log(`⏭️  Skipped (already migrated): ${skippedCount}`);
        console.log(`❌ Errors: ${errorCount}`);
        console.log(`📁 Total processed: ${resourcesSnapshot.size}`);
        console.log('='.repeat(60));

        if (errors.length > 0) {
            console.log('\n⚠️  ERRORS ENCOUNTERED:');
            errors.forEach(({ docId, error, fileUrl }) => {
                console.log(`\nDocument ID: ${docId}`);
                console.log(`File URL: ${fileUrl}`);
                console.log(`Error: ${error}`);
            });
        }

        console.log('\n✨ Migration complete!');

    } catch (error) {
        console.error('💥 Fatal error during migration:', error);
        process.exit(1);
    }
}

// Run migration
migrateToFileKeys()
    .then(() => {
        console.log('\n👋 Exiting...');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Unhandled error:', error);
        process.exit(1);
    });

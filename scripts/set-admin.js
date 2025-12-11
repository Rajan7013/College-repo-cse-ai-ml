const admin = require('firebase-admin');
const serviceAccount = require('../service-account.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Target email to promote to admin
const TARGET_EMAIL = 'rajanprasaila@gmail.com';

async function promoteToAdmin() {
    try {
        console.log(`🔍 Searching for user with email: ${TARGET_EMAIL}...`);

        // Query the users collection for the target email
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('email', '==', TARGET_EMAIL).get();

        if (snapshot.empty) {
            console.log('❌ User not found. Please log in to the website first.');
            console.log('   Steps:');
            console.log('   1. Go to http://localhost:3000');
            console.log('   2. Sign in with ' + TARGET_EMAIL);
            console.log('   3. Wait for user sync to complete');
            console.log('   4. Run this script again');
            process.exit(1);
        }

        // Get the first (and should be only) matching document
        const userDoc = snapshot.docs[0];
        const userData = userDoc.data();

        console.log(`✅ Found user: ${userData.email}`);
        console.log(`   Current role: ${userData.role}`);
        console.log(`   UID: ${userData.uid}`);

        if (userData.role === 'admin') {
            console.log('ℹ️  User is already an admin. No changes made.');
            process.exit(0);
        }

        // Update the user's role to admin
        await userDoc.ref.update({
            role: 'admin',
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log('🎉 Success: ' + TARGET_EMAIL + ' is now an ADMIN!');
        console.log('   Role updated from "' + userData.role + '" to "admin"');
        console.log('   The user now has permission to:');
        console.log('   - Upload resources to Firestore');
        console.log('   - Edit existing resources');
        console.log('   - Delete resources');
        console.log('   - Access /admin routes');

    } catch (error) {
        console.error('❌ Error promoting user to admin:', error);
        process.exit(1);
    } finally {
        // Cleanup
        process.exit(0);
    }
}

// Run the script
promoteToAdmin();

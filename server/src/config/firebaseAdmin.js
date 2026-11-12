const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

let firebaseApp = null;
let isMockMode = false;

function initializeFirebaseAdmin() {
  if (firebaseApp) return { admin, isMockMode };

  try {
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    const resolvedPath = serviceAccountPath ? path.resolve(serviceAccountPath) : null;

    if (resolvedPath && fs.existsSync(resolvedPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('✅ Firebase Admin SDK initialized successfully via serviceAccountKey.json');
      return { admin, isMockMode: false };
    }

    if (
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
    ) {
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
      console.log('✅ Firebase Admin SDK initialized successfully via Environment Variables');
      return { admin, isMockMode: false };
    }

    // Default to applicationDefault credentials if available (GCP / Cloud Run)
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      firebaseApp = admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
      console.log('✅ Firebase Admin SDK initialized via GOOGLE_APPLICATION_CREDENTIALS');
      return { admin, isMockMode: false };
    }

    // Development / Local Fallback Mode
    console.warn('⚠️ No Firebase service account credentials found.');
    console.warn('⚡ Initializing Firebase Admin in Dev Simulation mode (Mock SMS/OTP verification enabled for tests).');
    isMockMode = true;
    return { admin: null, isMockMode: true };
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin SDK:', error.message);
    isMockMode = true;
    return { admin: null, isMockMode: true };
  }
}

module.exports = {
  initializeFirebaseAdmin,
  getFirebaseAdmin: () => admin,
  getIsMockMode: () => isMockMode,
};

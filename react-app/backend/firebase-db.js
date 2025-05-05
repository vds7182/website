import admin from 'firebase-admin';
import { readFileSync } from 'fs';

// Read the service account JSON file securely
const serviceAccount = JSON.parse(readFileSync('./serviceAccount.json', 'utf-8'));

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

export { db };

import { initializeApp, getApps } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { offlineStorage } from './offline-mode';

// Check if we have Firebase config
const hasFirebaseConfig = process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
                          process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

let database;
let isOfflineMode = false;

if (hasFirebaseConfig) {
  try {
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
    };

    // Initialize Firebase only if it hasn't been initialized already
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    database = getDatabase(app);
    console.log('Firebase initialized successfully');
  } catch (error) {
    console.warn('Firebase initialization failed, using offline mode:', error);
    database = offlineStorage;
    isOfflineMode = true;
  }
} else {
  console.log('No Firebase config found, using offline mode');
  database = offlineStorage;
  isOfflineMode = true;
}

export { database, isOfflineMode }; 
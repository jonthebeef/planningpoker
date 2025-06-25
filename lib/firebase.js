import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';
import { offlineStorage } from './offline-mode';

// Check if we have Firebase config
const hasFirebaseConfig = process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
                          process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
                          process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;

let database;
let isOfflineMode = false;

console.log('Firebase Environment Check:', {
  hasApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  hasProjectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  hasDatabaseURL: !!process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
});

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

    console.log('Firebase config:', {
      projectId: firebaseConfig.projectId,
      databaseURL: firebaseConfig.databaseURL,
      hasApiKey: !!firebaseConfig.apiKey
    });

    // Validate required fields
    if (!firebaseConfig.databaseURL || !firebaseConfig.projectId) {
      throw new Error('Missing required Firebase configuration: databaseURL or projectId');
    }

    // Initialize Firebase app with proper error handling
    let app;
    try {
      // Check if app already exists
      if (getApps().length === 0) {
        app = initializeApp(firebaseConfig);
        console.log('Firebase app initialized successfully');
      } else {
        // Get existing app and verify it has the same config
        app = getApp();
        console.log('Using existing Firebase app');
      }
    } catch (error) {
      console.warn('Firebase app initialization issue:', error);
      // If there's a config mismatch, use the existing app anyway
      app = getApps()[0];
    }
    
    // Get database with explicit URL to avoid the fatal error
    try {
      database = getDatabase(app, firebaseConfig.databaseURL);
      console.log('Firebase database initialized successfully');
      
      // Test connection
      setTimeout(async () => {
        try {
          const testRef = ref(database, 'connection-test');
          await set(testRef, { timestamp: Date.now(), status: 'connected' });
          console.log('Firebase connection test successful');
        } catch (testError) {
          console.warn('Firebase connection test failed:', testError);
        }
      }, 1000);
      
    } catch (dbError) {
      console.warn('Database initialization failed:', dbError);
      throw dbError;
    }
    
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
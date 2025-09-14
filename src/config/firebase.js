// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Check config before init
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
  console.error("❌ Firebase config is missing required fields. Check your .env file!");
}

const app = initializeApp(firebaseConfig);

// Services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Analytics (optional, may fail in dev)
let analytics = null;
try {
  if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
    analytics = getAnalytics(app);
  }
} catch (err) {
  console.warn("Analytics disabled:", err);
}

// Google Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export { app, auth, db, storage, analytics, googleProvider };

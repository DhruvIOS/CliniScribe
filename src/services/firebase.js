// services/firebase.js
import { auth, googleProvider } from '../config/firebase.js';
import { signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';

const FirebaseService = {
  // Google login
  signInWithGoogle: async () => {
    if (!auth || !googleProvider) {
      throw new Error('auth/configuration-not-found');
    }
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  },

  // Logout
  signOut: async () => {
    if (!auth) return;
    await firebaseSignOut(auth);
    localStorage.clear();
  }
};

export default FirebaseService;

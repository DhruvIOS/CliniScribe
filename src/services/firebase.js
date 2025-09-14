import {
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db, googleProvider } from '../config/firebase.js';

class FirebaseService {
  // Authentication methods
  async signInWithGoogle() {
    if (!auth || !googleProvider) {
      throw new Error('Firebase authentication is not initialized');
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Save user to Firestore
      await this.saveUserToFirestore(user);

      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  }

  async signOutUser() {
    if (!auth) {
      localStorage.clear();
      return;
    }

    try {
      await signOut(auth);
      localStorage.clear();
    } catch (error) {
      console.error('Sign-out error:', error);
      localStorage.clear();
      throw error;
    }
  }

  onAuthStateChanged(callback) {
    if (!auth) {
      // If auth is not available, call callback with null
      callback(null);
      return () => {}; // Return empty unsubscribe function
    }
    return onAuthStateChanged(auth, callback);
  }

  getCurrentUser() {
    return auth?.currentUser || null;
  }

  // Firestore methods
  async saveUserToFirestore(user) {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } else {
        // Update user info if it exists
        await setDoc(userRef, {
          displayName: user.displayName,
          photoURL: user.photoURL,
          updatedAt: serverTimestamp(),
        }, { merge: true });
      }
    } catch (error) {
      console.error('Error saving user to Firestore:', error);
      throw error;
    }
  }

  async getUserFromFirestore(uid) {
    try {
      const userRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Error getting user from Firestore:', error);
      throw error;
    }
  }

  // Consultation methods
  async saveConsultation(consultationData) {
    try {
      const user = this.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const consultationsRef = collection(db, 'consultations');
      const docRef = await addDoc(consultationsRef, {
        userId: user.uid,
        userEmail: user.email,
        ...consultationData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return docRef.id;
    } catch (error) {
      console.error('Error saving consultation:', error);
      throw error;
    }
  }

  async getUserConsultations(userId) {
    try {
      const consultationsRef = collection(db, 'consultations');
      const q = query(
        consultationsRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const consultations = [];

      querySnapshot.forEach((doc) => {
        consultations.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return consultations;
    } catch (error) {
      console.error('Error getting consultations:', error);
      throw error;
    }
  }

  async getConsultationById(consultationId) {
    try {
      const consultationRef = doc(db, 'consultations', consultationId);
      const consultationDoc = await getDoc(consultationRef);

      if (consultationDoc.exists()) {
        return {
          id: consultationDoc.id,
          ...consultationDoc.data()
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting consultation:', error);
      throw error;
    }
  }

  // Health profile methods
  async saveHealthProfile(profileData) {
    try {
      const user = this.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const profileRef = doc(db, 'healthProfiles', user.uid);
      await setDoc(profileRef, {
        userId: user.uid,
        ...profileData,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      return true;
    } catch (error) {
      console.error('Error saving health profile:', error);
      throw error;
    }
  }

  async getHealthProfile(userId) {
    try {
      const profileRef = doc(db, 'healthProfiles', userId);
      const profileDoc = await getDoc(profileRef);

      if (profileDoc.exists()) {
        return profileDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Error getting health profile:', error);
      throw error;
    }
  }
}

export default new FirebaseService();

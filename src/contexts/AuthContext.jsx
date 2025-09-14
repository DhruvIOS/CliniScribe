import React, { createContext, useContext, useEffect, useState } from 'react';
import FirebaseService from '../services/firebase.js';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = FirebaseService.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);

      if (user) {
        // Update localStorage when user signs in
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userName', user.displayName || 'User');
        localStorage.setItem('userId', user.uid);
        localStorage.setItem('userPhoto', user.photoURL || '');
      } else {
        // Clear localStorage when user signs out
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('userId');
        localStorage.removeItem('userPhoto');
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    loading,
    signInWithGoogle: FirebaseService.signInWithGoogle.bind(FirebaseService),
    signOut: FirebaseService.signOutUser.bind(FirebaseService),
    saveConsultation: FirebaseService.saveConsultation.bind(FirebaseService),
    getUserConsultations: FirebaseService.getUserConsultations.bind(FirebaseService),
    getConsultationById: FirebaseService.getConsultationById.bind(FirebaseService),
    saveHealthProfile: FirebaseService.saveHealthProfile.bind(FirebaseService),
    getHealthProfile: FirebaseService.getHealthProfile.bind(FirebaseService),
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
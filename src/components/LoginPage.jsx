import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';
import ApiService from '../services/api.js';
import FirebaseService from '../services/firebase.js';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setIsLoading(true);

    try {
      // Use Firebase for real Google authentication
      const user = await FirebaseService.signInWithGoogle();

      // Store user info from Firebase
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userName', user.displayName || 'User');
      localStorage.setItem('userId', user.uid);
      localStorage.setItem('userPhoto', user.photoURL || '');

      // Also sync with your backend if needed
      try {
        const backendUser = {
          googleId: user.uid,
          name: user.displayName,
          email: user.email,
          photo: user.photoURL
        };
        await ApiService.loginWithGoogle(backendUser);
      } catch (backendError) {
        console.warn('Backend sync failed:', backendError);
        // Continue with Firebase auth even if backend fails
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Google login error:', error);

      // Fallback to demo mode if Firebase is not configured
      if (error.code === 'auth/configuration-not-found' || !import.meta.env.VITE_FIREBASE_API_KEY) {
        console.warn('Firebase not configured, using demo mode');

        const mockGoogleUser = {
          googleId: `demo_${Date.now()}`,
          name: 'Demo User',
          email: 'demo@google.com',
          photo: 'https://via.placeholder.com/150'
        };

        try {
          const response = await ApiService.loginWithGoogle(mockGoogleUser);
          localStorage.setItem('userEmail', response.user.email);
          localStorage.setItem('userName', response.user.name);
          localStorage.setItem('userId', response.user._id);
          localStorage.setItem('userPhoto', response.user.photo);
          navigate('/dashboard');
        } catch (demoError) {
          console.error('Demo login failed:', demoError);
          alert('Login failed. Please try again.');
        }
      } else {
        alert('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <Stethoscope className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Cliniscribe</h1>
          <p className="text-gray-600">Sign in to continue</p>
        </div>

        <div className="space-y-6">
          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-3 px-4 py-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            <span className="text-gray-700 font-medium">
              {isLoading ? 'Signing in...' : 'Continue with Google'}
            </span>
          </button>

          {/* Info Message */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Sign in with your Google account to access Cliniscribe's AI health assistant
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          By continuing, you agree to our{' '}
          <Link to="#" className="text-blue-600 hover:text-blue-700">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="#" className="text-blue-600 hover:text-blue-700">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
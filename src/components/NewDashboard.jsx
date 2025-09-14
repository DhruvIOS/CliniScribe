import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, Sparkles, Calendar, TrendingUp, Mic } from 'lucide-react';
import ApiService from '../services/api.js';
import FirebaseService from '../services/firebase.js';

export default function NewDashboard() {
  const [userName, setUserName] = useState('User');
  const [userPhoto, setUserPhoto] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [characterCount, setCharacterCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user info from localStorage (set during login)
    const storedUserName = localStorage.getItem('userName') || 'User';
    const storedUserPhoto = localStorage.getItem('userPhoto') || '';
    setUserName(storedUserName);
    setUserPhoto(storedUserPhoto);
  }, []);

  const handleSymptomsChange = (e) => {
    const value = e.target.value;
    if (value.length <= 500) {
      setSymptoms(value);
      setCharacterCount(value.length);
    }
  };

  const handleGenerateAdvice = async () => {
    if (symptoms.trim()) {
      try {
        // Get user ID from localStorage
        const userId = localStorage.getItem('userId') || '68c60dbbbb0c2ad2c3bb804a';

        // Call the backend API to analyze symptoms
        const analysis = await ApiService.analyzeSymptoms(symptoms, userId);

        // Navigate to consultation results with the symptoms and analysis
        navigate('/consultation-results', {
          state: {
            symptoms,
            analysis
          }
        });
      } catch (error) {
        console.error('Error analyzing symptoms:', error);
        // Still navigate with just symptoms if API fails
        navigate('/consultation-results', { state: { symptoms } });
      }
    }
  };

  const recentConsultations = [
    {
      id: 1,
      title: 'Viral or bacterial throat infection (such as...',
      date: '9/13/2025'
    },
    {
      id: 2,
      title: 'Viral pharyngitis (common cold or flu)',
      date: '9/13/2025'
    },
    {
      id: 3,
      title: 'Viral Pharyngitis (also known as a common col...',
      date: '9/13/2025'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header with User Profile */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {userName}!</h1>
            <p className="text-gray-600">Describe your symptoms and get intelligent health guidance</p>
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-4">
            {userPhoto && (
              <img
                src={userPhoto}
                alt={userName}
                className="w-12 h-12 rounded-full border-2 border-gray-200"
              />
            )}
            <button
              onClick={async () => {
                try {
                  await FirebaseService.signOutUser();
                  navigate('/login');
                } catch (error) {
                  console.error('Sign-out error:', error);
                  // Fallback to manual cleanup
                  localStorage.clear();
                  navigate('/login');
                }
              }}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Symptom Input */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Describe Your Symptoms</h2>
                  <p className="text-gray-600">Be as detailed as possible for better analysis</p>
                </div>
              </div>

              <div className="mb-6">
                <textarea
                  value={symptoms}
                  onChange={handleSymptomsChange}
                  placeholder="For example: I have fever and headache for 2 days. The fever started yesterday evening around 6 PM and reached 101°F. I also have a mild sore throat and feel very tired..."
                  className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-500">{characterCount}/500 characters</span>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Mic className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleGenerateAdvice}
                disabled={!symptoms.trim()}
                className="flex items-center space-x-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Sparkles className="w-5 h-5" />
                <span>Generate Advice</span>
              </button>
            </div>
          </div>

          {/* Sidebar - Health Dashboard */}
          <div className="space-y-6">
            {/* Health Dashboard Stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Dashboard</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-teal-600" />
                    <span className="text-gray-700">Consultations</span>
                  </div>
                  <span className="font-semibold text-gray-900">5</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-teal-600" />
                    <span className="text-gray-700">This Month</span>
                  </div>
                  <span className="font-semibold text-gray-900">5</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-purple-100 rounded flex items-center justify-center">
                      <div className="w-2 h-2 bg-purple-600 rounded"></div>
                    </div>
                    <span className="text-gray-700">Health Score</span>
                  </div>
                  <span className="font-semibold text-green-600">Good</span>
                </div>
              </div>
            </div>

            {/* Recent Consultations */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Consultations</h3>

              <div className="space-y-4">
                {recentConsultations.map((consultation) => (
                  <div key={consultation.id} className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                    <p className="text-sm text-gray-900 font-medium line-clamp-2 mb-1">
                      {consultation.title}
                    </p>
                    <p className="text-xs text-gray-500">{consultation.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
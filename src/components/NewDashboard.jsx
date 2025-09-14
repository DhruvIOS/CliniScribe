import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MessageSquare, Sparkles, Calendar, TrendingUp, Mic } from 'lucide-react';
import ApiService from '../services/api.js';
import FirebaseService from '../services/firebase.js';

export default function NewDashboard() {
  const [userName, setUserName] = useState('User');
  const [userPhoto, setUserPhoto] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [characterCount, setCharacterCount] = useState(0);
  const [userLocation, setUserLocation] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({
    totalConsultations: 0,
    thisMonthConsultations: 0,
    healthScore: 'Good',
  });
  const [recentConsultations, setRecentConsultations] = useState([]);

  const navigate = useNavigate();
  const { state } = useLocation();
  const consultation = state?.consultation;

  // Load user info from localStorage
  useEffect(() => {
    setUserName(localStorage.getItem('userName') || 'User');
    setUserPhoto(localStorage.getItem('userPhoto') || '');
  }, []);

  // Get user geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {
          console.error('Error getting location:', err);
          alert('Please allow location access for better results.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  }, []);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const stats = await ApiService.getDashboardStats(localStorage.getItem('userId'));
        setDashboardStats(stats);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      }
    };
    fetchDashboardStats();
  }, []);

  // Fetch recent consultations
  useEffect(() => {
    const fetchRecentConsultations = async () => {
      try {
        const data = await ApiService.getRecentConsultations(localStorage.getItem('userId'));
        setRecentConsultations(data);
      } catch (err) {
        console.error('Error fetching recent consultations:', err);
      }
    };
    fetchRecentConsultations();
  }, []);

  const handleSymptomsChange = (e) => {
    const value = e.target.value;
    if (value.length <= 500) {
      setSymptoms(value);
      setCharacterCount(value.length);
    }
  };

  const handleGenerateAdvice = async () => {
    if (symptoms.trim() && userLocation) {
      try {
        const data = await ApiService.analyzeSymptoms(
          symptoms,
          localStorage.getItem('userId') || 'user123',
          userLocation
        );
        navigate('/consultation-results', { state: { consultation: data } });
      } catch (err) {
        console.error('Error analyzing symptoms:', err);
        alert('Failed to analyze symptoms. Please try again.');
      }
    } else if (!userLocation) {
      alert('Please allow location access to get nearby pharmacies.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header with User Profile */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {userName}!
            </h1>
            <p className="text-gray-600">
              Describe your symptoms and get intelligent health guidance
            </p>
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
                  <h2 className="text-xl font-semibold text-gray-900">
                    Describe Your Symptoms
                  </h2>
                  <p className="text-gray-600">
                    Be as detailed as possible for better analysis
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <textarea
                  value={symptoms}
                  onChange={handleSymptomsChange}
                  placeholder="For example: I have fever and headache for 2 days..."
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
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Health Dashboard</h3>

              <div className="space-y-6">
                {/* Total Consultations Card */}
                <div className="bg-gradient-to-r from-teal-50 to-teal-100 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-teal-700 font-medium">Total Consultations</p>
                        <p className="text-xs text-teal-600">All time</p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-teal-800">{dashboardStats.totalConsultations}</span>
                  </div>
                </div>

                {/* This Month Card */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-blue-700 font-medium">This Month</p>
                        <p className="text-xs text-blue-600">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-blue-800">{dashboardStats.thisMonthConsultations}</span>
                  </div>
                </div>

                {/* Health Score Card */}
                <div className={`rounded-xl p-4 ${
                  dashboardStats.healthScore === 'Excellent'
                    ? 'bg-gradient-to-r from-green-50 to-green-100'
                    : dashboardStats.healthScore === 'Good'
                    ? 'bg-gradient-to-r from-emerald-50 to-emerald-100'
                    : dashboardStats.healthScore === 'Fair'
                    ? 'bg-gradient-to-r from-yellow-50 to-yellow-100'
                    : 'bg-gradient-to-r from-red-50 to-red-100'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        dashboardStats.healthScore === 'Excellent'
                          ? 'bg-green-600'
                          : dashboardStats.healthScore === 'Good'
                          ? 'bg-emerald-600'
                          : dashboardStats.healthScore === 'Fair'
                          ? 'bg-yellow-600'
                          : 'bg-red-600'
                      }`}>
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${
                          dashboardStats.healthScore === 'Excellent'
                            ? 'text-green-700'
                            : dashboardStats.healthScore === 'Good'
                            ? 'text-emerald-700'
                            : dashboardStats.healthScore === 'Fair'
                            ? 'text-yellow-700'
                            : 'text-red-700'
                        }`}>Health Score</p>
                        <p className={`text-xs ${
                          dashboardStats.healthScore === 'Excellent'
                            ? 'text-green-600'
                            : dashboardStats.healthScore === 'Good'
                            ? 'text-emerald-600'
                            : dashboardStats.healthScore === 'Fair'
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }`}>Based on recent activity</p>
                      </div>
                    </div>
                    <span className={`text-xl font-bold ${
                      dashboardStats.healthScore === 'Excellent'
                        ? 'text-green-800'
                        : dashboardStats.healthScore === 'Good'
                        ? 'text-emerald-800'
                        : dashboardStats.healthScore === 'Fair'
                        ? 'text-yellow-800'
                        : 'text-red-800'
                    }`}>
                      {dashboardStats.healthScore}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Consultations */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Consultations</h3>
                {recentConsultations.length > 0 && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {recentConsultations.length} recent
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {recentConsultations.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MessageSquare className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500 mb-2">No consultations yet</p>
                    <p className="text-xs text-gray-400">Start by describing your symptoms above</p>
                  </div>
                ) : (
                  recentConsultations.map((consultation, index) => (
                    <div key={consultation.id} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 font-medium line-clamp-2 mb-1">
                            {consultation.title}
                          </p>
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(consultation.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                        <div className={`w-2 h-2 rounded-full ml-2 mt-1 ${
                          index === 0 ? 'bg-teal-500' : 'bg-gray-300'
                        }`}></div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {recentConsultations.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => navigate('/history')}
                    className="w-full text-sm text-teal-600 hover:text-teal-700 font-medium"
                  >
                    View all consultations
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

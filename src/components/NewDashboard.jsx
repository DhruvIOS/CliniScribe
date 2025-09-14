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

  const handleGenerateAdvice = () => {
    if (symptoms.trim() && userLocation) {
      fetch('http://localhost:5000/api/symptom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: localStorage.getItem('userId'),
          inputType: 'text',
          symptoms,
          location: userLocation,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          navigate('/consultation-results', { state: { consultation: data } });
        })
        .catch((err) => console.error(err));
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Dashboard</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-teal-600" />
                    <span className="text-gray-700">Consultations</span>
                  </div>
                  <span className="font-semibold text-gray-900">{dashboardStats.totalConsultations}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-teal-600" />
                    <span className="text-gray-700">This Month</span>
                  </div>
                  <span className="font-semibold text-gray-900">{dashboardStats.thisMonthConsultations}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-purple-100 rounded flex items-center justify-center">
                      <div className="w-2 h-2 bg-purple-600 rounded"></div>
                    </div>
                    <span className="text-gray-700">Health Score</span>
                  </div>
                  <span className={`font-semibold ${dashboardStats.healthScore === 'Good' ? 'text-green-600' : 'text-red-600'}`}>
                    {dashboardStats.healthScore}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Consultations */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Consultations</h3>

              <div className="space-y-4">
                {recentConsultations.length === 0 ? (
                  <p className="text-sm text-gray-500">No recent consultations</p>
                ) : (
                  recentConsultations.map((consultation) => (
                    <div key={consultation.id} className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                      <p className="text-sm text-gray-900 font-medium line-clamp-2 mb-1">
                        {consultation.title}
                      </p>
                      <p className="text-xs text-gray-500">{new Date(consultation.date).toLocaleDateString()}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mic, FileText, MapPin, CheckSquare, Clock, TrendingUp, AlertCircle, Heart, Home, ArrowLeft, BarChart3, X } from 'lucide-react';
import ApiService from '../services/api.js';
import HealthAnalytics from './HealthAnalytics.jsx';

const Dashboard = () => {
  const [consultations, setConsultations] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalConsultations: 0,
    thisMonthConsultations: 0,
    healthScore: 'Good',
  });
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch real consultation data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem('userId') || 'user123';

        // Fetch consultations and dashboard stats
        const [consultationData, stats] = await Promise.all([
          ApiService.getConsultationHistory(userId),
          ApiService.getDashboardStats(userId)
        ]);

        setConsultations(consultationData);
        setDashboardStats(stats);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Generate recent consultations from real data
  const recentConsultations = consultations.slice(0, 3).map(consultation => ({
    id: consultation._id,
    date: new Date(consultation.createdAt).toLocaleDateString(),
    condition: consultation.advice?.illness || 'Health Consultation',
    status: 'completed'
  }));

  // Generate pending actions from real consultations
  const pendingActions = consultations.slice(0, 3).flatMap(consultation => {
    const actions = [];
    if (consultation.advice?.otcMedicines?.length > 0) {
      actions.push({
        id: `${consultation._id}-medication`,
        task: `Take ${consultation.advice.otcMedicines[0]}`,
        due: 'As prescribed'
      });
    }
    if (consultation.advice?.homeRemedies?.length > 0) {
      actions.push({
        id: `${consultation._id}-remedy`,
        task: consultation.advice.homeRemedies[0],
        due: 'Daily'
      });
    }
    return actions;
  }).slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center text-blue-600 hover:text-blue-700 mr-6">
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span>Back to Home</span>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Welcome to Cliniscribe 2.0</h2>
                <p className="text-blue-100 mb-4">Your AI nurse and scribe that listens, explains, and guides</p>
                <Link
                  to="/consultation"
                  className="inline-block bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Start New Consultation
                </Link>
              </div>
              <div className="hidden md:block">
                <Heart className="h-20 w-20 text-blue-300 opacity-50" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/consultation"
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-blue-200"
            >
              <div className="flex flex-col items-center text-center">
                <Mic className="h-8 w-8 text-blue-600 mb-2" />
                <span className="font-medium text-gray-900">New Consultation</span>
                <span className="text-sm text-gray-500">Voice or text</span>
              </div>
            </Link>

            <Link
              to="/history"
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-blue-200"
            >
              <div className="flex flex-col items-center text-center">
                <FileText className="h-8 w-8 text-green-600 mb-2" />
                <span className="font-medium text-gray-900">SOAP Notes</span>
                <span className="text-sm text-gray-500">Medical records</span>
              </div>
            </Link>

            <button className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-blue-200">
              <div className="flex flex-col items-center text-center">
                <MapPin className="h-8 w-8 text-red-600 mb-2" />
                <span className="font-medium text-gray-900">Find Care</span>
                <span className="text-sm text-gray-500">Nearby clinics</span>
              </div>
            </button>

            <button
              onClick={() => setShowAnalytics(true)}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-blue-200"
            >
              <div className="flex flex-col items-center text-center">
                <BarChart3 className="h-8 w-8 text-purple-600 mb-2" />
                <span className="font-medium text-gray-900">Health Analytics</span>
                <span className="text-sm text-gray-500">View charts</span>
              </div>
            </button>
          </div>

          {/* Recent Activity and Pending Actions */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Recent Consultations */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="h-5 w-5 text-blue-600 mr-2" />
                  Recent Consultations
                </h3>
                <div className="space-y-3">
                  {recentConsultations.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Clock className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500 mb-2">No consultations yet</p>
                      <p className="text-xs text-gray-400">Start your first consultation above</p>
                    </div>
                  ) : (
                    recentConsultations.map((consultation) => (
                      <div key={consultation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{consultation.condition}</p>
                          <p className="text-sm text-gray-500">{consultation.date}</p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            consultation.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {consultation.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
                <Link
                  to="/history"
                  className="block w-full mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium text-center"
                >
                  View All History
                </Link>
              </div>
            </div>

            {/* Pending Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <AlertCircle className="h-5 w-5 text-orange-600 mr-2" />
                  Pending Actions
                </h3>
                <div className="space-y-3">
                  {pendingActions.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CheckSquare className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500 mb-2">No pending actions</p>
                      <p className="text-xs text-gray-400">Complete consultations to see action items</p>
                    </div>
                  ) : (
                    pendingActions.map((action) => (
                      <div key={action.id} className="flex items-start p-3 bg-gray-50 rounded-lg">
                        <input
                          type="checkbox"
                          className="mt-0.5 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <div className="ml-3 flex-1">
                          <p className="font-medium text-gray-900">{action.task}</p>
                          <p className="text-sm text-gray-500">{action.due}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <button className="w-full mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Manage All Actions
                </button>
              </div>
            </div>
          </div>

          {/* Health Insights */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                Health Insights
              </h3>
              <button
                onClick={() => setShowAnalytics(true)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View Analytics
              </button>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{dashboardStats.healthScore}</p>
                <p className="text-sm text-gray-600">Health Score</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{dashboardStats.totalConsultations}</p>
                <p className="text-sm text-gray-600">Total Consultations</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">{dashboardStats.thisMonthConsultations}</p>
                <p className="text-sm text-gray-600">This Month</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Analytics Modal */}
      {showAnalytics && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Health Analytics Dashboard</h2>
              <button
                onClick={() => setShowAnalytics(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <HealthAnalytics consultations={consultations} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
import React from 'react';
import { Mic, FileText, MapPin, CheckSquare, Clock, TrendingUp, AlertCircle, Heart } from 'lucide-react';

interface DashboardProps {
  onNavigate: (view: 'consultation' | 'history' | 'profile') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const recentConsultations = [
    { id: 1, date: '2024-01-15', condition: 'Common Cold', status: 'completed' },
    { id: 2, date: '2024-01-12', condition: 'Headache', status: 'follow-up' },
    { id: 3, date: '2024-01-08', condition: 'Back Pain', status: 'completed' },
  ];

  const pendingActions = [
    { id: 1, task: 'Take prescribed medication (Paracetamol)', due: 'Every 6 hours' },
    { id: 2, task: 'Schedule follow-up appointment', due: 'Within 3 days' },
    { id: 3, task: 'Monitor symptoms', due: 'Daily' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome to Cliniscribe 2.0</h2>
            <p className="text-blue-100 mb-4">Your AI nurse and scribe that listens, explains, and guides</p>
            <button
              onClick={() => onNavigate('consultation')}
              className="bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Start New Consultation
            </button>
          </div>
          <div className="hidden md:block">
            <Heart className="h-20 w-20 text-blue-300 opacity-50" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => onNavigate('consultation')}
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-blue-200"
        >
          <div className="flex flex-col items-center text-center">
            <Mic className="h-8 w-8 text-blue-600 mb-2" />
            <span className="font-medium text-gray-900">New Consultation</span>
            <span className="text-sm text-gray-500">Voice or text</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('history')}
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-blue-200"
        >
          <div className="flex flex-col items-center text-center">
            <FileText className="h-8 w-8 text-green-600 mb-2" />
            <span className="font-medium text-gray-900">SOAP Notes</span>
            <span className="text-sm text-gray-500">Medical records</span>
          </div>
        </button>

        <button className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-blue-200">
          <div className="flex flex-col items-center text-center">
            <MapPin className="h-8 w-8 text-red-600 mb-2" />
            <span className="font-medium text-gray-900">Find Care</span>
            <span className="text-sm text-gray-500">Nearby clinics</span>
          </div>
        </button>

        <button className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-blue-200">
          <div className="flex flex-col items-center text-center">
            <CheckSquare className="h-8 w-8 text-purple-600 mb-2" />
            <span className="font-medium text-gray-900">Action Items</span>
            <span className="text-sm text-gray-500">Track progress</span>
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
              {recentConsultations.map((consultation) => (
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
              ))}
            </div>
            <button
              onClick={() => onNavigate('history')}
              className="w-full mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All History
            </button>
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
              {pendingActions.map((action) => (
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
              ))}
            </div>
            <button className="w-full mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium">
              Manage All Actions
            </button>
          </div>
        </div>
      </div>

      {/* Health Insights */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
          Health Insights
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">85%</p>
            <p className="text-sm text-gray-600">Treatment Adherence</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">12</p>
            <p className="text-sm text-gray-600">Consultations This Year</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">3</p>
            <p className="text-sm text-gray-600">Active Care Plans</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
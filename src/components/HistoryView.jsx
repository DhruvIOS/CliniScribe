import React, { useState } from 'react';
import { Calendar, FileText, TrendingUp, Search, Filter } from 'lucide-react';

const HistoryView = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCondition, setFilterCondition] = useState('all');

  const consultations = [
    {
      id: 1,
      date: '2024-01-15',
      time: '10:30 AM',
      condition: 'Common Cold',
      symptoms: ['Cough', 'Sore throat', 'Fever'],
      status: 'completed',
      confidence: 85,
      actions: 3,
      completedActions: 2
    },
    {
      id: 2,
      date: '2024-01-12',
      time: '2:15 PM',
      condition: 'Tension Headache',
      symptoms: ['Headache', 'Neck tension', 'Fatigue'],
      status: 'follow-up',
      confidence: 78,
      actions: 4,
      completedActions: 4
    },
    {
      id: 3,
      date: '2024-01-08',
      time: '9:45 AM',
      condition: 'Lower Back Pain',
      symptoms: ['Back pain', 'Stiffness', 'Muscle spasm'],
      status: 'completed',
      confidence: 92,
      actions: 5,
      completedActions: 5
    },
    {
      id: 4,
      date: '2024-01-03',
      time: '11:20 AM',
      condition: 'Seasonal Allergies',
      symptoms: ['Sneezing', 'Runny nose', 'Itchy eyes'],
      status: 'completed',
      confidence: 89,
      actions: 3,
      completedActions: 3
    },
  ];

  const filteredConsultations = consultations.filter((consultation) => {
    const matchesSearch = consultation.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.symptoms.some(symptom => symptom.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterCondition === 'all' ||
                         (filterCondition === 'completed' && consultation.status === 'completed') ||
                         (filterCondition === 'follow-up' && consultation.status === 'follow-up');
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    return status === 'completed'
      ? 'bg-green-100 text-green-800'
      : 'bg-yellow-100 text-yellow-800';
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 85) return 'text-green-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-700 font-medium mb-2"
        >
          ← Back to Dashboard
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Consultation History</h2>
        <p className="text-gray-600">Track your health journey over time</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by condition or symptoms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={filterCondition}
                onChange={(e) => setFilterCondition(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="follow-up">Follow-up</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-2xl font-bold text-gray-900">{consultations.length}</p>
              <p className="text-sm text-gray-600">Total Consultations</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-2xl font-bold text-gray-900">86%</p>
              <p className="text-sm text-gray-600">Avg Confidence</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-2xl font-bold text-gray-900">
                {consultations.filter(c => c.status === 'completed').length}
              </p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-2xl font-bold text-gray-900">
                {consultations.filter(c => c.status === 'follow-up').length}
              </p>
              <p className="text-sm text-gray-600">Follow-up</p>
            </div>
          </div>
        </div>
      </div>

      {/* Consultation Timeline */}
      <div className="space-y-4">
        {filteredConsultations.map((consultation) => (
          <div key={consultation.id} className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 mr-3">
                      {consultation.condition}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(consultation.status)}`}>
                      {consultation.status}
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{consultation.date} at {consultation.time}</span>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-1">Symptoms:</p>
                    <div className="flex flex-wrap gap-2">
                      {consultation.symptoms.map((symptom, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-gray-600">
                        Confidence: <span className={`font-medium ${getConfidenceColor(consultation.confidence)}`}>
                          {consultation.confidence}%
                        </span>
                      </span>
                      <span className="text-gray-600">
                        Actions: <span className="font-medium text-gray-900">
                          {consultation.completedActions}/{consultation.actions}
                        </span>
                      </span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredConsultations.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
          <div className="text-gray-400 mb-4">
            <FileText className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No consultations found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default HistoryView;
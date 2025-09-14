import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, FileText, TrendingUp, Search, Filter, Eye, Clock, MapPin, ArrowLeft, Pill, Home, AlertTriangle, Video } from 'lucide-react';
import ApiService from '../services/api.js';

const HistoryView = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCondition, setFilterCondition] = useState('all');
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsultation, setSelectedConsultation] = useState(null);

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId') || 'user123';
      const data = await ApiService.getConsultationHistory(userId);

      const formattedConsultations = data.map(consultation => ({
        id: consultation._id,
        date: new Date(consultation.createdAt).toLocaleDateString(),
        time: new Date(consultation.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        condition: consultation.advice?.illness || 'Unknown condition',
        symptoms: consultation.symptoms ? consultation.symptoms.split(',').map(s => s.trim()) : [],
        status: 'completed',
        confidence: consultation.advice?.confidence || 0,
        actions: (consultation.advice?.homeRemedies?.length || 0) + (consultation.advice?.otcMedicines?.length || 0),
        completedActions: (consultation.advice?.homeRemedies?.length || 0) + (consultation.advice?.otcMedicines?.length || 0),
        rawData: consultation
      }));

      setConsultations(formattedConsultations);
    } catch (error) {
      console.error('Error fetching consultations:', error);
      setConsultations([]);
    } finally {
      setLoading(false);
    }
  };

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

  const viewConsultationDetails = (consultation) => {
    setSelectedConsultation(consultation.rawData);
  };

  if (selectedConsultation) {
    return <ConsultationDetail consultation={selectedConsultation} onBack={() => setSelectedConsultation(null)} />;
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <button onClick={() => navigate('/dashboard')} className="text-blue-600 hover:text-blue-700 font-medium mb-2">
            ← Back to Dashboard
          </button>
          <h2 className="text-2xl font-bold text-gray-900">Consultation History</h2>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
          <div className="animate-pulse">Loading consultations...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard')}
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
                    <button
                      onClick={() => viewConsultationDetails(consultation)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
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

const ConsultationDetail = ({ consultation, onBack }) => {
  const navigate = useNavigate();
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 85) return 'text-green-600 bg-green-100';
    if (confidence >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-700 font-medium mb-2 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to History
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {consultation.advice?.illness || 'Consultation Details'}
            </h2>
            <p className="text-gray-600">{formatDate(consultation.createdAt)}</p>
          </div>
          {consultation.advice?.confidence && (
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(consultation.advice.confidence)}`}>
              {consultation.advice.confidence}% Confidence
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Symptoms */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Reported Symptoms
          </h3>
          <p className="text-gray-700">{consultation.symptoms}</p>
        </div>

        {/* SOAP Notes */}
        {consultation.soap && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">SOAP Notes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {consultation.soap.S && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Subjective</h4>
                  <p className="text-gray-700 text-sm">{consultation.soap.S}</p>
                </div>
              )}
              {consultation.soap.O && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Objective</h4>
                  <p className="text-gray-700 text-sm">{consultation.soap.O}</p>
                </div>
              )}
              {consultation.soap.A && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Assessment</h4>
                  <p className="text-gray-700 text-sm">{consultation.soap.A}</p>
                </div>
              )}
              {consultation.soap.P && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Plan</h4>
                  <p className="text-gray-700 text-sm">{consultation.soap.P}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Medical Advice */}
        {consultation.advice && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Home Remedies */}
            {consultation.advice.homeRemedies && consultation.advice.homeRemedies.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Home className="h-5 w-5 text-green-600" />
                  Home Remedies
                </h3>
                <ul className="space-y-2">
                  {consultation.advice.homeRemedies.map((remedy, index) => (
                    <li key={index} className="text-gray-700 text-sm flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                      {remedy}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* OTC Medicines */}
            {consultation.advice.otcMedicines && consultation.advice.otcMedicines.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Pill className="h-5 w-5 text-blue-600" />
                  OTC Medications
                </h3>
                <ul className="space-y-2">
                  {consultation.advice.otcMedicines.map((medicine, index) => (
                    <li key={index} className="text-gray-700 text-sm flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                      {medicine}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Red Flags */}
        {consultation.advice?.redFlags && consultation.advice.redFlags.length > 0 && (
          <div className="bg-red-50 rounded-lg border border-red-200 p-6">
            <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Warning Signs - Seek Medical Attention If:
            </h3>
            <ul className="space-y-2">
              {consultation.advice.redFlags.map((flag, index) => (
                <li key={index} className="text-red-800 text-sm flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  {flag}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Video */}
        {consultation.advice?.videoUrl && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Video className="h-5 w-5 text-purple-600" />
              Educational Video
            </h3>
            <a
              href={consultation.advice.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Video className="h-4 w-4" />
              Watch Video
            </a>
          </div>
        )}

        {/* Nearby Facilities */}
        {consultation.nearby && consultation.nearby.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-red-600" />
              Nearby Healthcare Facilities
            </h3>
            <div className="space-y-3">
              {consultation.nearby.map((facility, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{facility.name}</h4>
                      <p className="text-gray-600 text-sm">{facility.address}</p>
                      <span className="text-xs text-gray-500 capitalize">{facility.type}</span>
                    </div>
                    {facility.mapsUrl && (
                      <a
                        href={facility.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View on Maps →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        {consultation.advice?.disclaimer && (
          <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
            <p className="text-yellow-800 text-sm">
              <strong>Disclaimer:</strong> {consultation.advice.disclaimer}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryView;
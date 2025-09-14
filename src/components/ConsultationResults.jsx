import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, AlertTriangle, Pill, MapPin, Play, Volume2, Download, Share } from 'lucide-react';

export default function ConsultationResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const symptoms = location.state?.symptoms || '';
  const analysis = location.state?.analysis || null;

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  // Extract data from analysis or use defaults
  const likelyCondition = analysis?.advice?.illness || 'Viral infection (e.g., flu or common cold)';
  const homeRemedies = analysis?.advice?.homeRemedies || ['Stay well-hydrated', 'Rest as much as possible', 'Use a cool compress'];
  const otcMedicines = analysis?.advice?.otcMedicines || ['Acetaminophen (Tylenol)', 'Ibuprofen (Advil)'];
  const redFlags = analysis?.advice?.redFlags || ['Fever higher than 103°F (39.4°C)', 'Persists longer than three days'];
  const videoUrl = analysis?.advice?.videoUrl || null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">AI Health Analysis</h1>
          <div className="text-sm text-gray-500">Generated {currentTime}</div>
        </div>

        {/* Analysis Results Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Likely Condition */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900">Likely Condition</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-blue-700">80% confidence</span>
                </div>
              </div>
            </div>

            <h4 className="text-xl font-bold text-gray-900 mb-4">{likelyCondition}</h4>

            <div className="bg-blue-100 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                This assessment is based on the symptoms you provided. Always consult a healthcare professional for proper diagnosis.
              </p>
            </div>
          </div>

          {/* Home Remedies */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-900">Home Remedies</h3>
              </div>
            </div>

            <ul className="text-gray-800 space-y-2">
              {homeRemedies.map((remedy, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  {remedy}
                </li>
              ))}
            </ul>
          </div>

          {/* OTC Suggestions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-yellow-600 rounded-xl flex items-center justify-center">
                <Pill className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-yellow-900">OTC Suggestions</h3>
              </div>
            </div>

            <ul className="text-gray-800 space-y-2">
              {otcMedicines.map((medicine, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-yellow-600 mr-2">•</span>
                  {medicine}
                </li>
              ))}
            </ul>
          </div>

          {/* Red Flags */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-900">Red Flags - See Doctor If:</h3>
                <span className="inline-block px-2 py-1 bg-red-200 text-red-800 text-xs font-medium rounded-full">
                  Important
                </span>
              </div>
            </div>

            <ul className="text-gray-800 space-y-2 mb-4">
              {redFlags.map((flag, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-red-600 mr-2">⚠️</span>
                  {flag}
                </li>
              ))}
            </ul>

            <div className="bg-red-100 border border-red-300 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <p className="text-sm text-red-800 font-medium">
                  Seek immediate medical attention if any of these symptoms occur.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Nearby Healthcare Facilities */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <MapPin className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900">Nearby Healthcare Facilities</h3>
          </div>

          {/* Interactive Map Placeholder */}
          <div className="bg-blue-50 rounded-xl p-8 text-center mb-6">
            <MapPin className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Interactive Map Integration</h4>
            <p className="text-gray-600">
              Find nearby clinics, pharmacies, and emergency facilities based on your location
            </p>
          </div>

          {/* Facilities List */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">City General Hospital</h4>
                  <p className="text-sm text-gray-600">Emergency & General Care</p>
                </div>
                <span className="text-sm text-blue-600 font-medium">0.8 km</span>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">MedPlus Pharmacy</h4>
                  <p className="text-sm text-gray-600">24/7 Pharmacy</p>
                </div>
                <span className="text-sm text-blue-600 font-medium">0.3 km</span>
              </div>
            </div>
          </div>
        </div>

        {/* Personalized Health Video */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Play className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Personalized Health Video</h3>
                <p className="text-sm text-gray-600">AI-generated guidance for your condition</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
              HD Quality
            </span>
          </div>

          {/* Video Player */}
          <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-xl aspect-video flex items-center justify-center mb-4 relative">
            <button className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
              <Play className="w-6 h-6 text-gray-700 ml-1" />
            </button>

            <div className="absolute bottom-4 left-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-1">AI Health Video Ready</h4>
              <p className="text-sm text-gray-600">
                Personalized video explanation about your condition and treatment options
              </p>
            </div>
          </div>

          {/* Video Controls */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-1 bg-gray-200 h-1 rounded">
              <div className="bg-gray-400 h-1 rounded" style={{ width: '0%' }}></div>
            </div>
            <span className="text-sm text-gray-500">0:00 / 2:05</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Volume2 className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Share className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Video Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 mb-2">Generated by AI</p>
                <div className="bg-green-50 border-l-4 border-green-400 p-3 rounded">
                  <p className="text-sm text-green-800">
                    <strong>Preview:</strong> This video will provide personalized visual demonstrations of recommended treatments, exercises, and care instructions based on your specific symptoms and condition.
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">Coming Soon</span>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <span className="text-sm font-medium text-gray-700">Duration:</span>
                <span className="text-sm text-gray-600 ml-2">2:05</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Language:</span>
                <span className="text-sm text-gray-600 ml-2">English</span>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
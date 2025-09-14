import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, AlertTriangle, Pill, MapPin } from 'lucide-react';

export default function ConsultationResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const consultation = location.state?.consultation || {};

  const symptoms = consultation?.symptoms || '';
  const analysis = consultation?.advice || {};

  const nearbyFacilities = consultation?.nearby || [];

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const likelyCondition = analysis?.illness || 'Symptoms unclear, please consult a doctor';
  const homeRemedies = analysis?.homeRemedies || ['Stay well-hydrated', 'Rest as much as possible', 'Use a cool compress'];
  const otcMedicines = analysis?.otcMedicines || ['Acetaminophen (Tylenol)', 'Ibuprofen (Advil)'];
  const redFlags = analysis?.redFlags || ['Fever higher than 103°F (39.4°C)', 'Persists longer than three days'];

  let videoUrl = '';
  try {
    videoUrl = analysis?.videoUrl ? JSON.parse(analysis.videoUrl).response || analysis.videoUrl : '';
  } catch {
    videoUrl = analysis?.videoUrl || '';
  }

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
              </div>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-4">{likelyCondition}</h4>
          </div>

          {/* Home Remedies */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                <Pill className="w-5 h-5 text-white" />
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
            {nearbyFacilities.map((place, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{place.name}</h4>
                    <p className="text-sm text-gray-600">{place.address}</p>
                    {place.mapsUrl && (
                      <a
                        href={place.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm hover:underline mt-1 block"
                      >
                        View on Map
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Personalized Health Video */}
        {videoUrl && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
            <iframe
              title="Personalized Health Video"
              className="w-full aspect-video rounded-xl"
              src={videoUrl}
              allowFullScreen
            ></iframe>
          </div>
        )}

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

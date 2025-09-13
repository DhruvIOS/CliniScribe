import React, { useState } from 'react';
import { Mic, MicOff, Send, FileText, MapPin, Lightbulb, AlertTriangle } from 'lucide-react';

interface ConsultationViewProps {
  onBack: () => void;
}

const ConsultationView: React.FC<ConsultationViewProps> = ({ onBack }) => {
  const [symptoms, setSymptoms] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSubmit = async () => {
    if (!symptoms.trim()) return;
    
    setIsAnalyzing(true);
    // Simulate AI processing
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 2000);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, this would start/stop speech recognition
    if (!isRecording) {
      setTimeout(() => {
        setSymptoms("I've been having a persistent cough for the past 3 days, along with a sore throat and mild fever. The cough is dry and gets worse at night. I also feel tired and have some body aches.");
        setIsRecording(false);
      }, 3000);
    }
  };

  if (showResults) {
    return <ConsultationResults onBack={onBack} symptoms={symptoms} />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-700 font-medium mb-2"
        >
          ← Back to Dashboard
        </button>
        <h2 className="text-2xl font-bold text-gray-900">New Consultation</h2>
        <p className="text-gray-600">Describe your symptoms using voice or text</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        {/* Voice Input */}
        <div className="mb-6">
          <div className="flex items-center justify-center">
            <button
              onClick={toggleRecording}
              className={`relative p-8 rounded-full transition-all duration-300 ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isRecording ? (
                <MicOff className="h-12 w-12 text-white" />
              ) : (
                <Mic className="h-12 w-12 text-white" />
              )}
              {isRecording && (
                <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping"></div>
              )}
            </button>
          </div>
          <p className="text-center mt-4 text-gray-600">
            {isRecording ? 'Recording... Speak now' : 'Click to start voice recording'}
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-gray-500 bg-white">or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Text Input */}
        <div className="space-y-4">
          <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700">
            Describe your symptoms in detail
          </label>
          <textarea
            id="symptoms"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Please describe what you're experiencing, including when symptoms started, severity, and any other relevant details..."
            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Be as detailed as possible for better analysis
            </p>
            <button
              onClick={handleSubmit}
              disabled={!symptoms.trim() || isAnalyzing}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Analyze Symptoms
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Tips for better analysis:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Include when symptoms started and their progression</li>
          <li>• Mention severity levels (mild, moderate, severe)</li>
          <li>• Note any triggers or patterns you've noticed</li>
          <li>• Include relevant medical history if applicable</li>
        </ul>
      </div>
    </div>
  );
};

const ConsultationResults: React.FC<{ onBack: () => void; symptoms: string }> = ({ onBack, symptoms }) => {
  const [activeTab, setActiveTab] = useState<'soap' | 'advice' | 'actions'>('soap');

  const soapNotes = {
    subjective: "Patient reports persistent dry cough for 3 days, accompanied by sore throat and mild fever. Symptoms worsen at night. Patient also experiences fatigue and body aches.",
    objective: "Based on described symptoms: Dry cough present, throat discomfort noted, low-grade fever reported, general malaise.",
    assessment: "Likely viral upper respiratory infection (common cold) based on symptom constellation and duration.",
    plan: "Supportive care with rest, increased fluid intake, throat lozenges. Monitor symptoms and seek care if worsening."
  };

  const advice = {
    condition: "Common Cold (Viral Upper Respiratory Infection)",
    confidence: "High (85%)",
    homeRemedies: [
      "Get plenty of rest and sleep",
      "Drink warm fluids like tea with honey",
      "Use throat lozenges for sore throat",
      "Try steam inhalation for congestion"
    ],
    otcMedications: [
      "Acetaminophen/Paracetamol for fever and aches",
      "Throat lozenges or sprays",
      "Cough drops (avoid cough suppressants initially)"
    ],
    warnings: [
      "See a doctor if fever exceeds 103°F (39.4°C)",
      "Seek care if breathing becomes difficult",
      "Consult if symptoms worsen after 7 days",
      "Get immediate care if you develop chest pain"
    ]
  };

  const actionItems = [
    { id: 1, task: "Rest and stay hydrated", priority: "high", completed: false },
    { id: 2, task: "Monitor temperature twice daily", priority: "medium", completed: false },
    { id: 3, task: "Take acetaminophen as needed for fever", priority: "medium", completed: false },
    { id: 4, task: "Follow up if symptoms persist > 7 days", priority: "low", completed: false },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-700 font-medium mb-2"
        >
          ← Back to Dashboard
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Consultation Results</h2>
        <p className="text-gray-600">AI analysis completed</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-t-lg border border-gray-200 border-b-0">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('soap')}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'soap'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <FileText className="h-4 w-4 inline mr-2" />
            SOAP Notes
          </button>
          <button
            onClick={() => setActiveTab('advice')}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'advice'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <Lightbulb className="h-4 w-4 inline mr-2" />
            Medical Advice
          </button>
          <button
            onClick={() => setActiveTab('actions')}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'actions'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <AlertTriangle className="h-4 w-4 inline mr-2" />
            Action Items
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-b-lg border border-gray-200 border-t-0 p-6">
        {activeTab === 'soap' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Subjective</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded">{soapNotes.subjective}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Objective</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded">{soapNotes.objective}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Assessment</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded">{soapNotes.assessment}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Plan</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded">{soapNotes.plan}</p>
            </div>
          </div>
        )}

        {activeTab === 'advice' && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-1">Likely Condition</h3>
              <p className="text-blue-800">{advice.condition}</p>
              <p className="text-sm text-blue-600 mt-1">Confidence: {advice.confidence}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Home Remedies</h3>
              <ul className="space-y-2">
                {advice.homeRemedies.map((remedy, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-700">{remedy}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Over-the-Counter Medications</h3>
              <ul className="space-y-2">
                {advice.otcMedications.map((medication, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-700">{medication}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-semibold text-red-900 mb-3">⚠️ When to Seek Medical Care</h3>
              <ul className="space-y-2">
                {advice.warnings.map((warning, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-red-800">{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Your Care Plan</h3>
            {actionItems.map((action) => (
              <div key={action.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={action.completed}
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div className="ml-3 flex-1">
                  <p className="font-medium text-gray-900">{action.task}</p>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                      action.priority === 'high'
                        ? 'bg-red-100 text-red-800'
                        : action.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {action.priority} priority
                  </span>
                </div>
              </div>
            ))}
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                <div>
                  <h4 className="font-medium text-blue-900">Need to find care nearby?</h4>
                  <p className="text-sm text-blue-800 mt-1">We can help you locate clinics and pharmacies in your area.</p>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2">
                    Find nearby healthcare →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultationView;
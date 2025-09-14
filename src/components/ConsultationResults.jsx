import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  Clock, CheckCircle, AlertTriangle, Pill, MapPin,
  Download, Share, ArrowLeft, Home, Heart, Shield, Brain,
  Stethoscope, Phone, Navigation, BarChart3
} from 'lucide-react';
import HealthAnalytics from './HealthAnalytics';

export default function ConsultationResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const consultation = location.state?.consultation;
  const [activeTab, setActiveTab] = useState('analysis');


  useEffect(() => {
    if (!consultation) {
      navigate('/dashboard');
    }
  }, [consultation, navigate]);

  if (!consultation) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full mx-auto mb-4 animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading consultation results...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'analysis', label: 'Analysis', icon: Brain },
    { id: 'treatment', label: 'Treatment', icon: Pill },
    { id: 'safety', label: 'Safety', icon: Shield },
    { id: 'nearby', label: 'Nearby Help', icon: MapPin },
  ];

  const generatePDF = async () => {
    try {
      const element = document.getElementById('consultation-content');
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;

      // Add header
      pdf.setFontSize(20);
      pdf.text('Cliniscribe Health Analysis Report', 20, 20);

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);

      // Add footer
      pdf.setFontSize(10);
      pdf.text(`Generated on ${new Date().toLocaleDateString()}`, 20, pdfHeight - 10);
      pdf.text('Cliniscribe - Your Digital Health Companion', pdfWidth - 80, pdfHeight - 10);

      pdf.save(`health-analysis-${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const shareResults = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Health Analysis from Cliniscribe',
          text: `Health analysis for symptoms: ${consultation.symptoms}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        alert('Sharing not supported on this device');
      }
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-600 hover:shadow-xl transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                Your Health Analysis
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Generated at {new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: true})}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={shareResults}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-600 hover:shadow-xl transition-all"
              title="Share Results"
            >
              <Share className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={generatePDF}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-600 hover:shadow-xl transition-all"
              title="Download PDF"
            >
              <Download className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Main Analysis Card */}
        <div id="consultation-content">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Likely Condition
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Analysis Complete
                    </span>
                  </div>
                </div>
              </div>

              <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {consultation.advice?.illness || 'Health Consultation'}
              </h4>

              <div className="bg-teal-50 dark:bg-teal-900/20 rounded-2xl p-4 mb-6">
                <p className="text-teal-800 dark:text-teal-300 text-sm">
                  <strong>Your symptoms:</strong> {consultation.symptoms}
                </p>
              </div>
            </div>

            {/* Confidence Score */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-32 h-32 mb-4">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="stroke-gray-200 dark:stroke-gray-700"
                    strokeDasharray="100, 100"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="stroke-teal-500"
                    strokeDasharray={`${consultation.advice?.confidence || 75}, 100`}
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {consultation.advice?.confidence || 75}%
                  </span>
                </div>
              </div>
              <div className="px-4 py-2 rounded-full text-sm font-medium bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300">
                Confidence Score
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-2xl p-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-600 shadow-lg text-teal-600 dark:text-teal-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'analysis' && (
            <div className="space-y-6">
              {/* Detailed Analysis */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Detailed Medical Analysis</h3>

                {/* Symptoms Analysis */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 mb-6">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-4 flex items-center">
                    <Brain className="w-5 h-5 mr-2" />
                    Symptom Analysis
                  </h4>
                  <p className="text-blue-800 dark:text-blue-400 text-sm mb-3">
                    <strong>Reported Symptoms:</strong> {consultation.symptoms}
                  </p>
                  <p className="text-blue-800 dark:text-blue-400 text-sm">
                    <strong>Primary Diagnosis:</strong> {consultation.advice?.illness || 'General health consultation'}
                  </p>
                  <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/40 rounded-xl">
                    <p className="text-blue-800 dark:text-blue-300 text-sm">
                      <strong>Confidence Level:</strong> {consultation.advice?.confidence || 75}% - This indicates the reliability of the analysis based on the symptoms provided.
                    </p>
                  </div>
                </div>

                {/* Risk Assessment */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6">
                    <h4 className="font-semibold text-green-900 dark:text-green-300 mb-4 flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      Risk Assessment
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-green-800 dark:text-green-400 text-sm">Severity Level:</span>
                        <span className="px-3 py-1 bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full text-xs font-semibold">
                          {consultation.advice?.redFlags?.length > 0 ? 'Moderate' : 'Low'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-green-800 dark:text-green-400 text-sm">Urgency:</span>
                        <span className="text-green-900 dark:text-green-300 text-sm font-medium">
                          {consultation.advice?.redFlags?.length > 0 ? 'Monitor closely' : 'Non-urgent'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-green-800 dark:text-green-400 text-sm">Follow-up:</span>
                        <span className="text-green-900 dark:text-green-300 text-sm font-medium">
                          {consultation.advice?.redFlags?.length > 0 ? 'In 24-48 hours' : 'If symptoms persist'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-6">
                    <h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-4 flex items-center">
                      <Heart className="w-5 h-5 mr-2" />
                      Recommendations
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span className="text-purple-800 dark:text-purple-400 text-sm">
                          {consultation.advice?.homeRemedies?.length > 0 ? 'Home remedies available' : 'Rest and hydration recommended'}
                        </span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span className="text-purple-800 dark:text-purple-400 text-sm">
                          {consultation.advice?.otcMedicines?.length > 0 ? 'OTC medications may help' : 'Monitor symptoms closely'}
                        </span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span className="text-purple-800 dark:text-purple-400 text-sm">
                          Consult healthcare provider if symptoms worsen
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Clinical Notes */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 mt-6">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-300 mb-4 flex items-center">
                    <Stethoscope className="w-5 h-5 mr-2" />
                    Clinical Notes
                  </h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-white dark:bg-gray-600 rounded-xl">
                      <div className="text-2xl font-bold text-teal-600 mb-1">{new Date(consultation.createdAt || Date.now()).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Consultation Date</div>
                    </div>
                    <div className="text-center p-3 bg-white dark:bg-gray-600 rounded-xl">
                      <div className="text-2xl font-bold text-blue-600 mb-1">{consultation.advice?.confidence || 75}%</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Diagnostic Confidence</div>
                    </div>
                    <div className="text-center p-3 bg-white dark:bg-gray-600 rounded-xl">
                      <div className="text-2xl font-bold text-purple-600 mb-1">
                        {(consultation.advice?.homeRemedies?.length || 0) + (consultation.advice?.otcMedicines?.length || 0)}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Treatment Options</div>
                    </div>
                  </div>
                </div>

                {/* SOAP Notes if available */}
                {consultation.soap && (
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mt-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">SOAP Notes</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {consultation.soap.S && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                          <h5 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Subjective</h5>
                          <p className="text-blue-800 dark:text-blue-400 text-sm">{consultation.soap.S}</p>
                        </div>
                      )}
                      {consultation.soap.O && (
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                          <h5 className="font-semibold text-green-900 dark:text-green-300 mb-2">Objective</h5>
                          <p className="text-green-800 dark:text-green-400 text-sm">{consultation.soap.O}</p>
                        </div>
                      )}
                      {consultation.soap.A && (
                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
                          <h5 className="font-semibold text-purple-900 dark:text-purple-300 mb-2">Assessment</h5>
                          <p className="text-purple-800 dark:text-purple-400 text-sm">{consultation.soap.A}</p>
                        </div>
                      )}
                      {consultation.soap.P && (
                        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4">
                          <h5 className="font-semibold text-orange-900 dark:text-orange-300 mb-2">Plan</h5>
                          <p className="text-orange-800 dark:text-orange-400 text-sm">{consultation.soap.P}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'treatment' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {consultation.advice?.homeRemedies && consultation.advice.homeRemedies.length > 0 && (
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                        <Home className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Home Remedies</h3>
                      <span className="text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded-full text-xs font-semibold">FREE</span>
                    </div>
                    <ul className="space-y-3">
                      {consultation.advice.homeRemedies.map((remedy, index) => (
                        <li key={index} className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{remedy}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {consultation.advice?.otcMedicines && consultation.advice.otcMedicines.length > 0 && (
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                        <Pill className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">OTC Medications</h3>
                    </div>
                    <ul className="space-y-3">
                      {consultation.advice.otcMedicines.map((medicine, index) => {
                        const prices = ['$8.99', '$12.50', '$15.99', '$22.00', '$18.75', '$9.99', '$13.25', '$16.50'];
                        const randomPrice = prices[Math.floor(Math.random() * prices.length)];
                        return (
                          <li key={index} className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                            <div className="flex items-start space-x-3">
                              <Pill className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700 dark:text-gray-300">{medicine}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-lg font-bold text-blue-600">{randomPrice}</span>
                              <p className="text-xs text-gray-500">Est. price</p>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                    <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                      <p className="text-blue-800 dark:text-blue-300 text-sm">
                        💡 <strong>Tip:</strong> Compare prices at different pharmacies. Generic versions may be cheaper.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Treatment Options */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Professional Care Options</h3>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 border border-purple-200 dark:border-purple-800 rounded-xl bg-purple-50 dark:bg-purple-900/20">
                    <h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-2">Telemedicine</h4>
                    <p className="text-purple-800 dark:text-purple-400 text-sm mb-3">Virtual consultation with a doctor</p>
                    <div className="text-right">
                      <span className="text-lg font-bold text-purple-600">$45-75</span>
                      <p className="text-xs text-purple-500">Per session</p>
                    </div>
                  </div>
                  <div className="p-4 border border-orange-200 dark:border-orange-800 rounded-xl bg-orange-50 dark:bg-orange-900/20">
                    <h4 className="font-semibold text-orange-900 dark:text-orange-300 mb-2">Urgent Care</h4>
                    <p className="text-orange-800 dark:text-orange-400 text-sm mb-3">Walk-in clinic for non-emergency care</p>
                    <div className="text-right">
                      <span className="text-lg font-bold text-orange-600">$150-300</span>
                      <p className="text-xs text-orange-500">Typical visit</p>
                    </div>
                  </div>
                  <div className="p-4 border border-red-200 dark:border-red-800 rounded-xl bg-red-50 dark:bg-red-900/20">
                    <h4 className="font-semibold text-red-900 dark:text-red-300 mb-2">Primary Care</h4>
                    <p className="text-red-800 dark:text-red-400 text-sm mb-3">Appointment with your regular doctor</p>
                    <div className="text-right">
                      <span className="text-lg font-bold text-red-600">$200-400</span>
                      <p className="text-xs text-red-500">Office visit</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-xl">
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    💰 <strong>Insurance Note:</strong> Prices shown are estimates without insurance. Your actual costs may vary based on your coverage.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'safety' && (
            <div>
              {consultation.advice?.redFlags && consultation.advice.redFlags.length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 rounded-3xl border-2 border-red-200 dark:border-red-800 p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-red-900 dark:text-red-300">
                        🚨 Seek Immediate Medical Attention If:
                      </h3>
                      <p className="text-red-700 dark:text-red-400">These symptoms require professional evaluation</p>
                    </div>
                  </div>
                  <ul className="space-y-4">
                    {consultation.advice.redFlags.map((flag, index) => (
                      <li key={index} className="flex items-start space-x-3 p-4 bg-red-100 dark:bg-red-900/40 rounded-xl">
                        <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
                        <span className="text-red-800 dark:text-red-300 font-medium">{flag}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 pt-6 border-t border-red-200 dark:border-red-800">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button className="flex-1 flex items-center justify-center space-x-2 bg-red-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-red-700 transition-colors">
                        <Phone className="w-5 h-5" />
                        <span>Call 911</span>
                      </button>
                      <button className="flex-1 flex items-center justify-center space-x-2 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 py-3 px-6 rounded-xl font-semibold hover:bg-red-200 dark:hover:bg-red-800 transition-colors">
                        <MapPin className="w-5 h-5" />
                        <span>Find ER</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'nearby' && (
            <div>
              {consultation.nearby && consultation.nearby.length > 0 && (
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Nearby Healthcare Facilities</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {consultation.nearby.map((facility, index) => (
                      <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">{facility.name}</h4>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{facility.address}</p>
                            <span className="inline-block mt-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs rounded-full capitalize">
                              {facility.type.replace('_', ' ')}
                            </span>
                          </div>
                          {facility.mapsUrl && (
                            <a
                              href={facility.mapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                              <Navigation className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'video' && (
            <div className="space-y-6">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Video className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Visual Health Guide</h3>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Generate a personalized visual guide to better understand your condition and symptoms.
                </p>

                {/* Video Generation Status */}
                {videoGeneration.status === 'idle' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-8"
                  >
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Video className="w-12 h-12 text-purple-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Generate Visual Guide
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                      Create a visual explanation of <strong>{consultation.advice?.illness || 'your condition'}</strong> with anatomical illustrations.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={startVideoGeneration}
                      className="flex items-center space-x-2 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-8 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      <Play className="w-5 h-5" />
                      <span>Generate Guide</span>
                    </motion.button>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                      🎬 Estimated generation time: 2-3 minutes
                    </p>
                  </motion.div>
                )}

                {videoGeneration.status === 'generating' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <div className="relative w-24 h-24 mx-auto mb-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <Loader2 className="w-8 h-8 text-white" />
                        </motion.div>
                      </div>
                      <div className="absolute inset-0 rounded-full border-4 border-purple-200 dark:border-purple-700">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="50%"
                            cy="50%"
                            r="44%"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            strokeDasharray={`${videoGeneration.progress * 2.77} 277`}
                            className="text-purple-500 transition-all duration-1000"
                          />
                        </svg>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-bold text-purple-600 dark:text-purple-300">
                          {videoGeneration.progress}%
                        </span>
                      </div>
                    </div>

                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Creating your visual guide...
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      AI is creating a personalized educational video about your condition
                    </p>

                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-4 max-w-md mx-auto mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-purple-800 dark:text-purple-300">Progress:</span>
                        <span className="font-semibold text-purple-900 dark:text-purple-200">{videoGeneration.progress}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-purple-800 dark:text-purple-300">Elapsed:</span>
                        <span className="font-semibold text-purple-900 dark:text-purple-200">
                          {Math.floor(videoGeneration.elapsedTime / 60)}:{String(videoGeneration.elapsedTime % 60).padStart(2, '0')}
                        </span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={resetVideoGeneration}
                      className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-sm underline"
                    >
                      Cancel Generation
                    </motion.button>
                  </motion.div>
                )}

                {videoGeneration.status === 'ready' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>

                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Your visual guide is ready!
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Your personalized educational video has been generated successfully.
                    </p>

                    {videoGeneration.videoUrl && (
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-6 mb-6">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Video className="w-8 h-8 text-green-600" />
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mb-4">Your visual guide is ready to download</p>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            onClick={async () => {
                              try {
                                const response = await fetch(videoGeneration.videoUrl);
                                const blob = await response.blob();
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `health_video_${Date.now()}.mp4`;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                                URL.revokeObjectURL(url);
                              } catch (error) {
                                console.error('Download failed:', error);
                                // Fallback: try direct link
                                window.open(videoGeneration.videoUrl, '_blank');
                              }
                            }}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                          >
                            Download Video
                          </motion.button>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={resetVideoGeneration}
                        className="flex items-center space-x-2 bg-gray-500 text-white py-3 px-6 rounded-2xl font-semibold hover:bg-gray-600 transition-all"
                      >
                        <RotateCcw className="w-5 h-5" />
                        <span>Generate New</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {videoGeneration.status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <AlertTriangle className="w-12 h-12 text-red-600" />
                    </div>

                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Video Generation Failed
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {videoGeneration.error || 'An error occurred while generating your video.'}
                    </p>

                    <div className="flex justify-center space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={startVideoGeneration}
                        className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
                      >
                        <RotateCcw className="w-5 h-5" />
                        <span>Try Again</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={resetVideoGeneration}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 py-3 px-6 rounded-2xl border border-gray-300 dark:border-gray-600 transition-all"
                      >
                        Reset
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    Visual guides are generated based on your specific symptoms and condition for educational purposes.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white py-4 px-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <Home className="w-5 h-5" />
            <span>New Consultation</span>
          </button>

          <button
            onClick={() => navigate('/history')}
            className="flex-1 flex items-center justify-center space-x-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-4 px-6 rounded-2xl font-semibold shadow-lg border border-gray-200 dark:border-gray-600 hover:shadow-xl transition-all"
          >
            <Clock className="w-5 h-5" />
            <span>View History</span>
          </button>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, Sparkles, Calendar, TrendingUp, Mic, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeInUp, springCard } from '@/animations';
import { useRouteLoader } from '@/loaderContext';

export default function NewDashboard() {
  const [userName, setUserName] = useState('Game');
  const [symptoms, setSymptoms] = useState('');
  const [characterCount, setCharacterCount] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);
  const navigate = useNavigate();
  const { setShowGlobalLoader } = useRouteLoader();

  useEffect(() => {
    // Get user name from localStorage (set during login)
    const storedUserName = localStorage.getItem('userName') || 'Game';
    setUserName(storedUserName);
  }, []);

  const welcomeText = useMemo(() => `Welcome back, ${userName}!`, [userName]);
  const letters = useMemo(() => welcomeText.split(''), [welcomeText]);

  const fadeUp = fadeInUp;

  const handleSymptomsChange = (e) => {
    const value = e.target.value;
    if (value.length <= 500) {
      setSymptoms(value);
      setCharacterCount(value.length);
    }
  };

  const handleGenerateAdvice = () => {
    if (!symptoms.trim() || isAnalyzing) return;
    setIsAnalyzing(true);
    setShowGlobalLoader(false);
    setProgress(0);

    const DURATION = 3000; // ~3s to 100%
    const HOLD_AT_100_MS = 300; // brief hold at 100%
    const start = performance.now();

    const step = (now) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / DURATION) * 100));
      setProgress(pct);
      if (pct < 100) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        window.setTimeout(() => {
          navigate('/consultation-results', { state: { symptoms } });
          setIsAnalyzing(false);
        }, HOLD_AT_100_MS);
      }
    };

    rafRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const recentConsultations = [
    {
      id: 1,
      title: 'Viral or bacterial throat infection (such as...',
      date: '9/13/2025'
    },
    {
      id: 2,
      title: 'Viral pharyngitis (common cold or flu)',
      date: '9/13/2025'
    },
    {
      id: 3,
      title: 'Viral Pharyngitis (also known as a common col...',
      date: '9/13/2025'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Welcome Header */}
        <motion.div className="mb-8" initial={fadeUp.initial} animate={fadeUp.animate} transition={{ duration: 0.6, ease: 'easeOut' }}>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {letters.map((ch, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.02 * i }}
              >
                {ch}
              </motion.span>
            ))}
          </h1>
          <p className="text-gray-600">Describe your symptoms and get intelligent health guidance</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Symptom Input */}
          <div className="lg:col-span-2">
            <motion.div
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
              initial={fadeUp.initial}
              animate={fadeUp.animate}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.05 }}
              whileHover={{ scale: 1.03, boxShadow: '0 12px 30px rgba(0,0,0,0.08)' }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Describe Your Symptoms</h2>
                  <p className="text-gray-600">Be as detailed as possible for better analysis</p>
                </div>
              </div>

              <div className="mb-6">
                <textarea
                  value={symptoms}
                  onChange={handleSymptomsChange}
                  placeholder="For example: I have fever and headache for 2 days. The fever started yesterday evening around 6 PM and reached 101°F. I also have a mild sore throat and feel very tired..."
                  className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-500">{characterCount}/500 characters</span>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Mic className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <motion.button
                type="button"
                onClick={handleGenerateAdvice}
                disabled={!symptoms.trim() || isAnalyzing}
                whileHover={{ scale: !isAnalyzing ? 1.03 : 1 }}
                whileTap={{ scale: !isAnalyzing ? 0.95 : 1 }}
                className="relative w-full sm:w-auto overflow-hidden rounded-lg border border-teal-600 bg-white disabled:opacity-70 disabled:cursor-not-allowed"
                aria-live="polite"
              >
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-teal-600 to-blue-600"
                  initial={{ width: '0%' }}
                  animate={{ width: isAnalyzing ? `${progress}%` : '0%' }}
                  transition={{ duration: 0.15, ease: 'easeInOut' }}
                  style={{ willChange: 'width' }}
                />
                <div className="relative z-10 flex items-center justify-center gap-2 px-6 py-3">
                  {isAnalyzing ? (
                    <span className="font-medium text-white">Loading {progress}%</span>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-teal-700" />
                      <span className="font-medium text-teal-700">Generate Advice</span>
                    </>
                  )}
                </div>
              </motion.button>
            </motion.div>
          </div>

          {/* Sidebar - Health Dashboard */}
          <div className="space-y-6">
            {/* Health Dashboard Stats */}
            <motion.div
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
              initial={fadeUp.initial}
              animate={fadeUp.animate}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
              whileHover={{ scale: 1.03, boxShadow: '0 12px 30px rgba(0,0,0,0.08)' }}
              whileTap={{ scale: 0.95 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Dashboard</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-teal-600" />
                    <span className="text-gray-700">Consultations</span>
                  </div>
                  <span className="font-semibold text-gray-900">5</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-teal-600" />
                    <span className="text-gray-700">This Month</span>
                  </div>
                  <span className="font-semibold text-gray-900">5</span>
                </div>

                {/* Health Score with animated progress ring */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative w-8 h-8">
                      <svg width="32" height="32" viewBox="0 0 40 40">
                        <circle cx="20" cy="20" r="16" stroke="#E5E7EB" strokeWidth="4" fill="none" />
                        <motion.circle
                          cx="20"
                          cy="20"
                          r="16"
                          stroke="#10B981"
                          strokeWidth="4"
                          fill="none"
                          pathLength={100}
                          strokeDasharray="100"
                          initial={{ strokeDashoffset: 100 }}
                          animate={{ strokeDashoffset: 28 }}
                          transition={{ duration: 0.6, ease: 'easeInOut' }}
                          style={{ rotate: -90, transformOrigin: '50% 50%' }}
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700">Health Score</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-green-700">72%</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Recent Consultations */}
            <motion.div
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
              initial={fadeUp.initial}
              animate={fadeUp.animate}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
              whileHover={{ scale: 1.03, boxShadow: '0 12px 30px rgba(0,0,0,0.08)' }}
              whileTap={{ scale: 0.95 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Consultations</h3>

              <div className="space-y-4">
                {recentConsultations.map((consultation) => (
                  <div key={consultation.id} className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                    <p className="text-sm text-gray-900 font-medium line-clamp-2 mb-1">
                      {consultation.title}
                    </p>
                    <p className="text-xs text-gray-500">{consultation.date}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

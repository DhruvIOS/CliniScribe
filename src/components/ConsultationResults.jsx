import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, AlertTriangle, Pill, MapPin, Play, Volume2, Download, Share } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { containerStagger, slideInLeft, slideInUp, slideInRight, zoomIn, springSnappy, pingLoop } from '@/animations';

export default function ConsultationResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const symptoms = location.state?.symptoms || '';
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const container = useMemo(() => containerStagger(0.15), []);

  // Key results by symptoms so a new set can animate independently if reused
  const resultsKey = useMemo(() => (symptoms ? `r-${symptoms.length}-${symptoms.slice(0,10)}` : 'r-default'), [symptoms]);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1200);
    const s = setTimeout(() => setShowSuccess(true), 1400);
    return () => { clearTimeout(t); clearTimeout(s); };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">AI Health Analysis</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Generated {currentTime}</span>
            <AnimatePresence>
              {showSuccess && (
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [0.81, 1.21, 1], opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="inline-flex"
                >
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Loading Skeletons */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              key="skeletons"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="grid md:grid-cols-2 gap-6 mb-8"
            >
              {Array.from({ length: 4 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-200 p-6"
                  animate={{ opacity: [0.5, 0.9, 0.5] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="h-5 w-40 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer mb-4" />
                  <div className="h-4 w-24 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer mb-6" />
                  <div className="space-y-2">
                    <div className="h-3 w-full rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
                    <div className="h-3 w-11/12 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
                    <div className="h-3 w-4/5 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Analysis Results Grid */}
        <AnimatePresence mode="wait">
          {!isLoading && (
          <motion.div
            key={resultsKey}
            variants={container}
            initial="initial"
            animate="animate"
            exit="exit"
            className="grid md:grid-cols-2 gap-6 mb-8"
          >
          {/* Likely Condition */}
          <motion.div
            variants={slideInLeft}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="bg-blue-50 border border-blue-200 rounded-2xl p-6 hover:shadow-lg transition-shadow"
            whileHover={{ scale: 1.03, boxShadow: '0 12px 30px rgba(0,0,0,0.08)' }}
          >
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

            <h4 className="text-xl font-bold text-gray-900 mb-4">Viral infection (e.g., flu or common cold)</h4>

            <div className="bg-blue-100 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                This assessment is based on the symptoms you provided. Always consult a healthcare professional for proper diagnosis.
              </p>
            </div>
          </motion.div>

          {/* Home Remedies */}
          <motion.div
            variants={slideInUp}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="bg-green-50 border border-green-200 rounded-2xl p-6 hover:shadow-lg transition-shadow"
            whileHover={{ scale: 1.03, boxShadow: '0 12px 30px rgba(0,0,0,0.08)' }}
          >
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

            <p className="text-gray-800">
              Stay well-hydrated, rest as much as possible, and use a cool compress on your forehead to alleviate headache. Herbal teas (like ginger or chamomile) may also help.
            </p>
          </motion.div>

          {/* OTC Suggestions */}
          <motion.div
            variants={zoomIn}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 hover:shadow-lg transition-shadow"
            whileHover={{ scale: 1.03, boxShadow: '0 12px 30px rgba(0,0,0,0.08)' }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-yellow-600 rounded-xl flex items-center justify-center">
                <Pill className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-yellow-900">OTC Suggestions</h3>
              </div>
            </div>

            <p className="text-gray-800">
              Consider taking acetaminophen (Tylenol) or ibuprofen (Advil) to reduce fever and relieve headache.
            </p>
          </motion.div>

          {/* Red Flags */}
          <motion.div
            variants={slideInRight}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-6 hover:shadow-lg transition-shadow"
            whileHover={{ scale: 1.03, boxShadow: '0 12px 30px rgba(0,0,0,0.08)' }}
          >
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

            <p className="text-gray-800 mb-4">
              If the fever is higher than 103°F (39.4°C), persists longer than three days, develops a rash, or if you experience severe headache, stiff neck, confusion, or difficulty breathing, seek immediate medical attention.
            </p>

            <div className="bg-red-100 border border-red-300 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <p className="text-sm text-red-800 font-medium">
                  Seek immediate medical attention if any of these symptoms occur.
                </p>
              </div>
            </div>
          </motion.div>
          </motion.div>
          )}
        </AnimatePresence>

        {/* Nearby Healthcare Facilities */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <motion.div initial={pingLoop.initial} animate={pingLoop.animate} transition={pingLoop.transition}>
              <MapPin className="w-6 h-6 text-blue-600" />
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-900">Nearby Healthcare Facilities</h3>
          </div>

          {/* Interactive Map Placeholder */}
          <div className="bg-blue-50 rounded-xl p-8 text-center mb-6">
            <motion.div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center" initial={pingLoop.initial} animate={pingLoop.animate} transition={pingLoop.transition}>
              <MapPin className="w-16 h-16 text-blue-600" />
            </motion.div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Interactive Map Integration</h4>
            <p className="text-gray-600">
              Find nearby clinics, pharmacies, and emergency facilities based on your location
            </p>
          </div>

          {/* Facilities List */}
          <motion.div
            className="grid md:grid-cols-2 gap-4"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={{ animate: { transition: { staggerChildren: 0.12 } } }}
          >
            {[
              { name: 'City General Hospital', desc: 'Emergency & General Care', dist: '0.8 km' },
              { name: 'MedPlus Pharmacy', desc: '24/7 Pharmacy', dist: '0.3 km' }
            ].map((f) => (
              <motion.div
                key={f.name}
                className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-lg"
                variants={{ initial: { opacity: 0, x: -30 }, animate: { opacity: 1, x: 0 } }}
                whileHover={{ scale: 1.03, boxShadow: '0 12px 30px rgba(0,0,0,0.08)' }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{f.name}</h4>
                    <p className="text-sm text-gray-600">{f.desc}</p>
                  </div>
                  <span className="text-sm text-blue-600 font-medium">{f.dist}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        

        {/* Back Button */}
        <div className="mt-8 text-center">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Back to Dashboard
          </motion.button>
        </div>
      </div>
    </div>
  );
}

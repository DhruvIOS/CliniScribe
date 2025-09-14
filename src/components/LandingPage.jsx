import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, Play, CheckCircle, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeInUp, containerStagger, springCard, zoomIn } from '@/animations';
import FlipCard from '@/components/FlipCard';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <motion.header
        className="bg-white/80 backdrop-blur-sm shadow-sm"
        initial={fadeInUp.initial}
        animate={fadeInUp.animate}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center mr-3">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">Cliniscribe</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="flex items-center space-x-2 text-teal-600 font-medium">
                <span>Home</span>
              </a>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-teal-600 transition-colors">
                <Eye className="w-4 h-4" />
                <span>Demo</span>
              </button>
            </nav>

            {/* Login Button */}
            <div className="flex items-center space-x-4">
              <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                <Link
                  to="/login"
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium hover:shadow-lg"
                >
                  Login
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence>
          <motion.div
            className="grid lg:grid-cols-2 gap-12 items-center"
            initial="initial"
            animate="animate"
            variants={containerStagger(0.15)}
          >
          {/* Left Content */}
          <motion.div className="space-y-8" variants={fadeInUp} transition={{ duration: 0.7, ease: 'easeOut' }}>
            <motion.div className="flex items-center space-x-2 text-teal-600 font-medium" variants={fadeInUp}>
              <Stethoscope className="w-5 h-5" />
              <span>Your Personal AI Health Assistant</span>
            </motion.div>

            <motion.h1 className="text-5xl font-bold text-gray-900 leading-tight" variants={fadeInUp}>
              <span className="text-teal-600">Clini</span>
              <span className="text-blue-600">scribe</span>
            </motion.h1>

            <motion.p className="text-xl text-gray-600 leading-relaxed" variants={fadeInUp}>
              Your AI nurse that listens, understands, and guides you towards better health with intelligent insights and personalized care.
            </motion.p>

            <motion.div className="flex flex-col sm:flex-row gap-4" variants={fadeInUp}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                transition={springCard}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors hover:shadow-lg"
              >
                <Play className="w-5 h-5" />
                <span>Try Demo</span>
              </motion.button>
              <motion.div whileHover={{ scale: 1.05 }} transition={springCard}>
                <Link
                  to="/login"
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors hover:shadow-lg"
                >
                  <span>Go to Dashboard</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.div>
            </motion.div>

            {/* Features */}
            <motion.div className="flex flex-wrap gap-6 pt-4" variants={containerStagger(0.15)}>
              {["HIPAA Compliant", "24/7 Available", "No Appointment Needed"].map((label, i) => (
                <motion.div key={label} className="flex items-center space-x-2 text-green-700" variants={zoomIn}>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>{label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - AI Health Analysis Card */}
          <motion.div
            className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100"
            variants={fadeInUp}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">AI Health Analysis</h3>
                <p className="text-gray-600">Instant intelligent assessment</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-teal-600">User Input:</span>
                <p className="text-gray-900 bg-gray-50 rounded-lg p-3 mt-1">
                  "I have fever and headache for 2 days"
                </p>
              </div>

              <div className="space-y-3">
                <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50 rounded-r-lg">
                  <div className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">
                    LIKELY CONDITION
                  </div>
                  <div className="text-gray-900 font-medium">Common Cold</div>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4 py-2 bg-yellow-50 rounded-r-lg">
                  <div className="text-xs font-semibold text-yellow-700 uppercase tracking-wide mb-1">
                    HOME REMEDIES
                  </div>
                  <div className="text-gray-900">Rest, warm fluids, steam</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
        </AnimatePresence>

        {/* Stats Section */}
        <motion.div
          className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8"
          initial={fadeInUp.initial}
          whileInView={fadeInUp.animate}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center">
            <div className="text-4xl font-bold text-teal-600 mb-2">50K+</div>
            <div className="text-gray-600">Consultations</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-teal-600 mb-2">98%</div>
            <div className="text-gray-600">Accuracy Rate</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-teal-600 mb-2">24/7</div>
            <div className="text-gray-600">Available</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-teal-600 mb-2">5-Star</div>
            <div className="text-gray-600">User Rating</div>
          </div>
        </motion.div>

        {/* Why Choose Cliniscribe Section */}
        <motion.div
          className="mt-20 text-center"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerStagger(0.15)}
        >
          <motion.h2 className="text-3xl font-bold text-gray-900 mb-4" variants={fadeInUp}>Why Choose Cliniscribe?</motion.h2>
          <motion.p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto" variants={fadeInUp}>
            Experience the future of healthcare with AI-powered insights, personalized recommendations, and 24/7 availability.
          </motion.p>

          <div className="grid md:grid-cols-4 gap-8 place-items-center">
            {[
              { key: 'ai', bg: 'bg-teal-100', icon: <Stethoscope className="w-8 h-8 text-teal-600" />, title: 'AI-Powered Analysis', desc: 'Advanced AI understands your symptoms and provides intelligent health insights' },
              { key: 'care', bg: 'bg-blue-100', icon: (
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              ), title: 'Personalized Care', desc: 'Tailored recommendations based on your unique health profile and history' },
              { key: 'secure', bg: 'bg-green-100', icon: (
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              ), title: 'Safe & Secure', desc: 'Your health data is protected with enterprise-grade security and privacy' },
              { key: 'instant', bg: 'bg-purple-100', icon: (
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ), title: 'Instant Results', desc: 'Get immediate health advice and recommendations in seconds, not hours' }
            ].map((f, idx) => (
              <motion.div key={f.key} variants={zoomIn} transition={{ duration: 0.5, delay: idx * 0.1 }}>
                <FlipCard
                  frontContent={(
                    <>
                      <div className={`w-16 h-16 ${f.bg} rounded-full flex items-center justify-center mx-auto`}>
                        {f.icon}
                      </div>
                      <h3 className="text-base font-semibold text-gray-900">{f.title}</h3>
                    </>
                  )}
                  backContent={(
                    <p className="text-sm">
                      {f.desc}
                    </p>
                  )}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}

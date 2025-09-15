import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Sparkles, Calendar, TrendingUp, Mic,
  Moon, Sun, BarChart3, Activity, Heart, Shield,
  Zap, Settings, Bell, User, Plus, ArrowRight,
  Brain, Stethoscope, Target, Award, Edit, Save, X
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import ApiService from '../services/api.js';
import FirebaseService from '../services/firebase.js';
import HealthAnalytics from './HealthAnalytics';
import VoiceInput from './VoiceInput';
import RecoveryTracker from './RecoveryTracker';
import { assessRisk, computeFollowUpDate } from '../utils/risk';
import { computeConfidence as computeConfidenceFrontend } from '../utils/confidence';

export default function PremiumDashboard() {
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const { state } = useLocation();

  const [userName, setUserName] = useState('User');
  const [userPhoto, setUserPhoto] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [characterCount, setCharacterCount] = useState(0);
  const [userLocation, setUserLocation] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showRecoveryTracker, setShowRecoveryTracker] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    dateOfBirth: 'Jan 15, 1990',
    bloodType: 'O+',
    allergies: 'None'
  });
  const [dashboardStats, setDashboardStats] = useState({
    totalConsultations: 0,
    thisMonthConsultations: 0,
    healthScore: 'Good',
  });
  const [recentConsultations, setRecentConsultations] = useState([]);
  const [risk, setRisk] = useState(null);
  const [metrics, setMetrics] = useState({ healthScore: 80, recoveryRate: 60 });

  const consultation = state?.consultation;

  // Load user info from localStorage
  useEffect(() => {
    const storedName = localStorage.getItem('userName') || 'User';
    const storedEmail = localStorage.getItem('userEmail') || 'user@example.com';
    setUserName(storedName);
    setUserPhoto(localStorage.getItem('userPhoto') || '');
    setProfileData(prev => ({
      ...prev,
      name: storedName,
      email: storedEmail,
      dateOfBirth: localStorage.getItem('userDOB') || 'Jan 15, 1990',
      bloodType: localStorage.getItem('userBloodType') || 'O+',
      allergies: localStorage.getItem('userAllergies') || 'None'
    }));
  }, []);

  // Load risk/metrics and listen for updates (YES/NO follow-up click)
  useEffect(() => {
    try {
      const m = JSON.parse(localStorage.getItem('userMetrics') || '{}');
      if (m && (m.healthScore || m.recoveryRate)) {
        setMetrics({
          healthScore: m.healthScore ?? 80,
          recoveryRate: m.recoveryRate ?? 60,
        });
      }
      const r = JSON.parse(localStorage.getItem('currentRisk') || 'null');
      if (r) setRisk(r);
    } catch {}
    const onStorage = () => {
      try {
        const m = JSON.parse(localStorage.getItem('userMetrics') || '{}');
        if (m) setMetrics({
          healthScore: m.healthScore ?? 80,
          recoveryRate: m.recoveryRate ?? 60,
        });
        const r = JSON.parse(localStorage.getItem('currentRisk') || 'null');
        if (r) setRisk(r);
      } catch {}
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Catch-up: if follow-up email was scheduled but not sent and due time passed
  useEffect(() => {
    const run = async () => {
      try {
        const sched = JSON.parse(localStorage.getItem('followUpSchedule') || 'null');
        if (!sched || sched.sent) return;
        if (Date.now() >= (sched.dueAt || 0)) {
          await ApiService.sendFollowUpEmail({
            to: sched.to, name: sched.name, yesUrl: sched.yesUrl, noUrl: sched.noUrl,
            followUpDate: new Date(sched.dueAt).toISOString()
          });
          localStorage.setItem('followUpSchedule', JSON.stringify({ ...sched, sent: true, sentAt: Date.now() }));
        }
      } catch (e) {
        console.warn('Follow-up catch-up failed:', e);
      }
    };
    run();
  }, []);

  // Get user geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => console.error('Error getting location:', err)
      );
    }
  }, []);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const stats = await ApiService.getDashboardStats(localStorage.getItem('userId'));
        setDashboardStats(stats);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      }
    };
    fetchDashboardStats();
  }, []);

  // Fetch recent consultations
  useEffect(() => {
    const fetchRecentConsultations = async () => {
      try {
        const data = await ApiService.getRecentConsultations(localStorage.getItem('userId'));
        setRecentConsultations(data);

        // Check for consultations needing recovery check (older than 3 days without recovery status)
        const fullConsultations = await ApiService.getConsultationHistory(localStorage.getItem('userId') || 'user123');
        const now = new Date();
        const threeDaysAgo = new Date(now.getTime() - (3 * 24 * 60 * 60 * 1000));

        const needsRecoveryCheck = fullConsultations.find(consultation => {
          const consultationDate = new Date(consultation.createdAt);
          return consultationDate < threeDaysAgo &&
                 (consultation.recovery?.isResolved === null || consultation.recovery?.isResolved === undefined);
        });

        if (needsRecoveryCheck && !localStorage.getItem(`recovery_asked_${needsRecoveryCheck._id}`)) {
          setSelectedConsultation(needsRecoveryCheck);
          setShowRecoveryTracker(true);
        }

        // Initialize metrics if not present using history
        const metricsRaw = localStorage.getItem('userMetrics');
        if (!metricsRaw) {
          // Health score baseline using existing helper
          const histHealth = calculateHealthScore(fullConsultations);
          const baseHealth = Number(histHealth.score || 80);
          // Recovery rate baseline: percentage of resolved recoveries
          const total = fullConsultations.length;
          const resolved = fullConsultations.filter(c => c?.recovery?.isResolved === true).length;
          const baseRecovery = total > 0 ? Math.round((resolved / total) * 100) : 100;
          const init = { healthScore: baseHealth, recoveryRate: baseRecovery };
          localStorage.setItem('userMetrics', JSON.stringify(init));
          setMetrics(init);
        }
      } catch (err) {
        console.error('Error fetching recent consultations:', err);
      }
    };
    fetchRecentConsultations();
  }, []);

  const handleSymptomsChange = (e) => {
    const value = e.target.value;
    if (value.length <= 500) {
      setSymptoms(value);
      setCharacterCount(value.length);
    }
  };

  const handleVoiceTranscript = (transcript) => {
    setSymptoms(transcript);
    setCharacterCount(transcript.length);
  };

  const handleSaveProfile = () => {
    // Save to localStorage
    localStorage.setItem('userName', profileData.name);
    localStorage.setItem('userEmail', profileData.email);
    localStorage.setItem('userDOB', profileData.dateOfBirth);
    localStorage.setItem('userBloodType', profileData.bloodType);
    localStorage.setItem('userAllergies', profileData.allergies);

    // Update current state
    setUserName(profileData.name);
    setIsEditingProfile(false);
  };

  const handleGenerateAdvice = async () => {
    console.log('[PremiumDashboard] Get Instant Health Guidance clicked');

    // 1) Validate input
    if (!symptoms || !symptoms.trim()) {
      console.warn('[PremiumDashboard] No symptoms provided');
      return;
    }

    setIsGenerating(true);
    try {
      const userId = localStorage.getItem('userId') || 'user123';
      console.log('[PremiumDashboard] Calling ApiService.analyzeSymptoms', {
        userId,
        length: symptoms.length,
        hasLocation: Boolean(userLocation),
      });

      // 2) Await AI analysis via centralized API service
      const data = await ApiService.analyzeSymptoms(symptoms, userId, userLocation);
      console.log('[PremiumDashboard] Analysis success');

      // 3) Compute risk and schedule follow-up email
      const likely = data?.advice?.illness || data?.advice?.likelyCondition || '';
      const rEval = assessRisk(likely, symptoms, data?.advice);
      const riskId = `${Date.now()}`;
      const followUpDate = computeFollowUpDate(rEval.followUpHours);
      const riskRecord = {
        id: riskId,
        severity: rEval.severity,
        urgency: rEval.urgency,
        followUpHours: rEval.followUpHours,
        followUpDate,
        followUpNeeded: rEval.followUpNeeded,
        responded: false,
        outcome: null,
        needsReassessment: false,
        confidence: (() => { const v = Number(data?.advice?.confidence || 0); return v>0? v : computeConfidenceFrontend(symptoms || '', likely || ''); })(),
      createdAt: new Date().toISOString(),
      };
      localStorage.setItem('currentRisk', JSON.stringify(riskRecord));
      localStorage.setItem('lastConfidence', String(riskRecord.confidence));
      setRisk(riskRecord);

      if (rEval.followUpNeeded) {
        const name = localStorage.getItem('userName') || 'User';
        const to = localStorage.getItem('userEmail') || '';
        if (to) {
          const base = window.location.origin;
          const yesUrl = `${base}/follow-up?decision=yes&rid=${encodeURIComponent(riskId)}`;
          const noUrl = `${base}/follow-up?decision=no&rid=${encodeURIComponent(riskId)}`;
          const dueAt = followUpDate ? new Date(followUpDate).getTime() : Date.now();
          localStorage.setItem('followUpSchedule', JSON.stringify({ id: riskId, to, name, yesUrl, noUrl, dueAt, sent: false }));

          const ms = Math.max(0, dueAt - Date.now());
          setTimeout(async () => {
            try {
              const sched = JSON.parse(localStorage.getItem('followUpSchedule') || '{}');
              if (sched?.sent || sched?.id !== riskId) return;
              await ApiService.sendFollowUpEmail({ to, name, yesUrl, noUrl, followUpDate });
              localStorage.setItem('followUpSchedule', JSON.stringify({ ...sched, sent: true, sentAt: Date.now() }));
            } catch (e) {
              console.warn('Follow-up email send attempt failed:', e);
            }
          }, ms);
        }
      }

      // 4) Navigate to results with state
      navigate('/consultation-results', { state: { consultation: { ...data, risk: riskRecord } } });
    } catch (err) {
      console.error('[PremiumDashboard] Analysis failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  // Calculate real health score
  const calculateHealthScore = (consultations) => {
    if (consultations.length === 0) return { score: 100, status: 'Excellent' };

    const recentCount = consultations.filter(c => {
      const date = new Date(c.createdAt || c.date);
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return date >= monthAgo;
    }).length;

    const score = Math.max(100 - (recentCount * 5), 40);
    let status = 'Excellent';
    if (score < 70) status = 'Fair';
    else if (score < 85) status = 'Good';

    return { score, status };
  };

  const calculateWellnessStreak = (consultations) => {
    if (consultations.length === 0) return 0;

    const lastConsultation = consultations[0];
    const lastDate = new Date(lastConsultation.createdAt || lastConsultation.date);
    const daysSince = Math.floor((new Date() - lastDate) / (1000 * 60 * 60 * 24));

    return Math.max(daysSince, 0);
  };

  const healthScoreData = calculateHealthScore(recentConsultations);
  const wellnessStreak = calculateWellnessStreak(recentConsultations);

  const statsCards = [
    {
      title: 'Health Score',
      value: (metrics.healthScore ?? 80).toString(),
      subtitle: 'Live',
      icon: Heart,
      color: 'green',
      trend: recentConsultations.length === 0 ? 'Perfect!' : `${recentConsultations.length} recent`,
      bgGradient: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Consultations',
      value: dashboardStats.totalConsultations.toString(),
      subtitle: 'All Time',
      icon: Activity,
      color: 'blue',
      trend: `${dashboardStats.thisMonthConsultations} this month`,
      bgGradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Recovery Rate',
      value: `${metrics.recoveryRate ?? 60}%`,
      subtitle: 'Live',
      icon: Target,
      color: 'purple',
      trend: 'Improving',
      bgGradient: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Wellness Streak',
      value: wellnessStreak.toString(),
      subtitle: 'Days Healthy',
      icon: Award,
      color: 'orange',
      trend: wellnessStreak > 7 ? 'Great!' : 'Keep going',
      bgGradient: 'from-orange-500 to-yellow-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500">
      <motion.div
        className="max-w-7xl mx-auto p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Enhanced Header */}
        <motion.div
          className="flex justify-between items-center mb-8"
          variants={itemVariants}
        >
          <div className="space-y-2">
            <motion.h1
              className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              Welcome back, {userName}! 🌟
            </motion.h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Your personal doctor is just a click away - instant, reliable, always available
            </p>
          </div>

          {/* Enhanced User Profile Section */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-600 hover:shadow-xl transition-all duration-300"
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                  >
                    <Sun className="h-5 w-5 text-yellow-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                  >
                    <Moon className="h-5 w-5 text-blue-600" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Analytics Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAnalytics(!showAnalytics)}
              className={`p-3 rounded-full transition-all duration-300 ${
                showAnalytics
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 shadow-lg border border-gray-200 dark:border-gray-600'
              }`}
            >
              <BarChart3 className="h-5 w-5" />
            </motion.button>

            {/* User Avatar */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowProfile(!showProfile)}
              className="cursor-pointer"
            >
              {userPhoto ? (
                <img
                  src={userPhoto}
                  alt={userName}
                  className="w-12 h-12 rounded-full border-3 border-white shadow-lg"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center shadow-lg border-3 border-white">
                  <User className="w-6 h-6 text-white" />
                </div>
              )}
            </motion.div>

            {/* Sign Out Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={async () => {
                try {
                  await FirebaseService.signOutUser();
                  localStorage.clear();
                  navigate('/');
                } catch (error) {
                  localStorage.clear();
                  navigate('/');
                }
              }}
              className="px-6 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
            >
              Sign Out
            </motion.button>
          </div>
        </motion.div>

        {/* Analytics Panel */}
        <AnimatePresence>
          {showAnalytics && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-200 dark:border-gray-700 shadow-xl">
                <HealthAnalytics consultations={recentConsultations} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Risk Assessment UI removed on dashboard as requested */}

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={itemVariants}
        >
          {statsCards.map((card, index) => (
            <motion.div
              key={card.title}
              whileHover={{ y: -5, scale: 1.02 }}
              className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-5`} />

              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${card.bgGradient} shadow-lg`}>
                    <card.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded-full">
                    {card.trend}
                  </span>
                </div>
                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">
                  {card.title}
                </h3>
                <div className="flex items-end space-x-2">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {card.value}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                    {card.subtitle}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Enhanced Main Content - Symptom Input */}
          <motion.div
            className="lg:col-span-2"
            variants={itemVariants}
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
              {/* Header */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Stethoscope className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Cliniscribe Instant Doctor
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Describe your symptoms and get instant medical guidance
                  </p>
                </div>
              </div>

              {/* Enhanced Textarea */}
              <div className="mb-6 relative">
                <motion.textarea
                  whileFocus={{ scale: 1.01 }}
                  value={symptoms}
                  onChange={handleSymptomsChange}
                  placeholder="For example: I have fever and headache for 2 days, feeling dizzy and nauseous..."
                  className="w-full h-40 p-6 border border-gray-200 dark:border-gray-600 rounded-2xl resize-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300"
                />

                {/* Character Count and Voice Input */}
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {characterCount}/500 characters
                  </span>

                  {/* Voice Input - positioned to avoid sidebar overlap */}
                  <div className="relative z-20">
                    <VoiceInput onTranscript={handleVoiceTranscript} />
                  </div>
                </div>
              </div>

              {/* Enhanced Generate Button */}
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(20, 184, 166, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGenerateAdvice}
                disabled={!symptoms.trim() || isGenerating}
                className="w-full flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-teal-500/25"
              >
                <AnimatePresence mode="wait">
                  {isGenerating ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center space-x-2"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Getting your health insights...</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="ready"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center space-x-2"
                    >
                      <Sparkles className="w-5 h-5" />
                      <span>Get Instant Health Guidance</span>
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Quick Suggestions */}
              <div className="mt-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Quick suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {['Headache and fever', 'Persistent cough', 'Stomach pain', 'Fatigue and dizziness'].map((suggestion) => (
                    <motion.button
                      key={suggestion}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSymptoms(suggestion);
                        setCharacterCount(suggestion.length);
                      }}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Sidebar */}
          <motion.div
            className="space-y-6"
            variants={itemVariants}
          >
            {/* Recent Consultations */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h3>
                {recentConsultations.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => navigate('/history')}
                    className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center space-x-1"
                  >
                    <span>View All</span>
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                )}
              </div>

              <div className="space-y-3">
                {recentConsultations.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-blue-100 dark:from-teal-900 dark:to-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Stethoscope className="w-8 h-8 text-teal-600" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">No consultations yet</p>
                    <p className="text-gray-500 dark:text-gray-500 text-sm">
                      Start by describing your symptoms above
                    </p>
                  </motion.div>
                ) : (
                  recentConsultations.map((consultation, index) => (
                    <motion.div
                      key={consultation.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 dark:text-white font-medium line-clamp-2 mb-2">
                            {consultation.title}
                          </p>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(consultation.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 1, 0.5]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className={`w-2 h-2 rounded-full ml-3 mt-1 ${
                            index === 0 ? 'bg-teal-500' : 'bg-gray-300 dark:bg-gray-500'
                          }`}
                        />
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {recentConsultations.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/history')}
                    className="w-full text-sm text-teal-600 hover:text-teal-700 font-medium py-2 px-4 rounded-xl hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all duration-300"
                  >
                    View Complete History
                  </motion.button>
                </div>
              )}
            </div>

            {/* Health Tips - Horizontal Layout */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-pink-900/30 rounded-3xl p-6 border border-blue-200 dark:border-blue-700 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2">
                      💡 Today's Health Tip
                    </h3>
                    <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
                      Stay hydrated! Drinking 8 glasses of water daily helps maintain optimal body temperature and supports proper organ function. 🚰✨
                    </p>
                  </div>
                </div>
                <div className="hidden md:flex items-center space-x-2 text-blue-500 dark:text-blue-400">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* User Profile Modal */}
      <AnimatePresence>
        {showProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowProfile(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-8">
                <div className="relative inline-block mb-4">
                  {userPhoto ? (
                    <img
                      src={userPhoto}
                      alt={userName}
                      className="w-24 h-24 rounded-full border-4 border-teal-500 shadow-xl"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center shadow-xl border-4 border-teal-500">
                      <User className="w-12 h-12 text-white" />
                    </div>
                  )}
                  <button
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className="absolute -bottom-1 -right-1 w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors shadow-lg"
                  >
                    {isEditingProfile ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                  </button>
                </div>

                {isEditingProfile ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Your name"
                    />
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Your email"
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{profileData.name}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{profileData.email}</p>
                  </>
                )}
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Health Profile</h3>
                  <div className="space-y-3">
                    {isEditingProfile ? (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">Date of Birth:</span>
                          <input
                            type="text"
                            value={profileData.dateOfBirth}
                            onChange={(e) => setProfileData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                            className="p-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                            placeholder="Jan 15, 1990"
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">Blood Type:</span>
                          <select
                            value={profileData.bloodType}
                            onChange={(e) => setProfileData(prev => ({ ...prev, bloodType: e.target.value }))}
                            className="p-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                          >
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                          </select>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">Allergies:</span>
                          <input
                            type="text"
                            value={profileData.allergies}
                            onChange={(e) => setProfileData(prev => ({ ...prev, allergies: e.target.value }))}
                            className="p-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                            placeholder="None"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Date of Birth:</span>
                          <span className="text-gray-900 dark:text-white font-medium">{profileData.dateOfBirth}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Blood Type:</span>
                          <span className="text-gray-900 dark:text-white font-medium">{profileData.bloodType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Allergies:</span>
                          <span className="text-gray-900 dark:text-white font-medium">{profileData.allergies}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-3">Current Conditions</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-blue-800 dark:text-blue-300 text-sm">Excellent overall health</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-blue-800 dark:text-blue-300 text-sm">Regular checkups recommended</span>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-4">
                  <h3 className="font-semibold text-purple-900 dark:text-purple-300 mb-3">Health Stats</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center">
                      <div className="text-xl font-bold text-purple-900 dark:text-purple-300">{dashboardStats.totalConsultations}</div>
                      <div className="text-xs text-purple-600 dark:text-purple-400">Total Consultations</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-purple-900 dark:text-purple-300">87%</div>
                      <div className="text-xs text-purple-600 dark:text-purple-400">Health Score</div>
                    </div>
                  </div>
                </div>
              </div>

              {isEditingProfile ? (
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={handleSaveProfile}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-2xl font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                  <button
                    onClick={() => setIsEditingProfile(false)}
                    className="px-6 bg-gray-500 text-white py-3 rounded-2xl font-semibold hover:bg-gray-600 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowProfile(false)}
                  className="w-full mt-6 bg-gradient-to-r from-teal-500 to-blue-600 text-white py-3 rounded-2xl font-semibold hover:shadow-lg transition-all"
                >
                  Close Profile
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recovery Tracker */}
      <AnimatePresence>
        {showRecoveryTracker && selectedConsultation && (
          <RecoveryTracker
            consultation={selectedConsultation}
            onClose={() => {
              localStorage.setItem(`recovery_asked_${selectedConsultation._id}`, 'true');
              setShowRecoveryTracker(false);
              setSelectedConsultation(null);
            }}
            onUpdate={(consultationId, isResolved, recoveryNotes, followUpRequired) => {
              // Update the local consultations data
              setRecentConsultations(prev =>
                prev.map(consultation =>
                  consultation.id === consultationId
                    ? { ...consultation, recovery: { isResolved, recoveryNotes, followUpRequired } }
                    : consultation
                )
              );
              localStorage.setItem(`recovery_asked_${consultationId}`, 'true');
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

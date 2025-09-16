import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar
} from 'recharts';
import { TrendingUp, TrendingDown, Activity, Heart, Brain, Shield } from 'lucide-react';
import ApiService from '../services/api';

const HealthAnalytics = ({ consultations = [] }) => {
  const [selectedMetric, setSelectedMetric] = useState('consultations');
  const [fullConsultations, setFullConsultations] = useState([]);

  // Load full history if needed (to compute symptoms, recovery, etc.)
  useEffect(() => {
    const hasDetail = Array.isArray(consultations) && consultations.some(c => c && (c.symptoms || c.advice));
    if (hasDetail) {
      setFullConsultations(consultations);
      return;
    }
    (async () => {
      try {
        const userId = localStorage.getItem('userId') || 'user123';
        const history = await ApiService.getConsultationHistory(userId);
        setFullConsultations(history || []);
      } catch (e) {
        setFullConsultations([]);
      }
    })();
  }, [consultations]);

  const monthLabels = useMemo(() => {
    const arr = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      arr.push({
        key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
        label: d.toLocaleString('en-US', { month: 'short' }),
        year: d.getFullYear(),
        monthIndex: d.getMonth(),
      });
    }
    return arr;
  }, []);

  const stopwords = new Set(['i','ive','i\'ve','im','i\'m','me','my','mine','we','our','you','your','yours','have','having','had','has','get','getting','got','for','and','with','the','a','an','of','to','in','on','at','it','its','is','am','are','was','were','been','very','really','kinda','sort','sorta','bit','little','since','today','yesterday','tonight','last','night','morning','evening','days','day','weeks','week','hours','hour','ago','now','then','also','but','so','like']);

  const tokenizeSymptoms = (text = '') => {
    const lowered = (text || '').toLowerCase();
    return lowered
      .split(/,|;|\.|\band\b|\bwith\b|\bn\b|\+/)
      .map(s => s.trim())
      .filter(Boolean)
      .flatMap(s => s.split(/\s+/))
      .map(s => s.replace(/[^a-z\-]/g, ''))
      .filter(s => s.length > 2 && !stopwords.has(s));
  };

  // Symptom lexicon for phrase-first counting to avoid noise like "and, the, having"
  const SYMPTOM_PHRASES = [
    { label: 'Sore throat', pats: [/\bsore throat\b/] },
    { label: 'Runny nose', pats: [/\brunny nose\b/] },
    { label: 'Shortness of breath', pats: [/\bshort(ness)? of breath\b/] },
    { label: 'Chest pain', pats: [/\bchest pain\b|\bchest tightness\b/] },
    { label: 'Abdominal pain', pats: [/\babdominal pain\b|\bstomach pain\b|\btummy pain\b|\bbelly pain\b/] },
    { label: 'Lower-right abdominal pain', pats: [/\brlq pain\b|\bright lower quadrant pain\b/] },
    { label: 'Loss of smell', pats: [/\bloss of smell\b|\banosmia\b/] },
    { label: 'Loss of taste', pats: [/\bloss of taste\b|\bageusia\b/] },
    { label: 'Productive cough', pats: [/\bproductive (cough|sputum)\b|\bphlegm\b/] },
    { label: 'Dry cough', pats: [/\bdry cough\b/] },
    { label: 'High fever', pats: [/\bhigh fever\b|\bfever (of|at) \b/] },
    { label: 'Diarrhea', pats: [/\bdiarrh(oe)a\b/] },
    { label: 'Vomiting', pats: [/\bvomit(ing)?\b/] },
    { label: 'Nausea', pats: [/\bnausea\b|\bnauseous\b/] },
    { label: 'Headache', pats: [/\bheadache\b|\bthrobbing headache\b|\bmigraine\b/] },
    { label: 'Fatigue', pats: [/\bfatigue\b|\btired(ness)?\b|\bexhausted\b/] },
    { label: 'Wheezing', pats: [/\bwheez(ing)?\b/] },
    { label: 'Congestion', pats: [/\bcongestion\b|\bnasal congestion\b/] },
    { label: 'Heartburn', pats: [/\bheartburn\b|\bregurgitation\b/] },
    { label: 'Dizziness', pats: [/\bdizz(y|iness)\b|\blightheaded\b/] },
    { label: 'Rash', pats: [/\brash\b/] },
  ];

  const SYMPTOM_TOKENS = new Set([
    'fever','cough','headache','nausea','vomiting','diarrhea','fatigue','congestion','sneezing','wheezing','dizziness','rash','heartburn','cramps','pain','chills','myalgia'
  ]);

  const computeMonthlyData = useMemo(() => {
    const aggregates = monthLabels.map(m => ({ month: m.label, key: m.key, consultations: 0, symptoms: 0, recovery: 0, healthScore: 100 }));
    const byKey = Object.fromEntries(aggregates.map(a => [a.key, a]));

    fullConsultations.forEach(c => {
      const dt = new Date(c.createdAt || c.date || Date.now());
      const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
      if (!byKey[key]) return;
      const bucket = byKey[key];
      bucket.consultations += 1;
      const tokens = tokenizeSymptoms(c.symptoms || '');
      bucket.symptoms += Math.max(1, tokens.length);

      // recovery days
      if (c.recovery && c.recovery.isResolved && c.recovery.resolvedAt) {
        const start = new Date(c.createdAt || c.date || dt);
        const end = new Date(c.recovery.resolvedAt);
        const diffDays = Math.max(0, Math.round((end - start) / (1000 * 60 * 60 * 24)));
        bucket.recovery += diffDays;
      }
    });

    // finalize averages and derived health score per month
    aggregates.forEach(b => {
      if (b.consultations > 0) {
        b.symptoms = Math.round(b.symptoms / b.consultations);
        // If no recovery data was present, estimate modest value (3 days)
        b.recovery = Math.round((b.recovery || (3 * b.consultations)) / b.consultations);
        b.healthScore = Math.max(40, 100 - b.consultations * 5);
      } else {
        b.symptoms = 0;
        b.recovery = 0;
        b.healthScore = 100;
      }
    });
    return aggregates;
  }, [fullConsultations, monthLabels]);

  // Series used by charts
  const healthData = computeMonthlyData;

  // Generate symptom distribution from real consultations with fallback
  const generateSymptomDistribution = (consultations) => {
    if (!consultations || consultations.length === 0) {
      // Return sample symptom data when no real data exists
      return [
        { name: 'Headache', value: 30, color: '#8B5CF6' },
        { name: 'Fever', value: 25, color: '#06B6D4' },
        { name: 'Fatigue', value: 20, color: '#10B981' },
        { name: 'Cough', value: 15, color: '#F59E0B' },
        { name: 'Other', value: 10, color: '#EF4444' }
      ];
    }

    // Phrase-first, then token-based counting using symptoms + transcripts
    const counts = {};
    const inc = (label, n=1) => { counts[label] = (counts[label] || 0) + n; };

    consultations.forEach(consultation => {
      const textRaw = `${consultation.symptoms || ''} ${consultation.transcript || ''}`;
      let remaining = textRaw.toLowerCase();

      SYMPTOM_PHRASES.forEach(entry => {
        entry.pats.forEach(pat => {
          const re = new RegExp(pat, 'g');
          const matches = remaining.match(re);
          if (matches && matches.length) {
            inc(entry.label, matches.length);
            remaining = remaining.replace(re, ' ');
          }
        });
      });

      tokenizeSymptoms(remaining).forEach(tok => {
        if (SYMPTOM_TOKENS.has(tok)) {
          inc(tok.charAt(0).toUpperCase() + tok.slice(1));
        }
      });
    });

    const total = Object.values(counts).reduce((s, n) => s + n, 0) || 1;
    const entries = Object.entries(counts).sort(([,a],[,b]) => b - a);
    const topN = entries.slice(0, 5);
    const colors = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];

    const topData = topN.map(([name, n], index) => ({
      name,
      raw: n,
      value: Math.round((n / total) * 100),
      color: colors[index % colors.length]
    }));

    const used = topN.reduce((s, [,n]) => s + n, 0);
    const otherCount = Math.max(0, total - used);
    const otherPct = Math.round((otherCount / total) * 100);

    if (otherCount > 0) {
      topData.push({ name: 'Other', raw: otherCount, value: otherPct, color: '#9CA3AF' });
    }

    return topData;
  };

  const symptomDistribution = useMemo(() => generateSymptomDistribution(fullConsultations), [fullConsultations]);

  // Calculate real health score based on consultation frequency and outcomes
  const calculateHealthScore = (consultations) => {
    if (!consultations || consultations.length === 0) return 100;

    const recentConsultations = consultations.filter(c => {
      const date = new Date(c.createdAt || c.date);
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return date >= monthAgo;
    });

    const baseScore = 100;
    const penalty = Math.min(recentConsultations.length * 5, 30); // Max 30 point penalty
    return Math.max(baseScore - penalty, 40); // Minimum score of 40
  };

  const currentHealthScore = calculateHealthScore(fullConsultations);
  const healthScoreData = [
    { name: 'Current', value: currentHealthScore, color: '#10B981' },
    { name: 'Target', value: 100, color: '#E5E7EB' }
  ];

  const renderCustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600">
          <p className="text-gray-900 dark:text-white font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const metrics = [
    { id: 'consultations', label: 'Consultations', icon: Activity, color: 'blue' },
    { id: 'healthScore', label: 'Health Score', icon: Heart, color: 'green' },
    { id: 'symptoms', label: 'Symptoms', icon: Brain, color: 'purple' },
    { id: 'recovery', label: 'Recovery Time', icon: Shield, color: 'orange' }
  ];

  return (
    <div className="space-y-6">
      {/* Metric Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap gap-2"
      >
        {metrics.map((metric) => (
          <motion.button
            key={metric.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedMetric(metric.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              selectedMetric === metric.id
                ? `bg-${metric.color}-100 text-${metric.color}-800 dark:bg-${metric.color}-900 dark:text-${metric.color}-200`
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <metric.icon className="h-4 w-4" />
            <span className="text-sm font-medium">{metric.label}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Health Trends
            </h3>
            <div className="flex items-center space-x-1 text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">+12%</span>
            </div>
          </div>
          <div style={{ width: '100%', height: '250px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={healthData}>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip content={renderCustomTooltip} />
              <Area
                type="monotone"
                dataKey={selectedMetric}
                stroke="#10B981"
                fillOpacity={1}
                fill="url(#colorGradient)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Health Score Gauge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Health Score
          </h3>
          <div className="relative">
            <div style={{ width: '100%', height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={healthScoreData}>
                <RadialBar
                  dataKey="value"
                  cornerRadius={10}
                  fill="#10B981"
                  background={{ fill: '#E5E7EB' }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="text-3xl font-bold text-green-600"
                >
                  {currentHealthScore}
                </motion.div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Overall Score</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Secondary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Symptom Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Symptom Distribution
          </h3>
          <div style={{ width: '100%', height: '250px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={symptomDistribution}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
              >
                {symptomDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={renderCustomTooltip} />
            </PieChart>
          </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {symptomDistribution.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {item.name} ({item.value}%)
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recovery Progress */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recovery Progress
          </h3>
          <div style={{ width: '100%', height: '250px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={healthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip content={renderCustomTooltip} />
              <Bar dataKey="recovery" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Insights Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-800 dark:text-green-200 font-medium">Improvement</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">+23%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-800 dark:text-blue-200 font-medium">Avg Recovery</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">3.2 days</p>
            </div>
            <Heart className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-800 dark:text-purple-200 font-medium">Risk Level</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">Low</p>
            </div>
            <Shield className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HealthAnalytics;

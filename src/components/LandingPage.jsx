import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import FlipCard from './FlipCard';
import {
  Stethoscope, Play, CheckCircle, Eye, ArrowRight, Heart, Brain,
  Shield, Clock, Users, Star, Zap, Activity, TrendingUp,
  MessageSquare, Award, Sparkles
} from 'lucide-react';

export default function LandingPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  const testimonials = [
    {
      name: "Dr. Rajvi Patel",
      role: "Family Physician",
      content: "Cliniscribe has transformed how my patients manage their health between visits.",
      rating: 5
    },
    {
      name: "Mitesh Kumar",
      role: "Patient",
      content: "Got instant guidance for my symptoms at 2 AM. Saved me an unnecessary ER visit!",
      rating: 5
    },
    {
      name: "Elizabetha Smith",
      role: "Mother of 3",
      content: "Peace of mind knowing I can get reliable health advice anytime for my family.",
      rating: 5
    }
  ];

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced algorithms analyze your symptoms with medical-grade accuracy"
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Get health guidance whenever you need it, day or night"
    },
    {
      icon: Shield,
      title: "Data Security",
      description: "Your health data is protected with enterprise-grade security"
    },
    {
      icon: Heart,
      title: "Personalized Care",
      description: "Tailored recommendations based on your health history and symptoms"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="absolute top-20 left-20 w-20 h-20 bg-teal-200 dark:bg-teal-800 rounded-full opacity-20 blur-xl"
        />
        <motion.div
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: "2s" }}
          className="absolute top-40 right-32 w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 blur-xl"
        />
        <motion.div
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: "4s" }}
          className="absolute bottom-20 left-1/3 w-24 h-24 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 blur-xl"
        />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-gray-700"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                Cliniscribe
              </span>
            </motion.div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <motion.a
                whileHover={{ scale: 1.05 }}
                href="#features"
                className="text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors font-medium"
              >
                Features
              </motion.a>
            </nav>

            {/* Login Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/login"
                className="px-6 py-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
              >
                Get Started
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]"
        >
          {/* Left Content */}
          <div className="space-y-8">
            <motion.div
              variants={itemVariants}
              className="flex items-center space-x-2 text-teal-600 dark:text-teal-400 font-medium"
            >
              <Sparkles className="w-5 h-5" />
              <span>Your AI Health Companion</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight"
            >
              <span className="text-teal-600">Smart</span>{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Health
              </span>{" "}
              <br />
              <span className="text-gray-900 dark:text-white">Guidance</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed"
            >
              Get instant, intelligent health insights powered by AI. From symptom analysis to
              personalized recommendations, Cliniscribe is your 24/7 digital health companion.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/login"
                  className="flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-2xl hover:shadow-xl transition-all font-semibold"
                >
                  <span>Start Free Consultation</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center space-x-2 px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl border-2 border-gray-200 dark:border-gray-600 hover:border-teal-500 dark:hover:border-teal-400 transition-all font-semibold"
              >
                <Play className="w-5 h-5" />
                <span ><a  href="https://youtu.be/ZW3_PzuE-M4" target="_blank" > Watch Demo </a></span>
              </motion.button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-6 pt-4"
            >
              {[
                { icon: Shield, text: "Privacy Protected" },
                { icon: Clock, text: "24/7 Available" },
                { icon: Award, text: "Medically Validated" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-2 text-green-700 dark:text-green-400"
                >
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-500" />
                  <span className="font-medium">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right Content - Interactive Demo Card */}
          <motion.div
            variants={itemVariants}
            className="relative"
          >
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
              {/* Header */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">AI Health Analysis</h3>
                  <p className="text-gray-600 dark:text-gray-400">Live Demo</p>
                </div>
                <div className="ml-auto">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                  </div>
                </div>
              </div>

              {/* Demo Content */}
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-teal-600" />
                    <span className="text-sm font-medium text-teal-600 dark:text-teal-400">Patient Input</span>
                  </div>
                  <p className="text-gray-900 dark:text-white">
                    "I have fever, headache, and sore throat for 3 days"
                  </p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="space-y-4"
                >
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-l-4 border-green-500 rounded-r-2xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Activity className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-semibold text-green-700 dark:text-green-400">ANALYSIS COMPLETE</span>
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white">Viral Upper Respiratory Infection</h4>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '85%'}}></div>
                      </div>
                      <span className="text-sm text-green-700 dark:text-green-400 font-medium">85% confidence</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-l-4 border-blue-500 rounded-r-2xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Heart className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">RECOMMENDATIONS</span>
                    </div>
                    <ul className="text-gray-900 dark:text-white space-y-1 text-sm">
                      <li>• Rest and stay hydrated</li>
                      <li>• Warm salt water gargles</li>
                      <li>• OTC pain relievers if needed</li>
                    </ul>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              variants={floatingVariants}
              animate="animate"
              className="absolute -top-4 -right-4 w-8 h-8 bg-teal-200 dark:bg-teal-700 rounded-full opacity-60"
            />
            <motion.div
              variants={floatingVariants}
              animate="animate"
              style={{ animationDelay: "1s" }}
              className="absolute -bottom-4 -left-4 w-6 h-6 bg-blue-200 dark:bg-blue-700 rounded-full opacity-60"
            />
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.section
          id="features"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-32"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Cliniscribe?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Experience the future of healthcare with our advanced AI-powered platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center justify-center"
              >
                <FlipCard
                  className="border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80"
                  frontContent={
                    <div className="flex flex-col items-center justify-center text-center gap-3 px-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-base font-semibold text-gray-900 dark:text-white">{feature.title}</div>
                    </div>
                  }
                  backContent={
                    <div className="px-4">
                      <p className="text-sm text-center text-gray-700 dark:text-gray-300">{feature.description}</p>
                    </div>
                  }
                />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-32 bg-gradient-to-r from-teal-500 to-blue-600 rounded-3xl p-12 text-white"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { number: "100K+", label: "Consultations" },
              { number: "98%", label: "Accuracy Rate" },
              { number: "24/7", label: "Availability" },
              { number: "50+", label: "Conditions" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1 }}
              >
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-100 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Testimonials */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-32"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Trusted by Thousands
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 text-center"
              >
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <blockquote className="text-xl text-gray-900 dark:text-white mb-6 italic">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">
                    {testimonials[currentTestimonial].name}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {testimonials[currentTestimonial].role}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Testimonial Dots */}
            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentTestimonial
                      ? 'bg-teal-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-32 text-center"
        >
          <div className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 rounded-3xl p-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Transform Your Health?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust Cliniscribe for their health guidance.
              Start your free consultation today.
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/login"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-2xl hover:shadow-xl transition-all font-semibold text-lg"
              >
                <Sparkles className="w-6 h-6" />
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="mt-32 bg-gray-900 dark:bg-gray-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center mr-3">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Cliniscribe</span>
            </div>
            <p className="text-gray-400 hidden">
              © 2024 Cliniscribe. Transforming healthcare with AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

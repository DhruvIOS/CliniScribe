import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, Loader2, Zap } from 'lucide-react';

const VoiceInput = ({ onTranscript, isActive = false }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [confidence, setConfidence] = useState(0);

  useEffect(() => {
    // Check if browser supports Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      setIsSupported(true);
      const recognitionInstance = new SpeechRecognition();

      // Configuration
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      // Event handlers
      recognitionInstance.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
            setConfidence(result[0].confidence);
          } else {
            interimTranscript += result[0].transcript;
          }
        }

        const fullTranscript = finalTranscript || interimTranscript;
        setTranscript(fullTranscript);
        onTranscript?.(fullTranscript);
      };

      recognitionInstance.onstart = () => {
        setIsListening(true);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [onTranscript]);

  const startListening = () => {
    if (recognition && !isListening) {
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!isSupported) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-500 text-sm">
          Voice input not supported in this browser
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Main Voice Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleListening}
        className={`relative p-4 rounded-full transition-all duration-300 ${
          isListening
            ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
            : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25'
        }`}
      >
        <AnimatePresence mode="wait">
          {isListening ? (
            <motion.div
              key="recording"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="relative"
            >
              <MicOff className="h-6 w-6" />
              {/* Pulsing animation */}
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [1, 0.5, 1]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-red-400 rounded-full -z-10"
              />
            </motion.div>
          ) : (
            <motion.div
              key="ready"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Mic className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Voice Visualization */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl border border-gray-200 dark:border-gray-600 min-w-80 max-w-md"
          >
            {/* Status Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="p-1 bg-red-100 dark:bg-red-900 rounded-full"
                >
                  <Volume2 className="h-4 w-4 text-red-600" />
                </motion.div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Listening...
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={stopListening}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <MicOff className="h-4 w-4" />
              </motion.button>
            </div>

            {/* Transcript Display */}
            <div className="min-h-12 mb-3">
              {transcript ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-gray-900 dark:text-white text-sm leading-relaxed"
                >
                  {transcript}
                </motion.p>
              ) : (
                <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Speak now...</span>
                </div>
              )}
            </div>

            {/* Confidence Indicator */}
            {confidence > 0 && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${confidence * 100}%` }}
                className="h-1 bg-green-500 rounded-full mb-2"
              />
            )}

            {/* Audio Visualization Bars */}
            <div className="flex items-end justify-center space-x-1 h-8">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: [4, Math.random() * 24 + 8, 4],
                  }}
                  transition={{
                    duration: 0.5 + Math.random() * 0.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }}
                  className="w-1 bg-gradient-to-t from-blue-500 to-purple-500 rounded-full"
                />
              ))}
            </div>

            {/* Quick Actions */}
            <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
              <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                <Zap className="h-3 w-3" />
                <span>Real-time</span>
              </div>
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setTranscript('')}
                  className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Clear
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={stopListening}
                  className="px-3 py-1 text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                >
                  Stop
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default VoiceInput;
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, MessageSquare, Calendar, X, ThumbsUp, ThumbsDown } from 'lucide-react';
import ApiService from '../services/api.js';

const RecoveryTracker = ({ consultation, onClose, onUpdate }) => {
  const [isResolved, setIsResolved] = useState(consultation.recovery?.isResolved);
  const [recoveryNotes, setRecoveryNotes] = useState(consultation.recovery?.recoveryNotes || '');
  const [followUpRequired, setFollowUpRequired] = useState(consultation.recovery?.followUpRequired || false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (resolved) => {
    try {
      setIsSubmitting(true);

      await ApiService.updateRecoveryStatus(
        consultation._id,
        resolved,
        recoveryNotes,
        followUpRequired
      );

      setIsResolved(resolved);

      if (onUpdate) {
        onUpdate(consultation._id, resolved, recoveryNotes, followUpRequired);
      }

      // Auto close after successful submission
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (error) {
      console.error('Error updating recovery status:', error);
      alert('Failed to update recovery status. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Recovery Check-in
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-blue-800 dark:text-blue-300 font-medium text-sm">
                  {consultation.advice?.illness || 'Health Consultation'}
                </span>
              </div>
              <p className="text-blue-700 dark:text-blue-400 text-sm">
                Symptoms: {consultation.symptoms}
              </p>
              <p className="text-blue-600 dark:text-blue-500 text-xs mt-1">
                {new Date(consultation.createdAt).toLocaleDateString()}
              </p>
            </div>

            {isResolved !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl mb-4 ${
                  isResolved
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                    : 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {isResolved ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-orange-600" />
                  )}
                  <span className={`font-medium ${
                    isResolved
                      ? 'text-green-800 dark:text-green-300'
                      : 'text-orange-800 dark:text-orange-300'
                  }`}>
                    {isResolved ? 'Marked as Resolved' : 'Still experiencing symptoms'}
                  </span>
                </div>
              </motion.div>
            )}

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                How are you feeling now?
              </h4>

              {isResolved === null && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleSubmit(true)}
                    disabled={isSubmitting}
                    className="flex flex-col items-center space-y-2 p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-all disabled:opacity-50"
                  >
                    <ThumbsUp className="w-8 h-8 text-green-600" />
                    <span className="text-green-800 dark:text-green-300 font-medium">
                      Much Better
                    </span>
                    <span className="text-green-600 dark:text-green-400 text-xs text-center">
                      Symptoms resolved
                    </span>
                  </button>

                  <button
                    onClick={() => handleSubmit(false)}
                    disabled={isSubmitting}
                    className="flex flex-col items-center space-y-2 p-4 bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-800 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-all disabled:opacity-50"
                  >
                    <ThumbsDown className="w-8 h-8 text-orange-600" />
                    <span className="text-orange-800 dark:text-orange-300 font-medium">
                      Still Unwell
                    </span>
                    <span className="text-orange-600 dark:text-orange-400 text-xs text-center">
                      Need more time
                    </span>
                  </button>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={recoveryNotes}
                  onChange={(e) => setRecoveryNotes(e.target.value)}
                  placeholder="How are you feeling? Any additional symptoms or improvements?"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  rows="3"
                />
              </div>

              {!isResolved && isResolved !== null && (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="followUp"
                    checked={followUpRequired}
                    onChange={(e) => setFollowUpRequired(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="followUp" className="text-sm text-gray-700 dark:text-gray-300">
                    I would like a follow-up consultation
                  </label>
                </div>
              )}

              {isResolved !== null && recoveryNotes && (
                <button
                  onClick={async () => {
                    try {
                      setIsSubmitting(true);
                      await ApiService.updateRecoveryStatus(
                        consultation._id,
                        isResolved,
                        recoveryNotes,
                        followUpRequired
                      );
                      if (onUpdate) {
                        onUpdate(consultation._id, isResolved, recoveryNotes, followUpRequired);
                      }
                      onClose();
                    } catch (error) {
                      console.error('Error updating notes:', error);
                      alert('Failed to save notes. Please try again.');
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Update Notes'}
                </button>
              )}
            </div>
          </div>

          {isSubmitting && (
            <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-75 flex items-center justify-center rounded-2xl">
              <div className="text-center">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2 animate-spin"></div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Saving...</p>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RecoveryTracker;
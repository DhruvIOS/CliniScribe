import React from 'react';
import { motion } from 'framer-motion';

export default function PageLoader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/25 backdrop-blur-md flex items-center justify-center z-50"
    >
      <motion.div
        className="w-10 h-10 border-4 border-white/50 border-t-white rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        aria-label="Loading"
      />
    </motion.div>
  );
}


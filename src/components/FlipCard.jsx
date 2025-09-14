import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function FlipCard({ frontContent, backContent, className = '' }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className={`inline-block [perspective:1000px] ${className}`}
    >
      <motion.div
        className="relative h-56 w-56 rounded-xl shadow-md"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: hovered ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        {/* Front Face */}
        <div
          className="absolute inset-0 bg-white rounded-xl flex items-center justify-center text-center p-4"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex flex-col items-center justify-center space-y-3">
            {frontContent}
          </div>
        </div>

        {/* Back Face */}
        <div
          className="absolute inset-0 bg-white rounded-xl flex items-center justify-center text-center p-5"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="text-gray-700 leading-relaxed">
            {backContent}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

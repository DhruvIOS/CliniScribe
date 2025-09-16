import React from 'react';
import { motion } from 'framer-motion';

export default function FlipCard({ frontContent, backContent, className = '' }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <motion.div
      className={`relative w-56 h-56 rounded-xl shadow-md ${className}`}
      style={{ perspective: 1000 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <motion.div
        className="relative w-full h-full transform-gpu"
        animate={{ rotateY: hovered ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          className="absolute inset-0 rounded-xl flex items-center justify-center bg-white dark:bg-gray-800"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {frontContent}
        </div>

        <div
          className="absolute inset-0 rounded-xl flex items-center justify-center bg-white dark:bg-gray-800"
          style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
        >
          {backContent}
        </div>
      </motion.div>
    </motion.div>
  );
}


import { Variants } from 'framer-motion';

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 40 }
};

export const slideInRight: Variants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 }
};

export const slideInUp: Variants = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -40 }
};

export const zoomIn: Variants = {
  initial: { opacity: 0, scale: 0.81 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 }
};

export const containerStagger = (stagger = 0.15): Variants => ({
  initial: { opacity: 1 },
  animate: { opacity: 1, transition: { staggerChildren: stagger } },
  exit: { opacity: 0 }
});

export const pageFade: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 }
};

export const springSnappy = { type: 'spring', stiffness: 260, damping: 20 } as const;
export const springCard = { type: 'spring', stiffness: 300, damping: 24 } as const;

export const pingLoop = {
  initial: { scale: 1, opacity: 1 },
  animate: { scale: [1, 1.21, 1], opacity: [1, 0.6, 1] },
  transition: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }
} as const;

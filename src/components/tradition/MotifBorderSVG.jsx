import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const PATHS = {
  'temple-arch': 'M10,90 L10,40 Q50,5 90,40 L90,90',
  kalasha: 'M50,10 Q30,30 35,50 L35,85 Q50,95 65,85 L65,50 Q70,30 50,10',
  kolam: 'M10,50 Q30,10 50,50 T90,50',
  geometric: 'M10,10 L90,10 L90,90 L10,90 Z M30,30 L70,30 L70,70 L30,70 Z',
  'mihrab-arch': 'M10,90 L10,50 Q50,15 90,50 L90,90',
  floral: 'M10,50 Q25,20 50,35 Q75,20 90,50 Q75,80 50,65 Q25,80 10,50',
  minimal: 'M10,50 L90,50',
  crescent: 'M60,20 Q40,50 60,80 Q75,50 60,20',
  'coconut-leaf': 'M10,70 Q50,20 90,70',
  dove: 'M20,50 Q40,30 60,50 Q80,30 90,45',
  'cross-subtle': 'M50,20 L50,80 M30,45 L70,45',
  rangoli: 'M50,10 L70,40 L90,50 L70,60 L50,90 L30,60 L10,50 L30,40 Z'
};

export default function MotifBorderSVG({ motif = 'minimal', accentColor = '#D4AF37', className = '' }) {
  const reduced = useReducedMotion();
  const d = PATHS[motif] || PATHS.minimal;

  return (
    <svg
      className={`tradition-motif-border ${className}`}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <motion.path
        d={d}
        fill="none"
        stroke={accentColor}
        strokeWidth="0.8"
        strokeLinecap="round"
        initial={reduced ? { pathLength: 1 } : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.6 }}
        transition={{ duration: reduced ? 0 : 1.8, ease: 'easeInOut', delay: 0.3 }}
      />
    </svg>
  );
}

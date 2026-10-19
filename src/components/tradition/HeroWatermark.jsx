import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const WATERMARK_PATHS = {
  floral: 'M50,8 Q72,28 78,50 Q72,72 50,92 Q28,72 22,50 Q28,28 50,8',
  geometric: 'M50,5 L95,50 L50,95 L5,50 Z M50,22 L78,50 L50,78 L22,50 Z',
  'mihrab-arch': 'M15,92 L15,48 Q50,12 85,48 L85,92',
  'temple-arch': 'M12,92 L12,42 Q50,8 88,42 L88,92',
  kalasha: 'M50,12 Q32,32 36,52 L36,88 Q50,96 64,88 L64,52 Q68,32 50,12',
  kolam: 'M12,50 Q32,12 50,50 T88,50',
  crescent: 'M62,18 Q42,50 62,82 Q78,50 62,18',
  dove: 'M18,52 Q38,32 58,52 Q78,32 88,46',
  'cross-subtle': 'M50,18 L50,82 M32,48 L68,48',
  rangoli: 'M50,8 L68,38 L92,50 L68,62 L50,92 L32,62 L8,50 L32,38 Z',
  minimal: 'M50,15 L50,85 M15,50 L85,50',
  'coconut-leaf': 'M12,72 Q50,22 88,72'
};

export default function HeroWatermark({ motif = 'floral', accentColor = '#D4AF37' }) {
  const reduced = useReducedMotion();
  const d = WATERMARK_PATHS[motif] || WATERMARK_PATHS.floral;

  return (
    <div className="tradition-hero-watermark" aria-hidden="true">
      <svg viewBox="0 0 100 100" className="tradition-hero-watermark-svg">
        <motion.path
          d={d}
          fill="none"
          stroke={accentColor}
          strokeWidth="1.2"
          initial={reduced ? { pathLength: 1, opacity: 0.14 } : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.14 }}
          transition={{ duration: reduced ? 0 : 2, ease: 'easeInOut' }}
        />
      </svg>
    </div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';

const PETALS = [
  { id: 0, left: '8%', delay: 0, duration: 9, size: 9 },
  { id: 1, left: '18%', delay: 1.2, duration: 11, size: 7 },
  { id: 2, left: '32%', delay: 2.4, duration: 8, size: 10 },
  { id: 3, left: '48%', delay: 0.6, duration: 10, size: 8 },
  { id: 4, left: '62%', delay: 3, duration: 12, size: 9 },
  { id: 5, left: '74%', delay: 1.8, duration: 9.5, size: 7 },
  { id: 6, left: '86%', delay: 2.8, duration: 11, size: 8 },
  { id: 7, left: '24%', delay: 4, duration: 10, size: 6 },
  { id: 8, left: '55%', delay: 3.6, duration: 9, size: 9 },
  { id: 9, left: '92%', delay: 1, duration: 11.5, size: 7 }
];

export default function ChristianFloatingPetals({ className = '' }) {
  return (
    <div className={`christian-floating-petals ${className}`} aria-hidden="true">
      {PETALS.map((petal) => (
        <motion.span
          key={petal.id}
          className="christian-petal"
          style={{
            left: petal.left,
            width: petal.size,
            height: petal.size * 1.35
          }}
          initial={{ y: '-12%', opacity: 0, rotate: 0 }}
          animate={{
            y: ['-12%', '108%'],
            opacity: [0, 0.55, 0.55, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: petal.duration,
            repeat: Infinity,
            delay: petal.delay,
            ease: 'linear'
          }}
        />
      ))}
    </div>
  );
}

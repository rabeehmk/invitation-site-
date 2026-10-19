import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function MotifBackground({ religion, accentColor = '#D4AF37', isLight = false }) {
  const reduced = useReducedMotion();
  const anim = religion?.ambientAnimation || 'none';
  const style = { '--motif-accent': accentColor };

  return (
    <div className="tradition-ambient" style={style} aria-hidden="true">
      {/* Universal radial backdrop — matches premium card model */}
      <div
        className={`ambient-radial-rays ${isLight ? 'ambient-radial-rays--light' : ''}`}
        style={{ opacity: reduced ? 0.5 : 1 }}
      />

      {reduced || anim === 'none' ? null : anim === 'rangoli-shimmer' ? (
        <>
          <motion.div
            className="ambient-rangoli"
            animate={{ opacity: [0.04, 0.12, 0.04], rotate: [0, 3, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="ambient-diya"
              style={{ left: `${20 + i * 30}%`, bottom: `${10 + i * 5}%` }}
              animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 2 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
            />
          ))}
        </>
      ) : anim === 'geometric-breathe' ? (
        <motion.div
          className="ambient-geometric"
          animate={{ rotate: [0, 360], scale: [1, 1.05, 1] }}
          transition={{
            rotate: { duration: 120, repeat: Infinity, ease: 'linear' },
            scale: { duration: 6, repeat: Infinity }
          }}
        />
      ) : anim === 'petal-float' ? (
        Array.from({ length: 6 }).map((_, i) => (
          <motion.span
            key={i}
            className="ambient-petal"
            style={{ left: `${10 + i * 15}%` }}
            animate={{ y: [0, -30, 0], opacity: [0, 0.4, 0], rotate: [0, 180] }}
            transition={{ duration: 5 + i, repeat: Infinity, delay: i * 0.8 }}
          />
        ))
      ) : null}
    </div>
  );
}

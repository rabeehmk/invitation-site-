import React from 'react';
import { motion } from 'framer-motion';
import { getReligionBlessing } from '../../config/religionBlessings';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function ReligionBlessingSection({ religion = 'custom', blessingText = '', accentColor }) {
  const reduced = useReducedMotion();
  const blessing = getReligionBlessing(religion, blessingText);

  return (
    <motion.div
      className={`religion-blessing religion-blessing--${religion}`}
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7 }}
      style={{ '--blessing-accent': accentColor }}
    >
      <span className="religion-blessing-icon" aria-hidden="true">
        {blessing.icon}
      </span>
      <h3 className="religion-blessing-title">{blessing.title}</h3>
      <p
        className="religion-blessing-primary"
        dir={blessing.rtl ? 'rtl' : 'ltr'}
        lang={blessing.rtl ? 'ar' : undefined}
      >
        {blessing.primary}
      </p>
      {blessing.secondary && (
        <p className="religion-blessing-secondary">{blessing.secondary}</p>
      )}
      <div className="religion-blessing-divider" aria-hidden="true" />
    </motion.div>
  );
}

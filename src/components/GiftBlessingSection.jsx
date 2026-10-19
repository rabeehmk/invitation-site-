import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Heart } from 'lucide-react';
import { useReducedMotion } from '../hooks/useReducedMotion';

export default function GiftBlessingSection({ giftNote = '', title = 'Blessings & Gift Note' }) {
  const reduced = useReducedMotion();
  const text = giftNote?.trim();
  if (!text) return null;

  return (
    <motion.div
      className="guest-card-panel gift-blessing-section"
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6 }}
    >
      <div className="section-panel-header">
        <div className="section-panel-icon-wrap">
          <Gift size={18} />
        </div>
        <h3>{title}</h3>
      </div>

      <div className="gift-blessing-content">
        <div className="gift-blessing-heart-wrap">
          <Heart size={20} className="gift-blessing-heart" />
        </div>
        <p className="gift-blessing-text">{text}</p>
        <div className="gift-blessing-hint">
          <span>✨ Your Presence is Our Greatest Present ✨</span>
        </div>
      </div>
    </motion.div>
  );
}

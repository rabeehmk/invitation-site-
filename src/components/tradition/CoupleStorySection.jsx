import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function CoupleStorySection({ story = '', names = '', fallbackMessage = '' }) {
  const reduced = useReducedMotion();
  const text = story?.trim() || fallbackMessage?.trim();
  if (!text) return null;

  return (
    <motion.div
      className="couple-story-section"
      initial={reduced ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.65 }}
    >
      <div className="couple-story-header">
        <Heart size={16} className="couple-story-icon" />
        <h3>Our Story</h3>
      </div>
      {names && <p className="couple-story-names">{names}</p>}
      <p className="couple-story-text">{text}</p>
    </motion.div>
  );
}

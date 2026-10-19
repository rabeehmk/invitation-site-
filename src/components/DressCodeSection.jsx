import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Shirt } from 'lucide-react';
import { useReducedMotion } from '../hooks/useReducedMotion';

export default function DressCodeSection({ dressCode = '', title = 'Dress Code & Attire' }) {
  const reduced = useReducedMotion();
  const text = dressCode?.trim();
  if (!text) return null;

  // Split lines if separated by newline
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

  return (
    <motion.div
      className="guest-card-panel dress-code-section"
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6 }}
    >
      <div className="section-panel-header">
        <div className="section-panel-icon-wrap">
          <Shirt size={18} />
        </div>
        <h3>{title}</h3>
      </div>

      <div className="dress-code-content">
        {lines.length > 1 ? (
          <div className="dress-code-grid">
            {lines.map((line, idx) => {
              const colonIdx = line.indexOf(':');
              const hasLabel = colonIdx > -1 && colonIdx < 30;
              const label = hasLabel ? line.slice(0, colonIdx).trim() : null;
              const desc = hasLabel ? line.slice(colonIdx + 1).trim() : line;

              return (
                <div key={idx} className="dress-code-item">
                  <div className="dress-code-bullet">
                    <Sparkles size={12} />
                  </div>
                  <div className="dress-code-text">
                    {label && <strong className="dress-code-label">{label}: </strong>}
                    <span>{desc}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="dress-code-single">{text}</p>
        )}
      </div>
    </motion.div>
  );
}

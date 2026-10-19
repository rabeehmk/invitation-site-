import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { RELIGIONS, RELIGION_IDS } from '../config/religions';

const CARD_ANIM = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  })
};

export default function ReligionSelectScreen({ onSelect, onBack }) {
  return (
    <div className="builder-screen">
      <div className="builder-screen-inner">
        <button type="button" className="builder-back-btn" onClick={onBack}>
          ← Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="builder-header"
        >
          <Sparkles size={20} className="text-[var(--studio-accent)]" />
          <h1>Choose Your Tradition</h1>
          <p>
            Select the community or event type. Each path offers distinct templates,
            fields, and design language — not just a color reskin.
          </p>
        </motion.div>

        <div className="religion-grid">
          {RELIGION_IDS.map((id, i) => {
            const r = RELIGIONS[id];
            return (
              <motion.button
                key={id}
                type="button"
                className={`religion-card religion-card--${id}`}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={CARD_ANIM}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(id)}
              >
                <span className="religion-card-icon">{r.icon}</span>
                <span className="religion-card-label">{r.label}</span>
                {r.labelPa && <span className="religion-card-sub">{r.labelPa}</span>}
                {r.labelMl && <span className="religion-card-sub">{r.labelMl}</span>}
                {r.labelAr && <span className="religion-card-sub">{r.labelAr}</span>}
                <p className="religion-card-desc">{r.description}</p>
                <span className="religion-card-cta">
                  Continue <ArrowRight size={14} />
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

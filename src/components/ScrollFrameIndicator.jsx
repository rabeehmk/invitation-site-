import React from 'react';
import { motion, useTransform } from 'framer-motion';

export default function ScrollFrameIndicator({ progress, frame, total }) {
  const barScale = useTransform(progress, [0, 1], [0, 1]);
  const pct = Math.round(((frame + 1) / total) * 100);

  return (
    <div className="scroll-frame-indicator" aria-hidden="true">
      <div className="scroll-frame-indicator-track">
        <motion.div className="scroll-frame-indicator-fill" style={{ scaleX: barScale }} />
      </div>
      <span className="scroll-frame-indicator-label">{pct}%</span>
    </div>
  );
}

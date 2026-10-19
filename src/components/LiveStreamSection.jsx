import React from 'react';
import { motion } from 'framer-motion';
import { Video, ExternalLink, Radio } from 'lucide-react';
import { useReducedMotion } from '../hooks/useReducedMotion';

export default function LiveStreamSection({ liveStreamUrl = '', isPreviewMode = false }) {
  const reduced = useReducedMotion();
  const url = liveStreamUrl?.trim();
  if (!url) return null;

  return (
    <motion.div
      className="guest-card-panel live-stream-section"
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6 }}
    >
      <div className="section-panel-header live-stream-header">
        <div className="section-panel-icon-wrap live-icon-wrap">
          <Radio size={18} />
        </div>
        <div className="live-badge-row">
          <h3>Virtual Attendance</h3>
          <span className="live-indicator-pill">
            <span className="live-pulse-dot" /> LIVE STREAM
          </span>
        </div>
      </div>

      <div className="live-stream-content">
        <p className="live-stream-desc">
          For our cherished family and friends joining us from afar, you can witness our sacred ceremony live online.
        </p>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-theme-outline live-stream-btn"
          style={{ pointerEvents: isPreviewMode ? 'none' : 'auto' }}
        >
          <Video size={16} />
          <span>{isPreviewMode ? 'Watch Live Stream (active on link)' : 'Join Live Stream Broadcast'}</span>
          <ExternalLink size={14} />
        </a>
      </div>
    </motion.div>
  );
}

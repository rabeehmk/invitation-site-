import React from 'react';
import { motion } from 'framer-motion';
import { Hotel, PhoneCall } from 'lucide-react';
import { useReducedMotion } from '../hooks/useReducedMotion';

export default function AccommodationSection({ accommodationInfo = '', contactPhone = '' }) {
  const reduced = useReducedMotion();
  const text = accommodationInfo?.trim();
  if (!text) return null;

  return (
    <motion.div
      className="guest-card-panel accommodation-section"
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6 }}
    >
      <div className="section-panel-header">
        <div className="section-panel-icon-wrap">
          <Hotel size={18} />
        </div>
        <h3>Accommodations & Stay</h3>
      </div>

      <div className="accommodation-content">
        <p className="accommodation-text">{text}</p>
        {contactPhone && (
          <div className="accommodation-contact-badge">
            <PhoneCall size={14} />
            <span>Hospitality Desk: <a href={`tel:${contactPhone}`} className="contact-link">{contactPhone}</a></span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

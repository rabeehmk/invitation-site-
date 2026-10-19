import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Images, X } from 'lucide-react';
import { useReducedMotion } from '../hooks/useReducedMotion';

export default function GallerySection({ photos = [], title = 'Our Moments' }) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(null);
  const items = (photos || []).filter(Boolean);

  if (items.length === 0) return null;

  return (
    <>
      <motion.div
        className="gallery-section"
        initial={reduced ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="gallery-section-header">
          <Images size={18} />
          <h3>{title}</h3>
        </div>
        <div className={`gallery-grid gallery-grid--count-${Math.min(items.length, 6)}`}>
          {items.map((src, i) => (
            <motion.button
              key={`${src.slice(0, 32)}-${i}`}
              type="button"
              className="gallery-item"
              initial={reduced ? false : { opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.45 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setActive(src)}
              aria-label={`View gallery photo ${i + 1}`}
            >
              <img src={src} alt="" loading="lazy" draggable={false} />
            </motion.button>
          ))}
        </div>
      </motion.div>

      {active && (
        <div className="gallery-lightbox" onClick={() => setActive(null)} role="dialog" aria-modal="true">
          <button type="button" className="gallery-lightbox-close" onClick={() => setActive(null)} aria-label="Close">
            <X size={20} />
          </button>
          <img src={active} alt="Gallery preview" className="gallery-lightbox-img" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  );
}

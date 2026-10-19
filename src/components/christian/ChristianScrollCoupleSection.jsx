import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import ChristianScrollCouple from './ChristianScrollCouple';
import ChristianFloatingPetals from './ChristianFloatingPetals';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Standalone scroll section for Christian weddings — used when custom
 * bride/groom photos replace the hero animation, or as an extra reveal block.
 */
export default function ChristianScrollCoupleSection({ theme = 'rose-ivory', title = 'Our Sacred Union' }) {
  const trackRef = useRef(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end']
  });

  const opacity = useTransform(scrollYProgress, [0, 0.12, 0.88, 1], [0.55, 1, 1, 0.75]);
  const titleY = useTransform(scrollYProgress, [0, 0.25], [24, 0]);

  if (reduced) {
    return (
      <section className="christian-scroll-section christian-scroll-section--static">
        <h3 className="christian-scroll-section-title">{title}</h3>
        <ChristianScrollCouple theme={theme} scrollProgress={null} heroMode />
      </section>
    );
  }

  return (
    <section ref={trackRef} className="christian-scroll-section">
      {!reduced && <ChristianFloatingPetals className="christian-floating-petals--section" />}

      <motion.div
        className="christian-scroll-section-sticky"
        style={{ opacity }}
      >
        <motion.h3
          className="christian-scroll-section-title"
          style={{ y: titleY }}
        >
          {title}
        </motion.h3>
        <motion.p
          className="christian-scroll-section-sub"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          A moment of grace · scroll to reveal
        </motion.p>

        <ChristianScrollCouple
          theme={theme}
          scrollProgress={scrollYProgress}
          heroMode
          showBadge={false}
        />

        <motion.div
          className="christian-scroll-section-cue"
          animate={{ y: [0, 6, 0], opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={18} />
          <span>Keep scrolling</span>
        </motion.div>
      </motion.div>

      <div className="christian-scroll-section-spacer" aria-hidden="true" />
    </section>
  );
}

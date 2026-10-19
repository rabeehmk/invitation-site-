import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import AnimatedCouple from '../AnimatedCouple';
import ChristianFloatingPetals from './ChristianFloatingPetals';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Christian wedding scroll animation — ivory chapel frame, dove accent,
 * scroll-scrubbed couple sequence with floating petals & light rays.
 */
export default function ChristianScrollCouple({
  theme = 'rose-ivory',
  scrollProgress = null,
  heroMode = true,
  showBadge = true
}) {
  const reduced = useReducedMotion();
  const fallbackProgress = useMotionValue(0.4);
  const activeProgress = scrollProgress ?? fallbackProgress;

  const coupleScale = useTransform(activeProgress, [0, 0.45, 1], [0.9, 1, 1.03]);
  const coupleY = useTransform(activeProgress, [0, 1], [12, -8]);
  const lightOpacity = useTransform(activeProgress, [0, 0.3, 0.7, 1], [0.35, 0.85, 0.85, 0.5]);
  const archGlow = useTransform(activeProgress, [0, 0.5, 1], [0.4, 1, 0.7]);

  return (
    <motion.div
      className="christian-scroll-couple"
      initial={reduced ? false : { opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
    >
      {!reduced && <ChristianFloatingPetals />}

      {showBadge && (
        <motion.span
          className="christian-scroll-badge"
          initial={reduced ? false : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          Holy Matrimony
        </motion.span>
      )}

      <div className="christian-chapel-model">
        <div className="christian-chapel-pillar christian-chapel-pillar--left" aria-hidden="true" />
        <div className="christian-chapel-pillar christian-chapel-pillar--right" aria-hidden="true" />

        <motion.div
          className="christian-chapel-light-beam"
          style={{ opacity: reduced ? 0.6 : lightOpacity }}
          aria-hidden="true"
        />

        <div className="christian-scroll-frame">
          <motion.div
            className="christian-scroll-arch"
            style={{ opacity: reduced ? 0.7 : archGlow }}
            aria-hidden="true"
          />

          <div className="christian-chapel-inner-ring" aria-hidden="true" />

          <motion.div
            className="christian-chapel-couple-stage"
            style={{
              scale: reduced ? 1 : coupleScale,
              y: reduced ? 0 : coupleY
            }}
          >
            <AnimatedCouple
              theme={theme}
              heroMode={heroMode}
              scrollProgress={scrollProgress}
              autoplay={!scrollProgress}
              showScrollHint={!!scrollProgress}
              variant="christian"
            />
          </motion.div>

          <motion.span
            className="christian-scroll-dove"
            aria-hidden="true"
            animate={reduced ? {} : { y: [0, -7, 0], opacity: [0.45, 0.75, 0.45] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            🕊
          </motion.span>

          <span className="christian-chapel-cross" aria-hidden="true">
            ✝
          </span>

          <div className="christian-chapel-floor-shadow" aria-hidden="true" />
        </div>
      </div>

      {scrollProgress && (
        <motion.p
          className="christian-scroll-caption"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Scroll slowly to reveal the couple
        </motion.p>
      )}
    </motion.div>
  );
}

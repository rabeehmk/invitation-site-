import React, { useState, useEffect } from 'react';
import { useMotionValue, useMotionValueEvent } from 'framer-motion';
import {
  COUPLE_FRAME_COUNT,
  COUPLE_FRAME_INTERVAL_MS,
  COUPLE_HERO_STATIC_FRAME,
  getCoupleFramePath,
  progressToFrameIndex
} from '../utils/coupleAnimation';
import { useReducedMotion } from '../hooks/useReducedMotion';
import ScrollFrameIndicator from './ScrollFrameIndicator';

/**
 * Couple PNG sequence — scroll-scrubbed when scrollProgress is passed,
 * otherwise gentle autoplay fallback.
 */
export default function AnimatedCouple({
  theme = 'dark-gold',
  heroMode = false,
  scrollProgress = null,
  autoplay = true,
  showScrollHint = false,
  variant = ''
}) {
  const reduced = useReducedMotion();
  const [frame, setFrame] = useState(0);
  const fallbackProgress = useMotionValue(0);
  const progress = scrollProgress ?? fallbackProgress;

  useEffect(() => {
    for (let i = 0; i < COUPLE_FRAME_COUNT; i++) {
      const img = new Image();
      img.src = getCoupleFramePath(i);
    }
  }, []);

  useMotionValueEvent(progress, 'change', (v) => {
    setFrame(progressToFrameIndex(v));
  });

  useEffect(() => {
    if (reduced || scrollProgress || !autoplay) return;
    let idx = 0;
    const id = setInterval(() => {
      idx = (idx + 1) % COUPLE_FRAME_COUNT;
      fallbackProgress.set(idx / (COUPLE_FRAME_COUNT - 1));
    }, COUPLE_FRAME_INTERVAL_MS);
    return () => clearInterval(id);
  }, [reduced, scrollProgress, autoplay, fallbackProgress]);

  const src = reduced ? COUPLE_HERO_STATIC_FRAME : getCoupleFramePath(frame);
  const isChristian = variant === 'christian';

  return (
    <div
      className={`animated-couple-wrapper theme-${theme} ${heroMode ? 'hero-couple-mode' : ''} ${scrollProgress ? 'animated-couple--scroll' : ''} ${variant ? `animated-couple--${variant}` : ''}`}
    >
      <div className="animated-couple-glow" aria-hidden="true" />
      <div className="animated-couple-border" />
      <div className="animated-couple-frame-inner">
        <img
          key={isChristian ? frame : undefined}
          src={src}
          alt="Wedding couple animation"
          className="animated-couple-image"
          draggable={false}
        />
      </div>
      {!isChristian && <div className="animated-couple-overlay" />}
      {!reduced && scrollProgress && (
        <ScrollFrameIndicator progress={scrollProgress} frame={frame} total={COUPLE_FRAME_COUNT} />
      )}
      {!reduced && !scrollProgress && <div className="animated-couple-shimmer" aria-hidden="true" />}
      {showScrollHint && scrollProgress && !reduced && (
        <span className="scroll-couple-hint">Scroll to animate</span>
      )}
    </div>
  );
}

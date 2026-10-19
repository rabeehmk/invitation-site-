import React, { useRef } from 'react';
import { useScroll } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * Sticky scroll-scrub section — scroll drives the couple frame sequence.
 * Wrap hero content + couple visual inside this model.
 */
export default function ScrollCoupleModel({
  children,
  visual,
  className = '',
  trackHeight = '220vh'
}) {
  const trackRef = useRef(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end']
  });

  const visualNode =
    typeof visual === 'function' ? visual(scrollYProgress) : visual;

  if (reduced) {
    return (
      <div className={`scroll-couple-model scroll-couple-model--static ${className}`}>
        <div className="scroll-couple-model-sticky">
          <div className="scroll-couple-model-grid">
            <div className="scroll-couple-model-content">{children}</div>
            <div className="scroll-couple-model-visual">{typeof visual === 'function' ? visual(null) : visual}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={trackRef}
      className={`scroll-couple-model ${className}`}
      style={{ '--scroll-track-height': trackHeight }}
    >
      <div className="scroll-couple-model-sticky">
        <div className="scroll-couple-model-grid">
          <div className="scroll-couple-model-content">{children}</div>
          <div className="scroll-couple-model-visual">{visualNode}</div>
        </div>
        <div className="scroll-couple-scroll-cue">
          <ChevronDown size={18} />
          <span>Scroll to reveal the couple</span>
        </div>
      </div>
      <div className="scroll-couple-model-spacer" aria-hidden="true" />
    </div>
  );
}

export { useScroll };

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import LayoutPhoto from './LayoutPhoto';
import {
  resolveHeroPhoto,
  resolveSecondaryPhoto,
  resolvePageBackground,
  buildPageBackgroundStyle,
  pageBackgroundClass,
  shouldUseCoupleAnimation
} from './layoutUtils';
import { formatEventDate } from '../../utils/dateUtils';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function HeroFullBleed({ state, ctx, coverPhotoUrl }) {
  const reduced = useReducedMotion();
  const sectionRef = useRef(null);
  const pageBg = resolvePageBackground(state);
  const photo = resolveHeroPhoto(state, coverPhotoUrl);
  const secondary = resolveSecondaryPhoto(state);
  const { labels, fonts, accent, palette, hijriDate, showHijri } = ctx;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start']
  });
  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.85]);

  return (
    <section
      ref={sectionRef}
      className={`layout layout-full-bleed ${pageBackgroundClass(pageBg)}`}
      style={{
        '--layout-accent': accent,
        '--layout-bg': palette.bg,
        '--layout-text': palette.text,
        '--font-heading': fonts.heading,
        '--font-accent': fonts.accent,
        ...buildPageBackgroundStyle(pageBg)
      }}
    >
      <div className="full-bleed-photo-wrap">
        <motion.div className="full-bleed-photo-parallax" style={{ y: reduced ? 0 : photoY }}>
          <LayoutPhoto
            src={photo}
            secondarySrc={secondary}
            frame="none"
            className="full-bleed-photo"
            religion={state.religion}
            theme={state.theme}
            useAnimation={shouldUseCoupleAnimation(state)}
          />
        </motion.div>
        <div className="full-bleed-scrim" />
        <motion.div className="full-bleed-overlay-content" style={{ opacity: reduced ? 1 : contentOpacity }}>
          <motion.h2
            className="full-bleed-names"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {state.names}
          </motion.h2>
          <p className="full-bleed-ceremony">
            {labels.ceremonyName}
            {state.date && (
              <>
                {' · '}
                {formatEventDate(state.date, state.language)}
              </>
            )}
          </p>
          {showHijri && <p className="full-bleed-hijri">{hijriDate}</p>}
        </motion.div>
      </div>

      {!reduced && (
        <motion.div
          className="layout-scroll-cue"
          animate={{ y: [0, 6, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.2, repeat: Infinity }}
        >
          <ChevronDown size={18} />
          <span>{labels.scrollHint}</span>
        </motion.div>
      )}

      <div className="full-bleed-scroll-intro">
        {ctx.hasFamilyDetails && (
          <div className="full-bleed-family-strip">
            {state.parentsGroom && (
              <div className="family-strip-col">
                <span className="family-strip-label">{labels.groomParentLabel}</span>
                <p>{state.parentsGroom}</p>
              </div>
            )}
            {state.parentsBride && (
              <div className="family-strip-col">
                <span className="family-strip-label">{labels.brideParentLabel}</span>
                <p>{state.parentsBride}</p>
              </div>
            )}
          </div>
        )}
        {state.message && <p className="full-bleed-message">{state.message}</p>}
      </div>
    </section>
  );
}

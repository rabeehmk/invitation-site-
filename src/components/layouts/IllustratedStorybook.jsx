import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import SceneIllustration, { getSceneFrame } from './SceneIllustration';
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

export default function IllustratedStorybook({ state, ctx, coverPhotoUrl }) {
  const reduced = useReducedMotion();
  const trackRef = useRef(null);
  const pageBg = resolvePageBackground(state);
  const photo = resolveHeroPhoto(state, coverPhotoUrl);
  const { labels, fonts, accent, palette, hijriDate, showHijri } = ctx;
  const frame = getSceneFrame(state.religion);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end']
  });

  const sceneOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.85]);

  return (
    <section
      ref={trackRef}
      className={`layout layout-illustrated ${pageBackgroundClass(pageBg)}`}
      style={{
        '--layout-accent': accent,
        '--layout-bg': palette.bg,
        '--layout-text': palette.text,
        '--font-heading': fonts.heading,
        '--font-accent': fonts.accent,
        ...buildPageBackgroundStyle(pageBg)
      }}
    >
      <motion.div
        className="illustrated-sticky"
        style={{ opacity: reduced ? 1 : sceneOpacity }}
      >
        <SceneIllustration religion={state.religion} accentColor={accent} />

        <div className="illustrated-frame">
          <LayoutPhoto
            src={photo}
            secondarySrc={resolveSecondaryPhoto(state, photo)}
            frame={frame}
            className="illustrated-photo"
            religion={state.religion}
            theme={state.theme}
            scrollProgress={reduced ? null : scrollYProgress}
            useAnimation={shouldUseCoupleAnimation(state)}
          />

          <div className="illustrated-content">
            <span className="illustrated-badge">{labels.ceremonyName}</span>
            <h1 className="illustrated-names">{state.names}</h1>

            {(state.nakshatra || state.gothram) && state.religion === 'hindu' && (
              <p className="illustrated-auspicious">
                {[state.nakshatra && `Nakshatra: ${state.nakshatra}`, state.gothram && `Gothram: ${state.gothram}`]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            )}

            {ctx.hasFamilyDetails && (
              <p className="illustrated-family">
                {labels.familyIntro}
                {state.parentsGroom && ` · ${labels.groomParentLabel} ${state.parentsGroom}`}
                {state.parentsBride && ` · ${labels.brideParentLabel} ${state.parentsBride}`}
              </p>
            )}

            <div className="illustrated-tiles">
              {state.date && (
                <div className="illustrated-tile">
                  <span>{labels.dateLabel}</span>
                  <p>{formatEventDate(state.date, state.language)}</p>
                  {showHijri && <small>{hijriDate}</small>}
                </div>
              )}
              {(state.venueName || state.venue) && (
                <div className="illustrated-tile">
                  <span>Venue</span>
                  <p>{state.venueName || state.venue}</p>
                </div>
              )}
            </div>

            {state.message && <p className="illustrated-message">{state.message}</p>}
          </div>
        </div>
      </motion.div>

      {!reduced && state.religion === 'christian' && (
        <div className="illustrated-scroll-spacer" aria-hidden="true" />
      )}
    </section>
  );
}

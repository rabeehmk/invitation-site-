import React from 'react';
import { motion } from 'framer-motion';
import LayoutPhoto from './LayoutPhoto';
import {
  resolveHeroPhoto,
  resolveSecondaryPhoto,
  resolvePageBackground,
  buildPageBackgroundStyle,
  pageBackgroundClass,
  formatProseDate,
  shouldUseCoupleAnimation
} from './layoutUtils';
import { formatEventDate } from '../../utils/dateUtils';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function SplitScreen({ state, ctx, coverPhotoUrl }) {
  const reduced = useReducedMotion();
  const pageBg = resolvePageBackground(state);
  const photo = resolveHeroPhoto(state, coverPhotoUrl);
  const { labels, fonts, accent, palette, hijriDate, showHijri } = ctx;

  const item = (i) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, x: 24 },
          animate: { opacity: 1, x: 0 },
          transition: { delay: i * 0.1, duration: 0.6 }
        };

  return (
    <section
      className={`layout layout-split ${pageBackgroundClass(pageBg)}`}
      style={{
        '--layout-accent': accent,
        '--layout-bg': palette.bg,
        '--layout-text': palette.text,
        '--font-heading': fonts.heading,
        '--font-accent': fonts.accent,
        ...buildPageBackgroundStyle(pageBg)
      }}
    >
      <div className="split-visual-panel">
        <div className="split-pattern-bg" aria-hidden="true" />
        <LayoutPhoto
          src={photo}
          secondarySrc={resolveSecondaryPhoto(state, photo)}
          frame={state.religion === 'muslim' ? 'mihrab-arch' : state.religion === 'hindu' ? 'temple-arch' : 'oval'}
          className="split-photo"
          religion={state.religion}
          theme={state.theme}
          useAnimation={shouldUseCoupleAnimation(state)}
        />
      </div>

      <div className="split-content-panel">
        <motion.span className="split-label" {...item(0)}>
          {labels.invitationBadge}
        </motion.span>

        <motion.h1 className="split-names" {...item(1)}>
          {state.names}
        </motion.h1>

        {state.message && (
          <motion.p className="split-message" {...item(2)}>
            {state.message}
          </motion.p>
        )}

        {ctx.hasFamilyDetails && (
          <motion.div className="split-family-grid" {...item(3)}>
            <span className="split-family-intro">{labels.familyIntro}</span>
            {state.parentsGroom && (
              <p><strong>{labels.groomParentLabel}</strong> {state.parentsGroom}</p>
            )}
            {state.parentsBride && (
              <p><strong>{labels.brideParentLabel}</strong> {state.parentsBride}</p>
            )}
          </motion.div>
        )}

        {state.date && (
          <motion.div className="split-date-card" {...item(4)}>
            <span className="split-date-label">{labels.dateLabel}</span>
            <p className="split-date-main">{formatProseDate(state.date, state.language)}</p>
            <p className="split-date-sub">{formatEventDate(state.date, state.language)}</p>
            {showHijri && <p className="split-date-hijri">{hijriDate}</p>}
          </motion.div>
        )}

        {(state.venueName || state.venue) && (
          <motion.div className="split-venue-line" {...item(5)}>
            <strong>{state.venueName}</strong>
            {state.venue && <span> · {state.venue}</span>}
          </motion.div>
        )}
      </div>
    </section>
  );
}

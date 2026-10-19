import React from 'react';
import { motion } from 'framer-motion';
import LayoutPhoto from './LayoutPhoto';
import { resolveCardPhoto, resolveSecondaryPhoto, resolvePageBackground, buildPageBackgroundStyle, pageBackgroundClass, formatProseDate, shouldUseCoupleAnimation } from './layoutUtils';
import { formatEventDate } from '../../utils/dateUtils';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function CardOnCanvas({ state, ctx, coverPhotoUrl }) {
  const reduced = useReducedMotion();
  const pageBg = resolvePageBackground(state);
  const photo = resolveCardPhoto(state, coverPhotoUrl);
  const { labels, fonts, accent, palette, hijriDate, showHijri } = ctx;
  const textureClass = pageBg ? 'canvas-texture--custom-photo' : `canvas-texture--${state.religion || 'custom'}`;

  return (
    <section
      className={`layout layout-card-canvas ${textureClass} ${pageBackgroundClass(pageBg)}`}
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
        className="canvas-invite-card"
        initial={reduced ? false : { opacity: 0, y: 32, rotate: -0.5 }}
        animate={{ opacity: 1, y: 0, rotate: 0.5 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <LayoutPhoto
          src={photo}
          secondarySrc={resolveSecondaryPhoto(state, photo)}
          frame={state.religion === 'hindu' ? 'temple-arch' : state.religion === 'muslim' ? 'mihrab-arch' : state.religion === 'sikh' ? 'rounded' : 'rounded'}
          className="canvas-card-photo"
          religion={state.religion}
          theme={state.theme}
          useAnimation={shouldUseCoupleAnimation(state)}
        />

        <div className="canvas-card-body">
          <span className="canvas-card-badge">{labels.invitationBadge}</span>
          <h1 className="canvas-card-names">{state.names}</h1>
          <div className="canvas-card-divider" aria-hidden="true">✦</div>

          {state.date && (
            <div className="canvas-card-date-block">
              <p className="canvas-card-date-main">{formatProseDate(state.date, state.language)}</p>
              <p className="canvas-card-date-sub">{formatEventDate(state.date, state.language)}</p>
              {showHijri && <p className="canvas-card-date-hijri">{hijriDate}</p>}
            </div>
          )}

          {ctx.hasFamilyDetails && (
            <div className="canvas-card-family-row">
              {state.parentsGroom && (
                <div>
                  <span>{labels.groomParentLabel}</span>
                  <p>{state.parentsGroom}</p>
                </div>
              )}
              {state.parentsBride && (
                <div>
                  <span>{labels.brideParentLabel}</span>
                  <p>{state.parentsBride}</p>
                </div>
              )}
            </div>
          )}

          {state.message && <p className="canvas-card-message">{state.message}</p>}

          {(state.venueName || state.venue) && (
            <p className="canvas-card-venue">
              {state.venueName}
              {state.venue && <><br /><span>{state.venue}</span></>}
            </p>
          )}
        </div>
      </motion.div>
    </section>
  );
}

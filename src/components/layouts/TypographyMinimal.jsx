import React from 'react';
import { motion } from 'framer-motion';
import {
  resolveHeroPhoto,
  resolvePageBackground,
  buildPageBackgroundStyle,
  pageBackgroundClass,
  formatProseDate
} from './layoutUtils';
import { formatEventDate } from '../../utils/dateUtils';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function TypographyMinimal({ state, ctx, coverPhotoUrl }) {
  const reduced = useReducedMotion();
  const pageBg = resolvePageBackground(state);
  const { labels, fonts, accent, palette, hijriDate, showHijri } = ctx;
  const isRtl = state.language === 'ar';
  const optionalPhoto = resolveHeroPhoto(state, coverPhotoUrl);
  const showBottomPhoto = optionalPhoto && (state.bridePhoto || state.isUploaded);

  const nameParts = state.names?.split('&').map((s) => s.trim()).filter(Boolean) || [state.names];

  return (
    <section
      className={`layout layout-typography-minimal ${pageBackgroundClass(pageBg)}`}
      dir={isRtl ? 'rtl' : 'ltr'}
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
        className="typo-minimal-inner"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <span className="typo-minimal-label">{labels.invitationBadge}</span>

        <div className="typo-minimal-names">
          {nameParts.map((name, i) => (
            <span key={i} className="typo-minimal-name-line">{name}</span>
          ))}
        </div>

        <div className="typo-minimal-rule" aria-hidden="true" />

        {state.date && (
          <div className="typo-minimal-date">
            <p>{formatProseDate(state.date, state.language)}</p>
            {showHijri && <p className="typo-minimal-hijri">{hijriDate}</p>}
          </div>
        )}

        {(state.venueName || state.venue) && (
          <p className="typo-minimal-venue">
            {state.venueName}
            {state.venue && ` · ${state.venue}`}
          </p>
        )}

        {state.message && <p className="typo-minimal-message">{state.message}</p>}

        {ctx.hasFamilyDetails && (
          <div className="typo-minimal-family">
            <span>{labels.familyIntro}</span>
            {state.parentsGroom && <p>{labels.groomParentLabel} {state.parentsGroom}</p>}
            {state.parentsBride && <p>{labels.brideParentLabel} {state.parentsBride}</p>}
          </div>
        )}
      </motion.div>

      {showBottomPhoto && (
        <div className="typo-minimal-photo-break">
          <img src={optionalPhoto} alt="" className="typo-minimal-photo-full" draggable={false} />
        </div>
      )}
    </section>
  );
}

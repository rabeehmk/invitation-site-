import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import CoupleDisplay from './CoupleDisplay';
import { formatEventDate } from '../utils/dateUtils';
import { t } from '../data/i18n';
import { useReducedMotion } from '../hooks/useReducedMotion';

const SPARKLES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: `${8 + (i * 7.5) % 85}%`,
  top: `${10 + (i * 13) % 75}%`,
  delay: `${i * 0.35}s`,
  size: 3 + (i % 3)
}));

function InviteHeroContent({
  theme,
  eventType,
  names,
  title,
  date,
  hijriDate,
  message,
  language,
  secondaryLanguage,
  bilingual,
  showHijriDate,
  hasFamilyDetails,
  parentsGroom,
  parentsBride,
  familyGroom,
  familyBride,
  renderThemeIcon,
  bridePhoto,
  groomPhoto,
  scrollProgress
}) {
  const badgeText =
    eventType === 'wedding'
      ? t(language, 'weddingInvitation', secondaryLanguage, bilingual)
      : t(language, 'youreInvited', secondaryLanguage, bilingual);

  const hasCustomPhotos = !!(bridePhoto || groomPhoto);

  return (
    <>
      <div className="invite-hero-ambient" aria-hidden="true">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
        {SPARKLES.map((s) => (
          <span
            key={s.id}
            className="hero-sparkle"
            style={{
              left: s.left,
              top: s.top,
              animationDelay: s.delay,
              width: s.size,
              height: s.size
            }}
          />
        ))}
      </div>

      <div className="invite-hero-glass">
        <div className={`invite-hero-grid ${scrollProgress ? 'invite-hero-grid--scroll' : ''}`}>
          <div className="invite-hero-content">
            <span className="guest-badge hero-animate hero-delay-1">
              <span className="hero-badge-shimmer">{badgeText}</span>
            </span>

            {names && (
              <h2 className="guest-script-name hero-names hero-animate hero-delay-2">
                <span className="hero-names-inner">{names}</span>
              </h2>
            )}

            <h1 className="guest-title hero-animate hero-delay-3">{title}</h1>

            {hasFamilyDetails && (
              <div className="family-details-block hero-animate hero-delay-4">
                <p className="family-details-label">
                  {t(language, 'withBlessings', secondaryLanguage, bilingual)}
                </p>
                {parentsGroom && (
                  <p className="family-details-line">
                    {t(language, 'sonOf', secondaryLanguage, bilingual)} {parentsGroom}
                  </p>
                )}
                {parentsBride && (
                  <p className="family-details-line">
                    {t(language, 'daughterOf', secondaryLanguage, bilingual)} {parentsBride}
                  </p>
                )}
                {familyGroom && (
                  <p className="family-details-line">
                    {t(language, 'familyOf', secondaryLanguage, bilingual)} {familyGroom}
                  </p>
                )}
                {familyBride && (
                  <p className="family-details-line">
                    {t(language, 'familyOf', secondaryLanguage, bilingual)} {familyBride}
                  </p>
                )}
              </div>
            )}

            <div className="guest-divider hero-divider hero-animate hero-delay-5">
              <div className="guest-divider-line hero-divider-line" />
              <div className="hero-divider-icon-wrap">{renderThemeIcon()}</div>
              <div className="guest-divider-line hero-divider-line" />
            </div>

            {date && (
              <div className="hero-date-block hero-animate hero-delay-6">
                <div className="hero-date-pill">{formatEventDate(date, language)}</div>
                {showHijriDate && hijriDate && (
                  <div className="hijri-date-line hero-hijri">
                    {t(language, 'hijriDate', secondaryLanguage, bilingual)}: {hijriDate}
                  </div>
                )}
              </div>
            )}

            {message && (
              <blockquote className="hero-message-quote hero-animate hero-delay-7">
                <span className="hero-quote-mark">&ldquo;</span>
                <p>{message}</p>
              </blockquote>
            )}
          </div>

          <div className="invite-hero-visual hero-animate hero-delay-4">
            <div className="hero-visual-ring hero-visual-ring-1" aria-hidden="true" />
            <div className="hero-visual-ring hero-visual-ring-2" aria-hidden="true" />
            <div className="hero-couple-float">
              <CoupleDisplay
                theme={theme}
                bridePhoto={bridePhoto}
                groomPhoto={groomPhoto}
                heroMode
                scrollProgress={hasCustomPhotos ? null : scrollProgress}
              />
            </div>
          </div>
        </div>
      </div>

      {scrollProgress && !hasCustomPhotos && (
        <div className="scroll-couple-scroll-cue invite-scroll-cue">
          <span>Scroll to animate the couple</span>
        </div>
      )}

      <div className="hero-scroll-indicator hero-animate hero-delay-8" aria-hidden="true">
        <span className="hero-scroll-dot" />
      </div>
    </>
  );
}

export default function InviteHero(props) {
  const reduced = useReducedMotion();
  const trackRef = useRef(null);
  const hasCustomPhotos = !!(props.bridePhoto || props.groomPhoto);
  const useScrollModel = !hasCustomPhotos && !reduced;

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end']
  });

  const stickyOpacity = useTransform(scrollYProgress, [0, 0.95], [1, 0.9]);

  if (useScrollModel) {
    return (
      <section className={`invite-hero invite-hero--scroll-model theme-${props.theme}`}>
        <div ref={trackRef} className="scroll-couple-model invite-hero-scroll-track">
          <motion.div
            className="scroll-couple-model-sticky invite-hero-sticky"
            style={{ opacity: stickyOpacity }}
          >
            <InviteHeroContent {...props} scrollProgress={scrollYProgress} />
          </motion.div>
          <div className="scroll-couple-model-spacer" aria-hidden="true" />
        </div>
      </section>
    );
  }

  return (
    <section className={`invite-hero theme-${props.theme}`}>
      <InviteHeroContent {...props} scrollProgress={null} />
    </section>
  );
}

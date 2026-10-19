import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import CoupleDisplay from '../CoupleDisplay';
import ScrollCoupleModel from '../ScrollCoupleModel';
import MotifBackground from './MotifBackground';
import MotifBorderSVG from './MotifBorderSVG';
import HeroWatermark from './HeroWatermark';
import StickyCountdown from './StickyCountdown';
import { formatEventDate } from '../../utils/dateUtils';
import { t } from '../../data/i18n';
import { getReligion, FONT_PAIRS } from '../../config/religions';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { isLightBackground } from '../../utils/colorUtils';

const STAGGER = 0.15;

function HeroTextBlock({
  layout,
  names,
  title,
  message,
  date,
  hijriDate,
  showHijriDate,
  language,
  secondaryLanguage,
  bilingual,
  eventType,
  religionId,
  parentsGroom,
  parentsBride,
  hasFamilyDetails,
  accentColor,
  motif,
  fontPair,
  showCrossMotif
}) {
  const reduced = useReducedMotion();
  const fonts = FONT_PAIRS[fontPair] || FONT_PAIRS['serif-script'];
  const badgeText =
    eventType === 'wedding'
      ? t(language, 'weddingInvitation', secondaryLanguage, bilingual)
      : t(language, 'youreInvited', secondaryLanguage, bilingual);

  const item = (i) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, scale: 0.92 },
          animate: { opacity: 1, scale: 1 },
          transition: { duration: 0.7, delay: i * STAGGER, ease: [0.22, 1, 0.36, 1] }
        };

  const isRtl = language === 'ar' || (religionId === 'muslim' && secondaryLanguage === 'ar' && bilingual);
  const isMinimal = layout === 'typography-minimal';

  return (
    <div
      className={`tradition-hero-inner layout-${layout}`}
      style={{
        '--hero-accent': accentColor || '#D4AF37',
        '--font-heading': fonts.heading,
        '--font-body': fonts.body,
        '--font-accent': fonts.accent
      }}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {!isMinimal && <MotifBorderSVG motif={motif} accentColor={accentColor} className="hero-motif-frame" />}
      <HeroWatermark motif={motif} accentColor={accentColor} />

      <div className="tradition-hero-text">
        <motion.span className="tradition-badge" {...item(0)}>
          {badgeText}
        </motion.span>

        {names && (
          <motion.h2 className="tradition-names" {...item(1)}>
            {names}
          </motion.h2>
        )}

        <motion.h1 className="tradition-title" {...item(2)}>
          {title}
        </motion.h1>

        {hasFamilyDetails && (
          <motion.div className="tradition-family" {...item(3)}>
            <p className="tradition-family-label">
              {t(language, 'withBlessings', secondaryLanguage, bilingual)}
            </p>
            {parentsGroom && (
              <p>{t(language, 'sonOf', secondaryLanguage, bilingual)} {parentsGroom}</p>
            )}
            {parentsBride && (
              <p>{t(language, 'daughterOf', secondaryLanguage, bilingual)} {parentsBride}</p>
            )}
          </motion.div>
        )}

        {date && (
          <motion.div className="tradition-date-block" {...item(4)}>
            <span className="tradition-date-pill">{formatEventDate(date, language)}</span>
            {showHijriDate && hijriDate && (
              <span className="tradition-hijri">{hijriDate}</span>
            )}
          </motion.div>
        )}

        {message && (
          <motion.blockquote className="tradition-message" {...item(5)}>
            {message}
          </motion.blockquote>
        )}

        {showCrossMotif && religionId === 'christian' && (
          <motion.span className="tradition-cross-accent" {...item(6)} aria-hidden="true">
            ✝
          </motion.span>
        )}
      </div>
    </div>
  );
}

function HeroWithScrollModel({
  state,
  religion,
  hijriDate,
  hasFamilyDetails,
  textProps
}) {
  const trackRef = useRef(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end']
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.85]);
  const heroScale = useTransform(scrollYProgress, [0, 0.9], [1, 0.96]);

  return (
    <div ref={trackRef} className="scroll-couple-model tradition-hero-scroll-track">
      <motion.div
        className="scroll-couple-model-sticky tradition-hero-sticky"
        style={{
          opacity: reduced ? 1 : heroOpacity,
          scale: reduced ? 1 : heroScale
        }}
      >
        <div className="scroll-couple-model-grid tradition-hero-scroll-grid tradition-hero-scroll-grid--stacked">
          <div className="scroll-couple-model-content">
            <HeroTextBlock {...textProps} />
          </div>
          <div className="scroll-couple-model-visual tradition-hero-visual">
            <CoupleDisplay
              theme={state.theme || 'dark-gold'}
              bridePhoto={state.bridePhoto}
              groomPhoto={state.groomPhoto}
              heroMode
              scrollProgress={reduced ? null : scrollYProgress}
              religion={state.religion}
            />
          </div>
        </div>
        {!reduced && (
          <motion.div
            className="scroll-couple-scroll-cue christian-scroll-cue"
            animate={{ y: [0, 5, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span>
              {state.religion === 'christian'
                ? 'Scroll to reveal the sacred moment'
                : 'Scroll to animate the couple'}
            </span>
          </motion.div>
        )}
        {state.date && state.sectionVisibility?.showCountdown !== false && (
          <StickyCountdown
            targetDate={state.date}
            scrollProgress={scrollYProgress}
            accentColor={state.accentColor || religion.defaultPalette.primary}
          />
        )}
      </motion.div>
      <div className="scroll-couple-model-spacer" aria-hidden="true" />
    </div>
  );
}

export default function TraditionHero({
  state,
  hijriDate,
  hasFamilyDetails,
  coverPhotoUrl
}) {
  const reduced = useReducedMotion();
  const religion = getReligion(state.religion);
  const heroRef = useRef(null);

  const isChristian = state.religion === 'christian';
  const isFullPhoto = state.layout === 'full-photo-bg';
  const isMinimal = state.layout === 'typography-minimal';
  const hasCustomPhotos = !!(state.bridePhoto || state.groomPhoto);
  // Christian weddings always use scroll couple animation (all templates)
  const useScrollModel =
    !hasCustomPhotos &&
    !reduced &&
    (isChristian || (!isMinimal && !isFullPhoto));

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.85], [1, 0.92]);
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '-15%']);

  const bgUrl = state.customBackground || coverPhotoUrl;
  const cardBg = state.traditionBg || religion.defaultPalette?.bg || '#0b0c10';
  const isLightBg = isLightBackground(cardBg);

  const textProps = {
    layout: state.layout,
    names: state.names,
    title: state.title,
    message: state.message,
    date: state.date,
    hijriDate,
    showHijriDate: state.showHijriDate,
    language: state.language,
    secondaryLanguage: state.secondaryLanguage,
    bilingual: state.bilingual,
    eventType: state.eventType,
    religionId: state.religion,
    parentsGroom: state.parentsGroom,
    parentsBride: state.parentsBride,
    hasFamilyDetails,
    accentColor: state.accentColor || religion.defaultPalette.primary,
    motif: state.motif,
    fontPair: state.fontPair,
    showCrossMotif: state.showCrossMotif
  };

  return (
    <section
      ref={useScrollModel ? null : heroRef}
      className={`tradition-hero tradition-hero--${state.layout} ${useScrollModel ? 'tradition-hero--scroll-model' : ''} ${isChristian ? 'tradition-hero--christian' : ''}`}
    >
      {isFullPhoto && bgUrl && (
        <motion.div className="tradition-hero-bg-photo" style={{ y: reduced ? 0 : bgY }}>
          <img src={bgUrl} alt="" />
          <div className="tradition-hero-bg-overlay" />
        </motion.div>
      )}

      <MotifBackground religion={religion} accentColor={state.accentColor} isLight={isLightBg} />

      {useScrollModel ? (
        <HeroWithScrollModel
          state={state}
          religion={religion}
          hijriDate={hijriDate}
          hasFamilyDetails={hasFamilyDetails}
          textProps={textProps}
        />
      ) : (
        <>
          <motion.div
            className="tradition-hero-content-wrap"
            initial={{ opacity: 1 }}
            style={{
              opacity: reduced ? 1 : heroOpacity,
              scale: reduced ? 1 : heroScale,
              y: reduced ? 0 : heroY
            }}
          >
            <div className={`tradition-hero-inner layout-${state.layout}`}>
              <HeroTextBlock {...textProps} />
              {!isMinimal && !isFullPhoto && (
                <div className="tradition-hero-visual">
                  <CoupleDisplay
                    theme={state.theme || 'dark-gold'}
                    bridePhoto={state.bridePhoto}
                    groomPhoto={state.groomPhoto}
                    heroMode
                    scrollProgress={null}
                    religion={state.religion}
                  />
                </div>
              )}
            </div>
          </motion.div>

          {state.date && state.sectionVisibility?.showCountdown !== false && (
            <StickyCountdown
              targetDate={state.date}
              scrollProgress={scrollYProgress}
              accentColor={state.accentColor || religion.defaultPalette.primary}
            />
          )}
        </>
      )}
    </section>
  );
}

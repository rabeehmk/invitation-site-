import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Calendar as CalendarIcon, Volume2, VolumeX, Phone } from 'lucide-react';
import LayoutRouter from '../layouts/LayoutRouter';
import { resolveLayoutStructure } from '../../config/layoutStructures';
import AnimatedSection from './AnimatedSection';
import RsvpSection from '../RsvpSection';
import EventScheduleDisplay from '../EventScheduleDisplay';
import GuestbookSection from '../GuestbookSection';
import AddToCalendarButton from '../AddToCalendarButton';
import DirectionsSection from '../DirectionsSection';
import CountdownTimer from '../CountdownTimer';
import GallerySection from '../GallerySection';
import ReligionBlessingSection from './ReligionBlessingSection';
import CoupleStorySection from './CoupleStorySection';
import DressCodeSection from '../DressCodeSection';
import GiftBlessingSection from '../GiftBlessingSection';
import LiveStreamSection from '../LiveStreamSection';
import AccommodationSection from '../AccommodationSection';
import PetalsConfettiOverlay from '../PetalsConfettiOverlay';
import GuestPhotoMoment from '../GuestPhotoMoment';
import GuestCameraFab from '../GuestCameraFab';
import ChristianScrollCoupleSection from '../christian/ChristianScrollCoupleSection';
import TraditionSectionDivider from './TraditionSectionDivider';
import EnvelopeIntro from '../EnvelopeIntro';
import { ENVELOPE_FADE_DELAY, ENVELOPE_UNMOUNT_DELAY } from '../../config/envelope';
import { playMusic, stopMusic } from '../../utils/audioPlayback';
import { getPresetImageUrl, getMusicTrack } from '../../utils/helpers';
import { hexToRgbString, isLightBackground, ensureReadableColor } from '../../utils/colorUtils';
import { formatEventDate, formatEventTime, toHijriDate } from '../../utils/dateUtils';
import { t } from '../../data/i18n';
import { getReligion } from '../../config/religions';
import { getTemplateById } from '../../config/index';
import { getDefaultSectionVisibility } from '../../data/templates';

export default function TraditionCard({ state, isPreviewMode = false }) {
  const {
    theme = 'dark-gold',
    eventType = 'wedding',
    names = '',
    title = '',
    date = '',
    endDate = '',
    venueName = '',
    venue = '',
    message = '',
    mapLink = '',
    rsvpEnabled = true,
    rsvpPhone = '',
    presetIdx = 0,
    isUploaded = false,
    uploadedPhoto = '',
    audioTrack = 'none',
    customAudioUrl = '',
    audioEnabled = true,
    musicStartAt = 0,
    musicVolume = 70,
    musicFadeIn = true,
    envelopeStyle = 'royal',
    envelopePrompt = '',
    envelopeHint,
    envelopeLetterText = '',
    parentsGroom = '',
    parentsBride = '',
    contactName = '',
    contactPhone = '',
    schedule = [],
    language = 'en',
    bilingual = false,
    secondaryLanguage = 'ml',
    showHijriDate = false,
    mealPreferenceEnabled = false,
    guestbookEnabled = true,
    nearestStation = '',
    nearestBusStand = '',
    emergencyContact = '',
    brideSideContact = '',
    groomSideContact = '',
    brideEventName = '',
    brideEventVenue = '',
    brideEventAddress = '',
    brideEventMapLink = '',
    groomEventName = '',
    groomEventVenue = '',
    groomEventAddress = '',
    groomEventMapLink = '',
    bridePhoto = '',
    groomPhoto = '',
    sectionVisibility = null,
    religion = 'custom',
    accentColor = '#D4AF37',
    customBackground = '',
    coupleStory = '',
    blessingText = '',
    galleryPhotos = [],
    dressCode = '',
    giftNote = '',
    liveStreamUrl = '',
    accommodationInfo = ''
  } = state;

  const vis = sectionVisibility || getDefaultSectionVisibility();
  const religionConfig = getReligion(religion);
  const template = getTemplateById(state.templateId || state.selectedTemplateId);
  const palette = template?.palette || religionConfig.defaultPalette;
  // Accent must stay readable on the page (e.g. Noor's navy accent on a navy page → gold)
  const resolvedAccent = ensureReadableColor(
    accentColor || palette.primary || '#D4AF37',
    palette.bg,
    [palette.secondary, palette.primary],
    1.8
  );

  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [envelopeFading, setEnvelopeFading] = useState(false);
  const [envelopeUnmounted, setEnvelopeUnmounted] = useState(isPreviewMode);
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const audioRef = useRef(null);

  const coverPhotoUrl =
    customBackground || (isUploaded && uploadedPhoto ? uploadedPhoto : getPresetImageUrl(eventType, presetIdx));

  const activeTrack = getMusicTrack(audioTrack, customAudioUrl);
  const textDir = language === 'ar' ? 'rtl' : religionConfig.supportsRtl && bilingual && secondaryLanguage === 'ar' ? 'rtl' : 'ltr';
  const invitationId = isPreviewMode ? 'preview' : window.location.hash;
  const hasFamilyDetails = vis.showFamilyDetails !== false && (parentsGroom || parentsBride);
  const hijriDate = showHijriDate ? toHijriDate(date, language) : '';

  const musicSettings = { startAt: musicStartAt, volume: musicVolume, fadeIn: musicFadeIn };

  const handleOpenEnvelope = () => {
    setEnvelopeOpen(true);
    if (soundOn && audioEnabled && activeTrack.url && audioRef.current) {
      playMusic(audioRef.current, musicSettings).then(() => setIsPlaying(true)).catch(() => {});
    }
    setTimeout(() => setEnvelopeFading(true), ENVELOPE_FADE_DELAY);
    setTimeout(() => setEnvelopeUnmounted(true), ENVELOPE_UNMOUNT_DELAY);
  };

  // Reload only when the track itself changes; reloading on play/pause would restart the song
  useEffect(() => {
    if (isPreviewMode || !audioRef.current) return;
    stopMusic(audioRef.current);
    audioRef.current.load();
    setIsPlaying(false);
  }, [activeTrack.url, audioEnabled, isPreviewMode]);

  const togglePlayback = (e) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    if (isPlaying) {
      stopMusic(audioRef.current);
      setIsPlaying(false);
    } else {
      playMusic(audioRef.current, musicSettings).then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  const getSealMonogram = () => {
    if (names?.trim()) return names.trim().charAt(0).toUpperCase();
    return religionConfig.icon || 'A';
  };

  const hasCustomPhotos = !!(bridePhoto || groomPhoto);
  const showGuestPhoto =
    vis.showSelfieBooth !== false &&
    (eventType === 'wedding' || eventType === 'anniversary') &&
    envelopeUnmounted;

  const guestPhotoProps = {
    bridePhotoUrl: bridePhoto,
    groomPhotoUrl: groomPhoto,
    names,
    invitationId,
    religion,
    accentColor: resolvedAccent
  };

  const showChristianScrollSection =
    religion === 'christian' &&
    vis.showScrollCouple !== false &&
    hasCustomPhotos;

  const accentRgb = hexToRgbString(resolvedAccent);
  const lightCard = isLightBackground(palette.bg);

  const layoutStructure = resolveLayoutStructure(template);

  return (
    <div
      className={`tradition-card theme-${theme} religion-${religion} layout-${layoutStructure} layout-legacy-${state.layout || 'centered-symmetric'} ${lightCard ? 'tradition-card--light' : 'tradition-card--dark'}`}
      dir={textDir}
      style={{
        '--tradition-primary': resolvedAccent,
        '--tradition-secondary': palette.secondary,
        '--tradition-bg': palette.bg,
        '--tradition-text': palette.text,
        '--hero-accent': resolvedAccent,
        '--theme-accent': resolvedAccent,
        '--theme-accent-rgb': accentRgb,
        '--tradition-card-bg': lightCard ? 'rgba(255,255,255,0.88)' : 'rgba(18, 20, 29, 0.78)',
        '--tradition-card-border': lightCard
          ? `rgba(${accentRgb}, 0.22)`
          : `rgba(${accentRgb}, 0.18)`,
        // The theme class can be dark while the template page is light (or the reverse);
        // the template palette wins so text, cards and the music player stay readable
        '--theme-bg': palette.bg,
        '--theme-text': palette.text,
        '--theme-text-muted': `color-mix(in srgb, ${palette.text} 65%, transparent)`,
        '--theme-card-bg': lightCard ? 'rgba(255,255,255,0.88)' : 'rgba(18, 20, 29, 0.85)',
        '--theme-card-border': `rgba(${accentRgb}, 0.22)`
      }}
    >
      {!envelopeUnmounted && (
        <EnvelopeIntro
          theme={theme}
          monogram={getSealMonogram()}
          open={envelopeOpen}
          fading={envelopeFading}
          onOpen={handleOpenEnvelope}
          variant={envelopeStyle}
          prompt={envelopePrompt}
          hint={envelopeHint}
          letterText={envelopeLetterText}
          musicLabel={audioEnabled && activeTrack.url ? activeTrack.label : ''}
          soundOn={soundOn}
          onToggleSound={() => setSoundOn((v) => !v)}
        />
      )}

      <PetalsConfettiOverlay active={envelopeOpen} />

      <LayoutRouter
        state={{ ...state, accentColor: resolvedAccent }}
        hijriDate={hijriDate}
        hasFamilyDetails={hasFamilyDetails}
        coverPhotoUrl={coverPhotoUrl}
      />

      {showChristianScrollSection && layoutStructure !== 'illustrated' && (
        <ChristianScrollCoupleSection theme={theme} title="Blessed Union" />
      )}

      <div className={`tradition-sections tradition-sections--${religion || 'custom'}`}>
        {vis.showCountdown !== false && date && (
          <AnimatedSection variant="fadeUp" className="tradition-section">
            <div className="tradition-countdown-wrap">
              <CountdownTimer targetDate={date} />
            </div>
          </AnimatedSection>
        )}

        {vis.showBlessing !== false && religion && religion !== 'custom' && (
          <AnimatedSection variant="fadeScale" className="tradition-section">
            <div className="guest-card-panel tradition-panel">
              <ReligionBlessingSection
                religion={religion}
                blessingText={blessingText}
                accentColor={resolvedAccent}
              />
            </div>
          </AnimatedSection>
        )}

        {vis.showCoupleStory !== false && coupleStory?.trim() && (
          <AnimatedSection variant="fadeUp" className="tradition-section">
            <div className="guest-card-panel tradition-panel">
              <CoupleStorySection story={coupleStory} names={names} />
            </div>
          </AnimatedSection>
        )}

        {(vis.showCountdown !== false && date) && (
          <TraditionSectionDivider icon={religionConfig.icon || '✦'} />
        )}

        {vis.showSchedule !== false && schedule.length > 0 && (
          <AnimatedSection variant="fadeUp" className="tradition-section">
            <div className="tradition-schedule-wrap">
              <EventScheduleDisplay
                schedule={schedule}
                language={language}
                secondaryLanguage={secondaryLanguage}
                bilingual={bilingual}
                isPreviewMode={isPreviewMode}
              />
            </div>
          </AnimatedSection>
        )}

        {(vis.showSchedule !== false && schedule.length > 0) && (
          <TraditionSectionDivider icon={religionConfig.icon || '✦'} />
        )}

        <AnimatedSection variant="slideLeft" className="tradition-section">
          <div className="guest-card-panel tradition-panel">
            <h3>{t(language, 'dateTimeVenue', secondaryLanguage, bilingual)}</h3>

            <div className="detail-info-row">
              <div className="detail-info-icon"><CalendarIcon size={18} /></div>
              <span className="detail-info-title">{t(language, 'when', secondaryLanguage, bilingual)}</span>
              <p className="detail-info-text">{formatEventDate(date, language)}</p>
              {date && (
                <p className="detail-info-text" style={{ fontSize: '13px', opacity: 0.8 }}>
                  {t(language, 'at', secondaryLanguage, bilingual)} {formatEventTime(date, language)}
                </p>
              )}
            </div>

            <div className="guest-divider" style={{ margin: '16px 0', opacity: 0.2 }}>
              <div className="guest-divider-line" />
            </div>

            <div className="detail-info-row">
              <div className="detail-info-icon"><MapPin size={18} /></div>
              <span className="detail-info-title">{t(language, 'where', secondaryLanguage, bilingual)}</span>
              {venueName && <p className="detail-info-text" style={{ fontWeight: 600 }}>{venueName}</p>}
              <p className="detail-info-text">{venue}</p>
              {mapLink && (
                <a href={mapLink} target="_blank" rel="noopener noreferrer" className="btn-theme-outline">
                  {t(language, 'getDirections', secondaryLanguage, bilingual)}
                </a>
              )}
              <AddToCalendarButton
                title={title}
                date={date}
                endDate={endDate}
                venue={venue}
                venueName={venueName}
                message={message}
                language={language}
                secondaryLanguage={secondaryLanguage}
                bilingual={bilingual}
                isPreviewMode={isPreviewMode}
              />
            </div>
          </div>
        </AnimatedSection>

        <TraditionSectionDivider icon="◆" />

        {vis.showTravel !== false && (
          <AnimatedSection variant="slideRight" className="tradition-section">
            <DirectionsSection
              nearestStation={nearestStation}
              nearestBusStand={nearestBusStand}
              emergencyContact={emergencyContact}
              brideEventName={brideEventName}
              brideEventVenue={brideEventVenue}
              brideEventAddress={brideEventAddress}
              brideEventMapLink={brideEventMapLink}
              groomEventName={groomEventName}
              groomEventVenue={groomEventVenue}
              groomEventAddress={groomEventAddress}
              groomEventMapLink={groomEventMapLink}
              brideSideContact={brideSideContact}
              groomSideContact={groomSideContact}
              mapLink={mapLink}
              showBrideGroomEvents={vis.showBrideGroomEvents !== false}
              isPreviewMode={isPreviewMode}
            />
          </AnimatedSection>
        )}

        {vis.showDressCode !== false && dressCode?.trim() && (
          <AnimatedSection variant="fadeUp" className="tradition-section">
            <DressCodeSection dressCode={dressCode} />
          </AnimatedSection>
        )}

        {vis.showAccommodation !== false && accommodationInfo?.trim() && (
          <AnimatedSection variant="fadeUp" className="tradition-section">
            <AccommodationSection
              accommodationInfo={accommodationInfo}
              contactPhone={emergencyContact || contactPhone}
            />
          </AnimatedSection>
        )}

        {vis.showLiveStream !== false && liveStreamUrl?.trim() && (
          <AnimatedSection variant="fadeScale" className="tradition-section">
            <LiveStreamSection
              liveStreamUrl={liveStreamUrl}
              isPreviewMode={isPreviewMode}
            />
          </AnimatedSection>
        )}

        {vis.showGiftNote !== false && giftNote?.trim() && (
          <AnimatedSection variant="fadeUp" className="tradition-section">
            <GiftBlessingSection giftNote={giftNote} />
          </AnimatedSection>
        )}

        {showGuestPhoto && (
          <AnimatedSection variant="fadeScale" className="tradition-section">
            <div className="guest-card-panel">
              <GuestPhotoMoment {...guestPhotoProps} title="Take a Photo with the Couple" />
            </div>
          </AnimatedSection>
        )}

        {vis.showGallery !== false && galleryPhotos?.length > 0 && (
          <AnimatedSection variant="fadeUp" className="tradition-section">
            <div className="guest-card-panel tradition-panel">
              <GallerySection photos={galleryPhotos} />
            </div>
          </AnimatedSection>
        )}

        {(contactName || contactPhone) && (
          <AnimatedSection variant="fadeUp" className="tradition-section">
            <div className="guest-card-panel">
              <h3>{t(language, 'contactRsvp', secondaryLanguage, bilingual)}</h3>
              <div className="detail-info-row">
                <div className="detail-info-icon"><Phone size={18} /></div>
                {contactName && <p className="detail-info-text">{contactName}</p>}
                {contactPhone && (
                  <a href={`tel:${contactPhone}`} className="detail-info-text contact-link">{contactPhone}</a>
                )}
              </div>
            </div>
          </AnimatedSection>
        )}

        {vis.showRsvp !== false && rsvpEnabled && (
          <AnimatedSection variant="fadeUp" className="tradition-section">
            <RsvpSection
              rsvpPhone={rsvpPhone || contactPhone}
              eventTitle={title}
              invitationId={invitationId}
              language={language}
              secondaryLanguage={secondaryLanguage}
              bilingual={bilingual}
              mealPreferenceEnabled={mealPreferenceEnabled}
            />
          </AnimatedSection>
        )}

        {vis.showGuestbook !== false && guestbookEnabled && (
          <AnimatedSection variant="fadeScale" className="tradition-section">
            <GuestbookSection
              invitationId={invitationId}
              eventType={eventType}
              language={language}
              secondaryLanguage={secondaryLanguage}
              bilingual={bilingual}
              isPreviewMode={isPreviewMode}
            />
          </AnimatedSection>
        )}
      </div>

      <footer className="tradition-footer">
        {t(language, 'createdWith', secondaryLanguage, bilingual)}{' '}
        <a href="#home">Aura Invite</a>
      </footer>

      {showGuestPhoto && (
        <GuestCameraFab {...guestPhotoProps} visible={envelopeUnmounted} />
      )}

      {audioEnabled && activeTrack.url && (
        <>
          <audio ref={audioRef} src={activeTrack.url} loop preload="auto" />
          <div className="audio-player-container" onClick={togglePlayback}>
            <div className="audio-visualizer">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className={`audio-bar ${isPlaying ? 'playing' : ''}`} />
              ))}
            </div>
            <span className="audio-track-label">{activeTrack.label}</span>
            {isPlaying ? <Volume2 size={13} /> : <VolumeX size={13} />}
          </div>
        </>
      )}
    </div>
  );
}

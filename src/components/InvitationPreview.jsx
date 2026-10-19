import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Calendar as CalendarIcon, Heart, Home, Gift, Sparkles, Volume2, VolumeX, Phone, Camera } from 'lucide-react';
import CountdownTimer from './CountdownTimer';
import RsvpSection from './RsvpSection';
import InviteHero from './InviteHero';
import EventScheduleDisplay from './EventScheduleDisplay';
import GuestbookSection from './GuestbookSection';
import AddToCalendarButton from './AddToCalendarButton';
import DirectionsSection from './DirectionsSection';
import SelfieBooth from './SelfieBooth';
import GallerySection from './GallerySection';
import DressCodeSection from './DressCodeSection';
import GiftBlessingSection from './GiftBlessingSection';
import LiveStreamSection from './LiveStreamSection';
import AccommodationSection from './AccommodationSection';
import PetalsConfettiOverlay from './PetalsConfettiOverlay';
import { getPresetImageUrl, getMusicTrack, DEFAULT_COUPLE_FALLBACK } from '../utils/helpers';
import { formatEventDate, formatEventTime, toHijriDate } from '../utils/dateUtils';
import { t } from '../data/i18n';
import { FONT_OPTIONS } from '../data/invitationModel';
import { getDefaultSectionVisibility } from '../data/templates';
import EnvelopeIntro from './EnvelopeIntro';
import { ENVELOPE_FADE_DELAY, ENVELOPE_UNMOUNT_DELAY } from '../config/envelope';
import { playMusic, stopMusic } from '../utils/audioPlayback';

export default function InvitationPreview({ state, isPreviewMode = false }) {
  const {
    theme = 'dark-gold',
    eventType = 'wedding',
    names = 'Names Here',
    title = 'Event Title Here',
    date = '',
    endDate = '',
    venueName = '',
    venue = 'Venue Address Here',
    message = 'Your personal message will appear here.',
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
    familyGroom = '',
    familyBride = '',
    contactName = '',
    contactPhone = '',
    schedule = [],
    language = 'en',
    bilingual = false,
    secondaryLanguage = 'ml',
    font = 'serif',
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
    dressCode = '',
    giftNote = '',
    liveStreamUrl = '',
    accommodationInfo = '',
    galleryPhotos = []
  } = state;

  const vis = sectionVisibility || getDefaultSectionVisibility();

  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [envelopeFading, setEnvelopeFading] = useState(false);
  const [envelopeUnmounted, setEnvelopeUnmounted] = useState(isPreviewMode);
  const [showSelfieBooth, setShowSelfieBooth] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const audioRef = useRef(null);

  const coverPhotoUrl =
    isUploaded && uploadedPhoto ? uploadedPhoto : getPresetImageUrl(eventType, presetIdx);

  const activeTrack = getMusicTrack(audioTrack, customAudioUrl);
  const fontFamily = FONT_OPTIONS.find((f) => f.id === font)?.cssVar || 'var(--font-serif)';
  const textDir = language === 'ar' ? 'rtl' : 'ltr';
  const invitationId = isPreviewMode ? 'preview' : window.location.hash;

  const musicSettings = { startAt: musicStartAt, volume: musicVolume, fadeIn: musicFadeIn };

  const handleOpenEnvelope = () => {
    setEnvelopeOpen(true);
    if (soundOn && audioEnabled && activeTrack.url && audioRef.current) {
      playMusic(audioRef.current, musicSettings)
        .then(() => setIsPlaying(true))
        .catch((err) => console.log('Autoplay blocked:', err));
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

  const renderThemeIcon = () => {
    switch (eventType) {
      case 'wedding':
      case 'anniversary':
        return <Heart className="guest-divider-icon" size={20} />;
      case 'housewarming':
        return <Home className="guest-divider-icon" size={20} />;
      case 'birthday':
        return <Gift className="guest-divider-icon" size={20} />;
      default:
        return <Sparkles className="guest-divider-icon" size={20} />;
    }
  };

  const getSealMonogram = () => {
    if (names && names.trim()) return names.trim().charAt(0).toUpperCase();
    return 'A';
  };

  const hasFamilyDetails = vis.showFamilyDetails !== false && (parentsGroom || parentsBride || familyGroom || familyBride);
  const hijriDate = showHijriDate ? toHijriDate(date, language) : '';

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }} dir={textDir}>
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

      <div className={`guest-invitation-container theme-${theme}`}>
        <div className="guest-backdrop">
          <img src={coverPhotoUrl} alt={title} className="guest-backdrop-img" />
          <div className="guest-backdrop-overlay" />
        </div>

        <div className="guest-content-wrapper animate-fade-in" style={{ fontFamily }}>
          <InviteHero
            theme={theme}
            eventType={eventType}
            names={names}
            title={title}
            date={date}
            hijriDate={hijriDate}
            message={message}
            language={language}
            secondaryLanguage={secondaryLanguage}
            bilingual={bilingual}
            showHijriDate={showHijriDate}
            hasFamilyDetails={hasFamilyDetails}
            parentsGroom={parentsGroom}
            parentsBride={parentsBride}
            familyGroom={familyGroom}
            familyBride={familyBride}
            bridePhoto={bridePhoto}
            groomPhoto={groomPhoto}
            renderThemeIcon={renderThemeIcon}
          />

          <div className="guest-details-section">
            <div className="guest-column-left animate-fade-in-up animate-delay-2">
              {vis.showCountdown !== false && date && <CountdownTimer targetDate={date} />}

              {vis.showSchedule !== false && schedule.length > 0 && (
                <EventScheduleDisplay
                  schedule={schedule}
                  language={language}
                  secondaryLanguage={secondaryLanguage}
                  bilingual={bilingual}
                  isPreviewMode={isPreviewMode}
                />
              )}

              <div className="guest-card-panel">
                <h3>{t(language, 'dateTimeVenue', secondaryLanguage, bilingual)}</h3>

                <div className="detail-info-row">
                  <div className="detail-info-icon">
                    <CalendarIcon size={18} />
                  </div>
                  <span className="detail-info-title">
                    {t(language, 'when', secondaryLanguage, bilingual)}
                  </span>
                  <p className="detail-info-text">{formatEventDate(date, language)}</p>
                  {date && (
                    <p className="detail-info-text" style={{ fontSize: '13px', opacity: 0.8 }}>
                      {t(language, 'at', secondaryLanguage, bilingual)}{' '}
                      {formatEventTime(date, language)}
                      {endDate && ` – ${formatEventTime(endDate, language)}`}
                    </p>
                  )}
                </div>

                <div className="guest-divider" style={{ margin: '16px 0', opacity: 0.2 }}>
                  <div className="guest-divider-line" />
                </div>

                <div className="detail-info-row">
                  <div className="detail-info-icon">
                    <MapPin size={18} />
                  </div>
                  <span className="detail-info-title">
                    {t(language, 'where', secondaryLanguage, bilingual)}
                  </span>
                  {venueName && <p className="detail-info-text" style={{ fontWeight: 600 }}>{venueName}</p>}
                  <p className="detail-info-text">{venue || 'Location details'}</p>

                  {mapLink && (
                    <a
                      href={mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-theme-outline"
                      style={{ pointerEvents: isPreviewMode ? 'none' : 'auto' }}
                    >
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

              {vis.showTravel !== false && (
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
              )}

              {vis.showDressCode !== false && dressCode?.trim() && (
                <DressCodeSection dressCode={dressCode} />
              )}

              {vis.showAccommodation !== false && accommodationInfo?.trim() && (
                <AccommodationSection
                  accommodationInfo={accommodationInfo}
                  contactPhone={emergencyContact || contactPhone}
                />
              )}

              {vis.showLiveStream !== false && liveStreamUrl?.trim() && (
                <LiveStreamSection
                  liveStreamUrl={liveStreamUrl}
                  isPreviewMode={isPreviewMode}
                />
              )}

              {vis.showGiftNote !== false && giftNote?.trim() && (
                <GiftBlessingSection giftNote={giftNote} />
              )}

              {vis.showGallery !== false && galleryPhotos?.length > 0 && (
                <div className="guest-card-panel">
                  <GallerySection photos={galleryPhotos} />
                </div>
              )}

              {vis.showSelfieBooth !== false && (eventType === 'wedding' || eventType === 'anniversary') && envelopeUnmounted && (
                <div className="guest-card-panel selfie-cta-panel animate-fade-in-up">
                  <h3><Camera size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> Selfie with Bride & Groom</h3>
                  <p style={{ fontSize: '13px', opacity: 0.8, margin: '0 0 12px 0' }}>
                    {bridePhoto || groomPhoto
                      ? 'Take or upload your photo and get a beautiful keepsake with the couple!'
                      : 'Take a selfie and get a photo with the bride & groom illustration!'}
                  </p>
                  <button
                    type="button"
                    className="btn-theme-outline"
                    onClick={() => setShowSelfieBooth(true)}
                    style={{ pointerEvents: isPreviewMode ? 'none' : 'auto' }}
                  >
                    <Camera size={14} /> {isPreviewMode ? 'Selfie (live on published card)' : 'Open Camera & Take Selfie'}
                  </button>
                </div>
              )}

              {(contactName || contactPhone) && (
                <div className="guest-card-panel">
                  <h3>{t(language, 'contactRsvp', secondaryLanguage, bilingual)}</h3>
                  <div className="detail-info-row">
                    <div className="detail-info-icon">
                      <Phone size={18} />
                    </div>
                    {contactName && <p className="detail-info-text">{contactName}</p>}
                    {contactPhone && (
                      <a href={`tel:${contactPhone}`} className="detail-info-text contact-link">
                        {contactPhone}
                      </a>
                    )}
                  </div>
                </div>
              )}

              {vis.showRsvp !== false && rsvpEnabled && (
                <RsvpSection
                  rsvpPhone={rsvpPhone || contactPhone}
                  eventTitle={title}
                  invitationId={invitationId}
                  language={language}
                  secondaryLanguage={secondaryLanguage}
                  bilingual={bilingual}
                  mealPreferenceEnabled={mealPreferenceEnabled}
                />
              )}

              {vis.showGuestbook !== false && guestbookEnabled && (
                <GuestbookSection
                  invitationId={invitationId}
                  eventType={eventType}
                  language={language}
                  secondaryLanguage={secondaryLanguage}
                  bilingual={bilingual}
                  isPreviewMode={isPreviewMode}
                />
              )}
            </div>
          </div>

          <footer className="guest-invitation-footer animate-fade-in animate-delay-4">
            {t(language, 'createdWith', secondaryLanguage, bilingual)}{' '}
            <a href="#home" style={{ pointerEvents: isPreviewMode ? 'none' : 'auto' }}>
              Aura Invite
            </a>
          </footer>
        </div>
      </div>

      {showSelfieBooth && (
        <SelfieBooth
          bridePhotoUrl={bridePhoto}
          groomPhotoUrl={groomPhoto}
          coupleFallbackUrl={DEFAULT_COUPLE_FALLBACK}
          names={names}
          invitationId={invitationId}
          onClose={() => setShowSelfieBooth(false)}
        />
      )}

      {audioEnabled && activeTrack.url && (
        <>
          <audio ref={audioRef} src={activeTrack.url} loop preload="auto" />
          <div
            className="audio-player-container animate-fade-in animate-delay-3"
            onClick={togglePlayback}
            title={isPlaying ? 'Pause music' : 'Play music'}
          >
            <div className="audio-visualizer">
              <div className={`audio-bar ${isPlaying ? 'playing' : ''}`} />
              <div className={`audio-bar ${isPlaying ? 'playing' : ''}`} />
              <div className={`audio-bar ${isPlaying ? 'playing' : ''}`} />
              <div className={`audio-bar ${isPlaying ? 'playing' : ''}`} />
            </div>
            <span className="audio-track-label">{activeTrack.label}</span>
            {isPlaying ? <Volume2 size={13} style={{ opacity: 0.8 }} /> : <VolumeX size={13} style={{ opacity: 0.5 }} />}
          </div>
        </>
      )}
    </div>
  );
}

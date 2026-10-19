/**
 * Ready-made invitation templates — one click applies theme, content & styling.
 */
export const INVITATION_TEMPLATES = [
  {
    id: 'kerala-wedding',
    name: 'Traditional Kerala Wedding',
    description: 'Gold & dark theme, bilingual-ready, full family details',
    preview: 'dark-gold',
    apply: {
      theme: 'dark-gold',
      eventType: 'wedding',
      font: 'serif',
      language: 'en',
      bilingual: false,
      secondaryLanguage: 'en',
      title: 'Wedding Invitation',
      message: 'With the blessings of our families, we cordially invite you to celebrate our wedding. Your presence and prayers will grace our special day.',
      showHijriDate: false,
      audioTrack: 'romantic-piano',
      audioEnabled: true
    }
  },
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    description: 'Clean gradient, sans-serif, contemporary feel',
    preview: 'modern-gradient',
    apply: {
      theme: 'modern-gradient',
      eventType: 'wedding',
      font: 'modern',
      language: 'en',
      bilingual: false,
      message: 'We are getting married! Join us for an unforgettable celebration of love.',
      audioTrack: 'upbeat-lofi',
      audioEnabled: true
    }
  },
  {
    id: 'islamic-nikah',
    name: 'Islamic Nikah',
    description: 'Burgundy & gold, Hijri date, religious tone',
    preview: 'classic-burgundy',
    apply: {
      theme: 'classic-burgundy',
      eventType: 'wedding',
      font: 'serif',
      language: 'en',
      bilingual: true,
      secondaryLanguage: 'ar',
      showHijriDate: true,
      message: 'By the grace of Allah, we invite you to witness our Nikah ceremony. Your duas and presence mean the world to us.',
      audioTrack: 'cafe-acoustic',
      audioEnabled: true
    }
  },
  {
    id: 'rose-romantic',
    name: 'Rose Romantic',
    description: 'Soft ivory & rose, perfect for engagements & anniversaries',
    preview: 'rose-ivory',
    apply: {
      theme: 'rose-ivory',
      eventType: 'wedding',
      font: 'script',
      language: 'en',
      message: 'Two hearts, one promise. We would be honoured to have you celebrate with us.',
      audioTrack: 'romantic-piano',
      audioEnabled: true
    }
  },
  {
    id: 'griha-pravesham',
    name: 'Griha Pravesham',
    description: 'Sage green housewarming theme',
    preview: 'sage-cream',
    apply: {
      theme: 'sage-cream',
      eventType: 'housewarming',
      font: 'serif',
      language: 'en',
      bilingual: false,
      secondaryLanguage: 'en',
      message: 'We invite you to our Griha Pravesham — the auspicious entry into our new home. Your blessings are requested.',
      audioTrack: 'chill-lounge',
      audioEnabled: true
    }
  },
  {
    id: 'birthday-party',
    name: 'Birthday Celebration',
    description: 'Vibrant & fun party invite',
    preview: 'modern-gradient',
    apply: {
      theme: 'modern-gradient',
      eventType: 'birthday',
      font: 'modern',
      language: 'en',
      message: 'Come celebrate! Food, fun, and great memories await.',
      audioTrack: 'upbeat-lofi',
      audioEnabled: true,
      guestbookEnabled: true
    }
  }
];

/** Section visibility toggles — host controls what guests see */
export const CUSTOMIZABLE_SECTIONS = [
  { id: 'showCountdown', label: 'Countdown Timer', default: true },
  { id: 'showBlessing', label: 'Religion Blessing / Verse', default: true },
  { id: 'showCoupleStory', label: 'Couple Story', default: true },
  { id: 'showGallery', label: 'Photo Gallery', default: true },
  { id: 'showSchedule', label: 'Event Schedule', default: true },
  { id: 'showTravel', label: 'Travel & Directions', default: true },
  { id: 'showBrideGroomEvents', label: 'Bride & Groom Event Locations', default: true },
  { id: 'showRsvp', label: 'RSVP Form', default: true },
  { id: 'showGuestbook', label: 'Guestbook / Wishes', default: true },
  { id: 'showSelfieBooth', label: 'Selfie with Couple', default: true },
  { id: 'showFamilyDetails', label: 'Family Details (S/o, D/o)', default: true },
  { id: 'showDressCode', label: 'Dress Code & Attire', default: true },
  { id: 'showGiftNote', label: 'Blessing / Gift Note', default: true },
  { id: 'showLiveStream', label: 'Virtual Live Stream', default: true },
  { id: 'showAccommodation', label: 'Accommodation & Stay', default: true },
  { id: 'showScrollCouple', label: 'Scroll Couple Animation (Christian)', default: true }
];

export function getDefaultSectionVisibility() {
  return Object.fromEntries(CUSTOMIZABLE_SECTIONS.map((s) => [s.id, s.default]));
}

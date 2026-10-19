/**
 * Canonical invitation card data model.
 */
import { getDefaultSectionVisibility } from './templates.js';

export const EVENT_TYPES = [
  { id: 'wedding', label: 'Wedding', icon: 'heart' },
  { id: 'birthday', label: 'Birthday', icon: 'gift' },
  { id: 'housewarming', label: 'Housewarming / Griha Pravesham', icon: 'home' },
  { id: 'anniversary', label: 'Anniversary', icon: 'heart' },
  { id: 'religious', label: 'Religious Function', icon: 'sparkles' },
  { id: 'corporate', label: 'Corporate Event', icon: 'briefcase' },
  { id: 'party', label: 'Party / Dinner', icon: 'sparkles' }
];

export const SUB_EVENT_PRESETS = [
  { id: 'mehendi', label: 'Mehendi' },
  { id: 'sangeet', label: 'Sangeet' },
  { id: 'nikah', label: 'Nikah / Wedding' },
  { id: 'reception', label: 'Reception' },
  { id: 'griha-pravesham', label: 'Griha Pravesham' },
  { id: 'haldi', label: 'Haldi' },
  { id: 'engagement', label: 'Engagement' },
  { id: 'custom', label: 'Custom Event' }
];

export const LANGUAGES = [
  { id: 'en', label: 'English', dir: 'ltr' },
  { id: 'ml', label: 'Malayalam', dir: 'ltr' },
  { id: 'hi', label: 'Hindi', dir: 'ltr' },
  { id: 'ar', label: 'Arabic', dir: 'rtl' }
];

export const FONT_OPTIONS = [
  { id: 'serif', label: 'Classic Serif', cssVar: 'var(--font-serif)' },
  { id: 'script', label: 'Elegant Script', cssVar: 'var(--font-script)' },
  { id: 'modern', label: 'Modern Sans', cssVar: 'var(--font-modern)' }
];

export const MEAL_OPTIONS = [
  { id: 'veg', label: 'Vegetarian' },
  { id: 'non-veg', label: 'Non-Vegetarian' },
  { id: 'both', label: 'No Preference' }
];

export const RSVP_STATUS = ['yes', 'no', 'maybe'];

/** Default empty sub-event for the schedule editor */
export function createSubEvent(overrides = {}) {
  return {
    id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    presetId: 'custom',
    name: '',
    date: '',
    endTime: '',
    venue: '',
    address: '',
    mapLink: '',
    ...overrides
  };
}

/** Full default invitation state used by Studio and Guest views */
export function createDefaultInvitation(overrides = {}) {
  return {
    // Core event
    theme: 'dark-gold',
    eventType: 'wedding',
    names: 'Aria & Ethan',
    title: 'The Wedding Celebration of Aria & Ethan',
    date: '2026-12-20T18:30',
    endDate: '2026-12-20T23:00',
    venueName: 'The Glass House Waterfront',
    venue: '456 Opal Avenue, Marine View, New York',
    message:
      'Join us for an elegant evening of love, laughter, and celebration as we exchange our vows and begin our new journey together.',
    mapLink: 'https://maps.google.com',

    // Extended Wedding Details
    dressCode: 'Black-Tie & Cocktail Elegance',
    giftNote: 'Your presence and blessings are the only gifts we request.',
    liveStreamUrl: '',
    accommodationInfo: '',
    ceremonyRituals: '',

    // People (Indian invite conventions)
    parentsGroom: '',
    parentsBride: '',
    familyGroom: '',
    familyBride: '',
    contactName: '',
    contactPhone: '',

    // Multi-function schedule
    schedule: [],

    // Media
    presetIdx: 0,
    isUploaded: false,
    uploadedPhoto: '',
    bridePhoto: '',
    groomPhoto: '',
    galleryPhotos: [],
    coupleStory: '',
    blessingText: '',
    audioTrack: 'romantic-piano',
    audioEnabled: true,
    customAudioUrl: '',
    musicStartAt: 0,
    musicVolume: 70,
    musicFadeIn: true,

    // Envelope intro (empty text = built-in defaults)
    envelopeStyle: 'royal',
    envelopePrompt: '',
    envelopeLetterText: '',

    // Design & localization — English only by default (no Malayalam on card)
    language: 'en',
    bilingual: false,
    secondaryLanguage: 'en',
    font: 'serif',
    showHijriDate: false,

    // RSVP & guest features
    rsvpEnabled: true,
    rsvpPhone: '+1 (555) 019-2834',
    mealPreferenceEnabled: false,
    guestbookEnabled: true,

    // Travel & directions
    nearestStation: '',
    nearestBusStand: '',
    emergencyContact: '',
    brideSideContact: '',
    groomSideContact: '',
    brideEventName: '',
    brideEventVenue: '',
    brideEventAddress: '',
    brideEventMapLink: '',
    groomEventName: '',
    groomEventVenue: '',
    groomEventAddress: '',
    groomEventMapLink: '',

    // Tradition / religion builder
    religion: '',
    templateId: '',
    layout: 'centered-symmetric',
    fontPair: 'serif-script',
    accentColor: '',
    motif: '',
    customBackground: '',
    cardPhoto: '',
    groomName: '',
    brideName: '',
    nakshatra: '',
    gothram: '',
    officiantName: '',
    mehr: '',
    showCrossMotif: false,

    // Template & customization
    selectedTemplateId: '',
    sectionVisibility: getDefaultSectionVisibility(),

    // AI-generated background
    aiBackgroundStyle: '',
    useAiBackground: false,

    // Meta (client-side for now)
    planTier: 'free',

    ...overrides
  };
}

/** Placeholder title by event type */
export function getPlaceholderTitle(type, names) {
  const mainNames = names || 'Host Name';
  switch (type) {
    case 'wedding':
      return `The Wedding of ${mainNames}`;
    case 'birthday':
      return `${mainNames}'s Birthday Celebration`;
    case 'housewarming':
      return `${mainNames}'s Griha Pravesham`;
    case 'anniversary':
      return `${mainNames}'s Anniversary Celebration`;
    case 'religious':
      return `Religious Function — ${mainNames}`;
    case 'corporate':
      return `${mainNames} — Corporate Event`;
    default:
      return `${mainNames} Invites You!`;
  }
}

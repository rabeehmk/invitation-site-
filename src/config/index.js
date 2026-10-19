/**
 * Central template registry — merge all religion templates.
 */
import { HINDU_TEMPLATES } from './templates/hindu.js';
import { MUSLIM_TEMPLATES } from './templates/muslim.js';
import { CHRISTIAN_TEMPLATES } from './templates/christian.js';
import { SIKH_TEMPLATES } from './templates/sikh.js';
import { CUSTOM_TEMPLATES } from './templates/custom.js';
import { getReligion, FONT_PAIRS, MOTIF_OPTIONS, ACCENT_PRESETS } from './religions.js';
import { resolveLayoutStructure } from './layoutStructures.js';
import { getPresetForReligion } from '../data/weddingPresets.js';

export const ALL_TEMPLATES = [
  ...HINDU_TEMPLATES,
  ...MUSLIM_TEMPLATES,
  ...CHRISTIAN_TEMPLATES,
  ...SIKH_TEMPLATES,
  ...CUSTOM_TEMPLATES
];

export function getTemplatesForReligion(religionId) {
  return ALL_TEMPLATES.filter((t) => t.religion === religionId);
}

export function getTemplateById(templateId) {
  return ALL_TEMPLATES.find((t) => t.id === templateId) || null;
}

/** Build default invitation state from religion + template selection with authentic preset data */
export function createTraditionInvitation(religionId, templateId, overrides = {}) {
  const religion = getReligion(religionId);
  const template = getTemplateById(templateId) || getTemplatesForReligion(religionId)[0];
  const preset = getPresetForReligion(religionId);

  const groomName = overrides.groomName !== undefined ? overrides.groomName : preset.groomName;
  const brideName = overrides.brideName !== undefined ? overrides.brideName : preset.brideName;
  const hostNames = overrides.hostNames || [groomName, brideName].filter(Boolean).join(' & ') || preset.names;

  return {
    // Tradition meta
    religion: religionId,
    templateId: template?.id || '',
    layoutStructure: template?.layoutStructure || resolveLayoutStructure(template),
    layout: template?.layout || 'centered-symmetric',
    fontPair: template?.fontPair || 'serif-script',
    accentColor: template?.palette?.primary || religion.defaultPalette.primary,
    motif: template?.motifs?.[0] || religion.motifs[0],
    customBackground: '',
    cardPhoto: '',

    // Core (maps to existing serializer)
    theme: template?.theme || 'dark-gold',
    eventType: religion.eventType,
    names: hostNames,
    groomName,
    brideName,
    title: overrides.eventTitle || `${hostNames} — ${religion.label} Wedding Invitation`,
    date: overrides.muhurthamDate || overrides.nikahDate || overrides.matrimonyDate || overrides.anandKarajDate || overrides.eventDate || overrides.date || preset.date,
    endDate: overrides.endDate || preset.endDate || '',
    venueName: overrides.templeVenue || overrides.mosqueVenue || overrides.churchName || overrides.gurdwaraName || overrides.venueName || preset.venueName,
    venue: overrides.venue || preset.venue,
    message: overrides.message || template?.defaultMessage || preset.message,
    coupleStory: overrides.coupleStory || preset.coupleStory || '',
    blessingText: overrides.blessingText || preset.blessingText || '',
    mapLink: overrides.mapLink || preset.mapLink || '',

    // Extended Wedding Details
    dressCode: overrides.dressCode || preset.dressCode || '',
    giftNote: overrides.giftNote || preset.giftNote || '',
    liveStreamUrl: overrides.liveStreamUrl || preset.liveStreamUrl || '',
    accommodationInfo: overrides.accommodationInfo || preset.accommodationInfo || '',
    ceremonyRituals: overrides.ceremonyRituals || '',

    // Parents & auspicious
    parentsGroom: overrides.groomParents || overrides.parentsGroom || preset.parentsGroom || '',
    parentsBride: overrides.brideParents || overrides.parentsBride || preset.parentsBride || '',
    familyGroom: overrides.familyGroom || preset.familyGroom || '',
    familyBride: overrides.familyBride || preset.familyBride || '',
    nakshatra: overrides.nakshatra || preset.nakshatra || '',
    gothram: overrides.gothram || preset.gothram || '',
    officiantName: overrides.officiantName || preset.officiantName || '',
    mehr: overrides.mehr || preset.mehr || '',
    showCrossMotif: overrides.showCrossMotif !== undefined ? overrides.showCrossMotif : preset.showCrossMotif || false,

    // Contacts
    contactName: overrides.contactName || preset.contactName || '',
    contactPhone: overrides.contactPhone || preset.contactPhone || '',
    schedule: overrides.schedule || preset.schedule || [],

    // Media
    presetIdx: 0,
    isUploaded: false,
    uploadedPhoto: '',
    bridePhoto: '',
    groomPhoto: '',
    galleryPhotos: overrides.galleryPhotos || preset.galleryPhotos || [],
    customAudioUrl: '',
    audioTrack: preset.audioTrack || 'romantic-piano',
    audioEnabled: true,

    // Locale
    language: religion.defaultLanguage || 'en',
    bilingual: false,
    secondaryLanguage: 'en',
    font: 'serif',
    showHijriDate: template?.structure?.showHijri ?? preset.showHijriDate ?? (religionId === 'muslim'),

    // Features
    rsvpEnabled: true,
    rsvpPhone: overrides.rsvpPhone || preset.rsvpPhone || '',
    mealPreferenceEnabled: religionId !== 'custom',
    guestbookEnabled: true,

    // Travel
    nearestStation: overrides.nearestStation || preset.nearestStation || '',
    nearestBusStand: overrides.nearestBusStand || preset.nearestBusStand || '',
    emergencyContact: overrides.emergencyContact || preset.emergencyContact || '',
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

    // Customization
    selectedTemplateId: template?.id || '',
    sectionVisibility: {
      showCountdown: true,
      showSchedule: true,
      showTravel: true,
      showBrideGroomEvents: true,
      showRsvp: true,
      showGuestbook: true,
      showSelfieBooth: religionId !== 'custom',
      showFamilyDetails: true,
      showScrollCouple: religionId === 'christian',
      showBlessing: religionId !== 'custom',
      showCoupleStory: true,
      showGallery: true,
      showDressCode: true,
      showGiftNote: true,
      showLiveStream: true,
      showAccommodation: true
    },

    planTier: 'free',
    ...overrides
  };
}

export { getReligion, FONT_PAIRS, MOTIF_OPTIONS, ACCENT_PRESETS, ALL_TEMPLATES as TEMPLATES };
export { LAYOUT_STRUCTURES, resolveLayoutStructure } from './layoutStructures.js';
export { getReligionLabels } from './religionLabels.js';

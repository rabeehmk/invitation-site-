import { getPresetImageUrl } from '../../utils/helpers';
import { getReligionLabels } from '../../config/religionLabels';
import { resolveLayoutStructure } from '../../config/layoutStructures';
import { getTemplateById } from '../../config/index';
import { FONT_PAIRS } from '../../config/religions';
import { ensureReadableColor, isLightBackground } from '../../utils/colorUtils';

/** Photo priority: upload → bride → groom → preset/cover → null */
export function shouldUseCoupleAnimation(state) {
  return (
    state.religion === 'christian' &&
    !state.bridePhoto &&
    !state.groomPhoto &&
    !(state.isUploaded && state.uploadedPhoto)
  );
}

export function resolvePageBackground(state) {
  return state.customBackground || '';
}

/** Inline styles for host-uploaded page background */
export function buildPageBackgroundStyle(pageBg) {
  if (!pageBg) return {};
  return {
    backgroundImage: `url(${pageBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed'
  };
}

export function pageBackgroundClass(pageBg) {
  return pageBg ? 'layout-has-page-bg' : '';
}

export function resolveCardPhoto(state, coverPhotoUrl) {
  if (state.cardPhoto) return state.cardPhoto;
  return resolveHeroPhoto(state, coverPhotoUrl);
}

export function resolveHeroPhoto(state, coverPhotoUrl) {
  if (shouldUseCoupleAnimation(state)) return null;
  if (state.isUploaded && state.uploadedPhoto) return state.uploadedPhoto;
  if (state.cardPhoto && !state.isUploaded) return state.cardPhoto;
  if (state.bridePhoto && state.groomPhoto) return state.bridePhoto;
  if (state.bridePhoto) return state.bridePhoto;
  if (state.groomPhoto) return state.groomPhoto;
  if (coverPhotoUrl) return coverPhotoUrl;
  return getPresetImageUrl(state.eventType || 'wedding', state.presetIdx || 0);
}

/** Groom photo to pair with the bride's — only when the bride's photo is the one being shown */
export function resolveSecondaryPhoto(state, primary) {
  if (
    state.groomPhoto &&
    state.bridePhoto &&
    state.groomPhoto !== state.bridePhoto &&
    primary === state.bridePhoto
  ) {
    return state.groomPhoto;
  }
  return null;
}

export function useLayoutContext(state, template, hijriDate, hasFamilyDetails) {
  const tpl = template || getTemplateById(state.templateId || state.selectedTemplateId);
  const structure = resolveLayoutStructure(tpl);
  const baseLabels = getReligionLabels(state.religion || 'custom');
  // A family's own invitation leads with its function name (e.g. "Walima at Bride's Home")
  const labels = state.sideEventName
    ? { ...baseLabels, ceremonyName: state.sideEventName, invitationBadge: state.sideEventName }
    : baseLabels;
  const fonts = FONT_PAIRS[state.fontPair || tpl?.fontPair] || FONT_PAIRS['serif-script'];
  const palette = tpl?.palette || {};
  const accent = ensureReadableColor(
    state.accentColor || palette.primary || '#D4AF37',
    palette.bg,
    [palette.secondary, palette.primary],
    // Dark pages need a stronger minimum; light pages keep deliberate soft pairings
    isLightBackground(palette.bg) ? 1.8 : 3
  );

  return {
    template: tpl,
    structure,
    labels,
    fonts,
    accent,
    palette,
    motif: state.motif || tpl?.motifs?.[0] || 'minimal',
    hijriDate,
    hasFamilyDetails,
    showHijri: state.showHijriDate && hijriDate
  };
}

export function formatProseDate(dateStr, language = 'en') {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

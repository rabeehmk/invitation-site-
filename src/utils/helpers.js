/**
 * Curated Preset Images from Unsplash (Premium Quality)
 */
import { createDefaultInvitation } from '../data/invitationModel.js';
import { getDefaultSectionVisibility } from '../data/templates.js';
import { resolveLayoutStructure } from '../config/layoutStructures.js';
import { getTemplateById } from '../config/index.js';
import { getReligion } from '../config/religions.js';
import { WEDDING_PRESETS } from '../data/weddingPresets.js';

const VALID_THEMES = ['dark-gold', 'rose-ivory', 'sage-cream', 'modern-gradient', 'classic-burgundy'];
const MAX_URL_PHOTO_LEN = 9000;
const MAX_SHARE_URL_LEN = 60000;

/* ---------- Cloud short links (Netlify function + Blobs) ---------- */
const CLOUD_API = '/api/invite';
const CLOUD_ID_PATTERN = /^[a-z0-9]{10}$/;
const MAX_CLOUD_AUDIO_BYTES = 2.5 * 1024 * 1024;

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/** An uploaded song only exists in this browser (blob:) — embed it so guests can hear it */
async function embedUploadedAudio(state) {
  const url = state.customAudioUrl || '';
  if (!url.startsWith('blob:')) return state;
  try {
    const blob = await (await fetch(url)).blob();
    if (blob.size > MAX_CLOUD_AUDIO_BYTES) return { ...state, customAudioUrl: '', audioTooLarge: true };
    return { ...state, customAudioUrl: await blobToDataUrl(blob) };
  } catch {
    return { ...state, customAudioUrl: '' };
  }
}

/** Saves the invitation online; returns its short id, or null when the cloud is unavailable */
async function saveInvitationToCloud(state) {
  try {
    const res = await fetch(CLOUD_API, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ state })
    });
    if (!res.ok) return null;
    const { id } = await res.json();
    return CLOUD_ID_PATTERN.test(id) ? id : null;
  } catch {
    return null;
  }
}

async function loadInvitationFromCloud(id) {
  if (!CLOUD_ID_PATTERN.test(id)) return null;
  try {
    const res = await fetch(`${CLOUD_API}?id=${id}`);
    if (!res.ok) return null;
    const { state } = await res.json();
    return state ? normalizeInvitationState(state) : null;
  } catch {
    return null;
  }
}

/** Compress a data-URL image for URL embedding */
export function compressDataUrl(dataUrl, maxWidth = 480, maxHeight = 480, quality = 0.62, force = false) {
  if (!dataUrl || !dataUrl.startsWith('data:image')) {
    return Promise.resolve(dataUrl || '');
  }
  if (!force && dataUrl.length <= MAX_URL_PHOTO_LEN) {
    return Promise.resolve(dataUrl);
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve('');
    img.src = dataUrl;
  });
}

/** Shrink all embedded photos so share links keep custom images cross-device */
export async function preparePhotosForPublish(state) {
  const next = { ...state };

  const shrink = async (key, w, h, q) => {
    if (!next[key]?.startsWith('data:image')) return;
    next[key] = await compressDataUrl(next[key], w, h, q, true);
  };

  await shrink('bridePhoto', 400, 500, 0.7);
  await shrink('groomPhoto', 400, 500, 0.7);
  await shrink('uploadedPhoto', 560, 560, 0.65);
  await shrink('cardPhoto', 560, 560, 0.65);
  await shrink('customBackground', 800, 540, 0.55);

  if (Array.isArray(next.galleryPhotos)) {
    const compressed = [];
    for (const photo of next.galleryPhotos.slice(0, 6)) {
      if (photo?.startsWith('data:image')) {
        compressed.push(await compressDataUrl(photo, 480, 480, 0.6, true));
      }
    }
    next.galleryPhotos = compressed.filter(Boolean);
  }

  if (next.isUploaded && !next.uploadedPhoto) {
    next.isUploaded = false;
  }

  return next;
}

/** Strip oversized base64 from URL payload — prevents broken share links */
function trimPhotosForUrl(state) {
  const trim = (v) => (v && v.length > MAX_URL_PHOTO_LEN ? '' : v || '');
  return {
    ...state,
    uploadedPhoto: trim(state.uploadedPhoto),
    isUploaded: state.isUploaded && !!trim(state.uploadedPhoto),
    bridePhoto: trim(state.bridePhoto),
    groomPhoto: trim(state.groomPhoto),
    customBackground: trim(state.customBackground),
    cardPhoto: trim(state.cardPhoto),
    galleryPhotos: (state.galleryPhotos || []).map(trim).filter(Boolean).slice(0, 6)
  };
}

/** Fill missing tradition/theme defaults so guest cards always render */
export function normalizeInvitationState(state) {
  if (!state) return null;

  const template = getTemplateById(state.templateId || state.selectedTemplateId);
  const religion = state.religion ? getReligion(state.religion) : null;

  const theme =
    VALID_THEMES.includes(state.theme)
      ? state.theme
      : VALID_THEMES.includes(template?.theme)
        ? template.theme
        : 'dark-gold';

  let names = state.names || '';
  if (!names.trim() && (state.groomName || state.brideName)) {
    names = [state.groomName, state.brideName].filter(Boolean).join(' & ');
  }

  return {
    ...state,
    theme,
    names,
    religion: state.religion || '',
    templateId: state.templateId || state.selectedTemplateId || template?.id || '',
    selectedTemplateId: state.selectedTemplateId || state.templateId || template?.id || '',
    layoutStructure: state.layoutStructure || template?.layoutStructure || resolveLayoutStructure(template),
    fontPair: state.fontPair || template?.fontPair || 'serif-script',
    accentColor:
      state.accentColor ||
      template?.palette?.primary ||
      religion?.defaultPalette?.primary ||
      '#D4AF37',
    motif: state.motif || template?.motifs?.[0] || religion?.motifs?.[0] || 'minimal',
    title: state.title || names || 'Invitation',
    message: state.message || template?.defaultMessage || '',
    dressCode: state.dressCode || '',
    giftNote: state.giftNote || '',
    liveStreamUrl: state.liveStreamUrl || '',
    accommodationInfo: state.accommodationInfo || '',
    ceremonyRituals: state.ceremonyRituals || ''
  };
}

/** Fallback couple image when local animation frames are unavailable */
export const DEFAULT_COUPLE_FALLBACK =
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80';

export const EVENT_PRESETS = {
  wedding: [
    {
      id: 'wedding-1',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
      label: 'Elegant White Arch'
    },
    {
      id: 'wedding-2',
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80',
      label: 'Joyous Couple'
    },
    {
      id: 'wedding-3',
      url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80',
      label: 'Sparklers Dance'
    },
    {
      id: 'wedding-4',
      url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=800&auto=format&fit=crop&q=80',
      label: 'Champagne Toast'
    }
  ],
  birthday: [
    {
      id: 'birthday-1',
      url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&auto=format&fit=crop&q=80',
      label: 'Colorful Balloons'
    },
    {
      id: 'birthday-2',
      url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&auto=format&fit=crop&q=80',
      label: 'Cake & Sparkler'
    },
    {
      id: 'birthday-3',
      url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80',
      label: 'Party Lights'
    },
    {
      id: 'birthday-4',
      url: 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=800&auto=format&fit=crop&q=80',
      label: 'Warm Glitter'
    }
  ],
  housewarming: [
    {
      id: 'house-1',
      url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
      label: 'Bright Sunlit Room'
    },
    {
      id: 'house-2',
      url: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&auto=format&fit=crop&q=80',
      label: 'Cozy Living Area'
    },
    {
      id: 'house-3',
      url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=80',
      label: 'New House Keys'
    },
    {
      id: 'house-4',
      url: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&auto=format&fit=crop&q=80',
      label: 'Modern Pool Terrace'
    }
  ],
  party: [
    {
      id: 'party-1',
      url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop&q=80',
      label: 'Lively Celebration'
    },
    {
      id: 'party-2',
      url: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&auto=format&fit=crop&q=80',
      label: 'Bar Cocktails'
    },
    {
      id: 'party-3',
      url: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&auto=format&fit=crop&q=80',
      label: 'Plentiful Catering'
    },
    {
      id: 'party-4',
      url: 'https://images.unsplash.com/photo-1496024840928-4c417adf211d?w=800&auto=format&fit=crop&q=80',
      label: 'Cozy Table Dinner'
    }
  ]
};

/**
 * Curated Premium Background Audio Tracks — see data/musicLibrary.js for full catalog
 */
export { AUDIO_TRACKS, MUSIC_TRACKS, getMusicTrack } from '../data/musicLibrary.js';

/**
 * Returns all presets in a flat array or filters by type
 */
export const getPresetImageUrl = (type, index = 0) => {
  const category = EVENT_PRESETS[type] || EVENT_PRESETS.wedding;
  return category[index % category.length].url;
};

/**
 * Compress image using Canvas API client-side
 * Resizes the image to maximum dimensions and compresses quality to limit payload size
 */
export const compressImage = (file, maxWidth = 320, maxHeight = 320, quality = 0.5) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio resizing
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Export as JPEG with lower quality
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

/**
 * Serialize JSON state into a compressed Base64 string for URL hash
 */
export const serializeState = (state) => {
  try {
    const safe = trimPhotosForUrl(state);
    // Keep only essential fields to minimize URL size
    const essentialState = {
      t: safe.theme,
      ty: safe.eventType,
      n: safe.names,
      ti: safe.title,
      d: safe.date,
      ed: safe.endDate || '',
      vn: safe.venueName || '',
      v: safe.venue,
      m: safe.message,
      ml: safe.mapLink,
      re: safe.rsvpEnabled,
      rp: safe.rsvpPhone,
      pi: safe.presetIdx,
      isU: safe.isUploaded,
      up: safe.isUploaded ? safe.uploadedPhoto : null,
      brp: safe.bridePhoto || null,
      grp: safe.groomPhoto || null,
      au: safe.audioTrack || 'none',
      ae: safe.audioEnabled !== undefined ? safe.audioEnabled : true,
      cau: safe.customAudioUrl?.startsWith('http') ? safe.customAudioUrl : '',
      mst: Number(safe.musicStartAt) || 0,
      mv: safe.musicVolume ?? 70,
      mfi: safe.musicFadeIn !== false,
      // Envelope intro
      es: safe.envelopeStyle || 'royal',
      ept: safe.envelopePrompt || '',
      eh: safe.envelopeHint ?? null,
      elt: safe.envelopeLetterText || '',
      // People
      pg: safe.parentsGroom || '',
      pb: safe.parentsBride || '',
      fg: safe.familyGroom || '',
      fb: safe.familyBride || '',
      cn: safe.contactName || '',
      cp: safe.contactPhone || '',
      // Schedule (compact)
      sch: (safe.schedule || []).map((e) => ({
        i: e.id,
        p: e.presetId,
        n: e.name,
        d: e.date,
        et: e.endTime,
        v: e.venue,
        a: e.address,
        m: e.mapLink
      })),
      // Design & locale
      lg: safe.language || 'en',
      bi: safe.bilingual || false,
      sl: safe.secondaryLanguage || 'ml',
      ft: safe.font || 'serif',
      hj: safe.showHijriDate || false,
      // Features
      mp: safe.mealPreferenceEnabled || false,
      gb: safe.guestbookEnabled !== false,
      // Travel
      nst: safe.nearestStation || '',
      nbs: safe.nearestBusStand || '',
      ec: safe.emergencyContact || '',
      bsc: safe.brideSideContact || '',
      gsc: safe.groomSideContact || '',
      ben: safe.brideEventName || '',
      bev: safe.brideEventVenue || '',
      bea: safe.brideEventAddress || '',
      bem: safe.brideEventMapLink || '',
      gen: safe.groomEventName || '',
      gev: safe.groomEventVenue || '',
      gea: safe.groomEventAddress || '',
      gem: safe.groomEventMapLink || '',
      tpl: safe.selectedTemplateId || safe.templateId || '',
      sv: safe.sectionVisibility || null,
      // Tradition / religion builder
      rel: safe.religion || '',
      lay: safe.layout || '',
      ls: safe.layoutStructure || '',
      fp: safe.fontPair || '',
      ac: safe.accentColor || '',
      mot: safe.motif || '',
      cbg: safe.customBackground || '',
      chp: safe.cardPhoto || '',
      gn: safe.groomName || '',
      bn: safe.brideName || '',
      nk: safe.nakshatra || '',
      gt: safe.gothram || '',
      of: safe.officiantName || '',
      mr: safe.mehr || '',
      scm: safe.showCrossMotif || false,
      // AI bg
      abs: safe.aiBackgroundStyle || '',
      uab: safe.useAiBackground || false,
      cs: safe.coupleStory || '',
      bt: safe.blessingText || '',
      gal: (safe.galleryPhotos || []).slice(0, 6),
      dc: safe.dressCode || '',
      gnote: safe.giftNote || '',
      lsu: safe.liveStreamUrl || '',
      acc: safe.accommodationInfo || '',
      cr: safe.ceremonyRituals || '',
      // Bride's / groom's family invitation
      is: safe.inviteSide && safe.inviteSide !== 'joint' ? safe.inviteSide : '',
      bed: safe.brideEventDate || '',
      ged: safe.groomEventDate || '',
      bmsg: safe.brideMessage || '',
      gmsg: safe.groomMessage || ''
    };

    const jsonStr = JSON.stringify(essentialState);
    const base64 = btoa(
      encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (_, p1) =>
        String.fromCharCode(parseInt(p1, 16))
      )
    );
    // URL-safe encoding so hash links never break routing
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch (error) {
    console.error('Failed to serialize invitation state:', error);
    return '';
  }
};

const STORAGE_PREFIX = 'aura_inv_';
const STORAGE_HASH_PREFIX = 'aura_inv_hash_';

function generateInviteId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

function getAppBaseUrl() {
  return `${window.location.origin}${window.location.pathname.replace(/\/$/, '') || ''}`;
}

/** Clean hash route payload (strip tracking query params) */
export function cleanRoutePayload(raw) {
  if (!raw) return '';
  try {
    return decodeURIComponent(raw).split('?')[0].split('&')[0].trim();
  } catch {
    return raw.split('?')[0].split('&')[0].trim();
  }
}

function savePublishedInvitation(id, hash, state) {
  const payload = {
    id,
    hash,
    state: normalizeInvitationState(state),
    savedAt: new Date().toISOString()
  };
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${id}`, JSON.stringify(payload));
    if (hash) {
      localStorage.setItem(`${STORAGE_HASH_PREFIX}${hash}`, JSON.stringify(payload));
    }
  } catch (err) {
    console.warn('Could not cache invitation locally:', err);
  }
  return payload;
}

function loadPublishedFromStorage(id) {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${id}`);
    if (!raw) return null;
    const payload = JSON.parse(raw);
    return normalizeInvitationState(payload.state);
  } catch {
    return null;
  }
}

function loadPublishedByHash(hash) {
  try {
    const raw = localStorage.getItem(`${STORAGE_HASH_PREFIX}${hash}`);
    if (!raw) return null;
    const payload = JSON.parse(raw);
    return normalizeInvitationState(payload.state);
  } catch {
    return null;
  }
}

/**
 * Publish invitation — returns share URLs and caches data locally as fallback.
 */
export async function publishInvitation(state) {
  const normalized = normalizeInvitationState(state);
  if (!normalized) {
    return { ok: false, error: 'Invalid invitation data' };
  }

  const withPhotos = await preparePhotosForPublish(normalized);
  const serializedHash = serializeState(withPhotos);
  if (!serializedHash) {
    return { ok: false, error: 'Could not encode invitation. Remove large photos and try again.' };
  }

  const id = generateInviteId();
  savePublishedInvitation(id, serializedHash, withPhotos);

  const base = getAppBaseUrl();
  const hashUrl = `${base}#/i/${serializedHash}`;
  const shortUrl = `${base}#/i/s/${id}`;

  // Preferred: store online and share a short link that opens on any phone.
  // Cloud copies keep the sharper (pre-link-compression) photos and uploaded music.
  let cloudState = await embedUploadedAudio(normalized);
  let cloudId = await saveInvitationToCloud(cloudState);
  if (!cloudId) {
    // Retry with the link-compressed photos in case the full-quality copy was too large
    cloudState = await embedUploadedAudio(withPhotos);
    cloudId = await saveInvitationToCloud(cloudState);
  }
  if (cloudId) {
    const cloudUrl = `${base}#/i/c/${cloudId}`;
    return {
      ok: true,
      id: cloudId,
      hash: serializedHash,
      hashUrl: cloudUrl,
      shortUrl: '',
      shareUrl: cloudUrl,
      isLongUrl: false,
      storage: 'cloud',
      audioTooLarge: !!cloudState.audioTooLarge
    };
  }

  return {
    ok: true,
    id,
    hash: serializedHash,
    hashUrl,
    shortUrl,
    storage: 'link',
    /**
     * The full (hash) link carries the whole invitation, so it opens on any phone.
     * Short links only resolve in the creator's browser (localStorage), so they are
     * a last resort for invitations too big for a WhatsApp message (~65k chars).
     */
    shareUrl: hashUrl.length <= MAX_SHARE_URL_LEN ? hashUrl : shortUrl,
    isLongUrl: hashUrl.length > MAX_SHARE_URL_LEN,
    photosCompressed: true
  };
}

/**
 * Loads an invitation for the guest page; cloud links (#/i/c/{id}) are fetched online.
 */
export async function loadInvitationDataAsync(routeData) {
  const cleaned = cleanRoutePayload(routeData);
  if (cleaned.startsWith('c/')) return loadInvitationFromCloud(cleaned.slice(2));
  return loadInvitationData(routeData);
}

/**
 * Load invitation from URL hash segment — tries decode, then local cache.
 */
export function loadInvitationData(routeData) {
  const cleaned = cleanRoutePayload(routeData);
  if (!cleaned) return null;

  // Short link: #/i/s/{id}
  if (cleaned.startsWith('s/')) {
    const id = cleaned.slice(2);
    const fromShort = loadPublishedFromStorage(id);
    if (fromShort) return fromShort;
    return null;
  }

  // Full encoded hash in URL
  const fromHash = deserializeState(cleaned);
  if (fromHash) return fromHash;

  // Fallback: same browser cache if URL was truncated/corrupted
  return loadPublishedByHash(cleaned) || loadPublishedFromStorage(cleaned);
}

/**
 * Deserialize a compressed Base64 string back into the form state
 */
export const deserializeState = (hashStr) => {
  try {
    if (!hashStr || hashStr.length < 8) return null;
    // Skip short-link ids mistaken for base64
    if (/^s\//.test(hashStr) || /^[a-z0-9]{6,14}$/i.test(hashStr)) return null;

    // Support legacy base64 and new URL-safe base64
    let normalized = hashStr.replace(/-/g, '+').replace(/_/g, '/');
    while (normalized.length % 4) normalized += '=';
    const decodedStr = decodeURIComponent(
      atob(normalized)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const parsed = JSON.parse(decodedStr);

    // Map essential keys back to verbose state keys
    return normalizeInvitationState({
      theme: parsed.t || 'dark-gold',
      eventType: parsed.ty || 'wedding',
      names: parsed.n || '',
      title: parsed.ti || '',
      date: parsed.d || '',
      endDate: parsed.ed || '',
      venueName: parsed.vn || '',
      venue: parsed.v || '',
      message: parsed.m || '',
      mapLink: parsed.ml || '',
      rsvpEnabled: parsed.re !== undefined ? parsed.re : true,
      rsvpPhone: parsed.rp || '',
      presetIdx: parsed.pi !== undefined ? parsed.pi : 0,
      isUploaded: parsed.isU || false,
      uploadedPhoto: parsed.up || '',
      bridePhoto: parsed.brp || '',
      groomPhoto: parsed.grp || '',
      audioTrack: parsed.au || 'none',
      audioEnabled: parsed.ae !== undefined ? parsed.ae : true,
      customAudioUrl: parsed.cau || '',
      musicStartAt: parsed.mst || 0,
      musicVolume: parsed.mv ?? 70,
      musicFadeIn: parsed.mfi !== false,
      envelopeStyle: parsed.es || 'royal',
      envelopePrompt: parsed.ept || '',
      envelopeHint: parsed.eh ?? undefined,
      envelopeLetterText: parsed.elt || '',
      parentsGroom: parsed.pg || '',
      parentsBride: parsed.pb || '',
      familyGroom: parsed.fg || '',
      familyBride: parsed.fb || '',
      contactName: parsed.cn || '',
      contactPhone: parsed.cp || '',
      schedule: (parsed.sch || []).map((e) => ({
        id: e.i || `evt-${Date.now()}`,
        presetId: e.p || 'custom',
        name: e.n || '',
        date: e.d || '',
        endTime: e.et || '',
        venue: e.v || '',
        address: e.a || '',
        mapLink: e.m || ''
      })),
      language: parsed.lg || 'en',
      bilingual: parsed.bi || false,
      secondaryLanguage: parsed.sl || 'ml',
      font: parsed.ft || 'serif',
      showHijriDate: parsed.hj || false,
      mealPreferenceEnabled: parsed.mp || false,
      guestbookEnabled: parsed.gb !== undefined ? parsed.gb : true,
      nearestStation: parsed.nst || '',
      nearestBusStand: parsed.nbs || '',
      emergencyContact: parsed.ec || '',
      brideSideContact: parsed.bsc || '',
      groomSideContact: parsed.gsc || '',
      brideEventName: parsed.ben || '',
      brideEventVenue: parsed.bev || '',
      brideEventAddress: parsed.bea || '',
      brideEventMapLink: parsed.bem || '',
      groomEventName: parsed.gen || '',
      groomEventVenue: parsed.gev || '',
      groomEventAddress: parsed.gea || '',
      groomEventMapLink: parsed.gem || '',
      selectedTemplateId: parsed.tpl || '',
      templateId: parsed.tpl || '',
      sectionVisibility: parsed.sv || getDefaultSectionVisibility(),
      religion: parsed.rel || '',
      layout: parsed.lay || '',
      layoutStructure: parsed.ls || '',
      fontPair: parsed.fp || 'serif-script',
      accentColor: parsed.ac || '',
      motif: parsed.mot || '',
      customBackground: parsed.cbg || '',
      cardPhoto: parsed.chp || '',
      groomName: parsed.gn || '',
      brideName: parsed.bn || '',
      nakshatra: parsed.nk || '',
      gothram: parsed.gt || '',
      officiantName: parsed.of || '',
      mehr: parsed.mr || '',
      showCrossMotif: parsed.scm || false,
      aiBackgroundStyle: parsed.abs || '',
      useAiBackground: parsed.uab || false,
      coupleStory: parsed.cs || '',
      blessingText: parsed.bt || '',
      galleryPhotos: parsed.gal || [],
      dressCode: parsed.dc || '',
      giftNote: parsed.gnote || '',
      liveStreamUrl: parsed.lsu || '',
      accommodationInfo: parsed.acc || '',
      ceremonyRituals: parsed.cr || '',
      inviteSide: parsed.is || 'joint',
      brideEventDate: parsed.bed || '',
      groomEventDate: parsed.ged || '',
      brideMessage: parsed.bmsg || '',
      groomMessage: parsed.gmsg || '',
      planTier: 'free'
    });
  } catch (error) {
    console.error('Failed to deserialize invitation state:', error);
    return null;
  }
};

/**
 * Calculates countdown details
 */
export const getCountdownTime = (targetDateStr) => {
  if (!targetDateStr) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };

  const targetDate = new Date(targetDateStr);
  const now = new Date();
  const diffMs = targetDate - now;

  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }

  const sec = 1000;
  const min = sec * 60;
  const hr = min * 60;
  const day = hr * 24;

  return {
    days: Math.floor(diffMs / day),
    hours: Math.floor((diffMs % day) / hr),
    minutes: Math.floor((diffMs % hr) / min),
    seconds: Math.floor((diffMs % min) / sec),
    expired: false
  };
};

/** Pre-built sample invitation for landing page demo — loads realistic, beautiful Hindu wedding */
export function getSampleInvitationHash() {
  const sample = WEDDING_PRESETS.hindu;
  return serializeState(
    createDefaultInvitation({
      ...sample,
      religion: 'hindu',
      selectedTemplateId: 'hindu-card-kolam',
      templateId: 'hindu-card-kolam',
      layoutStructure: 'card-canvas'
    })
  );
}

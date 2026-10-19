/**
 * Religion / community definitions — field schemas, motifs, palettes.
 * Add new traditions here without touching UI components.
 */

export const RELIGION_IDS = ['hindu', 'muslim', 'christian', 'sikh', 'custom'];

export const RELIGIONS = {
  hindu: {
    id: 'hindu',
    label: 'Hindu',
    labelMl: 'ഹിന്ദു',
    description: 'Kerala & South Indian weddings — Muhurtham, Mehendi, Sangeet, Temple aesthetics',
    icon: '🪔',
    dir: 'ltr',
    defaultLanguage: 'en',
    motifs: ['kalasha', 'kolam', 'temple-arch', 'rangoli'],
    defaultPalette: { primary: '#8B1A1A', secondary: '#D4AF37', bg: '#FFF8F0', text: '#2C1810' },
    ambientAnimation: 'rangoli-shimmer',
    fieldGroups: [
      {
        id: 'couple',
        label: 'Couple',
        fields: [
          { id: 'groomName', label: 'Groom Name', type: 'text', required: true },
          { id: 'brideName', label: 'Bride Name', type: 'text', required: true },
          { id: 'groomParents', label: "Groom — S/o (Parents)", type: 'text', placeholder: 'S/o Shri. ... & Smt. ...' },
          { id: 'brideParents', label: "Bride — D/o (Parents)", type: 'text', placeholder: 'D/o Shri. ... & Smt. ...' }
        ]
      },
      {
        id: 'auspicious',
        label: 'Auspicious Details',
        fields: [
          { id: 'nakshatra', label: 'Nakshatra (optional)', type: 'text' },
          { id: 'gothram', label: 'Gothram (optional)', type: 'text' },
          { id: 'muhurthamDate', label: 'Muhurtham Date & Time', type: 'datetime', required: true },
          { id: 'templeVenue', label: 'Temple / Venue Name', type: 'text' }
        ]
      },
      {
        id: 'subEvents',
        label: 'Sub-Events',
        type: 'schedule',
        presets: ['mehendi', 'sangeet', 'wedding', 'reception']
      }
    ],
    sectionOrder: ['hero', 'family', 'muhurtham', 'schedule', 'venue', 'gallery', 'rsvp', 'guestbook'],
    eventType: 'wedding'
  },

  muslim: {
    id: 'muslim',
    label: 'Muslim',
    labelAr: 'مسلم',
    description: 'Nikah & Walima — Hijri dates, geometric motifs, Arabic RTL support',
    icon: '☪',
    dir: 'ltr',
    defaultLanguage: 'en',
    supportsRtl: true,
    motifs: ['geometric', 'crescent', 'mihrab-arch'],
    defaultPalette: { primary: '#0D5C4B', secondary: '#C9A227', bg: '#F7FAF9', text: '#1A2E28' },
    ambientAnimation: 'geometric-breathe',
    fieldGroups: [
      {
        id: 'couple',
        label: 'Couple',
        fields: [
          { id: 'groomName', label: 'Groom Name', type: 'text', required: true },
          { id: 'brideName', label: 'Bride Name', type: 'text', required: true },
          { id: 'groomParents', label: "Groom — S/o", type: 'text' },
          { id: 'brideParents', label: "Bride — D/o", type: 'text' }
        ]
      },
      {
        id: 'ceremony',
        label: 'Ceremony',
        fields: [
          { id: 'nikahDate', label: 'Nikah Date & Time', type: 'datetime', required: true },
          { id: 'walimaDate', label: 'Walima Date & Time', type: 'datetime' },
          { id: 'mosqueVenue', label: 'Mosque / Venue Name', type: 'text' },
          { id: 'mehr', label: 'Mehr (optional, private)', type: 'text', private: true },
          { id: 'showHijriDate', label: 'Show Hijri Date', type: 'boolean', default: true }
        ]
      },
      {
        id: 'subEvents',
        label: 'Events',
        type: 'schedule',
        presets: ['nikah', 'walima', 'reception']
      }
    ],
    sectionOrder: ['hero', 'family', 'nikah', 'walima', 'venue', 'rsvp', 'guestbook'],
    eventType: 'wedding'
  },

  christian: {
    id: 'christian',
    label: 'Christian',
    description: 'Holy Matrimony — Church elegance, engagement & reception',
    icon: '✝',
    dir: 'ltr',
    defaultLanguage: 'en',
    motifs: ['floral', 'dove', 'cross-subtle', 'botanical'],
    defaultPalette: { primary: '#2C3E6B', secondary: '#C9A87C', bg: '#FDFAF5', text: '#2A2A2A' },
    scrollCoupleAnimation: true,
    ambientAnimation: 'petal-float',
    fieldGroups: [
      {
        id: 'couple',
        label: 'Couple',
        fields: [
          { id: 'groomName', label: 'Groom Name', type: 'text', required: true },
          { id: 'brideName', label: 'Bride Name', type: 'text', required: true },
          { id: 'groomParents', label: "Groom's Parents", type: 'text' },
          { id: 'brideParents', label: "Bride's Parents", type: 'text' }
        ]
      },
      {
        id: 'ceremony',
        label: 'Ceremony',
        fields: [
          { id: 'matrimonyDate', label: 'Holy Matrimony Date & Time', type: 'datetime', required: true },
          { id: 'churchName', label: 'Church Name', type: 'text', required: true },
          { id: 'officiantName', label: 'Officiant Name (optional)', type: 'text' },
          { id: 'showCrossMotif', label: 'Show Cross/Dove Motif', type: 'boolean', default: false }
        ]
      },
      {
        id: 'subEvents',
        label: 'Events',
        type: 'schedule',
        presets: ['engagement', 'holy-matrimony', 'reception']
      }
    ],
    sectionOrder: ['hero', 'family', 'matrimony', 'schedule', 'venue', 'rsvp', 'guestbook'],
    eventType: 'wedding'
  },

  sikh: {
    id: 'sikh',
    label: 'Sikh',
    labelPa: 'ਸਿੱਖ',
    description: 'Anand Karaj — saffron & navy palette, Khanda motifs, Gurdwara ceremony',
    icon: '☬',
    dir: 'ltr',
    defaultLanguage: 'en',
    motifs: ['khanda', 'floral', 'minimal'],
    defaultPalette: { primary: '#E87722', secondary: '#1B2A4A', bg: '#FFF9F0', text: '#1A202C' },
    ambientAnimation: 'geometric-breathe',
    fieldGroups: [
      {
        id: 'couple',
        label: 'Couple',
        fields: [
          { id: 'groomName', label: 'Groom Name', type: 'text', required: true },
          { id: 'brideName', label: 'Bride Name', type: 'text', required: true },
          { id: 'groomParents', label: "Groom — S/o", type: 'text' },
          { id: 'brideParents', label: "Bride — D/o", type: 'text' }
        ]
      },
      {
        id: 'ceremony',
        label: 'Anand Karaj',
        fields: [
          { id: 'anandKarajDate', label: 'Anand Karaj Date & Time', type: 'datetime', required: true },
          { id: 'gurdwaraName', label: 'Gurdwara Name', type: 'text', required: true },
          { id: 'granthiName', label: 'Granthi Name (optional)', type: 'text' }
        ]
      },
      {
        id: 'subEvents',
        label: 'Events',
        type: 'schedule',
        presets: ['anand-karaj', 'reception', 'ladies-sangeet']
      }
    ],
    sectionOrder: ['hero', 'family', 'anand-karaj', 'schedule', 'venue', 'gallery', 'rsvp', 'guestbook'],
    eventType: 'wedding'
  },

  custom: {
    id: 'custom',
    label: 'Other / Custom',
    description: 'Birthdays, housewarming, corporate — neutral, fully flexible',
    icon: '✨',
    dir: 'ltr',
    defaultLanguage: 'en',
    motifs: ['minimal', 'geometric-neutral'],
    defaultPalette: { primary: '#4A5568', secondary: '#BDA06D', bg: '#FFFFFF', text: '#1A202C' },
    ambientAnimation: 'none',
    fieldGroups: [
      {
        id: 'event',
        label: 'Event Details',
        fields: [
          { id: 'hostNames', label: 'Host Name(s)', type: 'text', required: true },
          { id: 'eventTitle', label: 'Event Title', type: 'text', required: true },
          { id: 'eventDate', label: 'Date & Time', type: 'datetime', required: true },
          { id: 'venueName', label: 'Venue', type: 'text' }
        ]
      }
    ],
    sectionOrder: ['hero', 'details', 'venue', 'rsvp', 'guestbook'],
    eventType: 'party'
  }
};

export function getReligion(id) {
  return RELIGIONS[id] || RELIGIONS.custom;
}

export const LAYOUT_TYPES = {
  'full-bleed': { label: 'Full-Bleed Photo', description: 'Cinema poster hero' },
  split: { label: 'Split Screen', description: 'Fixed panel + scroll column' },
  'card-canvas': { label: 'Card on Canvas', description: 'Physical invite card' },
  'typography-minimal': { label: 'Typography Minimal', description: 'Stationery type-led' },
  illustrated: { label: 'Illustrated Scene', description: 'Storybook frame' },
  /* legacy */
  'centered-symmetric': { label: 'Card on Canvas', description: 'Classic balanced layout' },
  'asymmetric-modern': { label: 'Split Screen', description: 'Editorial offset columns' },
  'full-photo-bg': { label: 'Full-Bleed Photo', description: 'Immersive photo hero' },
  'illustration-heavy': { label: 'Illustrated Scene', description: 'Motif-rich decorative' }
};

export const FONT_PAIRS = {
  'serif-script': { heading: 'var(--font-serif)', body: 'var(--font-sans)', accent: 'var(--font-script)' },
  'display-modern': { heading: 'var(--font-display)', body: 'var(--font-modern)', accent: 'var(--font-display)' },
  'arabic-elegant': { heading: 'var(--font-arabic)', body: 'var(--font-arabic)', accent: 'var(--font-serif)' }
};

export const MOTIF_OPTIONS = {
  hindu: [
    { id: 'kalasha', label: 'Kalasha' },
    { id: 'kolam', label: 'Kolam / Rangoli' },
    { id: 'temple-arch', label: 'Temple Arch' },
    { id: 'coconut-leaf', label: 'Coconut & Banana Leaf' }
  ],
  muslim: [
    { id: 'geometric', label: 'Geometric Pattern' },
    { id: 'crescent', label: 'Crescent & Star' },
    { id: 'mihrab-arch', label: 'Mihrab Arch' }
  ],
  christian: [
    { id: 'floral', label: 'Floral Botanical' },
    { id: 'dove', label: 'Dove Accent' },
    { id: 'cross-subtle', label: 'Subtle Cross' }
  ],
  custom: [{ id: 'minimal', label: 'Minimal Lines' }]
};

export const ACCENT_PRESETS = {
  hindu: ['#8B1A1A', '#D4AF37', '#2D5016', '#C48B7F'],
  muslim: ['#0D5C4B', '#1A6B5C', '#C9A227', '#2C5282'],
  christian: ['#2C3E6B', '#C9A87C', '#C48B7F', '#5E6F5C'],
  custom: ['#4A5568', '#BDA06D', '#E024A5', '#5E6F5C']
};

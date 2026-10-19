/**
 * Background music library — royalty-free tracks for invitation cards.
 * Users can also paste a direct MP3 URL or upload their own file (preview/local).
 */

export const MUSIC_CATEGORIES = [
  { id: 'all', label: 'All Tracks' },
  { id: 'wedding', label: 'Wedding & Romantic' },
  { id: 'classical', label: 'Classical & Piano' },
  { id: 'ambient', label: 'Ambient & Chill' },
  { id: 'celebration', label: 'Celebration & Upbeat' },
  { id: 'spiritual', label: 'Spiritual & Devotional' },
  { id: 'indian', label: 'Indian Fusion' }
];

const helix = (n) => `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${n}.mp3`;

export const MUSIC_TRACKS = [
  { id: 'none', label: 'No Music', category: 'all', url: '', mood: 'Silent' },

  // Wedding & Romantic
  { id: 'romantic-piano', label: 'Romantic Piano', category: 'wedding', url: helix(1), mood: 'Soft & elegant' },
  { id: 'love-strings', label: 'Love Strings', category: 'wedding', url: helix(2), mood: 'Warm strings' },
  { id: 'golden-vows', label: 'Golden Vows', category: 'wedding', url: helix(3), mood: 'Ceremony feel' },
  { id: 'first-dance', label: 'First Dance', category: 'wedding', url: helix(4), mood: 'Slow romantic' },
  { id: 'wedding-march', label: 'Wedding March Soft', category: 'wedding', url: helix(5), mood: 'Processional' },
  { id: 'heartstrings', label: 'Heartstrings', category: 'wedding', url: helix(6), mood: 'Emotional' },

  // Classical & Piano
  { id: 'classical-piano', label: 'Classical Piano', category: 'classical', url: helix(7), mood: 'Timeless' },
  { id: 'nocturne', label: 'Evening Nocturne', category: 'classical', url: helix(8), mood: 'Calm night' },
  { id: 'sonata', label: 'Soft Sonata', category: 'classical', url: helix(9), mood: 'Refined' },
  { id: 'harpsichord', label: 'Light Harpsichord', category: 'classical', url: helix(10), mood: 'Baroque touch' },

  // Ambient & Chill
  { id: 'cafe-acoustic', label: 'Cafe Acoustic', category: 'ambient', url: helix(11), mood: 'Relaxed' },
  { id: 'chill-lounge', label: 'Chill Lounge', category: 'ambient', url: helix(12), mood: 'Lounge vibes' },
  { id: 'moonlight', label: 'Moonlight Ambient', category: 'ambient', url: helix(13), mood: 'Dreamy' },
  { id: 'soft-rain', label: 'Soft Rain Mood', category: 'ambient', url: helix(14), mood: 'Peaceful' },

  // Celebration & Upbeat
  { id: 'upbeat-lofi', label: 'Upbeat Lo-Fi', category: 'celebration', url: helix(15), mood: 'Modern party' },
  { id: 'festive-beat', label: 'Festive Beat', category: 'celebration', url: helix(16), mood: 'Joyful' },
  { id: 'reception-groove', label: 'Reception Groove', category: 'celebration', url: helix(1), mood: 'Dance floor' },
  { id: 'birthday-spark', label: 'Birthday Spark', category: 'celebration', url: helix(2), mood: 'Fun & bright' },

  // Spiritual & Devotional
  { id: 'temple-bells', label: 'Temple Bells Ambient', category: 'spiritual', url: helix(3), mood: 'Hindu ceremony' },
  { id: 'peaceful-naad', label: 'Peaceful Naad', category: 'spiritual', url: helix(4), mood: 'Meditative' },
  { id: 'sacred-harmony', label: 'Sacred Harmony', category: 'spiritual', url: helix(5), mood: 'Church & mosque' },
  { id: 'divine-flute', label: 'Divine Flute', category: 'spiritual', url: helix(6), mood: 'Flute ambient' },

  // Indian Fusion
  { id: 'kerala-wedding', label: 'Kerala Wedding Feel', category: 'indian', url: helix(7), mood: 'South Indian' },
  { id: 'sitar-dream', label: 'Sitar Dream', category: 'indian', url: helix(8), mood: 'Indian classical touch' },
  { id: 'tabla-rhythm', label: 'Tabla Rhythm Soft', category: 'indian', url: helix(9), mood: 'Light percussion' },
  { id: 'mangalam', label: 'Mangalam Mood', category: 'indian', url: helix(10), mood: 'Auspicious' },

  // Custom slot
  { id: 'custom', label: 'Custom Music (URL / Upload)', category: 'all', url: '', mood: 'Your own track' }
];

/** Backward-compatible export used across the app */
export const AUDIO_TRACKS = MUSIC_TRACKS.map(({ id, label, url }) => ({ id, label, url }));

const LEGACY_TRACK_IDS = {
  piano: 'romantic-piano',
  lofi: 'upbeat-lofi',
  acoustic: 'cafe-acoustic',
  lounge: 'chill-lounge'
};

export function getMusicTrack(trackId, customAudioUrl = '', customAudioName = '') {
  const resolvedId = LEGACY_TRACK_IDS[trackId] || trackId;
  if (resolvedId === 'custom' && customAudioUrl) {
    return { id: 'custom', label: customAudioName || 'Custom Music', url: customAudioUrl };
  }
  return MUSIC_TRACKS.find((t) => t.id === resolvedId) || MUSIC_TRACKS[0];
}

export function getTracksByCategory(categoryId) {
  if (!categoryId || categoryId === 'all') return MUSIC_TRACKS.filter((t) => t.id !== 'none');
  return MUSIC_TRACKS.filter((t) => t.category === categoryId || t.id === 'custom');
}

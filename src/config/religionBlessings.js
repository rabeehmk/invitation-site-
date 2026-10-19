/**
 * Religion-specific blessing / scripture / header copy for guest-facing cards.
 */
export const RELIGION_BLESSINGS = {
  hindu: {
    title: 'Shubh Mangal',
    icon: '🪔',
    primary: 'ॐ श्री गणेशाय नमः',
    secondary: 'With the divine blessings of Lord Ganesha, we begin this auspicious journey of togetherness.',
    showGanesh: true
  },
  muslim: {
    title: 'Bismillah',
    icon: '☪',
    primary: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    secondary: 'In the name of Allah, the Most Gracious, the Most Merciful — we invite you to witness our Nikah.',
    rtl: true
  },
  christian: {
    title: 'Blessed Union',
    icon: '✝',
    primary: '"So they are no longer two, but one flesh." — Matthew 19:6',
    secondary: 'We invite you to celebrate with us as we unite before God and our loved ones.'
  },
  sikh: {
    title: 'Anand Karaj',
    icon: '☬',
    primary: 'In the presence of Shri Guru Granth Sahib Ji, we unite in the blissful bond of Anand Karaj.',
    secondary: 'Your presence and blessings will honour our sacred union.'
  },
  custom: {
    title: 'With Love',
    icon: '✦',
    primary: 'We are delighted to share this special moment with you.',
    secondary: ''
  }
};

export function getReligionBlessing(religionId, customText = '') {
  const base = RELIGION_BLESSINGS[religionId] || RELIGION_BLESSINGS.custom;
  if (customText?.trim()) {
    return { ...base, secondary: customText.trim() };
  }
  return base;
}

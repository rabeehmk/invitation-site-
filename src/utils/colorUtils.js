/** Parse #RRGGBB to "r, g, b" for CSS rgba() */
export function hexToRgbString(hex) {
  if (!hex || typeof hex !== 'string') return '212, 175, 55';
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!m) return '212, 175, 55';
  return `${parseInt(m[1], 16)}, ${parseInt(m[2], 16)}, ${parseInt(m[3], 16)}`;
}

/** Light background → use dark translucent cards; dark bg → glass cards */
export function isLightBackground(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '');
  if (!m) return false;
  const r = parseInt(m[1], 16);
  const g = parseInt(m[2], 16);
  const b = parseInt(m[3], 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.62;
}

function relativeLuminance(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '');
  if (!m) return null;
  const [r, g, b] = [m[1], m[2], m[3]].map((h) => {
    const c = parseInt(h, 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two #RRGGBB colours (1–21) */
export function getContrastRatio(a, b) {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  if (la === null || lb === null) return 21;
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Returns `color` if it reads well on `bg`, otherwise the first candidate that
 * does (e.g. a navy accent on a navy page falls back to the palette's gold).
 */
export function ensureReadableColor(color, bg, candidates = [], minRatio = 3) {
  if (!bg || getContrastRatio(color, bg) >= minRatio) return color;
  const match = candidates.find((c) => c && getContrastRatio(c, bg) >= minRatio);
  if (match) return match;
  return isLightBackground(bg) ? '#2A2420' : '#F3E5C0';
}

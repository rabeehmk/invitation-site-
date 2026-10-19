/** Couple PNG frame sequence from public/image (ezgif export) */
export const COUPLE_FRAME_COUNT = 51;
export const COUPLE_FRAME_INTERVAL_MS = 85;
export const SCROLL_TRACK_HEIGHT = '220vh';

export function getCoupleFramePath(frameIndex) {
  const idx = ((frameIndex % COUPLE_FRAME_COUNT) + COUPLE_FRAME_COUNT) % COUPLE_FRAME_COUNT;
  const num = String(idx + 1).padStart(3, '0');
  return `/image/ezgif-frame-${num}.png`;
}

export function progressToFrameIndex(progress) {
  const clamped = Math.min(1, Math.max(0, progress));
  return Math.min(COUPLE_FRAME_COUNT - 1, Math.floor(clamped * (COUPLE_FRAME_COUNT - 1)));
}

export const COUPLE_HERO_STATIC_FRAME = getCoupleFramePath(3);

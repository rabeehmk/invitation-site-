/**
 * Plays an <audio> element using the invitation's music settings:
 * start offset (seconds), target volume (0–100) and an optional fade-in.
 */
export function playMusic(audio, { startAt = 0, volume = 70, fadeIn = true } = {}) {
  if (!audio) return Promise.reject(new Error('No audio element'));

  const target = Math.min(Math.max(Number(volume) || 0, 0), 100) / 100;
  clearInterval(audio._fadeTimer);

  // Only seek on a fresh start so pause/resume keeps its position
  if (startAt > 0 && audio.currentTime === 0) {
    try {
      audio.currentTime = startAt;
    } catch {
      // Seeking before metadata loads can throw in older browsers
    }
  }

  audio.volume = fadeIn ? 0 : target;
  const playing = audio.play();

  if (fadeIn && target > 0) {
    const steps = 30;
    let step = 0;
    audio._fadeTimer = setInterval(() => {
      step += 1;
      audio.volume = Math.min(target, (target * step) / steps);
      if (step >= steps) clearInterval(audio._fadeTimer);
    }, 2500 / steps);
  }

  return playing;
}

export function stopMusic(audio) {
  if (!audio) return;
  clearInterval(audio._fadeTimer);
  audio.pause();
}

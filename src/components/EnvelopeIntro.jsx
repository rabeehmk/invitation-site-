import React from 'react';
import { Music, VolumeX } from 'lucide-react';
import { ENVELOPE_DEFAULTS } from '../config/envelope';

// Deterministic sparkle layout so renders stay pure
const SPARKLES = Array.from({ length: 22 }, (_, i) => ({
  left: `${(i * 37 + 11) % 100}%`,
  top: `${(i * 53 + 7) % 100}%`,
  size: 2 + (i % 3),
  delay: `${(i * 0.37) % 4}s`,
  duration: `${4 + (i % 4)}s`
}));

// Gold shards that fly out when the seal breaks
const SHARDS = Array.from({ length: 10 }, (_, i) => ({
  angle: `${i * 36 + (i % 2) * 14}deg`,
  distance: `${70 + (i % 3) * 26}px`
}));

export default function EnvelopeIntro({
  theme,
  monogram,
  open,
  fading,
  onOpen,
  variant = 'royal',
  prompt,
  hint,
  letterText,
  musicLabel = '',
  soundOn = true,
  onToggleSound
}) {
  const showSound = !!(musicLabel && onToggleSound);
  const hintText = hint ?? ENVELOPE_DEFAULTS.hint;

  return (
    <div
      className={`envelope-wrapper theme-${theme} envelope-wrapper--visible envelope-variant-${variant} ${open ? 'is-open' : ''} ${fading ? 'fade-out' : ''}`}
      onClick={open ? undefined : onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => !open && (e.key === 'Enter' || e.key === ' ') && onOpen()}
      aria-label="Open invitation"
    >
      <div className="envelope-vignette" aria-hidden="true" />
      {variant !== 'minimal' && (
        <div className="envelope-sparkles" aria-hidden="true">
          {SPARKLES.map((s, i) => (
            <span
              key={i}
              style={{
                left: s.left,
                top: s.top,
                width: s.size,
                height: s.size,
                animationDelay: s.delay,
                animationDuration: s.duration
              }}
            />
          ))}
        </div>
      )}

      {showSound && (
        <button
          type="button"
          className={`envelope-sound ${soundOn ? 'is-on' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleSound();
          }}
          onKeyDown={(e) => e.stopPropagation()}
          aria-pressed={soundOn}
          aria-label={soundOn ? 'Music on, tap to mute' : 'Music off, tap to unmute'}
        >
          {soundOn ? (
            <span className="envelope-sound-bars" aria-hidden="true">
              <i /><i /><i />
            </span>
          ) : (
            <VolumeX size={14} />
          )}
          <span className="envelope-sound-label">
            {soundOn ? <><Music size={11} /> {musicLabel}</> : 'Music off'}
          </span>
        </button>
      )}

      <div className="envelope-stage">
        <div className="envelope-glow" aria-hidden="true" />
        {variant === 'royal' && <div className="envelope-rays" aria-hidden="true" />}
        <div className={`envelope-container ${open ? 'open' : ''}`}>
          <div className="envelope-liner" aria-hidden="true" />
          <div className="envelope-letter" aria-hidden="true">
            <span className="envelope-letter-ornament">✦</span>
            <span className="envelope-letter-monogram">{monogram}</span>
            <span className="envelope-letter-line" />
            <span className="envelope-letter-text">{letterText || ENVELOPE_DEFAULTS.letterText}</span>
          </div>
          <div className="envelope-pocket" />
          <div className="envelope-flap" />
          {variant === 'royal' && <div className="envelope-foil" aria-hidden="true" />}
          <div className="envelope-seal">
            <span className="envelope-seal-text">{monogram}</span>
          </div>
          {variant === 'royal' && (
            <div className="envelope-burst" aria-hidden="true">
              {SHARDS.map((s, i) => (
                <i key={i} style={{ '--shard-angle': s.angle, '--shard-distance': s.distance }} />
              ))}
            </div>
          )}
          <span className="envelope-prompt">{prompt || ENVELOPE_DEFAULTS.prompt}</span>
        </div>
      </div>
      {hintText && <p className="envelope-hint">{hintText}</p>}
    </div>
  );
}

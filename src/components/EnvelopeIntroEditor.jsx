import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Mail, Play, Square, Music } from 'lucide-react';
import EnvelopeIntro from './EnvelopeIntro';
import {
  ENVELOPE_STYLES,
  ENVELOPE_DEFAULTS,
  ENVELOPE_FADE_DELAY,
  ENVELOPE_UNMOUNT_DELAY
} from '../config/envelope';
import { getMusicTrack } from '../data/musicLibrary';
import { playMusic, stopMusic } from '../utils/audioPlayback';

export default function EnvelopeIntroEditor({ formState, onChange }) {
  const {
    theme = 'dark-gold',
    names = '',
    audioEnabled = true,
    audioTrack = 'none',
    customAudioUrl = '',
    customAudioName = '',
    musicStartAt = 0,
    musicVolume = 70,
    musicFadeIn = true,
    envelopeStyle = 'royal',
    envelopePrompt = '',
    envelopeHint,
    envelopeLetterText = ''
  } = formState;

  const track = getMusicTrack(audioTrack, customAudioUrl, customAudioName);
  const hasMusic = audioEnabled && !!track.url;
  const monogram = names.trim() ? names.trim().charAt(0).toUpperCase() : 'A';

  const [preview, setPreview] = useState(null); // null | 'closed' | 'open' | 'fading'
  const [soundOn, setSoundOn] = useState(true);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef(null);
  const timersRef = useRef([]);

  const stopPreviewMusic = () => {
    stopMusic(audioRef.current);
    audioRef.current = null;
    setMusicPlaying(false);
  };

  useEffect(() => () => {
    timersRef.current.forEach(clearTimeout);
    stopMusic(audioRef.current);
  }, []);

  const startPreview = () => {
    stopPreviewMusic();
    setSoundOn(true);
    setPreview('closed');
  };

  const handlePreviewOpen = () => {
    setPreview('open');
    if (soundOn && hasMusic) {
      const audio = new Audio(track.url);
      audio.loop = true;
      audioRef.current = audio;
      playMusic(audio, { startAt: musicStartAt, volume: musicVolume, fadeIn: musicFadeIn })
        .then(() => setMusicPlaying(true))
        .catch(() => setMusicPlaying(false));
    }
    timersRef.current = [
      setTimeout(() => setPreview('fading'), ENVELOPE_FADE_DELAY),
      setTimeout(() => setPreview(null), ENVELOPE_UNMOUNT_DELAY)
    ];
  };

  return (
    <div className="music-selector envelope-editor">
      <div className="music-selector-header">
        <Mail size={16} />
        <span>Envelope Opening</span>
      </div>

      <label className="envelope-editor-label">Animation style</label>
      <div className="envelope-style-grid">
        {ENVELOPE_STYLES.map((style) => (
          <button
            key={style.id}
            type="button"
            className={`envelope-style-btn ${envelopeStyle === style.id ? 'active' : ''}`}
            onClick={() => onChange('envelopeStyle', style.id)}
          >
            <strong>{style.label}</strong>
            <span>{style.description}</span>
          </button>
        ))}
      </div>

      <div className="form-group">
        <label htmlFor="envelopePrompt">Button text on envelope</label>
        <input
          id="envelopePrompt"
          type="text"
          maxLength={40}
          placeholder={ENVELOPE_DEFAULTS.prompt}
          value={envelopePrompt}
          onChange={(e) => onChange('envelopePrompt', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="envelopeLetterText">Text on the letter</label>
        <input
          id="envelopeLetterText"
          type="text"
          maxLength={32}
          placeholder={ENVELOPE_DEFAULTS.letterText}
          value={envelopeLetterText}
          onChange={(e) => onChange('envelopeLetterText', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="envelopeHint">Line below the envelope</label>
        <input
          id="envelopeHint"
          type="text"
          maxLength={60}
          placeholder="Leave empty to hide"
          value={envelopeHint ?? ENVELOPE_DEFAULTS.hint}
          onChange={(e) => onChange('envelopeHint', e.target.value)}
        />
      </div>

      <div className="envelope-editor-music">
        <div className="envelope-editor-music-title">
          <Music size={14} /> Music when the envelope opens
        </div>

        {hasMusic ? (
          <>
            <p className="music-selected-label" style={{ marginTop: 0 }}>
              Track: <strong>{track.label}</strong>
            </p>

            <label className="envelope-range">
              <span>Start song at <strong>{musicStartAt}s</strong></span>
              <input
                type="range"
                min={0}
                max={180}
                step={1}
                value={musicStartAt}
                onChange={(e) => onChange('musicStartAt', Number(e.target.value))}
              />
            </label>

            <label className="envelope-range">
              <span>Volume <strong>{musicVolume}%</strong></span>
              <input
                type="range"
                min={10}
                max={100}
                step={5}
                value={musicVolume}
                onChange={(e) => onChange('musicVolume', Number(e.target.value))}
              />
            </label>

            <label className="envelope-check">
              <input
                type="checkbox"
                checked={musicFadeIn}
                onChange={(e) => onChange('musicFadeIn', e.target.checked)}
              />
              <span>Fade music in smoothly</span>
            </label>
            <p className="music-custom-hint">
              Guests see a music chip on the envelope and can mute it before opening.
            </p>
          </>
        ) : (
          <p className="music-custom-hint">
            Turn on Background Music and pick a track (or upload your own) above to play it when the envelope opens.
          </p>
        )}
      </div>

      <div className="envelope-editor-actions">
        <button type="button" className="envelope-preview-btn" onClick={startPreview}>
          <Play size={14} /> Preview opening
        </button>
        {musicPlaying && (
          <button type="button" className="envelope-preview-btn envelope-preview-btn--ghost" onClick={stopPreviewMusic}>
            <Square size={12} /> Stop music
          </button>
        )}
      </div>

      {preview &&
        createPortal(
          <EnvelopeIntro
            theme={theme}
            monogram={monogram}
            open={preview !== 'closed'}
            fading={preview === 'fading'}
            onOpen={handlePreviewOpen}
            variant={envelopeStyle}
            prompt={envelopePrompt}
            hint={envelopeHint}
            letterText={envelopeLetterText}
            musicLabel={hasMusic ? track.label : ''}
            soundOn={soundOn}
            onToggleSound={() => setSoundOn((v) => !v)}
          />,
          document.body
        )}
    </div>
  );
}

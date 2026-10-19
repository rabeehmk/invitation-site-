import React, { useState, useRef } from 'react';
import { Music, Play, Pause, Upload, Link2 } from 'lucide-react';
import { MUSIC_CATEGORIES, getTracksByCategory, getMusicTrack } from '../data/musicLibrary';

export default function MusicSelector({
  audioEnabled,
  audioTrack,
  customAudioUrl = '',
  onChangeEnabled,
  onChangeTrack,
  onChangeCustomUrl
}) {
  const [category, setCategory] = useState('all');
  const [previewId, setPreviewId] = useState(null);
  const previewRef = useRef(null);

  const tracks = getTracksByCategory(category);

  const stopPreview = () => {
    if (previewRef.current) {
      previewRef.current.pause();
      previewRef.current = null;
    }
    setPreviewId(null);
  };

  const togglePreview = (track) => {
    if (track.id === 'none' || track.id === 'custom') return;

    if (previewId === track.id) {
      stopPreview();
      return;
    }

    stopPreview();
    const audio = new Audio(track.url);
    audio.volume = 0.4;
    audio.play().catch(() => {});
    previewRef.current = audio;
    setPreviewId(track.id);
    audio.onended = () => setPreviewId(null);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('audio/')) {
      alert('Please upload an MP3 or audio file.');
      return;
    }
    const url = URL.createObjectURL(file);
    onChangeTrack('custom');
    onChangeCustomUrl(url);
    onChangeEnabled(true);
  };

  return (
    <div className="music-selector">
      <div className="music-selector-header">
        <Music size={16} />
        <span>Background Music</span>
        <label className="music-toggle">
          <input
            type="checkbox"
            checked={audioEnabled}
            onChange={(e) => onChangeEnabled(e.target.checked)}
          />
          <span>{audioEnabled ? 'On' : 'Off'}</span>
        </label>
      </div>

      {audioEnabled && (
        <>
          <div className="music-category-tabs">
            {MUSIC_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`music-cat-btn ${category === cat.id ? 'active' : ''}`}
                onClick={() => setCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="music-track-list">
            {tracks.map((track) => (
              <div
                key={track.id}
                className={`music-track-row ${audioTrack === track.id ? 'selected' : ''}`}
                onClick={() => {
                  onChangeTrack(track.id);
                  if (track.id !== 'custom') stopPreview();
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onChangeTrack(track.id)}
              >
                <div className="music-track-info">
                  <strong>{track.label}</strong>
                  <span>{track.mood}</span>
                </div>
                {track.url && track.id !== 'custom' && (
                  <button
                    type="button"
                    className="music-preview-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePreview(track);
                    }}
                    title="Preview"
                  >
                    {previewId === track.id ? <Pause size={14} /> : <Play size={14} />}
                  </button>
                )}
              </div>
            ))}
          </div>

          {audioTrack === 'custom' && (
            <div className="music-custom-panel animate-fade-in">
              <label className="music-custom-label">
                <Link2 size={14} /> Paste MP3 / audio URL
              </label>
              <input
                type="url"
                placeholder="https://example.com/your-song.mp3"
                value={customAudioUrl.startsWith('blob:') ? '' : customAudioUrl}
                onChange={(e) => onChangeCustomUrl(e.target.value)}
              />
              <label className="music-upload-btn">
                <Upload size={14} /> Upload from device
                <input type="file" accept="audio/*" hidden onChange={handleFileUpload} />
              </label>
              <p className="music-custom-hint">
                Custom uploads work in preview. For shared links, use a hosted MP3 URL.
              </p>
            </div>
          )}

          <p className="music-selected-label">
            Selected: <strong>{getMusicTrack(audioTrack, customAudioUrl).label}</strong>
          </p>
        </>
      )}
    </div>
  );
}

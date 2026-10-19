import React from 'react';
import { Palette, Type, Image, Sparkles } from 'lucide-react';
import { ACCENT_PRESETS, FONT_PAIRS, MOTIF_OPTIONS } from '../config/religions';
import { compressImage } from '../utils/helpers';

const FONT_PAIR_LABELS = {
  'serif-script': 'Classic Serif + Script',
  'display-modern': 'Display + Modern Sans',
  'arabic-elegant': 'Arabic Elegant'
};

export default function TraditionCustomizePanel({ religionId, formState, onChange, hideBackground = false }) {
  const accents = ACCENT_PRESETS[religionId] || ACCENT_PRESETS.custom;
  const motifs = MOTIF_OPTIONS[religionId] || MOTIF_OPTIONS.custom;
  const fontPairs = Object.keys(FONT_PAIRS).filter((fp) =>
    religionId === 'muslim' ? true : fp !== 'arabic-elegant'
  );

  const handleBgUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImage(file, 800, 600, 0.7);
      onChange('customBackground', dataUrl);
      onChange('isUploaded', true);
      onChange('uploadedPhoto', dataUrl);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="tradition-customize-panel">
      <h4 className="studio-subsection-title">
        <Palette size={14} /> Accent Color
      </h4>
      <div className="accent-swatches">
        {accents.map((color) => (
          <button
            key={color}
            type="button"
            className={`accent-swatch ${formState.accentColor === color ? 'active' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => onChange('accentColor', color)}
            aria-label={`Accent ${color}`}
          />
        ))}
        <input
          type="color"
          value={formState.accentColor || '#D4AF37'}
          onChange={(e) => onChange('accentColor', e.target.value)}
          className="accent-color-picker"
          title="Custom accent"
        />
      </div>

      <h4 className="studio-subsection-title">
        <Sparkles size={14} /> Motif Style
      </h4>
      <div className="motif-options">
        {motifs.map((m) => (
          <button
            key={m.id}
            type="button"
            className={`motif-option ${formState.motif === m.id ? 'active' : ''}`}
            onClick={() => onChange('motif', m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>

      <h4 className="studio-subsection-title">
        <Type size={14} /> Font Pairing
      </h4>
      <select
        value={formState.fontPair || 'serif-script'}
        onChange={(e) => onChange('fontPair', e.target.value)}
        className="tradition-select"
      >
        {fontPairs.map((fp) => (
          <option key={fp} value={fp}>
            {FONT_PAIR_LABELS[fp] || fp}
          </option>
        ))}
      </select>

      {!hideBackground && (
        <>
          <h4 className="studio-subsection-title">
            <Image size={14} /> Custom Background
          </h4>
          <p className="studio-section-desc" style={{ marginBottom: '8px' }}>
            Override the template default with your own photo.
          </p>
          <input type="file" accept="image/*" onChange={handleBgUpload} />
          {formState.customBackground && (
            <button
              type="button"
              className="btn-secondary-sm"
              onClick={() => {
                onChange('customBackground', '');
                onChange('isUploaded', false);
                onChange('uploadedPhoto', '');
              }}
            >
              Remove custom background
            </button>
          )}
        </>
      )}

      {religionId === 'christian' && (
        <label className="customize-toggle-row" style={{ marginTop: '16px' }}>
          <span>Show cross / dove motif</span>
          <input
            type="checkbox"
            checked={formState.showCrossMotif || false}
            onChange={(e) => onChange('showCrossMotif', e.target.checked)}
          />
        </label>
      )}
    </div>
  );
}

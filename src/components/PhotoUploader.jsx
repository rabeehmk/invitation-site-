import React, { useState, useRef } from 'react';
import { Camera, Loader, Sparkles, Wand2 } from 'lucide-react';
import { EVENT_PRESETS, compressImage } from '../utils/helpers';
import { enhancePhotoDataUrl, smartCropToAspect } from '../utils/photoUtils';

export default function PhotoUploader({
  eventType,
  presetIdx,
  isUploaded,
  uploadedPhoto,
  onChange
}) {
  const [compressing, setCompressing] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const fileInputRef = useRef(null);

  const presets = EVENT_PRESETS[eventType] || EVENT_PRESETS.wedding;

  const handleFileChange = async (e, smartCrop = true) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setCompressing(true);
      const dataUrl = smartCrop
        ? await smartCropToAspect(file, 360, 450, 0.45)
        : await compressImage(file, 360, 360, 0.45);

      onChange({
        isUploaded: true,
        uploadedPhoto: dataUrl,
        presetIdx: 0
      });
    } catch (err) {
      console.error('Error processing image:', err);
      alert('Failed to process image. Please try a different photo.');
    } finally {
      setCompressing(false);
    }
  };

  const handleEnhance = async () => {
    if (!uploadedPhoto) return;
    setEnhancing(true);
    try {
      const enhanced = await enhancePhotoDataUrl(uploadedPhoto);
      onChange({ isUploaded: true, uploadedPhoto: enhanced, presetIdx: 0 });
    } catch {
      alert('Enhancement failed.');
    } finally {
      setEnhancing(false);
    }
  };

  const selectPreset = (idx) => {
    onChange({
      isUploaded: false,
      uploadedPhoto: '',
      presetIdx: idx
    });
  };

  const removeUploaded = () => {
    onChange({
      isUploaded: false,
      uploadedPhoto: '',
      presetIdx: 0
    });
  };

  return (
    <div className="photo-upload-container">
      <label style={{ fontSize: '12px', fontWeight: '600', color: '#fff', textTransform: 'uppercase' }}>
        Cover Photo
      </label>

      {isUploaded && uploadedPhoto ? (
        <div className="uploaded-preview-container">
          <img src={uploadedPhoto} alt="Upload preview" className="uploaded-preview-img" />
          <div className="photo-action-row">
            <button type="button" className="btn-icon-ai" onClick={handleEnhance} disabled={enhancing}>
              <Wand2 size={12} /> {enhancing ? 'Enhancing...' : 'AI Enhance'}
            </button>
            <button type="button" className="remove-upload-btn" onClick={removeUploaded}>
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          className="upload-zone"
          onClick={() => !compressing && fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileChange(e, true)}
            accept="image/png, image/jpeg, image/jpg"
            style={{ display: 'none' }}
          />
          {compressing ? (
            <>
              <Loader className="animate-spin" style={{ color: 'var(--studio-accent)' }} size={24} />
              <p style={{ color: 'var(--studio-accent)' }}>Smart cropping & optimizing...</p>
            </>
          ) : (
            <>
              <Camera style={{ color: 'var(--studio-text)' }} size={24} />
              <p style={{ fontWeight: '600', color: '#fff', fontSize: '13px' }}>Upload custom photo</p>
              <p>Auto smart-crop + compress for fast load</p>
            </>
          )}
        </div>
      )}

      <div style={{ marginTop: '10px' }}>
        <p style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', opacity: 0.6, marginBottom: '8px' }}>
          <Sparkles size={10} style={{ display: 'inline' }} /> Or choose a designer preset ({eventType})
        </p>
        <div className="presets-grid">
          {presets.map((preset, idx) => (
            <div
              key={preset.id}
              className={`preset-item ${!isUploaded && presetIdx === idx ? 'active' : ''}`}
              onClick={() => selectPreset(idx)}
              title={preset.label}
            >
              <img src={preset.url} alt={preset.label} />
              {!isUploaded && presetIdx === idx && (
                <div className="preset-active-dot" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

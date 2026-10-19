import React, { useRef, useState } from 'react';
import { Camera, Upload, X, Sparkles, SwitchCamera } from 'lucide-react';
import { compressImage } from '../utils/helpers';
import { enhancePhotoDataUrl, smartCropToAspect } from '../utils/photoUtils';
import { useCamera, captureVideoFrame } from '../hooks/useCamera';

/**
 * Premium photo slot — upload, camera capture, preview, optional AI enhance.
 */
export default function PremiumPhotoSlot({
  label,
  hint,
  value,
  onChange,
  aspect = 'portrait',
  maxW = 800,
  maxH = 1000,
  accentClass = ''
}) {
  const fileRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [facing, setFacing] = useState('user');
  const [error, setError] = useState('');
  const { videoRef, videoEl, ready, error: cameraError } = useCamera({
    active: cameraOpen,
    facingMode: facing,
    width: 1280,
    height: 1280
  });

  const processFile = async (file) => {
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const data =
        aspect === 'portrait'
          ? await smartCropToAspect(file, maxW, maxH, 0.72)
          : await compressImage(file, maxW, maxH, 0.72);
      onChange(data);
      setCameraOpen(false);
    } catch {
      setError('Could not process image. Try another photo.');
    } finally {
      setLoading(false);
    }
  };

  const startCamera = () => {
    setError('');
    setCameraOpen(true);
  };

  const closeCamera = () => setCameraOpen(false);

  // Saved photo keeps true orientation; only the front-camera preview is mirrored
  const capture = () => {
    if (!videoEl.current) return;
    const frame = captureVideoFrame(videoEl.current, {
      aspect: aspect === 'portrait' ? maxW / maxH : null,
      maxSize: Math.max(maxW, maxH),
      quality: 0.82
    });
    if (!frame) return;
    onChange(frame);
    setCameraOpen(false);
  };

  const handleEnhance = async () => {
    if (!value) return;
    setEnhancing(true);
    try {
      onChange(await enhancePhotoDataUrl(value));
    } catch {
      setError('Enhance failed.');
    } finally {
      setEnhancing(false);
    }
  };

  return (
    <div className={`premium-photo-slot ${accentClass}`}>
      <div className="premium-photo-slot-header">
        <span className="premium-photo-slot-label">{label}</span>
        {hint && <span className="premium-photo-slot-hint">{hint}</span>}
      </div>

      {error && <p className="premium-photo-error">{error}</p>}

      {value ? (
        <div className="premium-photo-preview">
          <img src={value} alt={label} />
          <div className="premium-photo-preview-actions">
            <button type="button" className="premium-photo-btn" onClick={handleEnhance} disabled={enhancing}>
              <Sparkles size={14} /> {enhancing ? 'Enhancing…' : 'Enhance'}
            </button>
            <button type="button" className="premium-photo-btn" onClick={() => fileRef.current?.click()}>
              <Upload size={14} /> Replace
            </button>
            <button type="button" className="premium-photo-btn premium-photo-btn--danger" onClick={() => onChange('')}>
              <X size={14} /> Remove
            </button>
          </div>
        </div>
      ) : cameraOpen && cameraError ? (
        <div className="premium-photo-camera">
          <p className="premium-photo-error">{cameraError}</p>
          <div className="premium-photo-camera-actions">
            <button type="button" className="premium-photo-btn premium-photo-btn--primary" onClick={() => { closeCamera(); fileRef.current?.click(); }}>
              <Upload size={14} /> Upload instead
            </button>
            <button type="button" className="premium-photo-btn" onClick={closeCamera}>
              Back
            </button>
          </div>
        </div>
      ) : cameraOpen ? (
        <div className="premium-photo-camera">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`premium-photo-video ${facing === 'user' ? 'is-mirrored' : ''}`}
          />
          <div className="premium-photo-camera-actions">
            <button type="button" className="premium-photo-btn premium-photo-btn--primary" onClick={capture} disabled={!ready}>
              <Camera size={14} /> {ready ? 'Capture' : 'Starting…'}
            </button>
            <button
              type="button"
              className="premium-photo-btn"
              onClick={() => setFacing((f) => (f === 'user' ? 'environment' : 'user'))}
              title="Switch camera"
            >
              <SwitchCamera size={14} />
            </button>
            <button type="button" className="premium-photo-btn" onClick={closeCamera}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="premium-photo-dropzone">
          {loading ? (
            <p className="premium-photo-loading">Optimizing photo…</p>
          ) : (
            <>
              <button type="button" className="premium-photo-drop-btn" onClick={() => fileRef.current?.click()}>
                <Upload size={22} />
                <span>Upload Image</span>
              </button>
              <button type="button" className="premium-photo-drop-btn premium-photo-drop-btn--camera" onClick={startCamera}>
                <Camera size={22} />
                <span>Use Camera</span>
              </button>
            </>
          )}
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => processFile(e.target.files?.[0])}
      />
    </div>
  );
}

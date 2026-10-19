import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Camera, Upload, X, Sparkles, RotateCcw } from 'lucide-react';
import { compressImage } from '../utils/helpers';
import { enhancePhotoDataUrl, smartCropToAspect } from '../utils/photoUtils';

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
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [error, setError] = useState('');

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
      stopCamera();
    } catch {
      setError('Could not process image. Try another photo.');
    } finally {
      setLoading(false);
    }
  };

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const startCamera = useCallback(async () => {
    setError('');
    setCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 960 } },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      setError('Camera access denied. Use upload instead.');
    }
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  const capture = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 720;
    canvas.height = videoRef.current.videoHeight || 960;
    const ctx = canvas.getContext('2d');
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(videoRef.current, 0, 0);
    onChange(canvas.toDataURL('image/jpeg', 0.85));
    setCameraOpen(false);
    stopCamera();
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
      ) : cameraOpen ? (
        <div className="premium-photo-camera">
          <video ref={videoRef} autoPlay playsInline muted className="premium-photo-video" />
          <div className="premium-photo-camera-actions">
            <button type="button" className="premium-photo-btn premium-photo-btn--primary" onClick={capture}>
              <Camera size={14} /> Capture
            </button>
            <button type="button" className="premium-photo-btn" onClick={() => { setCameraOpen(false); stopCamera(); }}>
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

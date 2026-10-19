import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Camera, X, Download, RotateCcw, Sparkles, Share2 } from 'lucide-react';
import { compositeSelfieWithCouple, downloadDataUrl } from '../utils/photoUtils';
import { DEFAULT_COUPLE_FALLBACK } from '../utils/helpers';

export default function SelfieBooth({
  bridePhotoUrl,
  groomPhotoUrl,
  coupleFallbackUrl,
  names = '',
  invitationId,
  religion = 'custom',
  onClose
}) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [mode, setMode] = useState('camera');
  const [selfieData, setSelfieData] = useState(null);
  const [compositeUrl, setCompositeUrl] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const hasCouplePhotos = bridePhotoUrl || groomPhotoUrl;

  const startCamera = useCallback(async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      setError('Camera access denied. Please allow camera permission or upload a photo instead.');
      setMode('upload');
    }
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => {
    if (mode === 'camera') startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera, mode]);

  const captureSelfie = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(videoRef.current, 0, 0);
    setSelfieData(canvas.toDataURL('image/jpeg', 0.85));
    setMode('preview');
    stopCamera();
  };

  const createComposite = async () => {
    if (!selfieData) return;
    setProcessing(true);
    setError('');
    try {
      const result = await compositeSelfieWithCouple(selfieData, {
        bridePhotoUrl,
        groomPhotoUrl,
        coupleFallbackUrl: coupleFallbackUrl || DEFAULT_COUPLE_FALLBACK,
        names,
        religion
      });
      setCompositeUrl(result);
      setMode('result');

      if (invitationId && invitationId !== 'preview') {
        try {
          const key = 'aura_selfies';
          const all = JSON.parse(localStorage.getItem(key) || '{}');
          if (!all[invitationId]) all[invitationId] = [];
          all[invitationId].push({ url: result, timestamp: new Date().toISOString() });
          localStorage.setItem(key, JSON.stringify(all));
        } catch { /* ignore */ }
      }
    } catch {
      setError('Failed to create photo. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const retake = () => {
    setSelfieData(null);
    setCompositeUrl(null);
    setMode('camera');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setSelfieData(ev.target.result);
      setMode('preview');
      stopCamera();
    };
    reader.readAsDataURL(file);
  };

  const shareKeepsake = async () => {
    if (!compositeUrl) return;
    try {
      const blob = await (await fetch(compositeUrl)).blob();
      const file = new File([blob], 'wedding-keepsake.jpg', { type: 'image/jpeg' });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: names || 'Wedding Keepsake',
          text: 'My photo with the happy couple!',
          files: [file]
        });
      } else if (navigator.share) {
        await navigator.share({
          title: names || 'Wedding Keepsake',
          text: 'My photo with the happy couple!',
          url: window.location.href
        });
      } else {
        downloadDataUrl(compositeUrl, 'wedding-keepsake.jpg');
      }
    } catch {
      /* user cancelled share */
    }
  };

  return (
    <div className="selfie-modal-backdrop" onClick={onClose}>
      <div className="selfie-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <h2 className="selfie-title">
          <Sparkles size={18} /> Take a Photo with the Couple
        </h2>
        <p className="selfie-desc">
          {hasCouplePhotos
            ? 'Take a selfie or upload a photo — get a themed keepsake with the bride & groom!'
            : 'Take a selfie — we will composite it with the couple illustration.'}
        </p>

        {error && <p className="selfie-error">{error}</p>}

        {mode === 'camera' && !error && (
          <div className="selfie-camera-wrap">
            <video ref={videoRef} autoPlay playsInline muted className="selfie-video" />
            <div className="selfie-camera-actions">
              <button type="button" className="btn-primary" onClick={captureSelfie}>
                <Camera size={16} /> Take Selfie
              </button>
              <label className="btn-secondary-outline selfie-upload-label">
                Upload Photo
                <input type="file" accept="image/*" onChange={handleFileUpload} hidden />
              </label>
            </div>
          </div>
        )}

        {mode === 'upload' && (
          <div className="selfie-camera-wrap">
            <p className="selfie-desc">Camera unavailable — upload your photo instead.</p>
            <label className="btn-primary selfie-upload-label">
              <Camera size={16} /> Upload Your Photo
              <input type="file" accept="image/*" onChange={handleFileUpload} hidden />
            </label>
          </div>
        )}

        {mode === 'preview' && selfieData && (
          <div className="selfie-preview-wrap">
            <img src={selfieData} alt="Your selfie" className="selfie-preview-img" />
            <div className="selfie-camera-actions">
              <button type="button" className="btn-primary" onClick={createComposite} disabled={processing}>
                {processing ? 'Creating your keepsake...' : '✨ Create Photo with Bride & Groom'}
              </button>
              <button type="button" className="btn-secondary-outline" onClick={retake}>
                <RotateCcw size={14} /> Retake
              </button>
            </div>
          </div>
        )}

        {mode === 'result' && compositeUrl && (
          <div className="selfie-result-wrap">
            <img src={compositeUrl} alt="You with the couple" className="selfie-result-img" />
            <div className="selfie-camera-actions">
              <button
                type="button"
                className="btn-primary"
                onClick={() => downloadDataUrl(compositeUrl, 'wedding-keepsake.jpg')}
              >
                <Download size={16} /> Download
              </button>
              <button type="button" className="btn-secondary-outline" onClick={shareKeepsake}>
                <Share2 size={16} /> Share
              </button>
              <button type="button" className="btn-secondary-outline" onClick={retake}>
                <RotateCcw size={14} /> Take Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

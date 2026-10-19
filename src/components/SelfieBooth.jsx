import React, { useState } from 'react';
import { Camera, X, Download, RotateCcw, Sparkles, Share2 } from 'lucide-react';
import { compositeSelfieWithCouple, downloadDataUrl } from '../utils/photoUtils';
import { DEFAULT_COUPLE_FALLBACK, compressImage } from '../utils/helpers';
import { useCamera, captureVideoFrame } from '../hooks/useCamera';

export default function SelfieBooth({
  bridePhotoUrl,
  groomPhotoUrl,
  coupleFallbackUrl,
  names = '',
  invitationId,
  religion = 'custom',
  onClose
}) {
  const [mode, setMode] = useState('camera');
  const [selfieData, setSelfieData] = useState(null);
  const [compositeUrl, setCompositeUrl] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const hasCouplePhotos = bridePhotoUrl || groomPhotoUrl;

  const { videoRef, videoEl, ready, error: cameraError } = useCamera({
    active: mode === 'camera',
    facingMode: 'user',
    width: 1280,
    height: 960
  });

  const captureSelfie = () => {
    // Mirrored to match the mirrored on-screen preview
    const frame = videoEl.current && captureVideoFrame(videoEl.current, { mirror: true, maxSize: 1080 });
    if (!frame) return;
    setSelfieData(frame);
    setMode('preview');
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
    setError('');
    setMode('camera');
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      // Phone photos can be 10MB+; shrink before compositing
      setSelfieData(await compressImage(file, 1080, 1080, 0.85));
      setError('');
      setMode('preview');
    } catch {
      setError('Could not read that photo. Please try another one.');
    }
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

        {mode === 'camera' && cameraError && (
          <div className="selfie-camera-wrap">
            <p className="selfie-error">{cameraError}</p>
            <label className="btn-primary selfie-upload-label">
              <Camera size={16} /> Upload Your Photo
              <input type="file" accept="image/*" onChange={handleFileUpload} hidden />
            </label>
          </div>
        )}

        {mode === 'camera' && !cameraError && (
          <div className="selfie-camera-wrap">
            <video ref={videoRef} autoPlay playsInline muted className="selfie-video" />
            <div className="selfie-camera-actions">
              <button type="button" className="btn-primary" onClick={captureSelfie} disabled={!ready}>
                <Camera size={16} /> {ready ? 'Take Selfie' : 'Starting camera…'}
              </button>
              <label className="btn-secondary-outline selfie-upload-label">
                Upload Photo
                <input type="file" accept="image/*" onChange={handleFileUpload} hidden />
              </label>
            </div>
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

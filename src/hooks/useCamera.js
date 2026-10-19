import { useEffect, useRef, useState, useCallback } from 'react';

/** Human-readable reason the camera could not start */
export function describeCameraError(err) {
  if (typeof window !== 'undefined' && !window.isSecureContext) {
    return 'Camera needs a secure (https) link. Open the invitation via https or on this device’s localhost.';
  }
  switch (err?.name) {
    case 'NotAllowedError':
    case 'SecurityError':
      return 'Camera permission was blocked. Allow camera access in your browser settings, or upload a photo instead.';
    case 'NotFoundError':
    case 'OverconstrainedError':
      return 'No camera was found on this device. Upload a photo instead.';
    case 'NotReadableError':
    case 'AbortError':
      return 'The camera is being used by another app. Close it and try again, or upload a photo.';
    default:
      return 'Could not start the camera. Upload a photo instead.';
  }
}

export function isCameraSupported() {
  return typeof window !== 'undefined' && window.isSecureContext && !!navigator.mediaDevices?.getUserMedia;
}

/**
 * Starts the camera while `active` is true and always stops it afterwards —
 * including when the request resolves after the component has closed.
 */
export function useCamera({ active, facingMode = 'user', width = 1280, height = 960 }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');

  const cancelledRef = useRef(false);

  // Connects the live stream to the <video>, whichever of the two appears first
  const attach = useCallback((video) => {
    const stream = streamRef.current;
    if (!video || !stream || video.srcObject === stream) return;
    video.srcObject = stream;
    const markReady = () => !cancelledRef.current && video.videoWidth > 0 && setReady(true);
    video.onloadedmetadata = markReady;
    video.onplaying = markReady;
    video.play?.().catch(() => {});
  }, []);

  const setVideoRef = useCallback(
    (node) => {
      videoRef.current = node;
      attach(node);
    },
    [attach]
  );

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setReady(false);
  }, []);

  useEffect(() => {
    if (!active) return undefined;
    let cancelled = false;
    cancelledRef.current = false;
    setError('');
    setReady(false);

    if (!isCameraSupported()) {
      setError(describeCameraError(null));
      return undefined;
    }

    const open = async () => {
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode, width: { ideal: width }, height: { ideal: height } },
          audio: false
        });
      } catch (err) {
        if (err?.name !== 'OverconstrainedError') throw err;
        // Some devices reject size hints; retry with any camera
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }

      if (cancelled) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      streamRef.current = stream;
      attach(videoRef.current);
    };

    open().catch((err) => {
      if (!cancelled) setError(describeCameraError(err));
    });

    return () => {
      cancelled = true;
      cancelledRef.current = true;
      stop();
    };
  }, [active, facingMode, width, height, stop, attach]);

  return { videoRef: setVideoRef, videoEl: videoRef, ready, error, stop };
}

/**
 * Grabs the current video frame as a JPEG data URL. Optionally crops to an
 * aspect ratio (w / h) and mirrors it (to match a mirrored selfie preview).
 */
export function captureVideoFrame(video, { mirror = false, aspect = null, maxSize = 1280, quality = 0.85 } = {}) {
  const vw = video.videoWidth;
  const vh = video.videoHeight;
  if (!vw || !vh) return null;

  let sx = 0;
  let sy = 0;
  let sw = vw;
  let sh = vh;
  if (aspect) {
    if (vw / vh > aspect) {
      sw = vh * aspect;
      sx = (vw - sw) / 2;
    } else {
      sh = vw / aspect;
      sy = (vh - sh) * 0.3;
    }
  }

  const scale = Math.min(1, maxSize / Math.max(sw, sh));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(sw * scale);
  canvas.height = Math.round(sh * scale);
  const ctx = canvas.getContext('2d');
  if (mirror) {
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', quality);
}

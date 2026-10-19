import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import SelfieBooth from './SelfieBooth';
import { DEFAULT_COUPLE_FALLBACK } from '../utils/helpers';

/**
 * Floating camera button — single entry point for guest selfie keepsake.
 */
export default function GuestCameraFab({
  bridePhotoUrl,
  groomPhotoUrl,
  names = '',
  invitationId,
  visible = true,
  religion = 'custom'
}) {
  const [open, setOpen] = useState(false);

  if (!visible) return null;

  return (
    <>
      <button
        type="button"
        className="guest-camera-fab"
        onClick={() => setOpen(true)}
        aria-label="Take a photo with the bride and groom"
      >
        <Camera size={22} strokeWidth={2} />
        <span className="guest-camera-fab-label">Photo</span>
      </button>

      {open && (
        <SelfieBooth
          bridePhotoUrl={bridePhotoUrl}
          groomPhotoUrl={groomPhotoUrl}
          coupleFallbackUrl={DEFAULT_COUPLE_FALLBACK}
          names={names}
          invitationId={invitationId}
          religion={religion}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

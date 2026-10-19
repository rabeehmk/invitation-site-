import React, { useState } from 'react';
import { Camera, Sparkles, Users } from 'lucide-react';
import SelfieBooth from './SelfieBooth';
import { DEFAULT_COUPLE_FALLBACK } from '../utils/helpers';

/**
 * Compact camera CTA — opens selfie booth; guest gets composite with bride & groom.
 */
export default function GuestPhotoMoment({
  bridePhotoUrl,
  groomPhotoUrl,
  names = '',
  invitationId,
  compact = false,
  title = 'Photo with Bride & Groom',
  religion = 'custom'
}) {
  const [open, setOpen] = useState(false);
  const hasCouple = !!(bridePhotoUrl || groomPhotoUrl);

  return (
    <>
      <div className={`guest-photo-moment ${compact ? 'guest-photo-moment--compact' : ''}`}>
        <div className="guest-photo-moment-icon">
          <Users size={compact ? 16 : 20} />
        </div>
        <div className="guest-photo-moment-text">
          <strong>{title}</strong>
          <p>
            {hasCouple
              ? 'Take a selfie or upload — get a keepsake photo with the couple!'
              : 'Take a selfie — we create a beautiful keepsake with the wedding couple.'}
          </p>
        </div>
        <button type="button" className="guest-photo-moment-btn" onClick={() => setOpen(true)}>
          <Camera size={16} />
          {compact ? 'Camera' : 'Open Camera'}
        </button>
      </div>

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

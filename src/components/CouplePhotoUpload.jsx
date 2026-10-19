import React, { useState } from 'react';
import { Upload, X, User, Heart } from 'lucide-react';
import { smartCropToAspect } from '../utils/photoUtils';

async function compressPortrait(file) {
  // 4:5 portrait, sharp enough for full-screen heroes; publish step re-compresses for links
  return smartCropToAspect(file, 640, 800, 0.82);
}

function PhotoSlot({ label, icon: Icon, photo, onUpload, onRemove, accentClass }) {
  const [loading, setLoading] = useState(false);

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const data = await compressPortrait(file);
      onUpload(data);
    } catch {
      alert('Failed to upload photo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`couple-photo-slot ${accentClass}`}>
      <label className="couple-photo-label">
        <Icon size={14} /> {label}
      </label>
      {photo ? (
        <div className="couple-photo-preview">
          <img src={photo} alt={label} />
          <button type="button" className="couple-photo-remove" onClick={onRemove}>
            <X size={14} />
          </button>
        </div>
      ) : (
        <label className="couple-photo-upload">
          <Upload size={20} />
          <span>{loading ? 'Uploading...' : 'Upload Photo'}</span>
          <input type="file" accept="image/*" hidden onChange={handleChange} disabled={loading} />
        </label>
      )}
    </div>
  );
}

export default function CouplePhotoUpload({ bridePhoto, groomPhoto, onChange }) {
  return (
    <div className="couple-photo-upload-section">
      <p className="couple-photo-hint">
        Upload separate bride & groom photos — guests can take a selfie and get a composite keepsake image with both of you.
      </p>
      <div className="couple-photo-grid">
        <PhotoSlot
          label="Bride Photo"
          icon={Heart}
          photo={bridePhoto}
          accentClass="bride-slot"
          onUpload={(data) => onChange('bridePhoto', data)}
          onRemove={() => onChange('bridePhoto', '')}
        />
        <PhotoSlot
          label="Groom Photo"
          icon={User}
          photo={groomPhoto}
          accentClass="groom-slot"
          onUpload={(data) => onChange('groomPhoto', data)}
          onRemove={() => onChange('groomPhoto', '')}
        />
      </div>
    </div>
  );
}

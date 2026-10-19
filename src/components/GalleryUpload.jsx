import React, { useRef } from 'react';
import { Plus, X, Images } from 'lucide-react';
import { compressImage } from '../utils/helpers';

const MAX_GALLERY = 6;

export default function GalleryUpload({ photos = [], onChange }) {
  const fileRef = useRef(null);
  const items = photos || [];

  const addPhoto = async (file) => {
    if (!file || items.length >= MAX_GALLERY) return;
    try {
      const dataUrl = await compressImage(file, 720, 720, 0.72);
      onChange([...items, dataUrl]);
    } catch {
      /* ignore */
    }
  };

  const removePhoto = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <section className="premium-media-section">
      <h4><Images size={14} /> Photo Gallery</h4>
      <p className="premium-media-desc">
        Add up to {MAX_GALLERY} photos for guests to browse — engagement, pre-wedding, or ceremony shots.
      </p>
      <div className="gallery-upload-grid">
        {items.map((src, i) => (
          <div key={`gal-${i}`} className="gallery-upload-slot">
            <img src={src} alt="" />
            <button type="button" className="gallery-upload-remove" onClick={() => removePhoto(i)} aria-label="Remove photo">
              <X size={14} />
            </button>
          </div>
        ))}
        {items.length < MAX_GALLERY && (
          <button
            type="button"
            className="gallery-upload-add"
            onClick={() => fileRef.current?.click()}
          >
            <Plus size={20} />
            <span>Add Photo</span>
          </button>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          addPhoto(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
    </section>
  );
}

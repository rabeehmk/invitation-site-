import React from 'react';
import { Image, Layers, Heart, Sparkles, Palette } from 'lucide-react';
import PremiumPhotoSlot from './PremiumPhotoSlot';
import GalleryUpload from './GalleryUpload';
import TraditionCustomizePanel from './TraditionCustomizePanel';
import { generateAIBackground } from '../utils/photoUtils';
import { resolveLayoutStructure } from '../config/layoutStructures';
import { getTemplateById } from '../config/index';

const AI_BG_STYLES = [
  { id: 'minimal-blush', label: 'Blush Ivory' },
  { id: 'sage-botanical', label: 'Sage Botanical' },
  { id: 'floral-gold', label: 'Floral Gold' },
  { id: 'islamic-geometric', label: 'Geometric Sand' },
  { id: 'mandala', label: 'Mandala Maroon' }
];

export default function PremiumMediaStudio({ religionId, formState, onChange, onBatchChange }) {
  const template = getTemplateById(formState.templateId || formState.selectedTemplateId);
  const layoutStructure = resolveLayoutStructure(template);

  const applyAiBackground = (styleId) => {
    const url = generateAIBackground(styleId, 900, 1200);
    onChange('customBackground', url);
  };

  return (
    <div className="premium-media-studio">
      <div className="premium-media-studio-hero">
        <Sparkles size={18} />
        <div>
          <h3>Premium Media Studio</h3>
          <p>Upload every image — page background, card photo, hero, bride & groom. Guests use camera to get a keepsake with your photos.</p>
        </div>
      </div>

      <section className="premium-media-section">
        <h4><Layers size={14} /> Page Background</h4>
        <p className="premium-media-desc">Full-page canvas texture behind your invitation card.</p>
        <PremiumPhotoSlot
          label="Background Image"
          hint="Landscape or pattern works best"
          value={formState.customBackground || ''}
          onChange={(v) => onChange('customBackground', v)}
          aspect="landscape"
          maxW={1200}
          maxH={800}
          accentClass="premium-slot--bg"
        />
        <div className="premium-ai-bg-row">
          <span className="premium-ai-bg-label">Or AI pattern:</span>
          <div className="premium-ai-bg-chips">
            {AI_BG_STYLES.map((s) => (
              <button key={s.id} type="button" className="premium-ai-bg-chip" onClick={() => applyAiBackground(s.id)}>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="premium-media-section">
        <h4><Image size={14} /> Hero / Cover Photo</h4>
        <p className="premium-media-desc">Main large photo for full-bleed and split layouts.</p>
        <PremiumPhotoSlot
          label="Cover Photo"
          value={formState.isUploaded ? formState.uploadedPhoto : ''}
          onChange={(v) => onBatchChange({ isUploaded: !!v, uploadedPhoto: v, presetIdx: 0 })}
          accentClass="premium-slot--hero"
        />
      </section>

      {(layoutStructure === 'card-canvas' || layoutStructure === 'illustrated') && (
        <section className="premium-media-section">
          <h4><Image size={14} /> Card Photo</h4>
          <p className="premium-media-desc">Photo displayed inside the physical card (overrides cover on card layouts).</p>
          <PremiumPhotoSlot
            label="Card Image"
            value={formState.cardPhoto || ''}
            onChange={(v) => onChange('cardPhoto', v)}
            accentClass="premium-slot--card"
          />
        </section>
      )}

      <section className="premium-media-section premium-media-section--couple">
        <h4><Heart size={14} /> Bride & Groom (for guest keepsakes)</h4>
        <p className="premium-media-desc">
          Required for &quot;Photo with Couple&quot; — when guests take a selfie, they receive a composite with both of you.
        </p>
        <div className="premium-couple-grid">
          <PremiumPhotoSlot
            label="Bride"
            value={formState.bridePhoto || ''}
            onChange={(v) => onChange('bridePhoto', v)}
            accentClass="premium-slot--bride"
          />
          <PremiumPhotoSlot
            label="Groom"
            value={formState.groomPhoto || ''}
            onChange={(v) => onChange('groomPhoto', v)}
            accentClass="premium-slot--groom"
          />
        </div>
      </section>

      <GalleryUpload
        photos={formState.galleryPhotos || []}
        onChange={(v) => onChange('galleryPhotos', v)}
      />

      <section className="premium-media-section premium-media-section--style">
        <h4><Palette size={14} /> Colors & Style</h4>
        <TraditionCustomizePanel
          religionId={religionId}
          formState={formState}
          onChange={onChange}
          hideBackground
        />
      </section>
    </div>
  );
}

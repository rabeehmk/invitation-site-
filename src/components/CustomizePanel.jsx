import React from 'react';
import { Settings2 } from 'lucide-react';
import { CUSTOMIZABLE_SECTIONS } from '../data/templates';

export default function CustomizePanel({ sectionVisibility, onChange }) {
  return (
    <div className="customize-panel">
      <p className="studio-section-desc">
        Choose which sections appear on your published invitation card.
      </p>
      <div className="customize-toggles">
        {CUSTOMIZABLE_SECTIONS.map(({ id, label }) => (
          <label key={id} className="customize-toggle-row">
            <span>{label}</span>
            <input
              type="checkbox"
              checked={sectionVisibility?.[id] !== false}
              onChange={(e) => onChange(id, e.target.checked)}
            />
          </label>
        ))}
      </div>
    </div>
  );
}

export function CustomizePanelHeader() {
  return (
    <h3 className="studio-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Settings2 size={16} /> Customize Card Sections
    </h3>
  );
}

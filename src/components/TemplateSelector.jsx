import React from 'react';
import { LayoutTemplate, Check } from 'lucide-react';
import { INVITATION_TEMPLATES } from '../data/templates';

export default function TemplateSelector({ activeTemplateId, onSelect }) {
  return (
    <div className="template-selector">
      <p className="template-selector-hint">
        Pick a template to instantly apply theme, tone, and layout defaults. You can customize everything after.
      </p>
      <div className="template-grid">
        {INVITATION_TEMPLATES.map((tpl) => (
          <button
            key={tpl.id}
            type="button"
            className={`template-card ${activeTemplateId === tpl.id ? 'active' : ''}`}
            onClick={() => onSelect(tpl)}
          >
            <div className={`template-preview theme-${tpl.preview}`}>
              <span className="template-preview-text">Aa</span>
            </div>
            <div className="template-card-info">
              <strong>{tpl.name}</strong>
              <span>{tpl.description}</span>
            </div>
            {activeTemplateId === tpl.id && (
              <span className="template-check"><Check size={14} /></span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { LAYOUT_STRUCTURES, LAYOUT_STRUCTURE_IDS } from '../config/layoutStructures.js';
import { getTemplatesForReligion } from '../config/index.js';

/**
 * Filter + pick templates by layout structure in Studio.
 */
export default function LayoutStructurePicker({ religionId, activeTemplateId, onSelectTemplate }) {
  const [filter, setFilter] = useState('all');
  const templates = getTemplatesForReligion(religionId);

  const filtered =
    filter === 'all'
      ? templates
      : templates.filter((t) => t.layoutStructure === filter);

  return (
    <div className="layout-structure-picker">
      <p className="layout-structure-picker-hint">
        Each layout has a different structure — not just colours. Pick the one that fits your event.
      </p>

      <div className="layout-structure-filters">
        <button
          type="button"
          className={`layout-filter-chip ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All layouts
        </button>
        {LAYOUT_STRUCTURE_IDS.map((id) => (
          <button
            key={id}
            type="button"
            className={`layout-filter-chip ${filter === id ? 'active' : ''}`}
            onClick={() => setFilter(id)}
          >
            {LAYOUT_STRUCTURES[id].shortLabel}
          </button>
        ))}
      </div>

      <div className="tradition-template-list">
        {filtered.map((tpl) => (
          <button
            key={tpl.id}
            type="button"
            className={`tradition-template-btn ${activeTemplateId === tpl.id ? 'active' : ''}`}
            onClick={() => onSelectTemplate(tpl.id)}
          >
            <div className="tradition-template-btn-head">
              <strong>{tpl.name}</strong>
              {tpl.recommended && <span className="template-recommended-badge">Recommended</span>}
            </div>
            <span className="template-layout-structure-tag">
              {LAYOUT_STRUCTURES[tpl.layoutStructure]?.label || tpl.layoutStructure}
            </span>
            <span>{tpl.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

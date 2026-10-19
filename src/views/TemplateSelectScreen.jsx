import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Image as ImageIcon, Columns2, Layers, Type, Landmark, LayoutGrid } from 'lucide-react';
import LayoutMockup from '../components/LayoutMockup';
import { getReligion } from '../config/religions';
import { getTemplatesForReligion } from '../config/index';
import { LAYOUT_STRUCTURES } from '../config/layoutStructures';

const STRUCTURE_ICONS = {
  'full-bleed': ImageIcon,
  split: Columns2,
  'card-canvas': Layers,
  'typography-minimal': Type,
  illustrated: Landmark
};

export default function TemplateSelectScreen({ religionId, onSelect, onBack }) {
  const religion = getReligion(religionId);
  const templates = getTemplatesForReligion(religionId);
  const [filter, setFilter] = useState('all');

  const filtered =
    filter === 'all'
      ? templates
      : templates.filter((t) => t.layoutStructure === filter);

  const structureIds = [...new Set(templates.map((t) => t.layoutStructure))];

  return (
    <div className="builder-screen">
      <div className="builder-screen-inner builder-screen-inner--wide">
        <button type="button" className="builder-back-btn" onClick={onBack}>
          ← Change tradition
        </button>

        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="builder-header"
        >
          <span className="builder-religion-badge">{religion.icon} {religion.label}</span>
          <h1>Pick a Layout</h1>
          <p>
            {templates.length} structurally different designs — each changes how your invitation is built, not just the colours.
          </p>
        </motion.div>

        <div className="tpl-filters" role="tablist" aria-label="Filter by layout">
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'all'}
            className={`tpl-filter ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            <LayoutGrid size={14} /> All <span className="tpl-filter-count">{templates.length}</span>
          </button>
          {structureIds.map((id) => {
            const Icon = STRUCTURE_ICONS[id] || LayoutGrid;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={filter === id}
                className={`tpl-filter ${filter === id ? 'active' : ''}`}
                onClick={() => setFilter(id)}
              >
                <Icon size={14} /> {LAYOUT_STRUCTURES[id]?.shortLabel || id}
                <span className="tpl-filter-count">
                  {templates.filter((t) => t.layoutStructure === id).length}
                </span>
              </button>
            );
          })}
        </div>

        <p className="tpl-filter-desc">
          {filter === 'all'
            ? 'Each preview shows how the invitation is actually laid out on a guest’s screen.'
            : LAYOUT_STRUCTURES[filter]?.description}
        </p>

        <div className="tpl-grid">
          {filtered.map((tpl, i) => {
            const meta = LAYOUT_STRUCTURES[tpl.layoutStructure];
            const Icon = STRUCTURE_ICONS[tpl.layoutStructure] || LayoutGrid;
            return (
              <motion.button
                key={tpl.id}
                type="button"
                className={`tpl-card ${tpl.recommended ? 'tpl-card--recommended' : ''}`}
                style={{ '--tpl-accent': tpl.palette?.secondary || '#BDA06D' }}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(tpl.id)}
              >
                <div className="tpl-card-preview">
                  <LayoutMockup
                    layoutStructure={tpl.layoutStructure}
                    palette={tpl.palette}
                    religion={religionId}
                    fontPair={tpl.fontPair}
                  />
                  <span className="tpl-card-structure">
                    <Icon size={12} /> {meta?.shortLabel || tpl.layoutStructure}
                  </span>
                  {tpl.recommended && (
                    <span className="tpl-card-ribbon">
                      <Star size={10} fill="currentColor" /> Recommended
                    </span>
                  )}
                </div>

                <div className="tpl-card-info">
                  <h3>{tpl.name}</h3>
                  <span className="tpl-card-tag">{meta?.label || tpl.layoutStructure}</span>
                  <p>{tpl.description}</p>
                  <div className="tpl-card-footer">
                    <span className="tpl-card-swatches" aria-label="Colour palette">
                      {['primary', 'secondary', 'bg'].map((k) => (
                        <i key={k} style={{ background: tpl.palette?.[k] }} />
                      ))}
                    </span>
                    <span className="tpl-card-cta">
                      Use this layout <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

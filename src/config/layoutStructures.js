/** Five structurally distinct invitation layout engines */
export const LAYOUT_STRUCTURE_IDS = [
  'full-bleed',
  'split',
  'card-canvas',
  'typography-minimal',
  'illustrated'
];

export const LAYOUT_STRUCTURES = {
  'full-bleed': {
    id: 'full-bleed',
    label: 'Full-Bleed Photo',
    shortLabel: 'Cinema Hero',
    description: 'Couple photo fills the screen; details reveal on scroll',
    previewClass: 'tpl-preview--full-bleed',
    supportsPhoto: true,
    photoProminence: 'full-viewport'
  },
  split: {
    id: 'split',
    label: 'Split Screen',
    shortLabel: 'Editorial Split',
    description: 'Fixed photo panel + scrollable story column',
    previewClass: 'tpl-preview--split',
    supportsPhoto: true,
    photoProminence: 'half-panel'
  },
  'card-canvas': {
    id: 'card-canvas',
    label: 'Card on Canvas',
    shortLabel: 'Physical Card',
    description: 'Invitation as a tangible card on textured paper',
    previewClass: 'tpl-preview--card',
    supportsPhoto: true,
    photoProminence: 'card-hero'
  },
  'typography-minimal': {
    id: 'typography-minimal',
    label: 'Typography Minimal',
    shortLabel: 'Stationery',
    description: 'Type-led luxury — no photo required',
    previewClass: 'tpl-preview--typography',
    supportsPhoto: false,
    photoProminence: 'none'
  },
  illustrated: {
    id: 'illustrated',
    label: 'Illustrated Scene',
    shortLabel: 'Storybook',
    description: 'Religion-specific illustrated frame around content',
    previewClass: 'tpl-preview--illustrated',
    supportsPhoto: true,
    photoProminence: 'arch-frame'
  }
};

/** Map legacy layout strings to new structure ids */
export const LEGACY_LAYOUT_MAP = {
  'full-photo-bg': 'full-bleed',
  'asymmetric-modern': 'split',
  'centered-symmetric': 'card-canvas',
  'typography-minimal': 'typography-minimal',
  'illustration-heavy': 'illustrated'
};

export function resolveLayoutStructure(template) {
  if (!template) return 'card-canvas';
  if (template.layoutStructure && LAYOUT_STRUCTURES[template.layoutStructure]) {
    return template.layoutStructure;
  }
  return LEGACY_LAYOUT_MAP[template.layout] || 'card-canvas';
}

export function getLayoutStructureMeta(id) {
  return LAYOUT_STRUCTURES[id] || LAYOUT_STRUCTURES['card-canvas'];
}

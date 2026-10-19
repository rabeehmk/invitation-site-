/**
 * Envelope opening intro — styles, default copy and timing shared by
 * the guest cards and the Studio editor.
 */

export const ENVELOPE_STYLES = [
  { id: 'royal', label: 'Royal', description: 'Light rays, gold foil & seal burst' },
  { id: 'classic', label: 'Classic', description: 'Elegant flap & letter reveal' },
  { id: 'minimal', label: 'Minimal', description: 'Clean & quiet' }
];

export const ENVELOPE_DEFAULTS = {
  prompt: 'Tap to Open Your Invitation',
  hint: 'A special invitation awaits you',
  letterText: "You're Invited"
};

export const ENVELOPE_FADE_DELAY = 2200;
export const ENVELOPE_UNMOUNT_DELAY = 3300;

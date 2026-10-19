import { getDefaultSectionVisibility } from '../data/templates';

/**
 * Separate bride's-family and groom's-family invitations from one project.
 * Each side can override the function name, date, venue, contact and message;
 * anything left empty falls back to the main (joint) invitation details.
 */

export const INVITE_SIDES = [
  { id: 'joint', label: 'Joint', description: 'One invitation from both families' },
  { id: 'bride', label: "Bride's Family", description: 'Hosted by the bride’s family' },
  { id: 'groom', label: "Groom's Family", description: 'Hosted by the groom’s family' }
];

export function getInviteSideLabel(side) {
  return INVITE_SIDES.find((s) => s.id === side)?.label || 'Joint';
}

function orderNames(state, hostFirst) {
  const { groomName = '', brideName = '' } = state;
  if (groomName && brideName) {
    return hostFirst === 'bride' ? `${brideName} & ${groomName}` : `${groomName} & ${brideName}`;
  }
  // Free-text names are written groom-first; flip them for the bride's side
  const parts = (state.names || '').split('&').map((s) => s.trim()).filter(Boolean);
  if (hostFirst === 'bride' && parts.length === 2) return `${parts[1]} & ${parts[0]}`;
  return state.names || '';
}

/** Returns the state a guest of the given side should see */
export function applyInviteSide(state) {
  const side = state?.inviteSide;
  if (!state || (side !== 'bride' && side !== 'groom')) return state;

  const pick = (key, fallback) => {
    const v = state[`${side}${key}`];
    return typeof v === 'string' && v.trim() ? v : fallback;
  };

  const sideContact = pick('SideContact', '');

  return {
    ...state,
    names: orderNames(state, side),
    title: pick('EventName', state.title),
    sideEventName: pick('EventName', ''),
    date: pick('EventDate', state.date),
    venueName: pick('EventVenue', state.venueName),
    venue: pick('EventAddress', state.venue),
    mapLink: pick('EventMapLink', state.mapLink),
    message: pick('Message', state.message),
    contactPhone: sideContact || state.contactPhone,
    rsvpPhone: sideContact || state.rsvpPhone,
    envelopeHint:
      state.envelopeHint ?? (side === 'bride' ? 'With love from the bride’s family' : 'With love from the groom’s family'),
    sectionVisibility: {
      ...(state.sectionVisibility || getDefaultSectionVisibility()),
      // The other family's function belongs on their own invitation
      showBrideGroomEvents: false
    }
  };
}

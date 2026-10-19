import React from 'react';
import { Heart, User, Share2, Eye } from 'lucide-react';
import { INVITE_SIDES } from '../utils/inviteSides';

const SIDE_FORMS = [
  {
    side: 'bride',
    title: "Bride's Family Invitation",
    icon: Heart,
    accentClass: 'invite-side-card--bride',
    eventPlaceholder: 'e.g. Nikah & Walima at Bride’s Residence'
  },
  {
    side: 'groom',
    title: "Groom's Family Invitation",
    icon: User,
    accentClass: 'invite-side-card--groom',
    eventPlaceholder: 'e.g. Wedding Reception'
  }
];

function SideForm({ config, formState, onChange, onPublish, publishing }) {
  const { side, title, icon: Icon, accentClass, eventPlaceholder } = config;
  const key = (suffix) => `${side}${suffix}`;
  const field = (suffix) => formState[key(suffix)] || '';
  const set = (suffix) => (e) => onChange(key(suffix), e.target.value);

  return (
    <section className={`invite-side-card ${accentClass}`}>
      <header className="invite-side-card-header">
        <span className="invite-side-card-icon"><Icon size={16} /></span>
        <div>
          <h4>{title}</h4>
          <p>Empty fields use the main invitation details.</p>
        </div>
      </header>

      <div className="form-group">
        <label htmlFor={key('EventName')}>Function name</label>
        <input id={key('EventName')} type="text" placeholder={eventPlaceholder} value={field('EventName')} onChange={set('EventName')} />
      </div>

      <div className="form-group">
        <label htmlFor={key('EventDate')}>Date &amp; time</label>
        <input id={key('EventDate')} type="datetime-local" value={field('EventDate')} onChange={set('EventDate')} />
      </div>

      <div className="form-group">
        <label htmlFor={key('EventVenue')}>Venue</label>
        <input id={key('EventVenue')} type="text" placeholder={formState.venueName || 'Venue name'} value={field('EventVenue')} onChange={set('EventVenue')} />
      </div>

      <div className="form-group">
        <label htmlFor={key('EventAddress')}>Address</label>
        <input id={key('EventAddress')} type="text" placeholder={formState.venue || 'Full address'} value={field('EventAddress')} onChange={set('EventAddress')} />
      </div>

      <div className="form-group">
        <label htmlFor={key('EventMapLink')}>Google Maps link</label>
        <input id={key('EventMapLink')} type="url" placeholder="https://maps.google.com/..." value={field('EventMapLink')} onChange={set('EventMapLink')} />
      </div>

      <div className="form-group">
        <label htmlFor={key('SideContact')}>Contact / RSVP number</label>
        <input id={key('SideContact')} type="tel" placeholder={formState.contactPhone || '+91 98765 43210'} value={field('SideContact')} onChange={set('SideContact')} />
      </div>

      <div className="form-group">
        <label htmlFor={key('Message')}>Message from the family</label>
        <textarea
          id={key('Message')}
          rows={3}
          maxLength={500}
          placeholder={formState.message || 'A personal note to your guests…'}
          value={field('Message')}
          onChange={set('Message')}
        />
      </div>

      <div className="invite-side-actions">
        <button
          type="button"
          className={`invite-side-btn ${formState.inviteSide === side ? 'active' : ''}`}
          onClick={() => onChange('inviteSide', side)}
        >
          <Eye size={14} /> Preview
        </button>
        <button
          type="button"
          className="invite-side-btn invite-side-btn--primary"
          onClick={() => onPublish(side)}
          disabled={publishing || !formState.names?.trim()}
        >
          <Share2 size={14} /> {publishing ? 'Publishing…' : 'Publish & get link'}
        </button>
      </div>
    </section>
  );
}

export default function InviteSidesEditor({ formState, onChange, onPublish, publishing }) {
  const current = formState.inviteSide || 'joint';

  return (
    <div className="invite-sides-editor">
      <h3 className="studio-section-title">Bride &amp; Groom Invitations</h3>
      <p className="studio-section-desc">
        Send a separate invitation from each family — each gets its own function, date, venue,
        contact and share link. The design, photos and music stay the same.
      </p>

      <div className="invite-side-switch" role="tablist" aria-label="Preview invitation">
        {INVITE_SIDES.map((s) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={current === s.id}
            className={`invite-side-switch-btn ${current === s.id ? 'active' : ''}`}
            onClick={() => onChange('inviteSide', s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>
      <p className="invite-side-switch-hint">
        Previewing: <strong>{INVITE_SIDES.find((s) => s.id === current)?.description}</strong>
      </p>

      {SIDE_FORMS.map((config) => (
        <SideForm
          key={config.side}
          config={config}
          formState={formState}
          onChange={onChange}
          onPublish={onPublish}
          publishing={publishing}
        />
      ))}
    </div>
  );
}

import React, { useState } from 'react';
import { Check, X, HelpCircle, Send } from 'lucide-react';
import { t } from '../data/i18n';
import { MEAL_OPTIONS } from '../data/invitationModel';

export default function RsvpSection({
  rsvpPhone,
  eventTitle,
  invitationId,
  language = 'en',
  secondaryLanguage,
  bilingual = false,
  mealPreferenceEnabled = false
}) {
  const [attending, setAttending] = useState(null);
  const [name, setName] = useState('');
  const [guestsCount, setGuestsCount] = useState(1);
  const [mealPreference, setMealPreference] = useState('both');
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter your name.');
      return;
    }

    const rsvpData = {
      id: Date.now().toString(),
      invitationId: invitationId || 'default',
      name: name.trim(),
      attending: attending === 'yes',
      maybe: attending === 'maybe',
      guestsCount: attending === 'yes' || attending === 'maybe' ? guestsCount : 0,
      mealPreference: mealPreferenceEnabled ? mealPreference : null,
      note: note.trim(),
      timestamp: new Date().toISOString()
    };

    try {
      const existingRsvps = JSON.parse(localStorage.getItem('aura_rsvps') || '[]');
      existingRsvps.push(rsvpData);
      localStorage.setItem('aura_rsvps', JSON.stringify(existingRsvps));
    } catch (err) {
      console.error('Failed to log RSVP:', err);
    }

    if (rsvpPhone) {
      const cleanPhone = rsvpPhone.replace(/[^0-9]/g, '');
      let text = '';
      const mealLabel = MEAL_OPTIONS.find((m) => m.id === mealPreference)?.label || '';

      if (attending === 'yes') {
        text = `Hi! I received your invitation to "${eventTitle || 'the event'}". I would love to attend!\n\nName: ${name.trim()}\nGuests: ${guestsCount}${mealPreferenceEnabled ? `\nMeal: ${mealLabel}` : ''}${note.trim() ? `\nMessage: "${note.trim()}"` : ''}\n\nSee you there!`;
      } else if (attending === 'maybe') {
        text = `Hi! Thank you for inviting me to "${eventTitle || 'the event'}". I may be able to attend — will confirm soon.\n\nName: ${name.trim()}\nGuests: ${guestsCount}${note.trim() ? `\nMessage: "${note.trim()}"` : ''}`;
      } else {
        text = `Hi! Thank you for inviting me to "${eventTitle || 'the event'}". Regretfully, I won't be able to attend.\n\nName: ${name.trim()}${note.trim() ? `\nMessage: "${note.trim()}"` : ''}`;
      }

      setTimeout(() => {
        window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
      }, 800);
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="guest-card-panel animate-fade-in-up animate-delay-3" style={{ textAlign: 'center' }}>
        <h3>{t(language, 'thankYou', secondaryLanguage, bilingual)}</h3>
        <p className="rsvp-success-message">
          {attending === 'yes'
            ? 'Your RSVP has been sent. Looking forward to celebrating with you!'
            : attending === 'maybe'
              ? 'Your response has been noted. We hope to see you!'
              : 'Your response has been sent. Thank you for letting us know!'}
        </p>
        {rsvpPhone && (
          <p style={{ fontSize: '12px', opacity: 0.7, marginTop: '10px' }}>
            Redirecting to WhatsApp...
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="guest-card-panel animate-fade-in-up animate-delay-3">
      <h3>{t(language, 'areYouAttending', secondaryLanguage, bilingual)}</h3>

      <div className="rsvp-buttons-toggle rsvp-buttons-3">
        <button
          type="button"
          className={`rsvp-toggle-btn ${attending === 'yes' ? 'active-yes' : ''}`}
          onClick={() => setAttending('yes')}
        >
          <Check size={16} /> {t(language, 'yesAttending', secondaryLanguage, bilingual)}
        </button>

        <button
          type="button"
          className={`rsvp-toggle-btn ${attending === 'maybe' ? 'active-maybe' : ''}`}
          onClick={() => setAttending('maybe')}
        >
          <HelpCircle size={16} /> {t(language, 'maybe', secondaryLanguage, bilingual)}
        </button>

        <button
          type="button"
          className={`rsvp-toggle-btn ${attending === 'no' ? 'active-no' : ''}`}
          onClick={() => setAttending('no')}
        >
          <X size={16} /> {t(language, 'regretfullyNo', secondaryLanguage, bilingual)}
        </button>
      </div>

      {attending && (
        <form onSubmit={handleSubmit} className="rsvp-inputs animate-fade-in">
          <div className="form-group">
            <label htmlFor="guest-name">{t(language, 'yourName', secondaryLanguage, bilingual)}</label>
            <input
              id="guest-name"
              type="text"
              className="rsvp-field"
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {(attending === 'yes' || attending === 'maybe') && (
            <div className="form-group">
              <label htmlFor="guest-count">
                {t(language, 'guestCount', secondaryLanguage, bilingual)}
              </label>
              <select
                id="guest-count"
                className="rsvp-field"
                value={guestsCount}
                onChange={(e) => setGuestsCount(parseInt(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? t(language, 'guest', secondaryLanguage, bilingual) : t(language, 'guests', secondaryLanguage, bilingual)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {mealPreferenceEnabled && attending === 'yes' && (
            <div className="form-group">
              <label htmlFor="meal-pref">
                {t(language, 'mealPreference', secondaryLanguage, bilingual)}
              </label>
              <select
                id="meal-pref"
                className="rsvp-field"
                value={mealPreference}
                onChange={(e) => setMealPreference(e.target.value)}
              >
                {MEAL_OPTIONS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="guest-note">{t(language, 'shortNote', secondaryLanguage, bilingual)}</label>
            <textarea
              id="guest-note"
              className="rsvp-field"
              placeholder={attending === 'no' ? 'Send warm wishes...' : "Can't wait! / Dietary restrictions"}
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-rsvp-submit">
            {t(language, 'confirmRsvp', secondaryLanguage, bilingual)} <Send size={14} />
          </button>
        </form>
      )}
    </div>
  );
}

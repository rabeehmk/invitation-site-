import React, { useState, useEffect } from 'react';
import { Heart, Send, Sparkles } from 'lucide-react';
import { t } from '../data/i18n';
import { getWishes, saveWish } from '../utils/dateUtils';
import { suggestWishes } from '../services/aiService';

export default function GuestbookSection({
  invitationId,
  eventType = 'wedding',
  language = 'en',
  secondaryLanguage,
  bilingual = false,
  isPreviewMode = false
}) {
  const [wishes, setWishes] = useState([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    if (invitationId && invitationId !== 'preview') {
      setWishes(getWishes(invitationId));
    }
  }, [invitationId]);

  const loadAiSuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const suggestions = await suggestWishes({ eventType, language });
      setAiSuggestions(suggestions);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  useEffect(() => {
    loadAiSuggestions();
  }, [eventType, language]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    const wish = {
      id: Date.now().toString(),
      name: name.trim(),
      message: message.trim(),
      timestamp: new Date().toISOString()
    };

    if (!isPreviewMode && invitationId) {
      saveWish(invitationId, wish);
      setWishes((prev) => [...prev, wish]);
    }

    setName('');
    setMessage('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const tapSuggestion = (text) => {
    setMessage(text);
  };

  return (
    <div className="guest-card-panel animate-fade-in-up animate-delay-3">
      <h3>
        <Heart size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
        {t(language, 'guestbook', secondaryLanguage, bilingual)}
      </h3>

      {wishes.length > 0 && (
        <div className="guestbook-wishes">
          {wishes.slice(-5).reverse().map((w) => (
            <div key={w.id} className="guestbook-wish-item">
              <strong>{w.name}</strong>
              <p>{w.message}</p>
            </div>
          ))}
        </div>
      )}

      {!isPreviewMode && (
        <form onSubmit={handleSubmit} className="guestbook-form">
          {aiSuggestions.length > 0 && (
            <div className="ai-wish-suggestions">
              <span className="ai-wish-label">
                <Sparkles size={12} /> AI Wish Suggestions — tap to use:
              </span>
              <div className="ai-wish-chips">
                {loadingSuggestions ? (
                  <span className="ai-wish-chip">Loading...</span>
                ) : (
                  aiSuggestions.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      className="ai-wish-chip"
                      onClick={() => tapSuggestion(s)}
                    >
                      {s.length > 60 ? s.slice(0, 60) + '…' : s}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          <input
            type="text"
            className="rsvp-field"
            placeholder={t(language, 'yourName', secondaryLanguage, bilingual)}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <textarea
            className="rsvp-field"
            placeholder={t(language, 'leaveWish', secondaryLanguage, bilingual)}
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <button type="submit" className="btn-rsvp-submit" style={{ marginTop: '8px' }}>
            <Send size={14} /> {t(language, 'submitWish', secondaryLanguage, bilingual)}
          </button>
          {submitted && (
            <p className="rsvp-success-message" style={{ marginTop: '8px' }}>
              {t(language, 'thankYou', secondaryLanguage, bilingual)}
            </p>
          )}
        </form>
      )}
    </div>
  );
}

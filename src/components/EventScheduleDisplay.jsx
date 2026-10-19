import React from 'react';
import { MapPin, Clock } from 'lucide-react';
import { formatEventDate, formatEventTime } from '../utils/dateUtils';
import { t } from '../data/i18n';

export default function EventScheduleDisplay({
  schedule = [],
  language = 'en',
  secondaryLanguage,
  bilingual = false,
  isPreviewMode = false
}) {
  if (!schedule || schedule.length === 0) return null;

  const sorted = [...schedule].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="guest-card-panel animate-fade-in-up animate-delay-2">
      <h3>{t(language, 'eventSchedule', secondaryLanguage, bilingual)}</h3>

      <div className="schedule-display-list">
        {sorted.map((evt) => (
          <div key={evt.id} className="schedule-display-item">
            <div className="schedule-display-name">{evt.name}</div>

            {evt.date && (
              <div className="schedule-display-row">
                <Clock size={14} />
                <span>
                  {formatEventDate(evt.date, language)}
                  {' · '}
                  {formatEventTime(evt.date, language)}
                  {evt.endTime && ` – ${evt.endTime}`}
                </span>
              </div>
            )}

            {(evt.venue || evt.address) && (
              <div className="schedule-display-row">
                <MapPin size={14} />
                <span>
                  {[evt.venue, evt.address].filter(Boolean).join(', ')}
                </span>
              </div>
            )}

            {evt.mapLink && (
              <a
                href={evt.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-theme-outline schedule-map-link"
                style={{ pointerEvents: isPreviewMode ? 'none' : 'auto' }}
              >
                {t(language, 'getDirections', secondaryLanguage, bilingual)}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

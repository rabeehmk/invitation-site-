import React from 'react';
import { CalendarPlus } from 'lucide-react';
import { buildCalendarUrl } from '../utils/dateUtils';
import { t } from '../data/i18n';

export default function AddToCalendarButton({
  title,
  date,
  endDate,
  venue,
  venueName,
  message,
  language = 'en',
  secondaryLanguage,
  bilingual = false,
  isPreviewMode = false
}) {
  const url = buildCalendarUrl({
    title,
    date,
    endDate,
    venue,
    venueName,
    description: message
  });

  if (!url || !date) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-theme-outline"
      style={{
        pointerEvents: isPreviewMode ? 'none' : 'auto',
        marginTop: '10px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px'
      }}
    >
      <CalendarPlus size={14} />
      {t(language, 'addToCalendar', secondaryLanguage, bilingual)}
    </a>
  );
}

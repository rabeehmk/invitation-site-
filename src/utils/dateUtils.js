/**
 * Approximate Gregorian → Hijri conversion (Umm al-Qura algorithm simplified).
 * Suitable for display on invitations; not for religious/legal dates.
 */
export function toHijriDate(dateStr, locale = 'en') {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return '';

    // Use Intl for Hijri when available (modern browsers)
    if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
      try {
        return new Intl.DateTimeFormat(`${locale}-u-ca-islamic`, {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }).format(date);
      } catch {
        // fallback below
      }
    }

    // Fallback: tabular Islamic calendar approximation
    const jd = gregorianToJulian(date);
    const hijri = julianToHijri(jd);
    const months = [
      'Muharram', 'Safar', "Rabi' al-awwal", "Rabi' al-thani",
      'Jumada al-awwal', 'Jumada al-thani', 'Rajab', "Sha'ban",
      'Ramadan', 'Shawwal', "Dhu al-Qi'dah", 'Dhu al-Hijjah'
    ];
    return `${hijri.day} ${months[hijri.month - 1]} ${hijri.year} AH`;
  } catch {
    return '';
  }
}

function gregorianToJulian(date) {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  return (
    d +
    Math.floor((153 * mm + 2) / 5) +
    365 * yy +
    Math.floor(yy / 4) -
    Math.floor(yy / 100) +
    Math.floor(yy / 400) -
    32045
  );
}

function julianToHijri(jd) {
  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j =
    Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) +
    Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
  const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const month = Math.floor((24 * l3) / 709);
  const day = l3 - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;
  return { year, month, day };
}

/** Build Google Calendar URL */
export function buildCalendarUrl({ title, date, endDate, venue, venueName, description }) {
  if (!date) return '';
  const start = new Date(date);
  const end = endDate ? new Date(endDate) : new Date(start.getTime() + 3 * 60 * 60 * 1000);

  const fmt = (d) =>
    d
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}/, '');

  const location = [venueName, venue].filter(Boolean).join(', ');
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title || 'Event Invitation',
    dates: `${fmt(start)}/${fmt(end)}`,
    details: description || '',
    location
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Format date for display with locale */
export function formatEventDate(dateStr, lang = 'en') {
  if (!dateStr) return '';
  try {
    const locale = lang === 'ml' ? 'ml-IN' : lang === 'hi' ? 'hi-IN' : lang === 'ar' ? 'ar-AE' : undefined;
    return new Date(dateStr).toLocaleDateString(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

export function formatEventTime(dateStr, lang = 'en') {
  if (!dateStr) return '';
  try {
    const locale = lang === 'ml' ? 'ml-IN' : lang === 'hi' ? 'hi-IN' : lang === 'ar' ? 'ar-AE' : undefined;
    return new Date(dateStr).toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return '';
  }
}

/** Track view count per invitation hash (client-side) */
export function incrementViewCount(invitationHash) {
  if (!invitationHash || invitationHash === 'preview') return;
  try {
    const key = 'aura_views';
    const views = JSON.parse(localStorage.getItem(key) || '{}');
    views[invitationHash] = (views[invitationHash] || 0) + 1;
    localStorage.setItem(key, JSON.stringify(views));
    return views[invitationHash];
  } catch {
    return 0;
  }
}

export function getViewCount(invitationHash) {
  try {
    const views = JSON.parse(localStorage.getItem('aura_views') || '{}');
    return views[invitationHash] || 0;
  } catch {
    return 0;
  }
}

/** Guestbook wishes stored per invitation */
export function saveWish(invitationId, wish) {
  try {
    const key = 'aura_wishes';
    const all = JSON.parse(localStorage.getItem(key) || '{}');
    if (!all[invitationId]) all[invitationId] = [];
    all[invitationId].push(wish);
    localStorage.setItem(key, JSON.stringify(all));
  } catch (e) {
    console.error(e);
  }
}

export function getWishes(invitationId) {
  try {
    const all = JSON.parse(localStorage.getItem('aura_wishes') || '{}');
    return all[invitationId] || [];
  } catch {
    return [];
  }
}

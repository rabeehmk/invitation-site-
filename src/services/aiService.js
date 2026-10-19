/**
 * AI service layer — smart template engine for offline/demo use.
 * Swap `callAI()` with a real API (OpenAI, Gemini, etc.) for production.
 */

export const AI_TONES = [
  { id: 'formal', label: 'Formal & Elegant' },
  { id: 'casual', label: 'Casual & Warm' },
  { id: 'poetic', label: 'Poetic & Romantic' },
  { id: 'religious', label: 'Religious & Traditional' }
];

export const AI_BG_STYLES = [
  { id: 'floral-gold', label: 'Floral Gold (Kerala)' },
  { id: 'mandala', label: 'Traditional Mandala' },
  { id: 'islamic-geometric', label: 'Islamic Geometric' },
  { id: 'minimal-blush', label: 'Minimal Blush' },
  { id: 'sage-botanical', label: 'Sage Botanical' }
];

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function callAI(fn) {
  await delay(600 + Math.random() * 400);
  return fn();
}

/* ─── Invitation text generator ─── */
const TEXT_TEMPLATES = {
  wedding: {
    formal: {
      en: (n) => `With hearts full of joy, ${n} request the honour of your presence as they unite in the sacred bond of marriage. Your blessings will make their celebration complete.`,
      ml: (n) => `${n} എന്നിവർ വിവാഹ ബന്ധത്തിൽ ഏകീkrutമാകുന്ന ഈ പavitra നിമിഷത്തിൽ നിങ്ങളുടെ സാന്നിധ്യവും ആശീർവാദവും അനുഗ്രഹിക്കാൻ ക്ഷണിക്കുന്നു.`,
      hi: (n) => `${n} आपको अपने पवित्र विवाह बंधन में सादर आमंत्रित करते हैं। आपकी उपस्थिति और आशीर्वाद उनके जीवन को और भी सुंदर बनाएगी।`,
      ar: (n) => `${n} يتشرفان بدعوتكم لحضور حفل زفافهما. بركاتكم ستجعل احتفالهما مكتملاً.`
    },
    casual: {
      en: (n) => `Hey! ${n} are tying the knot and they'd love for you to be there! Come celebrate love, laughter, and lots of good food with us!`,
      ml: (n) => `${n} വിവാഹം കഴിക്കുന്നു — നിങ്ങൾ വരണം! സന്തോഷവും ചിരിയും നല്ല ഭക്ഷണവും ഒരുക്കിയിരിക്കുന്നു!`,
      hi: (n) => `${n} की शादी है और आपको पक्का बुलाया है! प्यार, हँसी और ज़बरदस्त खाने के लिए तैयार रहें!`,
      ar: (n) => `${n} يتزوجان ويسعدهما حضوركم! تعالوا للاحتفال بالحب والضحك!`
    },
    poetic: {
      en: (n) => `Two souls, one journey — ${n} invite you to witness the moment when their hearts become one, beneath a sky painted with promises of forever.`,
      ml: (n) => `രണ്ട് ആത്മാക്കൾ, ഒരു യാത്ര — ${n} എന്നിവരുടെ ഹൃദയങ്ങൾ യugമിക്കുന്ന ആ നിമിഷത്തിന്റെ സാക്ഷികളാകാൻ നിങ്ങളെ ക്ഷണിക്കുന്നു.`,
      hi: (n) => `दो रूह, एक रास्ता — ${n} आपको उस पल का साक्षी बनने के लिए आमंत्रित करते हैं जब उनके दिल एक हो जाएँगे।`,
      ar: (n) => `روحان، رحلة واحدة — ${n} يدعوانكم لمشهد لحظة اتحاد قلبيهما.`
    },
    religious: {
      en: (n) => `By the grace of the Almighty, ${n} seek your presence and prayers as they begin their life together in accordance with divine blessings.`,
      ml: (n) => `ദൈവാനുഗ്രഹത്താൽ, ${n} എന്നിവർ ദൈവീക ആശീർവാദത്തോടെ പുതിയ ജീവിതം ആരംഭിക്കുന്ന ഈ auspicious നിമിഷത്തിൽ നിങ്ങളുടെ പ്രാർത്ഥനയും സാന്നിധ്യവും തേടുന്നു.`,
      hi: (n) => `ईश्वर की कृपा से, ${n} दिव्य आशीर्वाद के साथ अपना नया जीवन शुरू कर रहे हैं। आपकी प्रार्थना और उपस्थिति अनुरोध है।`,
      ar: (n) => `بفضل الله، ${n} يطلبان حضوركم ودعواتكم لبدء حياتهما معاً ببركة إلهية.`
    }
  },
  birthday: {
    formal: { en: (n) => `${n} cordially invites you to celebrate another year of life's beautiful journey.` },
    casual: { en: (n) => `It's party time! Join ${n} for cake, fun, and unforgettable memories!` },
    poetic: { en: (n) => `Another candle, another wish — celebrate ${n}'s special day with joy and warmth.` },
    religious: { en: (n) => `With gratitude to the Almighty, ${n} invites you to celebrate this blessed occasion.` }
  },
  housewarming: {
    formal: { en: (n) => `${n} request your gracious presence at their Griha Pravesham — the auspicious entry into their new home.` },
    casual: { en: (n) => `${n} got new keys! Come see the new home and enjoy a feast with us!` },
    poetic: { en: (n) => `A new door opens, a new chapter begins — join ${n} as they step into their dream home.` },
    religious: { en: (n) => `${n} seek your blessings for their Griha Pravesham, entering their new abode with divine grace.` }
  }
};

export async function generateInvitationText({ names, eventType, tone, language }) {
  return callAI(() => {
    const templates = TEXT_TEMPLATES[eventType] || TEXT_TEMPLATES.wedding;
    const toneSet = templates[tone] || templates.formal;
    const fn = toneSet[language] || toneSet.en;
    return fn(names || 'Our Family');
  });
}

/* ─── Wish suggestions for guestbook ─── */
const WISHES = {
  wedding: {
    en: [
      'Wishing you both a lifetime of love and happiness! 💕',
      'May your journey together be filled with joy and blessings.',
      'Congratulations! May Allah bless your union with peace and prosperity.',
      'ആശംസകൾ! നിങ്ങൾക്ക് സന്തോഷമേറിയ ജീവിതം ലഭിക്കട്ടെ!',
      'Heartiest congratulations on your special day!'
    ],
    ml: [
      'ആശംസകൾ! നിങ്ങൾക്ക് സന്തോഷമേറിയ ജീവിതം ലഭിക്കട്ടെ! 💕',
      'ദൈവം നിങ്ങളെ അനുഗ്രഹിക്കട്ടെ!',
      'Congratulations! Wishing you eternal happiness!'
    ],
    hi: [
      'बधाई हो! आप दोनों को जीवनभर की खुशियाँ मिलें! 💕',
      'ईश्वर आपको सुख-समृद्धि दे!',
      'Heartiest congratulations on your wedding!'
    ]
  },
  birthday: {
    en: ['Happy Birthday! Wishing you an amazing year ahead! 🎂', 'Many happy returns of the day!']
  },
  default: {
    en: ['Wishing you all the best!', 'Congratulations and best wishes!', 'So happy for you! 🎉']
  }
};

export async function suggestWishes({ eventType, language }) {
  return callAI(() => {
    const pool = WISHES[eventType] || WISHES.default;
    return pool[language] || pool.en || WISHES.default.en;
  });
}

/* ─── Simple translate (template swap — replace with real API) ─── */
const TRANSLATE_MAP = {
  'Join us for an elegant evening': {
    ml: 'ഒരു elegant സായാഹ്നത്തിനായി ഞങ്ങളോടൊപ്പം ചേരുക',
    hi: 'एक शानदार शाम के लिए हमारे साथ जुड़ें',
    ar: 'انضموا إلينا في أمسية راقية'
  }
};

export async function translateText(text, fromLang, toLang) {
  return callAI(() => {
    if (fromLang === toLang) return text;
    const mapped = TRANSLATE_MAP[text]?.[toLang];
    if (mapped) return mapped;
    return `[${toLang.toUpperCase()}] ${text}`;
  });
}

/* ─── Theme suggestion ─── */
export async function suggestTheme({ eventType, language }) {
  return callAI(() => {
    const map = {
      wedding: { theme: 'dark-gold', reason: 'Elegant gold suits traditional Kerala & North Indian weddings' },
      birthday: { theme: 'modern-gradient', reason: 'Vibrant gradient fits celebratory birthday vibes' },
      housewarming: { theme: 'sage-cream', reason: 'Sage green evokes warmth and new beginnings' },
      religious: { theme: 'classic-burgundy', reason: 'Burgundy & gold reflects sacred ceremonies' },
      anniversary: { theme: 'rose-ivory', reason: 'Rose ivory is romantic and timeless' },
      corporate: { theme: 'modern-gradient', reason: 'Clean modern look for professional events' },
      party: { theme: 'modern-gradient', reason: 'Bold and fun for parties' }
    };
    const s = map[eventType] || map.wedding;
    if (language === 'ml') s.reason = 'പാരമ്പര്യ Kerala wedding-ന് ideal — dark gold theme';
    return s;
  });
}

/* ─── Chat builder: parse natural language ─── */
export async function parseEventFromChat(input) {
  return callAI(() => {
    const result = {};
    const lower = input.toLowerCase();

    if (/wedding|vivaham|വിവാഹ|शादी|nikah|reception|mehendi|sangeet/i.test(input)) result.eventType = 'wedding';
    else if (/birthday|janmadin|ജന്മദിന|जन्मदिन/i.test(input)) result.eventType = 'birthday';
    else if (/housewarming|griha|pravesham|house warming|പുതിയ വീട/i.test(input)) result.eventType = 'housewarming';
    else if (/anniversary/i.test(input)) result.eventType = 'anniversary';

    const nameMatch = input.match(/(?:of|for|between)\s+([A-Za-z\u0900-\u097F\u0D00-\u0D7F\s&]+?)(?:\s+on|\s+at|\s+in|,|\.|$)/i)
      || input.match(/([A-Za-z\u0900-\u097F\u0D00-\u0D7F]+)\s*(?:&|and|ഉം|ആണ്)\s*([A-Za-z\u0900-\u097F\u0D00-\u0D7F]+)/i);
    if (nameMatch) {
      if (nameMatch[2]) result.names = `${nameMatch[1].trim()} & ${nameMatch[2].trim()}`;
      else result.names = nameMatch[1].trim();
    }

    const dateMatch = input.match(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})|(\d{4}-\d{2}-\d{2})|((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2},?\s+\d{4})/i);
    if (dateMatch) {
      try {
        const d = new Date(dateMatch[0]);
        if (!Number.isNaN(d.getTime())) {
          result.date = d.toISOString().slice(0, 16);
        }
      } catch { /* ignore */ }
    }

    const atMatch = input.match(/(?:at|in|venue|@)\s+([A-Za-z0-9\s,.-]+?)(?:\s+on|\s+near|\.|$)/i);
    if (atMatch) result.venueName = atMatch[1].trim();

    if (/formal/i.test(lower)) result.tone = 'formal';
    else if (/casual|fun/i.test(lower)) result.tone = 'casual';
    else if (/poetic|romantic/i.test(lower)) result.tone = 'poetic';
    else if (/religious|traditional|islamic|hindu/i.test(lower)) result.tone = 'religious';

    return result;
  });
}

/* ─── Video invite script ─── */
export async function generateVideoScript({ names, eventType, date, venueName, language }) {
  return callAI(() => {
    const d = date ? new Date(date).toLocaleDateString() : 'the special day';
    const scripts = {
      en: `🎬 Video Invite Script\n\n[Opening — soft music]\n\n"Hello and warm greetings!"\n\n"We, ${names}, are delighted to invite you to our ${eventType === 'wedding' ? 'wedding celebration' : eventType}."\n\n"Join us on ${d}${venueName ? ` at ${venueName}` : ''}."\n\n"Your presence and blessings mean the world to us."\n\n"See you there! With love, ${names}."`,
      ml: `🎬 വീഡിയോ ക്ഷണ സ്ക്രിപ്റ്റ്\n\n[സംഗീതം]\n\n"നമസ്കാരം!"\n\n"${names} എന്നിവരുടെ ${eventType === 'wedding' ? 'വിവാഹ' : ''} ചടങ്ങിലേക്ക് നിങ്ങളെ സ്നേഹപൂർവ്വം ക്ഷണിക്കുന്നു."\n\n"തീയതി: ${d}${venueName ? `, സ്ഥലം: ${venueName}` : ''}"\n\n"നിങ്ങളുടെ സാന്നിധ്യം ഞങ്ങൾക്ക് അമൂല്യമാണ്."`,
      hi: `🎬 वीडियो निमंत्रण स्क्रिप्ट\n\n[संगीत]\n\n"नमस्ते!"\n\n"${names} आपको अपने ${eventType === 'wedding' ? 'विवाह' : 'कार्यक्रम'} में सादर आमंत्रित करते हैं।"\n\n"दिनांक: ${d}${venueName ? `, स्थान: ${venueName}` : ''}"\n\n"आपकी उपस्थिति हमारे लिए महत्वपूर्ण है।"`
    };
    return scripts[language] || scripts.en;
  });
}

/* ─── RSVP reminder messages ─── */
export async function generateRsvpReminder({ guestName, eventTitle, hostPhone, language }) {
  return callAI(() => {
    const msgs = {
      en: `Hi ${guestName || 'there'}! 👋 Just a gentle reminder about "${eventTitle}". We'd love to know if you can make it! Please RSVP when you get a chance. Thank you! 🙏`,
      ml: `ഹായ് ${guestName || ''}! "${eventTitle}" ക്ഷണം സംബന്ധിച്ച gentle reminder. നിങ്ങൾ വരുമോ എന്ന് അറിയാൻ ആഗ്രഹിക്കുന്നു. RSVP ചെയ്യാൻ മറക്കരുത്! 🙏`,
      hi: `नमस्ते ${guestName || ''}! "${eventTitle}" के लिए एक gentle reminder। क्या आप आ पाएँगे? कृपया RSVP confirm करें। 🙏`
    };
    return msgs[language] || msgs.en;
  });
}

/* ─── Analytics summary ─── */
export async function generateAnalyticsSummary({ rsvps, creations }) {
  return callAI(() => {
    const total = rsvps.length;
    const attending = rsvps.filter((r) => r.attending).length;
    const declined = rsvps.filter((r) => !r.attending && !r.maybe).length;
    const maybe = rsvps.filter((r) => r.maybe).length;
    const rate = total > 0 ? Math.round((attending / total) * 100) : 0;
    const guestCount = rsvps.filter((r) => r.attending).reduce((s, r) => s + (r.guestsCount || 1), 0);

    let summary = `📊 AI Insights Summary\n\n`;
    summary += `• ${rate}% confirmation rate (${attending} yes, ${maybe} maybe, ${declined} no out of ${total} responses)\n`;
    summary += `• Total expected guests: ${guestCount}\n`;
    summary += `• Active cards: ${creations.length}\n`;

    if (rate < 50 && total > 0) summary += `\n💡 Tip: Send WhatsApp reminders to guests who haven't responded yet.`;
    if (maybe > 0) summary += `\n💡 ${maybe} guest(s) marked "Maybe" — a personal follow-up could help confirm.`;
    if (total === 0) summary += `\n💡 Share your invite link on WhatsApp groups for faster responses.`;

    return summary;
  });
}

/* ─── Marketing captions ─── */
export async function generateMarketingCaption({ eventType, theme, language }) {
  return callAI(() => {
    const caps = {
      en: `✨ Create stunning digital ${eventType} invitations in minutes!\n\n🎨 Premium ${theme} theme\n📱 WhatsApp-ready share link\n💌 Built-in RSVP tracking\n\nTry Aura Invite — link in bio! #WeddingInvite #DigitalInvitation #KeralaWedding`,
      ml: `✨ മിനിറ്റുകൾക്കുള്ളിൽ beautiful digital ${eventType} invitation!\n\n📱 WhatsApp-ൽ share ചെയ്യാം\n💌 RSVP tracking built-in\n\nAura Invite പരീക്ഷിക്കൂ! #KeralaWedding #DigitalInvite`
    };
    return caps[language] || caps.en;
  });
}

import React, { useState, useRef } from 'react';
import {
  Sparkles, Wand2, Languages, MessageSquare, Mic, MicOff,
  Video, Image, Palette, Copy, Check, Send, Loader
} from 'lucide-react';
import {
  AI_TONES, AI_BG_STYLES,
  generateInvitationText, translateText,
  suggestTheme, parseEventFromChat, generateVideoScript,
  generateMarketingCaption
} from '../services/aiService';
import { generateAIBackground, generateSaveTheDateImage, downloadDataUrl } from '../utils/photoUtils';
import { LANGUAGES } from '../data/invitationModel';

export default function AIAssistantPanel({ formState, onApply }) {
  const [loading, setLoading] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [tone, setTone] = useState('formal');
  const [genLang, setGenLang] = useState(formState.language || 'en');
  const [translateTarget, setTranslateTarget] = useState('ml');
  const [translatedText, setTranslatedText] = useState('');
  const [themeSuggestion, setThemeSuggestion] = useState(null);
  const [videoScript, setVideoScript] = useState('');
  const [marketingCaption, setMarketingCaption] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', text: 'Hi! Tell me about your event — e.g. "Wedding of Ananya and Arjun on 20 September at Taj Convention Centre, Kozhikode"' }
  ]);
  const [copied, setCopied] = useState('');
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const [chatParsed, setChatParsed] = useState(null);

  const run = async (key, fn) => {
    setLoading(key);
    try {
      return await fn();
    } finally {
      setLoading('');
    }
  };

  const handleGenerateText = async () => {
    const text = await run('text', () =>
      generateInvitationText({
        names: formState.names,
        eventType: formState.eventType,
        tone,
        language: genLang
      })
    );
    setGeneratedText(text);
  };

  const handleTranslate = async () => {
    const text = await run('translate', () =>
      translateText(formState.message, formState.language, translateTarget)
    );
    setTranslatedText(text);
  };

  const handleSuggestTheme = async () => {
    const s = await run('theme', () =>
      suggestTheme({ eventType: formState.eventType, language: formState.language })
    );
    setThemeSuggestion(s);
  };

  const handleGenerateBg = async (styleId) => {
    await run('bg', async () => {
      const bg = generateAIBackground(styleId);
      onApply({ aiBackgroundStyle: styleId, useAiBackground: true, uploadedPhoto: bg, isUploaded: true });
    });
  };

  const handleVideoScript = async () => {
    const script = await run('video', () =>
      generateVideoScript({
        names: formState.names,
        eventType: formState.eventType,
        date: formState.date,
        venueName: formState.venueName,
        language: formState.language
      })
    );
    setVideoScript(script);
  };

  const handleMarketing = async () => {
    const cap = await run('marketing', () =>
      generateMarketingCaption({
        eventType: formState.eventType,
        theme: formState.theme,
        language: formState.language
      })
    );
    setMarketingCaption(cap);
  };

  const handleSaveTheDate = () => {
    const img = generateSaveTheDateImage({
      names: formState.names,
      date: formState.date,
      venueName: formState.venueName,
      theme: formState.theme
    });
    downloadDataUrl(img, 'save-the-date.png');
  };

  const handleChatSend = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');

    const parsed = await run('chat', () => parseEventFromChat(userMsg));
    const fields = Object.entries(parsed).map(([k, v]) => `${k}: ${v}`).join(', ');
    setChatMessages((prev) => [
      ...prev,
      {
        role: 'ai',
        text: fields
          ? `Got it! I extracted: ${fields}. Click "Apply to Card" to fill the form.`
          : "I couldn't extract details. Try: 'Wedding of Priya & Rahul on 15 Dec 2026 at Lulu Convention Centre'"
      }
    ]);

    if (Object.keys(parsed).length > 0) {
      setChatParsed(parsed);
    }
  };

  const applyChatParsed = () => {
    if (chatParsed) {
      onApply(chatParsed);
      if (chatParsed.tone) setTone(chatParsed.tone);
    }
  };

  const startVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice input is not supported in this browser. Try Chrome.');
      return;
    }
    const rec = new SpeechRecognition();
    rec.lang = formState.language === 'ml' ? 'ml-IN' : formState.language === 'hi' ? 'hi-IN' : 'en-IN';
    rec.interimResults = false;
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setChatInput(transcript);
      setListening(false);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recognitionRef.current = rec;
    rec.start();
    setListening(true);
  };

  const stopVoice = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const copyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="ai-panel">
      <div className="ai-panel-header">
        <Sparkles size={18} style={{ color: 'var(--studio-accent)' }} />
        <h3>AI Smart Assistant</h3>
      </div>

      {/* Chat Builder */}
      <div className="ai-section">
        <h4><MessageSquare size={14} /> Chat Card Builder</h4>
        <div className="ai-chat-box">
          {chatMessages.map((m, i) => (
            <div key={i} className={`ai-chat-msg ai-chat-${m.role}`}>{m.text}</div>
          ))}
        </div>
        <div className="ai-chat-input-row">
          <input
            type="text"
            placeholder="Describe your event in natural language..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
          />
          <button type="button" className="btn-icon-ai" onClick={listening ? stopVoice : startVoice} title="Voice input">
            {listening ? <MicOff size={16} /> : <Mic size={16} />}
          </button>
          <button type="button" className="btn-icon-ai" onClick={handleChatSend} disabled={loading === 'chat'}>
            {loading === 'chat' ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
        {chatParsed && (
          <button type="button" className="btn-secondary-outline" style={{ marginTop: '8px' }} onClick={applyChatParsed}>
            Apply Extracted Fields to Card
          </button>
        )}
      </div>

      {/* Wording Generator */}
      <div className="ai-section">
        <h4><Wand2 size={14} /> AI Wording Generator</h4>
        <div className="form-row-2">
          <select value={tone} onChange={(e) => setTone(e.target.value)}>
            {AI_TONES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
          <select value={genLang} onChange={(e) => setGenLang(e.target.value)}>
            {LANGUAGES.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
          </select>
        </div>
        <button type="button" className="btn-secondary-outline" onClick={handleGenerateText} disabled={!!loading}>
          {loading === 'text' ? 'Generating...' : '✨ Generate Invitation Text'}
        </button>
        {generatedText && (
          <div className="ai-output-box">
            <p>{generatedText}</p>
            <div className="ai-output-actions">
              <button type="button" className="btn-icon-ai" onClick={() => onApply({ message: generatedText })}>Use This</button>
              <button type="button" className="btn-icon-ai" onClick={() => copyText(generatedText, 'gen')}>
                {copied === 'gen' ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Auto Translate */}
      <div className="ai-section">
        <h4><Languages size={14} /> Multi-Language Translate</h4>
        <select value={translateTarget} onChange={(e) => setTranslateTarget(e.target.value)}>
          {LANGUAGES.filter((l) => l.id !== formState.language).map((l) => (
            <option key={l.id} value={l.id}>Translate to {l.label}</option>
          ))}
        </select>
        <button type="button" className="btn-secondary-outline" onClick={handleTranslate} disabled={!!loading || !formState.message}>
          {loading === 'translate' ? 'Translating...' : 'Translate Message'}
        </button>
        {translatedText && (
          <div className="ai-output-box">
            <p>{translatedText}</p>
            <button type="button" className="btn-icon-ai" onClick={() => onApply({ message: translatedText, language: translateTarget })}>
              Apply Translation
            </button>
          </div>
        )}
      </div>

      {/* Theme Suggestion */}
      <div className="ai-section">
        <h4><Palette size={14} /> AI Theme Suggestion</h4>
        <button type="button" className="btn-secondary-outline" onClick={handleSuggestTheme} disabled={!!loading}>
          {loading === 'theme' ? 'Analyzing...' : 'Suggest Best Theme'}
        </button>
        {themeSuggestion && (
          <div className="ai-output-box">
            <p><strong>{themeSuggestion.theme}</strong> — {themeSuggestion.reason}</p>
            <button type="button" className="btn-icon-ai" onClick={() => onApply({ theme: themeSuggestion.theme })}>
              Apply Theme
            </button>
          </div>
        )}
      </div>

      {/* AI Background */}
      <div className="ai-section">
        <h4><Image size={14} /> AI Background Generator</h4>
        <div className="ai-bg-grid">
          {AI_BG_STYLES.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`ai-bg-btn ${formState.aiBackgroundStyle === s.id ? 'active' : ''}`}
              onClick={() => handleGenerateBg(s.id)}
              disabled={!!loading}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Video Script */}
      <div className="ai-section">
        <h4><Video size={14} /> AI Video Invite Script</h4>
        <button type="button" className="btn-secondary-outline" onClick={handleVideoScript} disabled={!!loading}>
          {loading === 'video' ? 'Writing...' : 'Generate Video Script'}
        </button>
        {videoScript && (
          <div className="ai-output-box ai-output-pre">
            <pre style={{ whiteSpace: 'pre-wrap', margin: 0, fontSize: '12px' }}>{videoScript}</pre>
            <button type="button" className="btn-icon-ai" onClick={() => copyText(videoScript, 'video')}>
              {copied === 'video' ? <Check size={14} /> : <Copy size={14} />} Copy
            </button>
          </div>
        )}
      </div>

      {/* Save the Date + Marketing */}
      <div className="ai-section">
        <h4>Share & Marketing</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button type="button" className="btn-secondary-outline" onClick={handleSaveTheDate}>
            📱 Generate Save-the-Date Story Image
          </button>
          <button type="button" className="btn-secondary-outline" onClick={handleMarketing} disabled={!!loading}>
            {loading === 'marketing' ? 'Creating...' : '📸 Generate Instagram Caption'}
          </button>
        </div>
        {marketingCaption && (
          <div className="ai-output-box">
            <p style={{ fontSize: '12px', whiteSpace: 'pre-wrap' }}>{marketingCaption}</p>
            <button type="button" className="btn-icon-ai" onClick={() => copyText(marketingCaption, 'cap')}>
              {copied === 'cap' ? <Check size={14} /> : <Copy size={14} />} Copy
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

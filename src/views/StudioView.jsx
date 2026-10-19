import React, { useState } from 'react';
import { Layout, Palette, Calendar, Globe, Split, CircleCheck, Circle, Smartphone, Monitor, Sparkles, Share2, Home, Wand2, LayoutTemplate, Settings2, ArrowLeft, PencilLine, Eye } from 'lucide-react';
import ThemeSelector from '../components/ThemeSelector';
import TemplateSelector from '../components/TemplateSelector';
import CustomizePanel, { CustomizePanelHeader } from '../components/CustomizePanel';
import TraditionCustomizePanel from '../components/TraditionCustomizePanel';
import ReligionFieldsEditor from '../components/ReligionFieldsEditor';
import PhotoUploader from '../components/PhotoUploader';
import InvitationPreview from '../components/InvitationPreview';
import TraditionCard from '../components/tradition/TraditionCard';
import ShareModal from '../components/ShareModal';
import ScheduleEditor from '../components/ScheduleEditor';
import AIAssistantPanel from '../components/AIAssistantPanel';
import CouplePhotoUpload from '../components/CouplePhotoUpload';
import { TravelDirectionsEditor } from '../components/DirectionsSection';
import MusicSelector from '../components/MusicSelector';
import EnvelopeIntroEditor from '../components/EnvelopeIntroEditor';
import { publishInvitation } from '../utils/helpers';
import { getInviteSideLabel } from '../utils/inviteSides';
import InviteSidesEditor from '../components/InviteSidesEditor';
import { createDefaultInvitation, getPlaceholderTitle, EVENT_TYPES, LANGUAGES, FONT_OPTIONS } from '../data/invitationModel';
import { getDefaultSectionVisibility } from '../data/templates';
import LayoutStructurePicker from '../components/LayoutStructurePicker';
import PremiumMediaStudio from '../components/PremiumMediaStudio';
import { getTemplateById } from '../config/index';
import { getReligion } from '../config/religions';
import { WEDDING_PRESETS } from '../data/weddingPresets';

export default function StudioView({ onNavigate, initialState = null, religionId = null, onBackToTemplates }) {
  const [formState, setFormState] = useState(() =>
    initialState || createDefaultInvitation({ sectionVisibility: getDefaultSectionVisibility() })
  );

  const isTraditionFlow = !!(formState.religion || religionId);
  const activeReligion = formState.religion || religionId;
  const religionConfig = activeReligion ? getReligion(activeReligion) : null;

  const [activeTab, setActiveTab] = useState('content');
  const [previewDevice, setPreviewDevice] = useState('mobile');
  // Phones/tablets show one pane at a time: the editor or the live preview
  const [mobileView, setMobileView] = useState('edit');
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [shareShortUrl, setShareShortUrl] = useState('');
  const [shareIsLongUrl, setShareIsLongUrl] = useState(false);

  const handleLoadPreset = (presetKey) => {
    const preset = WEDDING_PRESETS[presetKey] || WEDDING_PRESETS.hindu;
    setFormState((prev) => ({
      ...prev,
      ...preset,
      religion: preset.religion || prev.religion,
      title: preset.title || prev.title,
      names: preset.names || prev.names,
      schedule: preset.schedule || prev.schedule,
      galleryPhotos: preset.galleryPhotos || prev.galleryPhotos,
      sectionVisibility: {
        ...prev.sectionVisibility,
        showDressCode: true,
        showGiftNote: true,
        showLiveStream: true,
        showAccommodation: true,
        showCountdown: true,
        showSchedule: true,
        showTravel: true,
        showRsvp: true,
        showGuestbook: true,
        showGallery: true
      }
    }));
  };

  const handleStateChange = (key, value) => {
    setFormState((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleBatchChange = (updates) => {
    setFormState((prev) => ({ ...prev, ...updates }));
  };

  const handleApplyAI = (updates) => {
    setFormState((prev) => ({ ...prev, ...updates }));
  };

  const handlePhotoChange = ({ isUploaded, uploadedPhoto, presetIdx }) => {
    setFormState((prev) => ({
      ...prev,
      isUploaded,
      uploadedPhoto,
      presetIdx
    }));
  };

  const handleEventTypeChange = (newType) => {
    setFormState((prev) => ({
      ...prev,
      eventType: newType,
      presetIdx: 0,
      title: getPlaceholderTitle(newType, prev.names)
    }));
  };

  const [publishError, setPublishError] = useState('');
  const [publishing, setPublishing] = useState(false);

  const [shareSide, setShareSide] = useState('joint');
  const [shareNotice, setShareNotice] = useState('');

  // `side` publishes the bride's or groom's family version; buttons pass a click event instead
  const handlePublish = async (side) => {
    const publishSide = typeof side === 'string' ? side : formState.inviteSide || 'joint';
    const stateToPublish = { ...formState, inviteSide: publishSide };
    setPublishError('');
    setPublishing(true);

    try {
      const result = await publishInvitation(stateToPublish);

      if (!result.ok) {
        setPublishError(result.error || 'Failed to publish. Please try again.');
        return;
      }

      const { shareUrl, hash, hashUrl, shortUrl } = result;
      setShareNotice(
        result.storage !== 'cloud'
          ? 'Could not save online right now, so this link carries the whole invitation and may break if it is shortened by an app. Check your connection and publish again for a short link.'
          : result.audioTooLarge
            ? 'Your uploaded song is over 2.5 MB, so guests will not hear it. Upload a shorter or compressed MP3 and publish again.'
            : ''
      );

      try {
        const history = JSON.parse(localStorage.getItem('aura_creations') || '[]');
        const exists = history.some((item) => item.hash === hash);
        if (!exists) {
          history.push({
            id: result.id,
            names: publishSide === 'joint' ? formState.names : `${formState.names} (${getInviteSideLabel(publishSide)})`,
            title: formState.title,
            hash,
            hashUrl,
            shortUrl,
            date: formState.date,
            eventType: formState.eventType,
            religion: formState.religion,
            timestamp: new Date().toISOString()
          });
          localStorage.setItem('aura_creations', JSON.stringify(history));
        }
      } catch (e) {
        console.error(e);
      }

      setShareUrl(shareUrl);
      setShareShortUrl(shortUrl);
      setShareIsLongUrl(result.isLongUrl);
      setShareSide(publishSide);
      setShowShareModal(true);
    } finally {
      setPublishing(false);
    }
  };

  const handleApplyTemplate = (tpl) => {
    if (isTraditionFlow && typeof tpl === 'string') {
      const template = getTemplateById(tpl);
      if (!template) return;
      setFormState((prev) => ({
        ...prev,
        templateId: template.id,
        selectedTemplateId: template.id,
        layoutStructure: template.layoutStructure,
        layout: template.layout,
        theme: template.theme,
        fontPair: template.fontPair,
        accentColor: template.palette.primary,
        motif: template.motifs[0],
        message: prev.message || template.defaultMessage
      }));
      return;
    }
    setFormState((prev) => ({
      ...prev,
      ...tpl.apply,
      selectedTemplateId: tpl.id,
      title: prev.names ? getPlaceholderTitle(tpl.apply.eventType || prev.eventType, prev.names) : tpl.apply.title || prev.title
    }));
  };

  const handleSectionVisibility = (key, value) => {
    setFormState((prev) => ({
      ...prev,
      sectionVisibility: { ...prev.sectionVisibility, [key]: value }
    }));
  };

  // Only names + date are required; venue & WhatsApp make the card useful for guests
  const essentials = [
    { label: 'Names', done: !!formState.names?.trim(), required: true },
    { label: 'Date & time', done: !!formState.date, required: true },
    { label: 'Venue', done: !!(formState.venueName?.trim() || formState.venue?.trim()), required: false },
    { label: 'WhatsApp number', done: !!formState.contactPhone?.trim(), required: false }
  ];

  const tabs = [
    { id: 'templates', label: 'Templates', icon: LayoutTemplate },
    { id: 'content', label: 'Content', icon: Layout },
    { id: 'sides', label: 'Bride / Groom', icon: Split },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'design', label: 'Design', icon: Palette },
    { id: 'details', label: 'Extras', icon: Globe },
    { id: 'customize', label: 'Customize', icon: Settings2 },
    { id: 'ai', label: 'AI', icon: Wand2 }
  ];

  return (
    <div className={`studio-container studio-container--mobile-${mobileView}`}>
      <aside className="studio-sidebar">
        <div className="studio-header">
          {onBackToTemplates ? (
            <button
              type="button"
              className="btn-icon-back"
              onClick={onBackToTemplates}
              style={{ padding: '6px 10px', fontSize: '11px' }}
            >
              <ArrowLeft size={12} /> Templates
            </button>
          ) : (
            <button
              type="button"
              className="btn-icon-back"
              onClick={() => onNavigate('home')}
              style={{ padding: '6px 10px', fontSize: '11px' }}
            >
              <Home size={12} /> Home
            </button>
          )}
          <div className="studio-logo" style={{ fontSize: '16px', marginLeft: 'auto' }}>
            <Sparkles size={16} style={{ color: 'var(--studio-accent)' }} />
            {isTraditionFlow && religionConfig ? (
              <>AURA<span>{religionConfig.label.toUpperCase()}</span></>
            ) : (
              <>AURA<span>STUDIO</span></>
            )}
          </div>
        </div>

        <div className="studio-tabs studio-tabs-scroll">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`studio-tab-btn ${activeTab === id ? 'active' : ''}`}
              onClick={() => setActiveTab(id)}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        <div className="studio-content">
          {activeTab === 'templates' && (
            <div className="animate-fade-in">
              <h3 className="studio-section-title">Choose a Layout</h3>
              {isTraditionFlow ? (
                <LayoutStructurePicker
                  religionId={activeReligion}
                  activeTemplateId={formState.templateId || formState.selectedTemplateId}
                  onSelectTemplate={handleApplyTemplate}
                />
              ) : (
                <TemplateSelector
                  activeTemplateId={formState.selectedTemplateId}
                  onSelect={handleApplyTemplate}
                />
              )}
            </div>
          )}

          {activeTab === 'content' && (
            <div className="animate-fade-in">
              <div className="studio-section-title-row">
                <h3 className="studio-section-title">Invitation Content</h3>
              </div>

              {/* One-click demo data quick-fill banner */}
              <div className="demo-data-card animate-fade-in">
                <div className="demo-data-card-header">
                  <Sparkles size={14} className="text-amber-400" />
                  <span>One-Click Wedding Demo Data</span>
                </div>
                <p className="demo-data-card-sub">
                  Fill realistic names, dates, temple/church/mosque venue, full schedule, story & attire in 1 tap:
                </p>
                <div className="demo-data-buttons-grid">
                  <button
                    type="button"
                    className="demo-preset-btn"
                    onClick={() => handleLoadPreset('hindu')}
                    title="Load Aditya & Ananya Hindu Muhurtham"
                  >
                    🪔 Hindu Muhurtham
                  </button>
                  <button
                    type="button"
                    className="demo-preset-btn"
                    onClick={() => handleLoadPreset('muslim')}
                    title="Load Farhan & Ayesha Muslim Nikah"
                  >
                    ☪ Muslim Nikah
                  </button>
                  <button
                    type="button"
                    className="demo-preset-btn"
                    onClick={() => handleLoadPreset('christian')}
                    title="Load Ethan & Maria Holy Matrimony"
                  >
                    ✝ Holy Matrimony
                  </button>
                  <button
                    type="button"
                    className="demo-preset-btn"
                    onClick={() => handleLoadPreset('sikh')}
                    title="Load Harpreet & Jaspreet Anand Karaj"
                  >
                    ☬ Anand Karaj
                  </button>
                  <button
                    type="button"
                    className="demo-preset-btn"
                    onClick={() => handleLoadPreset('custom')}
                    title="Load Kabir & Meera Destination Wedding"
                  >
                    👑 Royal Destination
                  </button>
                </div>
              </div>

              <section className="essentials-card">
                <header className="essentials-head">
                  <strong>Essentials</strong>
                  <span>
                    {essentials.filter((e) => e.done).length}/{essentials.length} done · only names &amp; date are needed to publish
                  </span>
                </header>
                <ul className="essentials-checklist">
                  {essentials.map((item) => (
                    <li key={item.label} className={item.done ? 'done' : ''}>
                      {item.done ? <CircleCheck size={14} /> : <Circle size={14} />}
                      {item.label}
                      {!item.required && <em>recommended</em>}
                    </li>
                  ))}
                </ul>

                {isTraditionFlow ? (
                  <ReligionFieldsEditor
                    religionId={activeReligion}
                    formState={formState}
                    onChange={handleStateChange}
                    onBatchChange={handleBatchChange}
                    mode="essential"
                  />
                ) : (
                  <>
                    <div className="form-group">
                      <label htmlFor="eventType">Event Type</label>
                      <select
                        id="eventType"
                        value={formState.eventType}
                        onChange={(e) => handleEventTypeChange(e.target.value)}
                      >
                        {EVENT_TYPES.map((et) => (
                          <option key={et.id} value={et.id}>
                            {et.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="names">Host Name(s) *</label>
                      <input
                        id="names"
                        type="text"
                        placeholder="e.g. Ananya & Arjun"
                        value={formState.names}
                        onChange={(e) => handleStateChange('names', e.target.value)}
                        maxLength={80}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="date">Date &amp; Time *</label>
                      <input
                        id="date"
                        type="datetime-local"
                        value={formState.date}
                        onChange={(e) => handleStateChange('date', e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="venueName">Venue Name</label>
                      <input
                        id="venueName"
                        type="text"
                        placeholder="e.g. Taj Convention Centre"
                        value={formState.venueName}
                        onChange={(e) => handleStateChange('venueName', e.target.value)}
                      />
                    </div>
                  </>
                )}

                <div className="form-group">
                  <label htmlFor="venue">Venue Address</label>
                  <input
                    id="venue"
                    type="text"
                    placeholder="Street, landmark, city"
                    value={formState.venue}
                    onChange={(e) => handleStateChange('venue', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="mapLink">Google Maps Link</label>
                  <input
                    id="mapLink"
                    type="url"
                    placeholder="Paste the Share link from Google Maps"
                    value={formState.mapLink}
                    onChange={(e) => handleStateChange('mapLink', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contactPhone">WhatsApp Number (for RSVPs)</label>
                  <input
                    id="contactPhone"
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={formState.contactPhone}
                    onChange={(e) => handleStateChange('contactPhone', e.target.value)}
                  />
                </div>
              </section>

              <details className="optional-details">
                <summary>
                  <span>More details <em>(optional)</em></span>
                  <small>Parents, message, story, title…</small>
                </summary>

                {isTraditionFlow && (
                  <ReligionFieldsEditor
                    religionId={activeReligion}
                    formState={formState}
                    onChange={handleStateChange}
                    onBatchChange={handleBatchChange}
                    mode="optional"
                  />
                )}

                {isTraditionFlow && (
                  <div className="form-group">
                    <label htmlFor="names">Names as shown on the card</label>
                    <input
                      id="names"
                      type="text"
                      value={formState.names}
                      onChange={(e) => handleStateChange('names', e.target.value)}
                      maxLength={80}
                    />
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="title">Invitation Title</label>
                  <input
                    id="title"
                    type="text"
                    placeholder="Filled in automatically from the names"
                    value={formState.title}
                    onChange={(e) => handleStateChange('title', e.target.value)}
                    maxLength={100}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message to Guests</label>
                  <textarea
                    id="message"
                    placeholder="Write a message to your guests..."
                    value={formState.message}
                    onChange={(e) => handleStateChange('message', e.target.value)}
                    rows={3}
                    maxLength={500}
                  />
                </div>

                {isTraditionFlow && (
                  <>
                    <div className="form-group">
                      <label htmlFor="coupleStory">Couple Story</label>
                      <textarea
                        id="coupleStory"
                        placeholder="How you met, your journey together..."
                        value={formState.coupleStory || ''}
                        onChange={(e) => handleStateChange('coupleStory', e.target.value)}
                        rows={4}
                        maxLength={800}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="blessingText">Custom Blessing Note</label>
                      <textarea
                        id="blessingText"
                        placeholder="Override or extend the default blessing..."
                        value={formState.blessingText || ''}
                        onChange={(e) => handleStateChange('blessingText', e.target.value)}
                        rows={2}
                        maxLength={300}
                      />
                    </div>
                  </>
                )}

                {!isTraditionFlow && (
                  <>
                    <div className="form-group">
                      <label htmlFor="parentsGroom">Groom — S/o (Parents)</label>
                      <input
                        id="parentsGroom"
                        type="text"
                        placeholder="e.g. S/o Shri. Rajan & Smt. Lakshmi"
                        value={formState.parentsGroom}
                        onChange={(e) => handleStateChange('parentsGroom', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="parentsBride">Bride — D/o (Parents)</label>
                      <input
                        id="parentsBride"
                        type="text"
                        placeholder="e.g. D/o Shri. Mohan & Smt. Geetha"
                        value={formState.parentsBride}
                        onChange={(e) => handleStateChange('parentsBride', e.target.value)}
                      />
                    </div>
                  </>
                )}

                <div className="form-row-2">
                  <div className="form-group">
                    <label htmlFor="familyGroom">Groom&apos;s Family</label>
                    <input
                      id="familyGroom"
                      type="text"
                      placeholder="e.g. The Rajan Family, Kochi"
                      value={formState.familyGroom}
                      onChange={(e) => handleStateChange('familyGroom', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="familyBride">Bride&apos;s Family</label>
                    <input
                      id="familyBride"
                      type="text"
                      placeholder="e.g. The Mohan Family, Thrissur"
                      value={formState.familyBride}
                      onChange={(e) => handleStateChange('familyBride', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="contactName">Contact Person&apos;s Name</label>
                  <input
                    id="contactName"
                    type="text"
                    placeholder="e.g. Rajesh (Brother)"
                    value={formState.contactName}
                    onChange={(e) => handleStateChange('contactName', e.target.value)}
                  />
                </div>
              </details>
            </div>
          )}

          {activeTab === 'sides' && (
            <div className="animate-fade-in">
              <InviteSidesEditor
                formState={formState}
                onChange={handleStateChange}
                onPublish={handlePublish}
                publishing={publishing}
              />
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="animate-fade-in">
              <h3 className="studio-section-title">Multi-Function Schedule</h3>
              <ScheduleEditor
                schedule={formState.schedule}
                onChange={(schedule) => handleStateChange('schedule', schedule)}
              />
            </div>
          )}

          {activeTab === 'design' && (
            <div className="animate-fade-in">
              <h3 className="studio-section-title">Visual Styling</h3>

              {isTraditionFlow && (
                <TraditionCustomizePanel
                  religionId={activeReligion}
                  formState={formState}
                  onChange={handleStateChange}
                />
              )}

              <MusicSelector
                audioEnabled={formState.audioEnabled}
                audioTrack={formState.audioTrack}
                customAudioUrl={formState.customAudioUrl || ''}
                customAudioName={formState.customAudioName || ''}
                onChangeEnabled={(v) => handleStateChange('audioEnabled', v)}
                onChangeTrack={(v) => handleStateChange('audioTrack', v)}
                onChangeCustomUrl={(v) => handleStateChange('customAudioUrl', v)}
                onChangeCustomName={(v) => handleStateChange('customAudioName', v)}
              />

              <EnvelopeIntroEditor formState={formState} onChange={handleStateChange} />

              <div className="form-group" style={{ marginBottom: '24px', marginTop: isTraditionFlow ? '24px' : 0 }}>
                <label style={{ marginBottom: '10px' }}>Theme Template</label>
                <ThemeSelector
                  activeTheme={formState.theme}
                  onChange={(themeId) => handleStateChange('theme', themeId)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="font">Font Style</label>
                <select
                  id="font"
                  value={formState.font}
                  onChange={(e) => handleStateChange('font', e.target.value)}
                >
                  {FONT_OPTIONS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <PhotoUploader
                  eventType={formState.eventType}
                  presetIdx={formState.presetIdx}
                  isUploaded={formState.isUploaded}
                  uploadedPhoto={formState.uploadedPhoto}
                  onChange={handlePhotoChange}
                />
              </div>

              <div className="form-group" style={{ marginTop: '16px' }}>
                <label htmlFor="language">Primary Language</label>
                <select
                  id="language"
                  value={formState.language}
                  onChange={(e) => handleStateChange('language', e.target.value)}
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>

              {!isTraditionFlow && (
              <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <label htmlFor="showHijriDate" style={{ cursor: 'pointer', margin: 0 }}>
                  Show Hijri / Islamic Date
                </label>
                <input
                  id="showHijriDate"
                  type="checkbox"
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  checked={formState.showHijriDate}
                  onChange={(e) => handleStateChange('showHijriDate', e.target.checked)}
                />
              </div>
              )}
            </div>
          )}

          {activeTab === 'details' && (
            <div className="animate-fade-in">
              <h3 className="studio-section-title">Extras</h3>
              <p className="studio-section-desc" style={{ marginBottom: '16px' }}>
                All optional — fill only what you need. Empty sections are hidden from guests.
              </p>

              <div className="form-group">
                <label htmlFor="endDate">End Date &amp; Time</label>
                <input
                  id="endDate"
                  type="datetime-local"
                  value={formState.endDate}
                  onChange={(e) => handleStateChange('endDate', e.target.value)}
                />
              </div>

              {!isTraditionFlow && (formState.eventType === 'wedding' || formState.eventType === 'anniversary') && (
                <CouplePhotoUpload
                  bridePhoto={formState.bridePhoto}
                  groomPhoto={formState.groomPhoto}
                  onChange={handleStateChange}
                />
              )}

              <TravelDirectionsEditor formState={formState} onChange={handleStateChange} showSides={false} />

              <div className="studio-subsection-divider" style={{ margin: '20px 0 16px 0', borderBottom: '1px solid var(--studio-card-border)' }} />
              <h4 className="studio-subsection-title">Dress Code & Hospitality</h4>

              <div className="form-group">
                <label htmlFor="dressCode">Dress Code & Attire Guidance</label>
                <textarea
                  id="dressCode"
                  placeholder="e.g. Muhurtham: Traditional Kasavu & Silk&#10;Sangeet: Pastel Glamour & Indo-Western"
                  value={formState.dressCode || ''}
                  onChange={(e) => handleStateChange('dressCode', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label htmlFor="giftNote">Blessing / Gift Note</label>
                <input
                  id="giftNote"
                  type="text"
                  placeholder="e.g. Your presence and blessings are the only gifts we request."
                  value={formState.giftNote || ''}
                  onChange={(e) => handleStateChange('giftNote', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="liveStreamUrl">Virtual Wedding Live Stream Link</label>
                <input
                  id="liveStreamUrl"
                  type="url"
                  placeholder="https://www.youtube.com/live/..."
                  value={formState.liveStreamUrl || ''}
                  onChange={(e) => handleStateChange('liveStreamUrl', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="accommodationInfo">Accommodations & Stay Details</label>
                <textarea
                  id="accommodationInfo"
                  placeholder="e.g. Complimentary stay arranged at Grand Regency. Contact hospitality desk at +91 98470 12345."
                  value={formState.accommodationInfo || ''}
                  onChange={(e) => handleStateChange('accommodationInfo', e.target.value)}
                  rows={2}
                />
              </div>

              <div className="studio-subsection-divider" style={{ margin: '20px 0 16px 0', borderBottom: '1px solid var(--studio-card-border)' }} />

              <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px' }}>
                <label htmlFor="rsvpEnabled" style={{ cursor: 'pointer', margin: 0 }}>Enable RSVP</label>
                <input
                  id="rsvpEnabled"
                  type="checkbox"
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  checked={formState.rsvpEnabled}
                  onChange={(e) => handleStateChange('rsvpEnabled', e.target.checked)}
                />
              </div>

              {formState.rsvpEnabled && (
                <>
                  <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label htmlFor="mealPreferenceEnabled" style={{ cursor: 'pointer', margin: 0 }}>
                      Ask Meal Preference (Veg/Non-Veg)
                    </label>
                    <input
                      id="mealPreferenceEnabled"
                      type="checkbox"
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                      checked={formState.mealPreferenceEnabled}
                      onChange={(e) => handleStateChange('mealPreferenceEnabled', e.target.checked)}
                    />
                  </div>
                </>
              )}

              <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <label htmlFor="guestbookEnabled" style={{ cursor: 'pointer', margin: 0 }}>
                  Enable Guestbook / Wishes
                </label>
                <input
                  id="guestbookEnabled"
                  type="checkbox"
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  checked={formState.guestbookEnabled}
                  onChange={(e) => handleStateChange('guestbookEnabled', e.target.checked)}
                />
              </div>
            </div>
          )}

          {activeTab === 'customize' && (
            <div className="animate-fade-in">
              {isTraditionFlow ? (
                <PremiumMediaStudio
                  religionId={activeReligion}
                  formState={formState}
                  onChange={handleStateChange}
                  onBatchChange={handleBatchChange}
                />
              ) : null}
              <CustomizePanelHeader />
              <CustomizePanel
                sectionVisibility={formState.sectionVisibility}
                onChange={handleSectionVisibility}
              />
            </div>
          )}

          {activeTab === 'ai' && (
            <AIAssistantPanel formState={formState} onApply={handleApplyAI} />
          )}
        </div>

        <div className="studio-footer">
          {publishError && (
            <p className="studio-publish-error" role="alert">
              {publishError}
            </p>
          )}
          <button
            type="button"
            className="btn-primary"
            onClick={handlePublish}
            disabled={!formState.names.trim() || !formState.date || publishing}
          >
            <Share2 size={16} /> {publishing ? 'Publishing…' : 'Publish & Share'}
          </button>
        </div>
      </aside>

      <main className="studio-preview-pane">
        <div className="preview-toggle">
          <button
            className={`preview-toggle-btn ${previewDevice === 'mobile' ? 'active' : ''}`}
            onClick={() => setPreviewDevice('mobile')}
          >
            <Smartphone size={12} /> Mobile
          </button>
          <button
            className={`preview-toggle-btn ${previewDevice === 'desktop' ? 'active' : ''}`}
            onClick={() => setPreviewDevice('desktop')}
          >
            <Monitor size={12} /> Desktop
          </button>
        </div>

        <div className={`device-mockup ${previewDevice}`}>
          <div className="device-notch" />
          <div className="device-screen">
            {/* Outer screen is the frame for "fixed" UI (music, camera); this layer scrolls */}
            <div
              className="device-screen-scroll"
              onScroll={(e) => {
                // The preview should only ever scroll vertically
                if (e.currentTarget.scrollLeft) e.currentTarget.scrollLeft = 0;
              }}
            >
              {!isTraditionFlow ? (
                <InvitationPreview state={formState} isPreviewMode={true} />
              ) : (
                <TraditionCard state={formState} isPreviewMode={true} />
              )}
            </div>
          </div>
        </div>
      </main>

      <nav className="studio-mobile-bar" aria-label="Studio view">
        {publishError && mobileView === 'preview' && (
          <p className="studio-mobile-bar-error">{publishError}</p>
        )}
        <button
          type="button"
          className={`studio-mobile-bar-btn ${mobileView === 'edit' ? 'active' : ''}`}
          onClick={() => setMobileView('edit')}
          aria-pressed={mobileView === 'edit'}
        >
          <PencilLine size={18} />
          <span>Edit</span>
        </button>
        <button
          type="button"
          className={`studio-mobile-bar-btn ${mobileView === 'preview' ? 'active' : ''}`}
          onClick={() => setMobileView('preview')}
          aria-pressed={mobileView === 'preview'}
        >
          <Eye size={18} />
          <span>Preview</span>
        </button>
        <button
          type="button"
          className="studio-mobile-bar-publish"
          onClick={handlePublish}
          disabled={!formState.names.trim() || !formState.date || publishing}
        >
          <Share2 size={16} />
          <span>{publishing ? 'Publishing…' : 'Publish'}</span>
        </button>
      </nav>

      {showShareModal && (
        <ShareModal
          invitationUrl={shareUrl}
          shortUrl={shareShortUrl}
          isLongUrl={shareIsLongUrl}
          title={shareSide === 'joint' ? '' : `${getInviteSideLabel(shareSide)} invitation`}
          notice={shareNotice}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}

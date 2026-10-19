import React, { useState, useEffect } from 'react';
import { Home, Trash2, ClipboardCheck, ExternalLink, Eye, Sparkles, MessageCircle } from 'lucide-react';
import { getViewCount } from '../utils/dateUtils';
import { generateAnalyticsSummary, generateRsvpReminder } from '../services/aiService';

export default function RsvpsView({ onNavigate }) {
  const [rsvps, setRsvps] = useState([]);
  const [creations, setCreations] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [aiSummary, setAiSummary] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [reminderMsg, setReminderMsg] = useState('');

  useEffect(() => {
    // Load RSVPs and Creations from localStorage
    try {
      const loggedRsvps = JSON.parse(localStorage.getItem('aura_rsvps') || '[]');
      const loggedCreations = JSON.parse(localStorage.getItem('aura_creations') || '[]');
      setRsvps(loggedRsvps);
      setCreations(loggedCreations);
    } catch (e) {
      console.error('Failed to load local storage logs:', e);
    }
  }, []);

  const handleClearRsvps = () => {
    if (window.confirm('Are you sure you want to clear all logged RSVPs? This action cannot be undone.')) {
      try {
        localStorage.removeItem('aura_rsvps');
        setRsvps([]);
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Filter RSVPs based on selection
  // Note: Guest RSVPs store `invitationId` which is the hash string at the time of submission
  const filteredRsvps = rsvps.filter((rsvp) => {
    if (selectedFilter === 'all') return true;
    return rsvp.invitationId.includes(selectedFilter);
  });

  // Calculate statistics
  const totalAttendingCount = filteredRsvps
    .filter((r) => r.attending)
    .reduce((sum, r) => sum + (r.guestsCount || 1), 0);

  const stats = {
    totalResponses: filteredRsvps.length,
    attending: filteredRsvps.filter((r) => r.attending).length,
    maybe: filteredRsvps.filter((r) => r.maybe).length,
    attendingTotalGuests: totalAttendingCount,
    declined: filteredRsvps.filter((r) => !r.attending && !r.maybe).length
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  const handleAiSummary = async () => {
    setLoadingAi(true);
    try {
      const summary = await generateAnalyticsSummary({ rsvps: filteredRsvps, creations });
      setAiSummary(summary);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleGenerateReminder = async (guestName) => {
    const creation = creations[0];
    const msg = await generateRsvpReminder({
      guestName,
      eventTitle: creation?.title || 'our event',
      language: 'en'
    });
    setReminderMsg(msg);
  };

  const sendReminderWhatsApp = () => {
    if (!reminderMsg) return;
    window.open(`https://wa.me/?text=${encodeURIComponent(reminderMsg)}`, '_blank');
  };

  return (
    <div className="rsvps-container animate-fade-in">
      <header className="rsvps-header-row">
        <div>
          <h1 style={{ color: '#fff', fontSize: '32px', margin: 0, fontFamily: 'var(--font-serif)' }}>
            RSVP Dashboard
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px', opacity: 0.7 }}>
            Track and manage your guests' responses
          </p>
        </div>
        <button
          type="button"
          className="btn-icon-back"
          onClick={() => onNavigate('home')}
        >
          <Home size={14} /> Back Home
        </button>
      </header>

      {/* Stats Cards Row */}
      <div className="rsvps-stats">
        <div className="stat-box">
          <div className="stat-val">{stats.totalResponses}</div>
          <div className="stat-label">Responses</div>
        </div>
        <div className="stat-box" style={{ borderLeft: '3px solid #28c76f' }}>
          <div className="stat-val" style={{ color: '#28c76f' }}>
            {stats.attendingTotalGuests}
          </div>
          <div className="stat-label">Attending (Total)</div>
        </div>
        <div className="stat-box" style={{ borderLeft: '3px solid #ff9f43' }}>
          <div className="stat-val" style={{ color: '#ff9f43' }}>{stats.maybe}</div>
          <div className="stat-label">Maybe</div>
        </div>
        <div className="stat-box" style={{ borderLeft: '3px solid #ea5455' }}>
          <div className="stat-val" style={{ color: '#ea5455' }}>
            {stats.declined}
          </div>
          <div className="stat-label">Declined</div>
        </div>
      </div>

      {/* AI Analytics */}
      <div className="ai-dashboard-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ color: '#fff', fontSize: '16px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} style={{ color: 'var(--studio-accent)' }} /> AI Insights
          </h3>
          <button type="button" className="btn-secondary-outline" onClick={handleAiSummary} disabled={loadingAi}>
            {loadingAi ? 'Analyzing...' : 'Generate Summary'}
          </button>
        </div>
        {aiSummary && (
          <div className="ai-output-box" style={{ whiteSpace: 'pre-wrap', fontSize: '13px' }}>{aiSummary}</div>
        )}
      </div>

      {/* RSVP Reminder */}
      {filteredRsvps.some((r) => r.maybe) && (
        <div className="ai-dashboard-section">
          <h3 style={{ color: '#fff', fontSize: '16px', margin: '0 0 12px 0' }}>
            <MessageCircle size={16} style={{ display: 'inline', marginRight: '6px' }} />
            AI RSVP Reminders
          </h3>
          <p style={{ fontSize: '12px', opacity: 0.7, margin: '0 0 10px 0' }}>
            Generate WhatsApp reminder for guests who responded &quot;Maybe&quot;
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {filteredRsvps.filter((r) => r.maybe).map((r) => (
              <button key={r.id} type="button" className="btn-icon-ai" onClick={() => handleGenerateReminder(r.name)}>
                Remind {r.name}
              </button>
            ))}
          </div>
          {reminderMsg && (
            <div className="ai-output-box" style={{ marginTop: '12px' }}>
              <p style={{ fontSize: '13px', margin: '0 0 8px 0' }}>{reminderMsg}</p>
              <button type="button" className="btn-primary" style={{ fontSize: '12px', padding: '8px 16px' }} onClick={sendReminderWhatsApp}>
                Send via WhatsApp
              </button>
            </div>
          )}
        </div>
      )}

      {/* Filter and Clear controls */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          gap: '16px',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: '600' }}>Filter by Card:</span>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            style={{
              backgroundColor: 'var(--studio-input-bg)',
              border: '1px solid var(--studio-input-border)',
              borderRadius: '6px',
              padding: '6px 12px',
              color: '#fff',
              fontSize: '13px',
              outline: 'none'
            }}
          >
            <option value="all">All RSVP Logs</option>
            {creations.map((c) => (
              <option key={c.id} value={c.hash.substring(0, 15)}>
                {c.names} ({c.eventType})
              </option>
            ))}
          </select>
        </div>

        {rsvps.length > 0 && (
          <button
            type="button"
            className="btn-icon-back"
            onClick={handleClearRsvps}
            style={{ color: 'var(--studio-danger)', borderColor: 'rgba(234, 84, 85, 0.2)' }}
          >
            <Trash2 size={14} /> Clear All RSVPs
          </button>
        )}
      </div>

      {/* RSVPs Table card */}
      <div className="rsvps-card">
        {filteredRsvps.length === 0 ? (
          <div className="empty-rsvps">
            <ClipboardCheck size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
            <p style={{ margin: 0, fontWeight: '600' }}>No responses logged yet</p>
            <p style={{ fontSize: '12px', marginTop: '4px' }}>
              When guests submit the RSVP form on your invitation page, details will appear here.
            </p>
          </div>
        ) : (
          <div className="rsvp-table-wrapper">
            <table className="rsvp-table">
              <thead>
                <tr>
                  <th>Guest Name</th>
                  <th>Attending</th>
                  <th>Guests</th>
                  <th>Meal</th>
                  <th>Submitted</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {filteredRsvps.map((rsvp) => (
                  <tr key={rsvp.id}>
                    <td style={{ fontWeight: '600', color: '#fff' }}>{rsvp.name}</td>
                    <td>
                      {rsvp.attending ? (
                        <span className="badge-yes">Yes</span>
                      ) : rsvp.maybe ? (
                        <span className="badge-maybe">Maybe</span>
                      ) : (
                        <span className="badge-no">No</span>
                      )}
                    </td>
                    <td>{rsvp.attending || rsvp.maybe ? rsvp.guestsCount : '-'}</td>
                    <td style={{ fontSize: '12px' }}>{rsvp.mealPreference || '-'}</td>
                    <td style={{ fontSize: '12px', opacity: 0.8 }}>{formatDate(rsvp.timestamp)}</td>
                    <td style={{ fontStyle: 'italic', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={rsvp.note}>
                      {rsvp.note || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* History of Creations */}
      {creations.length > 0 && (
        <div style={{ marginTop: '40px' }}>
          <h3 style={{ color: '#fff', fontSize: '18px', marginBottom: '16px', fontFamily: 'var(--font-serif)' }}>
            Your Created Invitation Cards
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {creations.map((c) => (
              <div 
                key={c.id} 
                style={{
                  backgroundColor: 'var(--studio-card-bg)',
                  border: '1px solid var(--studio-card-border)',
                  borderRadius: '10px',
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <h4 style={{ margin: 0, color: '#fff', fontSize: '15px' }}>{c.title}</h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '11px', opacity: 0.6, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Created {new Date(c.timestamp).toLocaleDateString()}
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <Eye size={10} /> {getViewCount(c.hash.substring(0, 20))} views
                    </span>
                  </p>
                </div>
                <a 
                  href={`#/i/${c.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-nav-action"
                  style={{ padding: '6px 12px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  View <ExternalLink size={10} />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

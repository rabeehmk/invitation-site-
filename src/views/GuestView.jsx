import React, { useEffect, useState } from 'react';
import { Home, AlertCircle } from 'lucide-react';
import InvitationPreview from '../components/InvitationPreview';
import TraditionCard from '../components/tradition/TraditionCard';
import { loadInvitationData } from '../utils/helpers';
import { incrementViewCount } from '../utils/dateUtils';

export default function GuestView({ data }) {
  const [invitationState, setInvitationState] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (data) {
      const state = loadInvitationData(data);
      if (state) {
        setInvitationState(state);
        document.title = state.title || 'Aura Invite';
        incrementViewCount(data);
      } else {
        setError(true);
      }
    } else {
      setError(true);
    }
  }, [data]);

  if (error) {
    return (
      <div 
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0b0c10',
          color: '#a9b2c3',
          padding: '20px',
          textAlign: 'center'
        }}
      >
        <AlertCircle size={48} style={{ color: 'var(--studio-danger)', marginBottom: '16px' }} />
        <h1 style={{ color: '#fff', fontSize: '28px', margin: '0 0 10px 0', fontFamily: 'var(--font-serif)' }}>
          Invitation Not Found
        </h1>
        <p style={{ maxWidth: '400px', margin: '0 0 24px 0', lineHeight: 1.5 }}>
          The invitation link appears to be invalid or broken. Please double check the URL or contact the host.
        </p>
        <a 
          href="#home"
          className="btn-icon-back"
        >
          <Home size={14} /> Go Back Home
        </a>
      </div>
    );
  }

  if (!invitationState) {
    return (
      <div 
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0b0c10',
          color: '#a9b2c3'
        }}
      >
        <div className="animate-spin" style={{
          border: '3px solid rgba(189, 160, 109, 0.1)',
          borderTop: '3px solid var(--studio-accent)',
          borderRadius: '50%',
          width: '30px',
          height: '30px',
          marginBottom: '12px'
        }} />
        <p style={{ fontSize: '14px', letterSpacing: '1px' }}>Loading Invitation...</p>
      </div>
    );
  }

  const PreviewComponent = invitationState.religion ? TraditionCard : InvitationPreview;

  return (
    <div
      className={`guest-view-root theme-${invitationState.theme || 'dark-gold'}`}
      style={{ minHeight: '100vh', width: '100%', backgroundColor: 'var(--theme-bg, #0b0c10)' }}
    >
      <PreviewComponent state={invitationState} isPreviewMode={false} />
    </div>
  );
}

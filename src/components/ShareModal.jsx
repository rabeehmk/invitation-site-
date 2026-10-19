import React, { useState } from 'react';
import { X, Copy, Check, MessageCircle, Share2, ExternalLink, Printer } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const MAX_QR_LENGTH = 2900;

export default function ShareModal({ invitationUrl, shortUrl, isLongUrl, title = '', onClose }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(invitationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePreview = (e) => {
    e.preventDefault();
    window.open(invitationUrl, '_blank', 'noopener,noreferrer');
  };

  const handleOpenHere = (e) => {
    e.preventDefault();
    const hashPart = invitationUrl.includes('#') ? invitationUrl.slice(invitationUrl.indexOf('#')) : invitationUrl;
    window.location.hash = hashPart.replace(/^#/, '');
  };

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `You are cordially invited! Please view my invitation card here: ${invitationUrl}`
  )}`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'You are cordially invited!',
          text: 'Please view my digital invitation card:',
          url: invitationUrl
        });
      } catch (err) {
        console.log('Native sharing cancelled or failed:', err);
      }
    } else {
      // Fallback to copy link
      handleCopy();
    }
  };

  const canNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <h2 className="modal-title">✨ {title ? `${title} is Live!` : 'Your Invitation is Live!'}</h2>
        <p className="modal-description">
          Your invitation is saved. Share the link below — guests can open it on any phone.
        </p>

        {isLongUrl && (
          <p className="modal-warning">
            This invitation has too many photos to fit in a link, so this short link only opens on
            this device. Remove some gallery photos and publish again to get a link guests can open.
          </p>
        )}

        {shortUrl && (
          <p className="modal-short-link-hint">
            Backup link (same device only):{' '}
            <button type="button" className="modal-short-link-btn" onClick={() => navigator.clipboard.writeText(shortUrl)}>
              Copy short link
            </button>
          </p>
        )}

        {/* QR codes hold ~2,900 characters; longer links would crash the QR renderer */}
        {invitationUrl.length <= MAX_QR_LENGTH ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <div className="qr-container">
              <QRCodeSVG value={invitationUrl} size={160} level="L" includeMargin={true} />
              <p style={{ color: '#000', fontSize: '10px', fontWeight: 'bold', margin: '4px 0 0 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Scan QR Code
              </p>
            </div>
          </div>
        ) : (
          <p className="modal-description" style={{ fontSize: '12px', opacity: 0.75 }}>
            This invitation carries a lot of details, so it is too big for a QR code —
            share it on WhatsApp or copy the link below.
          </p>
        )}

        {/* Share Link Row */}
        <div className="share-link-box">
          <input
            type="text"
            readOnly
            className="share-link-input"
            value={invitationUrl}
            onClick={(e) => e.target.select()}
          />
          <button type="button" className="btn-copy" onClick={handleCopy}>
            {copied ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Check size={14} /> Copied!
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Copy size={14} /> Copy
              </span>
            )}
          </button>
        </div>

        {/* Direct Social Buttons */}
        <div className="social-share-buttons">
          <button
            type="button"
            className="btn-social-share"
            onClick={handlePreview}
            style={{
              backgroundColor: 'var(--studio-card-bg)',
              color: 'var(--studio-text-bright)',
              border: '1px solid var(--studio-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <ExternalLink size={16} /> Preview in New Tab
          </button>

          <button
            type="button"
            className="btn-social-share"
            onClick={handleOpenHere}
            style={{
              backgroundColor: 'transparent',
              color: 'var(--studio-text)',
              border: '1px solid var(--studio-input-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <ExternalLink size={16} /> Open Invitation Here
          </button>

          <button
            type="button"
            className="btn-social-share"
            onClick={() => window.print()}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              color: 'var(--studio-text-bright)',
              border: '1px solid var(--studio-card-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Printer size={16} /> Print / Save as PDF
          </button>

          <a
            href={whatsappShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-social-share btn-whatsapp"
          >
            <MessageCircle size={16} /> WhatsApp Share
          </a>
          
          <button
            type="button"
            className="btn-social-share"
            onClick={handleNativeShare}
            style={{
              backgroundColor: 'var(--studio-accent)',
              color: '#000',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Share2 size={16} /> 
            {canNativeShare ? 'Share Link' : copied ? 'Link Copied!' : 'Copy Share Link'}
          </button>
        </div>

        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--studio-card-border)', fontSize: '12px' }}>
          <p style={{ margin: 0, opacity: 0.6 }}>
            Guests can RSVP directly from their device. You can track responses anytime.
          </p>
        </div>
      </div>
    </div>
  );
}

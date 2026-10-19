import React from 'react';
import { FONT_PAIRS } from '../config/religions';

const SAMPLE_COUPLES = {
  hindu: ['Priya', 'Arjun'],
  muslim: ['Aisha', 'Omar'],
  christian: ['Grace', 'Daniel'],
  sikh: ['Simran', 'Arjan'],
  custom: ['Emma', 'James']
};

const SAMPLE_PHOTO =
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=480&auto=format&fit=crop&q=70';

function Photo({ className = '' }) {
  return (
    <div className={`lm-photo ${className}`}>
      <img src={SAMPLE_PHOTO} alt="" loading="lazy" draggable="false" />
    </div>
  );
}

function Names({ couple, className = '' }) {
  return (
    <div className={`lm-names ${className}`}>
      {couple[0]} <span className="lm-amp">&amp;</span> {couple[1]}
    </div>
  );
}

/**
 * Realistic miniature of each layout engine so a first-time visitor can
 * tell the structures apart at a glance (photo placement, card, type, arch).
 */
export default function LayoutMockup({ layoutStructure, palette = {}, religion = 'custom', fontPair }) {
  const couple = SAMPLE_COUPLES[religion] || SAMPLE_COUPLES.custom;
  const fonts = FONT_PAIRS[fontPair] || FONT_PAIRS['serif-script'];
  const style = {
    '--lm-primary': palette.primary || '#BDA06D',
    '--lm-secondary': palette.secondary || '#D4AF37',
    '--lm-bg': palette.bg || '#FAF7F2',
    '--lm-text': palette.text || '#1A1A1A',
    '--lm-heading': fonts.heading,
    '--lm-script': fonts.accent
  };

  // Split screen is a desktop layout, so it gets a landscape browser frame
  if (layoutStructure === 'split') {
    return (
      <div className="lm-stage" style={style}>
        <div className="lm-browser">
          <div className="lm-browser-bar"><i /><i /><i /></div>
          <div className="lm-split">
            <Photo className="lm-split-photo" />
            <div className="lm-split-col">
              <span className="lm-kicker">Together with their families</span>
              <Names couple={couple} />
              <span className="lm-rule" />
              <span className="lm-date">12 · 12 · 2026</span>
              <span className="lm-line" />
              <span className="lm-line lm-line--short" />
              <span className="lm-btn">RSVP</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lm-stage" style={style}>
      <div className={`lm-phone lm-phone--${layoutStructure}`}>
        <div className="lm-notch" />

        {layoutStructure === 'full-bleed' && (
          <>
            <Photo className="lm-fill" />
            <div className="lm-bleed-scrim" />
            <div className="lm-bleed-text">
              <span className="lm-kicker lm-kicker--light">Save the date</span>
              <Names couple={couple} className="lm-names--light" />
              <span className="lm-date lm-date--light">12 · 12 · 2026</span>
            </div>
            <span className="lm-scroll-cue" />
          </>
        )}

        {layoutStructure === 'card-canvas' && (
          <div className="lm-canvas">
            <div className="lm-card">
              <span className="lm-corner lm-corner--tl" />
              <span className="lm-corner lm-corner--br" />
              <Photo className="lm-card-photo" />
              <Names couple={couple} />
              <span className="lm-rule" />
              <span className="lm-date">12 · 12 · 2026</span>
            </div>
          </div>
        )}

        {layoutStructure === 'typography-minimal' && (
          <div className="lm-typo">
            <span className="lm-kicker">The wedding of</span>
            <div className="lm-typo-name">{couple[0]}</div>
            <div className="lm-typo-amp">&amp;</div>
            <div className="lm-typo-name">{couple[1]}</div>
            <span className="lm-rule" />
            <span className="lm-date">Saturday, the twelfth of December</span>
            <span className="lm-line" />
            <span className="lm-line lm-line--short" />
          </div>
        )}

        {layoutStructure === 'illustrated' && (
          <div className="lm-scene">
            <div className="lm-arch">
              <Photo className="lm-fill" />
            </div>
            <span className="lm-motif-row"><i /><i /><i /></span>
            <Names couple={couple} />
            <span className="lm-date">12 · 12 · 2026</span>
          </div>
        )}
      </div>
    </div>
  );
}

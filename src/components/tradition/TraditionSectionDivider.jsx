import React from 'react';

export default function TraditionSectionDivider({ icon = '✦' }) {
  return (
    <div className="tradition-section-divider" aria-hidden="true">
      <span className="tradition-section-divider-line" />
      <span className="tradition-section-divider-icon">{icon}</span>
      <span className="tradition-section-divider-line" />
    </div>
  );
}

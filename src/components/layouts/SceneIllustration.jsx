import React from 'react';

const SCENES = {
  hindu: {
    header: (
      <svg viewBox="0 0 400 80" className="scene-illustration-header" aria-hidden="true">
        <path d="M200 8 L240 35 L280 18 L320 35 L360 12 L380 40 L360 68 L40 68 L20 40 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <path d="M160 68 L200 42 L240 68 M240 68 L280 42 L320 68" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
      </svg>
    ),
    frame: 'temple-arch'
  },
  muslim: {
    header: (
      <svg viewBox="0 0 400 90" className="scene-illustration-header" aria-hidden="true">
        <path d="M200 12 Q120 12 80 55 L80 78 L320 78 L320 55 Q280 12 200 12" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <path d="M200 12 L200 78" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.35" />
        <circle cx="200" cy="28" r="6" fill="none" stroke="currentColor" strokeWidth="0.8" />
      </svg>
    ),
    frame: 'mihrab-arch'
  },
  christian: {
    header: (
      <svg viewBox="0 0 400 90" className="scene-illustration-header" aria-hidden="true">
        <path d="M200 10 L215 35 L245 35 L220 52 L230 78 L200 62 L170 78 L180 52 L155 35 L185 35 Z" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
        <path d="M120 78 Q200 20 280 78" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
    frame: 'oval'
  },
  sikh: {
    header: (
      <svg viewBox="0 0 400 80" className="scene-illustration-header" aria-hidden="true">
        <circle cx="200" cy="40" r="22" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <path d="M200 18 L200 62 M182 40 L218 40" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M120 68 Q200 28 280 68" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
      </svg>
    ),
    frame: 'rounded'
  },
  custom: {
    header: (
      <svg viewBox="0 0 400 60" className="scene-illustration-header" aria-hidden="true">
        <path d="M40 30 L200 10 L360 30 L360 50 L40 50 Z" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
    ),
    frame: 'rounded'
  }
};

export default function SceneIllustration({ religion = 'custom', accentColor }) {
  const scene = SCENES[religion] || SCENES.custom;

  return (
    <div className="scene-illustration" style={{ color: accentColor }}>
      {scene.header}
    </div>
  );
}

export function getSceneFrame(religion) {
  return (SCENES[religion] || SCENES.custom).frame;
}

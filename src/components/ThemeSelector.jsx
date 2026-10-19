import React from 'react';

const THEMES = [
  {
    id: 'dark-gold',
    name: 'Elegant Dark Gold',
    class: 'theme-dark-gold',
    colors: ['#090a0f', '#d4af37', '#e1e4eb']
  },
  {
    id: 'rose-ivory',
    name: 'Rose Gold Ivory',
    class: 'theme-rose-ivory',
    colors: ['#fdfaf5', '#c48b7f', '#3c3530']
  },
  {
    id: 'sage-cream',
    name: 'Sage Green & Cream',
    class: 'theme-sage-cream',
    colors: ['#eaece6', '#5e6f5c', '#2f382e']
  },
  {
    id: 'modern-gradient',
    name: 'Modern Gradient',
    class: 'theme-modern-gradient',
    colors: ['#090812', '#e024a5', '#f3f0ff']
  },
  {
    id: 'classic-burgundy',
    name: 'Classic Burgundy',
    class: 'theme-classic-burgundy',
    colors: ['#1c050a', '#dfba6b', '#f9ecee']
  }
];

export default function ThemeSelector({ activeTheme, onChange }) {
  return (
    <div className="themes-grid">
      {THEMES.map((theme) => (
        <div
          key={theme.id}
          className={`theme-card-option ${activeTheme === theme.id ? 'active' : ''}`}
          onClick={() => onChange(theme.id)}
        >
          <span style={{ fontWeight: 600, color: '#fff', fontSize: '13px' }}>
            {theme.name}
          </span>
          <div className="theme-preview-dots">
            {theme.colors.map((color, idx) => (
              <span
                key={idx}
                className="theme-dot"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

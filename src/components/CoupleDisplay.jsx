import React from 'react';
import AnimatedCouple from './AnimatedCouple';
import ChristianScrollCouple from './christian/ChristianScrollCouple';

export default function CoupleDisplay({
  theme,
  bridePhoto,
  groomPhoto,
  heroMode = false,
  scrollProgress = null,
  religion = ''
}) {
  const hasPhotos = bridePhoto || groomPhoto;
  const isChristian = religion === 'christian';

  if (!hasPhotos && isChristian) {
    return (
      <ChristianScrollCouple
        theme={theme}
        scrollProgress={scrollProgress}
        heroMode={heroMode}
      />
    );
  }

  if (!hasPhotos) {
    return (
      <AnimatedCouple
        theme={theme}
        heroMode={heroMode}
        scrollProgress={scrollProgress}
        autoplay={!scrollProgress}
        showScrollHint={!!scrollProgress}
      />
    );
  }

  return (
    <div className={`couple-display-wrapper theme-${theme} ${heroMode ? 'hero-couple-mode' : ''}`}>
      <div className="animated-couple-border" />
      <div className="couple-display-grid">
        <div className={`couple-portrait bride-portrait ${bridePhoto ? 'has-photo' : 'empty'}`}>
          {bridePhoto ? (
            <img src={bridePhoto} alt="Bride" />
          ) : (
            <span className="couple-portrait-placeholder">Bride</span>
          )}
          <span className="couple-portrait-badge">Bride</span>
        </div>
        <div className="couple-display-heart">♥</div>
        <div className={`couple-portrait groom-portrait ${groomPhoto ? 'has-photo' : 'empty'}`}>
          {groomPhoto ? (
            <img src={groomPhoto} alt="Groom" />
          ) : (
            <span className="couple-portrait-placeholder">Groom</span>
          )}
          <span className="couple-portrait-badge">Groom</span>
        </div>
      </div>
      <div className="animated-couple-overlay" />
    </div>
  );
}

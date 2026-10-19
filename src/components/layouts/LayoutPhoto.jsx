import React from 'react';
import CoupleDisplay from '../CoupleDisplay';

/**
 * Large prominence photo — never thumbnail pair unless collage mode.
 */
export default function LayoutPhoto({
  src,
  alt = 'Couple',
  frame = 'none',
  className = '',
  religion = '',
  theme = 'rose-ivory',
  scrollProgress = null,
  useAnimation = false,
  secondarySrc = null
}) {
  const showAnimation =
    useAnimation && religion === 'christian' && !src?.startsWith('data:');

  if (showAnimation) {
    return (
      <div className={`layout-photo layout-photo--animation layout-photo--${frame} ${className}`}>
        <CoupleDisplay
          theme={theme}
          heroMode
          scrollProgress={scrollProgress}
          religion={religion}
        />
      </div>
    );
  }

  if (!src && !secondarySrc) {
    return (
      <div className={`layout-photo layout-photo--placeholder layout-photo--${frame} ${className}`}>
        <span className="layout-photo-placeholder-text">Add your photo in Studio</span>
      </div>
    );
  }

  if (secondarySrc) {
    return (
      <div className={`layout-photo layout-photo--collage layout-photo--${frame} ${className}`}>
        <img src={src} alt={alt} className="layout-photo-collage-main" draggable={false} />
        <img src={secondarySrc} alt="" className="layout-photo-collage-secondary" draggable={false} />
      </div>
    );
  }

  return (
    <div className={`layout-photo layout-photo--${frame} ${className}`}>
      <img src={src} alt={alt} className="layout-photo-img" draggable={false} />
    </div>
  );
}

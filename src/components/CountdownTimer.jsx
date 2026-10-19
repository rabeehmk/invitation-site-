import React, { useState, useEffect } from 'react';
import { getCountdownTime } from '../utils/helpers';

export default function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState(getCountdownTime(targetDate));

  useEffect(() => {
    // Initial update
    setTimeLeft(getCountdownTime(targetDate));

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(getCountdownTime(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.expired) {
    return (
      <div className="guest-card-panel animate-fade-in-up animate-delay-2" style={{ textAlign: 'center' }}>
        <p style={{
          fontFamily: 'var(--theme-font-heading)',
          fontSize: '18px',
          fontWeight: '600',
          color: 'var(--theme-accent)',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          margin: 0
        }}>
          ✨ The Celebration Has Begun! ✨
        </p>
      </div>
    );
  }

  return (
    <div className="guest-card-panel animate-fade-in-up animate-delay-2">
      <h3>Countdown to the Day</h3>
      <div className="countdown-grid">
        <div className="countdown-box">
          <span className="countdown-num">{String(timeLeft.days).padStart(2, '0')}</span>
          <span className="countdown-label">Days</span>
        </div>
        <div className="countdown-box">
          <span className="countdown-num">{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className="countdown-label">Hours</span>
        </div>
        <div className="countdown-box">
          <span className="countdown-num">{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span className="countdown-label">Mins</span>
        </div>
        <div className="countdown-box">
          <span className="countdown-num">{String(timeLeft.seconds).padStart(2, '0')}</span>
          <span className="countdown-label">Secs</span>
        </div>
      </div>
    </div>
  );
}

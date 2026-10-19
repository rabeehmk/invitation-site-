import React, { useEffect, useState } from 'react';
import { motion, useTransform } from 'framer-motion';
import { getCountdownTime } from '../../utils/helpers';

export default function StickyCountdown({ targetDate, scrollProgress, accentColor }) {
  const [time, setTime] = useState(() => getCountdownTime(targetDate));
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setTime(getCountdownTime(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  useEffect(() => {
    if (!scrollProgress) return;
    const unsub = scrollProgress.on('change', (v) => setCompact(v > 0.35));
    return () => unsub();
  }, [scrollProgress]);

  const scale = useTransform(scrollProgress, [0, 0.4, 0.8], [1, 0.88, 0.72]);
  const y = useTransform(scrollProgress, [0, 0.5], [0, -12]);

  if (!targetDate || time.expired) return null;

  return (
    <motion.div
      className={`tradition-countdown ${compact ? 'tradition-countdown--pill' : ''}`}
      style={{
        scale,
        y,
        borderColor: accentColor,
        '--countdown-accent': accentColor
      }}
    >
      {compact ? (
        <span className="countdown-pill-text">
          {time.days}d {time.hours}h {time.minutes}m
        </span>
      ) : (
        <div className="countdown-grid">
          {[
            { v: time.days, l: 'Days' },
            { v: time.hours, l: 'Hrs' },
            { v: time.minutes, l: 'Min' },
            { v: time.seconds, l: 'Sec' }
          ].map(({ v, l }) => (
            <div key={l} className="countdown-unit">
              <span className="countdown-value">{String(v).padStart(2, '0')}</span>
              <span className="countdown-label">{l}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

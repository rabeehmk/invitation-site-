import React, { useEffect, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

const PETAL_COLORS = [
  '#f59e0b', // Marigold amber
  '#fbbf24', // Warm gold
  '#f43f5e', // Rose petal red
  '#fda4af', // Soft blush pink
  '#ffffff', // Jasmine white
  '#e5c158'  // Shimmering gold
];

export default function PetalsConfettiOverlay({ active = false, duration = 4500 }) {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(active);
  const [petals, setPetals] = useState([]);

  useEffect(() => {
    if (!active || reduced) {
      setVisible(false);
      return;
    }

    setVisible(true);
    // Generate 32 delicate floating petals
    const items = Array.from({ length: 32 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 96}%`,
      delay: `${Math.random() * 1.4}s`,
      dur: `${2.8 + Math.random() * 2.2}s`,
      size: `${8 + Math.random() * 10}px`,
      color: PETAL_COLORS[i % PETAL_COLORS.length],
      drift: `${(Math.random() - 0.5) * 80}px`,
      rot: `${Math.random() * 360}deg`
    }));
    setPetals(items);

    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [active, duration, reduced]);

  if (!visible || reduced) return null;

  return (
    <div className="petals-confetti-container" aria-hidden="true">
      {petals.map((p) => (
        <span
          key={p.id}
          className="petals-particle"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.dur,
            width: p.size,
            height: `${parseFloat(p.size) * 1.3}px`,
            backgroundColor: p.color,
            '--drift-x': p.drift,
            '--initial-rot': p.rot
          }}
        />
      ))}
    </div>
  );
}

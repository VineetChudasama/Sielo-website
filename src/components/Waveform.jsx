import React, { useState } from 'react';

export default function Waveform({ progress = 0.45, onSeek }) {
  const [hoverIndex, setHoverIndex] = useState(null);

  // 48 rhythmic waveform bars representing acoustic dynamics
  const barHeights = [
    25, 40, 60, 85, 45, 30, 70, 95, 80, 50, 65, 90, 100, 75, 40, 30,
    55, 80, 95, 70, 45, 60, 85, 100, 65, 40, 55, 75, 90, 85, 60, 35,
    50, 75, 95, 80, 60, 40, 65, 85, 95, 70, 45, 35, 55, 75, 60, 30
  ];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '48px',
        gap: '3px',
        padding: '8px 0',
        cursor: 'pointer',
        position: 'relative'
      }}
      onMouseLeave={() => setHoverIndex(null)}
    >
      {barHeights.map((height, i) => {
        const barProgress = i / barHeights.length;
        const isPlayed = barProgress <= progress;
        const isHovered = hoverIndex !== null && barProgress <= hoverIndex / barHeights.length;

        return (
          <div
            key={i}
            onMouseEnter={() => setHoverIndex(i)}
            onClick={() => onSeek && onSeek(barProgress)}
            style={{
              flex: 1,
              height: `${height}%`,
              borderRadius: '2px',
              background: isPlayed
                ? 'linear-gradient(180deg, #F4F1DE 0%, #D4C4A8 100%)'
                : isHovered
                ? 'rgba(212, 196, 168, 0.5)'
                : 'rgba(65, 90, 119, 0.35)',
              boxShadow: isPlayed
                ? '0 0 8px rgba(212, 196, 168, 0.25)'
                : 'none',
              transform: isHovered ? 'scaleY(1.15)' : 'scaleY(1)',
              transition: 'height 0.15s ease, background 0.15s ease, transform 0.15s ease'
            }}
          />
        );
      })}
    </div>
  );
}

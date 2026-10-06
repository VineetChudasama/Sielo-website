import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function CircadianWave() {
  const [activePoint, setActivePoint] = useState(4); // default: Night

  const dayparts = [
    { hour: '05:00', label: 'Dawn', level: 25, x: 40, y: 130, mood: 'Ambient & Lo-fi', share: '8%' },
    { hour: '09:00', label: 'Morning', level: 60, x: 130, y: 80, mood: 'Indie & High-Energy', share: '22%' },
    { hour: '14:00', label: 'Afternoon', level: 45, x: 220, y: 105, mood: 'Deep Focus & Jazz', share: '16%' },
    { hour: '19:00', label: 'Evening', level: 80, x: 310, y: 50, mood: 'Synthwave & Disco', share: '24%' },
    { hour: '23:30', label: 'Night', level: 98, x: 400, y: 25, mood: 'Atmospheric R&B & Soul', share: '30%' }
  ];

  // Smooth cubic bezier spline passing through points
  // Width 440, Height 160
  const wavePath = "M 0,140 C 20,135 30,130 40,130 C 80,130 100,80 130,80 C 160,80 190,105 220,105 C 255,105 280,50 310,50 C 350,50 375,25 400,25 C 420,25 435,35 440,40";
  const areaPath = `${wavePath} L 440,160 L 0,160 Z`;

  return (
    <div style={{ width: '100%', position: 'relative', marginTop: '12px' }}>
      {/* Active Daypart Pill Tooltip */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 14px',
          borderRadius: '12px',
          background: 'rgba(13, 27, 42, 0.75)',
          border: '1px solid rgba(212, 196, 168, 0.2)',
          marginBottom: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#D4C4A8',
              boxShadow: '0 0 8px #D4C4A8',
              flexShrink: 0
            }}
          />
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-ivory)' }}>
            {dayparts[activePoint].label} ({dayparts[activePoint].hour})
          </span>
          <span style={{ fontSize: '0.75rem', color: 'rgba(244, 241, 222, 0.6)' }}>
            — {dayparts[activePoint].mood}
          </span>
        </div>
        <span
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: 'var(--color-gold)'
          }}
        >
          {dayparts[activePoint].share} of daily volume
        </span>
      </div>

      {/* Responsive SVG Wave Container */}
      <div style={{ position: 'relative', width: '100%', height: '145px' }}>
        <svg
          viewBox="0 0 440 160"
          preserveAspectRatio="none"
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
        >
          <defs>
            {/* Wave gradient fill */}
            <linearGradient id="waveFillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#D4C4A8" stopOpacity="0.25" />
              <stop offset="60%" stopColor="#778D7A" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#0D1B2A" stopOpacity="0" />
            </linearGradient>

            {/* Stroke gradient */}
            <linearGradient id="waveStrokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#415A77" />
              <stop offset="40%" stopColor="#778D7A" />
              <stop offset="80%" stopColor="#D4C4A8" />
              <stop offset="100%" stopColor="#F4F1DE" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="0" y1="40" x2="440" y2="40" stroke="rgba(65, 90, 119, 0.18)" strokeDasharray="3 3" />
          <line x1="0" y1="80" x2="440" y2="80" stroke="rgba(65, 90, 119, 0.18)" strokeDasharray="3 3" />
          <line x1="0" y1="120" x2="440" y2="120" stroke="rgba(65, 90, 119, 0.18)" strokeDasharray="3 3" />

          {/* Area fill */}
          <motion.path
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            d={areaPath}
            fill="url(#waveFillGradient)"
          />

          {/* Continuous wave spline */}
          <motion.path
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            d={wavePath}
            fill="none"
            stroke="url(#waveStrokeGradient)"
            strokeWidth="3"
            filter="drop-shadow(0 0 8px rgba(212, 196, 168, 0.4))"
          />
        </svg>

        {/* HTML daypart marker dots - guaranteed true geometric circles on all screen sizes */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {dayparts.map((pt, i) => {
            const isSelected = i === activePoint;
            const leftPct = (pt.x / 440) * 100;
            const topPct = (pt.y / 160) * 100;
            return (
              <div
                key={pt.label}
                onClick={() => setActivePoint(i)}
                style={{
                  position: 'absolute',
                  left: `${leftPct}%`,
                  top: `${topPct}%`,
                  transform: 'translate(-50%, -50%)',
                  width: isSelected ? '22px' : '16px',
                  height: isSelected ? '22px' : '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  pointerEvents: 'auto',
                  zIndex: 5
                }}
              >
                {/* Outer glow ring for selected point */}
                {isSelected && (
                  <span
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '50%',
                      border: '1.5px solid #D4C4A8',
                      opacity: 0.85,
                      boxShadow: '0 0 8px rgba(212, 196, 168, 0.5)'
                    }}
                  />
                )}
                {/* Dot */}
                <span
                  style={{
                    width: isSelected ? '10px' : '7px',
                    height: isSelected ? '10px' : '7px',
                    borderRadius: '50%',
                    background: isSelected ? '#F4F1DE' : '#778D7A',
                    border: '2px solid #0D1B2A',
                    boxShadow: isSelected ? '0 0 6px rgba(244, 241, 222, 0.8)' : 'none',
                    transition: 'all 0.2s ease',
                    flexShrink: 0
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* X-axis labels below the wave with generous padding */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '14px 6px',
          fontSize: '0.74rem',
          color: 'rgba(244, 241, 222, 0.55)',
          fontFamily: 'var(--font-heading)',
          marginTop: '10px',
          marginBottom: '4px'
        }}
      >
        {dayparts.map((pt, i) => (
          <span
            key={pt.label}
            onClick={() => setActivePoint(i)}
            style={{
              cursor: 'pointer',
              color: i === activePoint ? 'var(--color-gold)' : 'inherit',
              fontWeight: i === activePoint ? 700 : 400,
              transition: 'color 0.2s ease'
            }}
          >
            {pt.label}
          </span>
        ))}
      </div>
    </div>
  );
}

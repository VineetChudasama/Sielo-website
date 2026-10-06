import React from 'react';
import { motion } from 'framer-motion';

export default function VibeRadar({ metrics }) {
  // SVG Radar coordinates for 5 axes
  // Center at (150, 150), radius = 100
  const size = 300;
  const center = size / 2;
  const radius = 95;
  const numPoints = metrics.length;

  const getCoordinates = (index, value) => {
    // start from top (-PI/2)
    const angle = (Math.PI * 2 / numPoints) * index - Math.PI / 2;
    const r = (value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y, angle };
  };

  // Build outer grid polygons for 25%, 50%, 75%, 100%
  const gridLevels = [0.25, 0.5, 0.75, 1.0];
  const gridPolygons = gridLevels.map((level) => {
    const points = metrics.map((_, i) => {
      const angle = (Math.PI * 2 / numPoints) * i - Math.PI / 2;
      const x = center + radius * level * Math.cos(angle);
      const y = center + radius * level * Math.sin(angle);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
    return points;
  });

  // User Vibe Radar polygon
  const userPoints = metrics.map((m, i) => {
    const { x, y } = getCoordinates(i, m.value);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ overflow: 'visible' }}
      >
        {/* Background concentric web polygons */}
        {gridPolygons.map((pts, idx) => (
          <polygon
            key={idx}
            points={pts}
            fill="none"
            stroke="rgba(65, 90, 119, 0.28)"
            strokeWidth="1"
            strokeDasharray={idx === 3 ? 'none' : '3 3'}
          />
        ))}

        {/* Spoke axis lines */}
        {metrics.map((_, i) => {
          const { x, y } = getCoordinates(i, 100);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="rgba(65, 90, 119, 0.35)"
              strokeWidth="1"
            />
          );
        })}

        {/* Data polygon with glow and fill */}
        <motion.polygon
          initial={{ opacity: 0, scale: 0.2 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{ transformOrigin: `${center}px ${center}px` }}
          points={userPoints}
          fill="rgba(212, 196, 168, 0.22)"
          stroke="#D4C4A8"
          strokeWidth="2.5"
          filter="drop-shadow(0 0 12px rgba(212, 196, 168, 0.3))"
        />

        {/* Vertex points & labels */}
        {metrics.map((m, i) => {
          const { x, y } = getCoordinates(i, m.value);
          const labelCoord = getCoordinates(i, 118);

          return (
            <g key={i}>
              {/* Vertex glowing node */}
              <circle
                cx={x}
                cy={y}
                r="4.5"
                fill="#F4F1DE"
                stroke="#D4C4A8"
                strokeWidth="2"
              />

              {/* Label */}
              <text
                x={labelCoord.x}
                y={labelCoord.y + 4}
                textAnchor="middle"
                fill="var(--color-ivory)"
                fontSize="11"
                fontWeight="600"
                fontFamily="var(--font-heading)"
              >
                {m.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

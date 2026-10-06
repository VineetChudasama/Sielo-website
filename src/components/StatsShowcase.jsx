import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Moon, Sun, Sunrise, Sunset, Activity, Sparkles, Orbit } from 'lucide-react';
import VibeRadar from './VibeRadar';
import CircadianWave from './CircadianWave';
import { VIBE_METRICS } from '../data/musicData';

export default function StatsShowcase() {
  return (
    <section
      id="stats"
      style={{
        position: 'relative',
        zIndex: 20,
        padding: '120px 24px',
        maxWidth: 'var(--max-w-content)',
        margin: '0 auto'
      }}
    >
      {/* Section Header */}
      <div style={{ marginBottom: '64px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <span className="pill-badge">
            <Orbit size={13} />
            <span>MUSIC UNIVERSE STATS</span>
          </span>
        </div>
        <h2
          style={{
            fontSize: 'clamp(2.2rem, 4.5vw, 4rem)',
            fontWeight: 700,
            textTransform: 'uppercase',
            lineHeight: 1.08,
            color: 'var(--color-ivory)',
            marginBottom: '16px'
          }}
        >
          YOUR MUSIC
          <br />
          <span style={{ color: 'var(--color-gold)' }}>HAS A PATTERN.</span>
        </h2>
        <p
          style={{
            fontSize: '1.15rem',
            color: 'rgba(244, 241, 222, 0.72)',
            maxWidth: '640px'
          }}
        >
          Beyond simple play-count totals: Sielo maps your listening persona, acoustic
          energy variance, and circadian audio waves.
        </p>
      </div>

      {/* Grid: Radar on Left, Circadian & Persona on Right */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '28px'
        }}
      >
        {/* Left Column: Vibe Radar (Spans 6 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-panel"
          style={{
            gridColumn: 'span 12',
            borderRadius: '28px',
            padding: 'clamp(24px, 3.5vw, 40px)',
            background: 'linear-gradient(150deg, rgba(27, 38, 59, 0.7) 0%, rgba(13, 27, 42, 0.9) 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--color-ivory)' }}>
                Vibe Radar
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'rgba(244, 241, 222, 0.6)' }}>
                5-Dimensional Acoustic Fingerprint
              </p>
            </div>
            <span className="pill-badge" style={{ fontSize: '0.68rem' }}>
              <Compass size={12} />
              <span>LIVE DEMO</span>
            </span>
          </div>

          {/* SVG Radar Graphic */}
          <div style={{ margin: '16px 0 28px 0' }}>
            <VibeRadar metrics={VIBE_METRICS} />
          </div>

          {/* Metric breakdown bars */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {VIBE_METRICS.map((item) => (
              <div key={item.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-ivory)' }}>{item.label}</span>
                  <span style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>
                    {item.value}%
                  </span>
                </div>
                <div
                  style={{
                    height: '6px',
                    borderRadius: '3px',
                    background: 'rgba(65, 90, 119, 0.3)',
                    overflow: 'hidden'
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.value}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    style={{
                      height: '100%',
                      background: 'linear-gradient(90deg, #778D7A 0%, #D4C4A8 100%)',
                      borderRadius: '3px'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Column: Circadian Wave & Persona (Spans 6 cols) */}
        <div
          style={{
            gridColumn: 'span 12',
            display: 'flex',
            flexDirection: 'column',
            gap: '28px'
          }}
          className="stats-right-col"
        >
          {/* Persona Spotlight Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-panel"
            style={{
              borderRadius: '28px',
              padding: 'clamp(24px, 3.5vw, 36px)',
              background: 'linear-gradient(150deg, rgba(27, 38, 59, 0.7) 0%, rgba(13, 27, 42, 0.9) 100%)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span className="pill-badge">
                <Sparkles size={12} />
                <span>LISTENING PERSONA</span>
              </span>
            </div>

            <h3
              style={{
                fontSize: '1.75rem',
                fontWeight: 700,
                color: 'var(--color-ivory)',
                marginBottom: '8px'
              }}
            >
              Late-Night Introspective
            </h3>

            <p style={{ color: 'rgba(244, 241, 222, 0.75)', fontSize: '0.98rem', lineHeight: 1.6, marginBottom: '20px' }}>
              Your acoustic sessions peak when the world slows down. Driven by
              deep analog synths, atmospheric reverb, and high repeat frequencies on concept albums.
            </p>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <span className="pill-badge" style={{ fontSize: '0.72rem' }}>84% Atmospheric R&B</span>
              <span className="pill-badge" style={{ fontSize: '0.72rem' }}>76% Synthwave</span>
              <span className="pill-badge" style={{ fontSize: '0.72rem' }}>Top 1% The Weeknd</span>
            </div>
          </motion.div>

          {/* Circadian Wave Activity Graph Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="glass-panel"
            style={{
              borderRadius: '28px',
              padding: 'clamp(24px, 3.5vw, 36px)',
              background: 'linear-gradient(150deg, rgba(27, 38, 59, 0.7) 0%, rgba(13, 27, 42, 0.9) 100%)',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--color-ivory)' }}>
                    Circadian Flow
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(244, 241, 222, 0.6)' }}>
                    24-Hour Acoustic Rhythm & Daypart Drift
                  </p>
                </div>
                <span
                  className="pill-badge"
                  style={{
                    background: 'rgba(119, 141, 122, 0.15)',
                    border: '1px solid rgba(119, 141, 122, 0.35)',
                    color: '#A3B8A6',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Activity size={12} />
                  <span>24-HR WAVE</span>
                </span>
              </div>

              {/* 24-Hour Continuous Landscape Wave Graph */}
              <CircadianWave />
            </div>

            <div
              style={{
                fontSize: '0.82rem',
                color: 'rgba(212, 196, 168, 0.75)',
                paddingTop: '16px',
                borderTop: '1px solid rgba(244, 241, 222, 0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '12px'
              }}
            >
              <Moon size={14} style={{ flexShrink: 0 }} />
              <span>95% of peak listening occurs between 21:00 and 03:30</span>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          #stats .glass-panel:nth-child(1) {
            grid-column: span 6 !important;
          }
          .stats-right-col {
            grid-column: span 6 !important;
          }
        }
      `}</style>
    </section>
  );
}

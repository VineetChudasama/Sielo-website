import React from 'react';
import { motion } from 'framer-motion';
import { Disc, Mic2, Users, Radio, ShieldCheck, Zap, Layers, Sparkles } from 'lucide-react';
import { FEATURE_DATA } from '../data/musicData';

export default function FeatureSection() {
  return (
    <section
      id="features"
      style={{
        position: 'relative',
        zIndex: 20,
        padding: '120px 24px 100px 24px',
        maxWidth: 'var(--max-w-content)',
        margin: '0 auto'
      }}
    >
      {/* Section Header */}
      <div style={{ marginBottom: '64px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <span className="pill-badge">
            <Layers size={13} />
            <span>CORE ARCHITECTURE</span>
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
          EVERYTHING
          <br />
          <span style={{ color: 'var(--color-gold)' }}>YOU NEED TO LISTEN.</span>
        </h2>
        <p
          style={{
            fontSize: '1.15rem',
            color: 'rgba(244, 241, 222, 0.72)',
            maxWidth: '600px'
          }}
        >
          Engineered for acoustic fidelity and tactile intimacy. Sielo reimagines
          playback from the audio stream layer to physical haptics.
        </p>
      </div>

      {/* Asymmetric Editorial Feature Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '24px'
        }}
      >
        {/* Card 1: Dual Stream Engine (Spans 7 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="glass-panel glass-card-interactive"
          style={{
            gridColumn: 'span 12',
            borderRadius: '24px',
            padding: '36px',
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(145deg, rgba(27, 38, 59, 0.75) 0%, rgba(13, 27, 42, 0.85) 100%)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
            <div>
              <span className="pill-badge" style={{ marginBottom: '12px' }}>
                <Zap size={12} />
                <span>{FEATURE_DATA[0].tag}</span>
              </span>
              <h3 style={{ fontSize: '1.85rem', fontWeight: 700, marginTop: '8px' }}>
                {FEATURE_DATA[0].title}
              </h3>
              <p style={{ color: 'var(--color-gold)', fontSize: '0.95rem', marginTop: '4px' }}>
                {FEATURE_DATA[0].subtitle}
              </p>
            </div>
            <span className="pill-badge-teal">
              <ShieldCheck size={13} />
              <span>{FEATURE_DATA[0].pill}</span>
            </span>
          </div>

          <p style={{ fontSize: '1.02rem', lineHeight: 1.6, maxWidth: '640px', marginBottom: '28px' }}>
            {FEATURE_DATA[0].description}
          </p>

          {/* Interactive Stream Fallback Diagram */}
          <div
            style={{
              padding: '16px 18px',
              borderRadius: '16px',
              background: 'rgba(13, 27, 42, 0.6)',
              border: '1px solid rgba(65, 90, 119, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '14px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 'min(100%, 250px)', flex: '1 1 auto' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(212, 196, 168, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-gold)',
                  flexShrink: 0
                }}
              >
                <Radio size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-ivory)' }}>
                  Lossless Resolution Engine
                </div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(244, 241, 222, 0.6)', lineHeight: 1.4 }}>
                  320kbps AAC Direct Stream • <span style={{ whiteSpace: 'nowrap' }}>Sub-40ms Initial Buffer</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', maxWidth: '100%' }}>
              <span className="pill-badge" style={{ fontSize: 'clamp(0.6rem, 1.8vw, 0.68rem)', padding: '3px 10px' }}>
                JioSaavn CD AAC
              </span>
              <span className="pill-badge" style={{ fontSize: 'clamp(0.6rem, 1.8vw, 0.68rem)', opacity: 0.8, padding: '3px 10px' }}>
                YT InnerTube Fallback
              </span>
            </div>
          </div>
        </motion.div>

        {/* Card 2: Synchronized Lyrics (Spans 5 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass-panel glass-card-interactive"
          style={{
            gridColumn: 'span 12',
            borderRadius: '24px',
            padding: '36px',
            position: 'relative',
            background: 'linear-gradient(145deg, rgba(27, 38, 59, 0.75) 0%, rgba(13, 27, 42, 0.85) 100%)'
          }}
        >
          <span className="pill-badge" style={{ marginBottom: '12px' }}>
            <Mic2 size={12} />
            <span>{FEATURE_DATA[1].tag}</span>
          </span>
          <h3 style={{ fontSize: '1.85rem', fontWeight: 700, marginTop: '8px', marginBottom: '8px' }}>
            {FEATURE_DATA[1].title}
          </h3>
          <p style={{ color: 'var(--color-gold)', fontSize: '0.95rem', marginBottom: '16px' }}>
            {FEATURE_DATA[1].subtitle}
          </p>
          <p style={{ fontSize: '1.02rem', lineHeight: 1.6, marginBottom: '24px' }}>
            {FEATURE_DATA[1].description}
          </p>

          {/* Micro-preview of lyrics */}
          <div
            style={{
              padding: '16px',
              borderRadius: '14px',
              background: 'rgba(13, 27, 42, 0.6)',
              border: '1px solid rgba(65, 90, 119, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <div style={{ fontSize: '0.78rem', color: 'rgba(244, 241, 222, 0.4)' }}>[01:36] Look what you've done</div>
            <div style={{ fontSize: '0.95rem', color: 'var(--color-ivory)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--color-gold)' }}>▶</span> [01:42] Every day a lover try to test me
            </div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(244, 241, 222, 0.4)' }}>[01:46] Pull off in that Roadster SV</div>
          </div>
        </motion.div>

        {/* Card 3: Tactile Vinyl & Haptics (Spans 6 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="glass-panel glass-card-interactive"
          style={{
            gridColumn: 'span 12',
            borderRadius: '24px',
            padding: '36px',
            position: 'relative',
            background: 'linear-gradient(145deg, rgba(27, 38, 59, 0.75) 0%, rgba(13, 27, 42, 0.85) 100%)'
          }}
        >
          <span className="pill-badge" style={{ marginBottom: '12px' }}>
            <Disc size={12} />
            <span>{FEATURE_DATA[2].tag}</span>
          </span>
          <h3 style={{ fontSize: '1.85rem', fontWeight: 700, marginTop: '8px', marginBottom: '8px' }}>
            {FEATURE_DATA[2].title}
          </h3>
          <p style={{ color: 'var(--color-gold)', fontSize: '0.95rem', marginBottom: '16px' }}>
            {FEATURE_DATA[2].subtitle}
          </p>
          <p style={{ fontSize: '1.02rem', lineHeight: 1.6 }}>
            {FEATURE_DATA[2].description}
          </p>
        </motion.div>

        {/* Card 4: Listen Together E2EE (Spans 6 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-panel glass-card-interactive"
          style={{
            gridColumn: 'span 12',
            borderRadius: '24px',
            padding: '36px',
            position: 'relative',
            background: 'linear-gradient(145deg, rgba(27, 38, 59, 0.75) 0%, rgba(13, 27, 42, 0.85) 100%)'
          }}
        >
          <span className="pill-badge" style={{ marginBottom: '12px' }}>
            <Users size={12} />
            <span>{FEATURE_DATA[3].tag}</span>
          </span>
          <h3 style={{ fontSize: '1.85rem', fontWeight: 700, marginTop: '8px', marginBottom: '8px' }}>
            {FEATURE_DATA[3].title}
          </h3>
          <p style={{ color: 'var(--color-gold)', fontSize: '0.95rem', marginBottom: '16px' }}>
            {FEATURE_DATA[3].subtitle}
          </p>
          <p style={{ fontSize: '1.02rem', lineHeight: 1.6 }}>
            {FEATURE_DATA[3].description}
          </p>
        </motion.div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          #features .glass-panel:nth-child(1) {
            grid-column: span 7 !important;
          }
          #features .glass-panel:nth-child(2) {
            grid-column: span 5 !important;
          }
          #features .glass-panel:nth-child(3) {
            grid-column: span 6 !important;
          }
          #features .glass-panel:nth-child(4) {
            grid-column: span 6 !important;
          }
        }
      `}</style>
    </section>
  );
}

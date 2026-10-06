import React from 'react';
import { motion } from 'framer-motion';
import { Users, Lock, Wifi, MessageSquare, Radio, ShieldCheck, Zap } from 'lucide-react';

export default function ListenTogether() {
  return (
    <section
      id="listen-together"
      style={{
        position: 'relative',
        zIndex: 20,
        padding: '120px 24px',
        maxWidth: 'var(--max-w-content)',
        margin: '0 auto'
      }}
    >
      {/* Section Header */}
      <div style={{ textAlign: 'center', marginBottom: '72px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <span className="pill-badge">
            <Users size={13} />
            <span>PRIVATE SOCIAL SESSIONS</span>
          </span>
        </div>
        <h2
          style={{
            fontSize: 'clamp(2.2rem, 5vw, 4.2rem)',
            fontWeight: 700,
            textTransform: 'uppercase',
            lineHeight: 1.08,
            color: 'var(--color-ivory)',
            marginBottom: '18px'
          }}
        >
          SAME SONG.
          <br />
          <span style={{ color: 'var(--color-gold)' }}>DIFFERENT PLACES.</span>
        </h2>
        <p
          style={{
            fontSize: '1.15rem',
            color: 'rgba(244, 241, 222, 0.72)',
            maxWidth: '640px',
            margin: '0 auto'
          }}
        >
          Sub-150ms real-time audio synchronization secured by AES-256-GCM authenticated
          peer-to-peer mesh. Collaborative queueing and encrypted in-room chat.
        </p>
      </div>

      {/* 3D Synchronized Device Scene */}
      <div
        className="glass-panel"
        style={{
          borderRadius: '32px',
          padding: 'clamp(14px, 4vw, 56px)',
          background: 'linear-gradient(160deg, rgba(27, 38, 59, 0.7) 0%, rgba(13, 27, 42, 0.95) 100%)',
          border: '1px solid rgba(212, 196, 168, 0.18)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Sync Status Badge in top center */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '40px'
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'clamp(5px, 1.5vw, 10px)',
              padding: '6px clamp(10px, 2vw, 18px)',
              borderRadius: '9999px',
              background: 'rgba(13, 27, 42, 0.85)',
              border: '1px solid rgba(212, 196, 168, 0.25)',
              boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
              maxWidth: '100%',
              boxSizing: 'border-box'
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#778D7A',
                boxShadow: '0 0 10px #778D7A',
                flexShrink: 0
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(0.56rem, 1.6vw, 0.76rem)',
                fontWeight: 600,
                color: 'var(--color-ivory)',
                letterSpacing: '0.04em',
                whiteSpace: 'nowrap'
              }}
            >
              LATENCY DRIFT: 42ms • CLOCK SYNCHRONIZED
            </span>
            <span
              className="pill-badge-teal"
              style={{
                fontSize: 'clamp(0.54rem, 1.4vw, 0.65rem)',
                padding: '2px 7px',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              AES-256-GCM
            </span>
          </div>
        </div>

        {/* Two Synchronized Device Cards with Center Wave */}
        <div
          className="listen-together-cards-container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'clamp(20px, 4vw, 48px)',
            flexWrap: 'wrap',
            position: 'relative'
          }}
        >
          {/* USER A (HOST) CARD */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              width: '280px',
              borderRadius: '20px',
              padding: '20px',
              background: 'rgba(13, 27, 42, 0.85)',
              border: '1px solid rgba(212, 196, 168, 0.25)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
            }}
          >
            {/* User tag */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'var(--color-gold)',
                    color: 'var(--bg-deep)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  A
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-ivory)' }}>
                    Host (Harsh)
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'rgba(244, 241, 222, 0.5)' }}>
                    Berlin, Germany
                  </div>
                </div>
              </div>
              <span className="pill-badge" style={{ fontSize: '0.6rem', padding: '2px 6px' }}>ROOM HOST</span>
            </div>

            {/* Album artwork & Track */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '14px' }}>
              <img
                src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300&auto=format&fit=crop"
                alt="After Hours"
                style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
              />
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-ivory)', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  After Hours
                </div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(244, 241, 222, 0.6)' }}>
                  The Weeknd • 02:45
                </div>
              </div>
            </div>

            {/* Chat bubble */}
            <div
              style={{
                padding: '8px 12px',
                borderRadius: '10px',
                background: 'rgba(27, 38, 59, 0.6)',
                border: '1px solid rgba(65, 90, 119, 0.25)',
                fontSize: '0.75rem',
                color: 'rgba(244, 241, 222, 0.85)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <MessageSquare size={12} color="var(--color-gold)" />
              <span>"That beat switch at 2:00 is insane"</span>
            </div>
          </motion.div>

          {/* Connection Pulse Wave Indicator */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: '5px',
                    height: `${Math.sin((i / 7) * Math.PI) * 28 + 6}px`,
                    borderRadius: '2px',
                    background: 'linear-gradient(180deg, #778D7A 0%, #D4C4A8 100%)',
                    boxShadow: '0 0 8px rgba(212, 196, 168, 0.4)'
                  }}
                />
              ))}
            </div>
            <span
              style={{
                fontSize: '0.68rem',
                letterSpacing: '0.08em',
                color: 'var(--color-gold)',
                fontFamily: 'var(--font-heading)',
                fontWeight: 600
              }}
            >
              P2P MESH
            </span>
          </div>

          {/* USER B (LISTENER) CARD */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              width: '280px',
              borderRadius: '20px',
              padding: '20px',
              background: 'rgba(13, 27, 42, 0.85)',
              border: '1px solid rgba(212, 196, 168, 0.25)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
            }}
          >
            {/* User tag */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: '#778D7A',
                    color: 'var(--bg-deep)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  B
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-ivory)' }}>
                    Listener (Elena)
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'rgba(244, 241, 222, 0.5)' }}>
                    Tokyo, Japan
                  </div>
                </div>
              </div>
              <span className="pill-badge-teal" style={{ fontSize: '0.6rem', padding: '2px 6px' }}>SYNCED</span>
            </div>

            {/* Album artwork & Track */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '14px' }}>
              <img
                src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300&auto=format&fit=crop"
                alt="After Hours"
                style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
              />
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-ivory)', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  After Hours
                </div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(244, 241, 222, 0.6)' }}>
                  The Weeknd • 02:45
                </div>
              </div>
            </div>

            {/* Chat bubble */}
            <div
              style={{
                padding: '8px 12px',
                borderRadius: '10px',
                background: 'rgba(27, 38, 59, 0.6)',
                border: '1px solid rgba(65, 90, 119, 0.25)',
                fontSize: '0.75rem',
                color: 'rgba(244, 241, 222, 0.85)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <MessageSquare size={12} color="#778D7A" />
              <span>"Added Blinding Lights next in queue!"</span>
            </div>
          </motion.div>
        </div>

        {/* Feature Highlights Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
            marginTop: '48px',
            paddingTop: '32px',
            borderTop: '1px solid rgba(244, 241, 222, 0.08)'
          }}
        >
          <div style={{ display: 'flex', gap: '12px' }}>
            <ShieldCheck size={20} color="var(--color-gold)" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-ivory)' }}>
                Zero Metadata Leaks
              </div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(244, 241, 222, 0.6)' }}>
                Relay servers never decrypt payloads or track what you stream.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Zap size={20} color="var(--color-gold)" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-ivory)' }}>
                Sub-150ms Precision
              </div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(244, 241, 222, 0.6)' }}>
                Continuous clock drift correction keeps playback in exact step.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Wifi size={20} color="var(--color-gold)" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-ivory)' }}>
                Resilient Reconnect
              </div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(244, 241, 222, 0.6)' }}>
                Host backgrounding or network switches will not disrupt the room.
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .listen-together-cards-container {
            flex-direction: column !important;
            align-items: center !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </section>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
import { Music, Disc3, Radio, ArrowLeft, Download, ExternalLink } from 'lucide-react';
import DownloadButton from './DownloadButton';

export default function DeepLinkFallback({ type, id, title, artist, onBack }) {
  const getMeta = () => {
    switch (type) {
      case 'song':
        return {
          badge: 'SHARED TRACK',
          icon: <Music size={22} color="#D4AF37" />,
          heading: title || 'Song Preview',
          subheading: artist ? `by ${artist}` : `Track ID: ${id}`,
          description: 'Experience this track in studio-grade lossless 320kbps audio with synchronized lyrics on Sielo for Android.',
          appUri: `sielo://track/${id}`
        };
      case 'album':
        return {
          badge: 'SHARED ALBUM',
          icon: <Disc3 size={22} color="#D4AF37" />,
          heading: title || 'Album Discography',
          subheading: artist ? `by ${artist}` : `Album ID: ${id}`,
          description: 'Explore the full album release, verified tracklist, and atmospheric visual artwork in Sielo.',
          appUri: `sielo://album/${id}`
        };
      case 'listen':
        return {
          badge: 'LISTEN TOGETHER ROOM',
          icon: <Radio size={22} color="#778D7A" />,
          heading: `Room Code: ${id}`,
          subheading: 'Encrypted Peer-to-Peer Session',
          description: 'Join this sub-150ms synchronized listening room to listen along in real-time with AES-256-GCM encryption.',
          appUri: `sielo://room/${id}`
        };
      default:
        return {
          badge: 'SIELO MUSIC',
          icon: <Music size={22} color="#D4AF37" />,
          heading: 'Music Preview',
          subheading: id,
          description: 'Stream music in lossless quality with Sielo.',
          appUri: '#'
        };
    }
  };

  const meta = getMeta();

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#070B12',
        color: '#F4F1DE',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 24px',
        position: 'relative',
        zIndex: 50,
        boxSizing: 'border-box'
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '100%',
          maxWidth: '520px',
          background: 'linear-gradient(160deg, rgba(27, 38, 59, 0.85) 0%, rgba(13, 27, 42, 0.95) 100%)',
          border: '1px solid rgba(212, 196, 168, 0.22)',
          borderRadius: '28px',
          padding: 'clamp(28px, 6vw, 44px)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Ambient Top Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '240px',
            height: '160px',
            background: 'radial-gradient(circle, rgba(212, 196, 168, 0.2) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <span className="pill-badge" style={{ padding: '6px 14px', fontSize: '0.74rem' }}>
            {meta.icon}
            <span style={{ letterSpacing: '0.08em' }}>{meta.badge}</span>
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.6rem, 4vw, 2.3rem)',
            fontWeight: 700,
            color: 'var(--color-ivory)',
            lineHeight: 1.2,
            marginBottom: '8px',
            wordBreak: 'break-word'
          }}
        >
          {meta.heading}
        </h1>

        {/* Subheading */}
        <div
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.05rem',
            color: 'var(--color-gold)',
            fontWeight: 600,
            marginBottom: '18px'
          }}
        >
          {meta.subheading}
        </div>

        {/* Description */}
        <p
          style={{
            fontSize: '0.92rem',
            lineHeight: 1.55,
            color: 'rgba(244, 241, 222, 0.72)',
            marginBottom: '32px'
          }}
        >
          {meta.description}
        </p>

        {/* Action: Open in App / Download Sielo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}>
          <DownloadButton
            variant="hero"
            label="Download Sielo"
            subtitle="Install App to Open Link"
            style={{ width: '100%', maxWidth: '360px' }}
          />

          <button
            onClick={onBack}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(244, 241, 222, 0.55)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.85rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              padding: '8px 14px',
              borderRadius: '8px',
              transition: 'color 0.2s ease',
              marginTop: '6px'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#F4F1DE')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(244, 241, 222, 0.55)')}
          >
            <ArrowLeft size={14} />
            <span>Go to Sielo Home</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Disc, Sparkles, Clock, Music } from 'lucide-react';
import { ALBUMS_DISCOGRAPHY } from '../data/musicData';

export default function AlbumShowcase() {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'Albums', 'Singles & EPs', 'Soundtracks'];

  const filteredAlbums = activeCategory === 'All'
    ? ALBUMS_DISCOGRAPHY
    : ALBUMS_DISCOGRAPHY.filter((a) => a.category === activeCategory);

  return (
    <section
      id="albums"
      style={{
        position: 'relative',
        zIndex: 20,
        padding: '120px 24px',
        maxWidth: 'var(--max-w-content)',
        margin: '0 auto'
      }}
    >
      {/* Section Header */}
      <div style={{ marginBottom: '56px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <span className="pill-badge">
            <Disc size={13} />
            <span>SMART DISCOGRAPHY</span>
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
          DISCOVER
          <br />
          <span style={{ color: 'var(--color-gold)' }}>THE STORY BEHIND</span>
          <br />
          THE MUSIC.
        </h2>
        <p
          style={{
            fontSize: '1.15rem',
            color: 'rgba(244, 241, 222, 0.72)',
            maxWidth: '620px'
          }}
        >
          Large visual cards powered by dynamic color-gradient extraction directly from
          studio artwork. Grouped cleanly by Albums, EPs, and Soundtracks.
        </p>

        {/* Category Filter Pills */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginTop: '32px',
            flexWrap: 'wrap'
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={activeCategory === cat ? 'btn-primary' : 'btn-secondary'}
              style={{
                padding: '8px 20px',
                fontSize: '0.85rem'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Large Visual Album Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '28px'
        }}
      >
        {filteredAlbums.map((album, index) => (
          <motion.div
            key={album.title}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            className="glass-card-interactive"
            style={{
              borderRadius: '24px',
              padding: '24px',
              background: album.gradient,
              border: '1px solid rgba(244, 241, 222, 0.1)',
              boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.7)',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer'
            }}
          >
            {/* Soft edge light highlight */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)'
              }}
            />

            {/* Album Artwork */}
            <div
              style={{
                width: '100%',
                aspectRatio: '1/1',
                borderRadius: '16px',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
                marginBottom: '20px'
              }}
            >
              <img
                src={album.cover}
                alt={album.title}
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />

              {/* Release pill on top right */}
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  background: 'rgba(13, 27, 42, 0.8)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  color: 'var(--color-gold)',
                  letterSpacing: '0.08em'
                }}
              >
                {album.type}
              </div>
            </div>

            {/* Album Info */}
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.35rem',
                fontWeight: 700,
                color: 'var(--color-ivory)',
                marginBottom: '4px'
              }}
            >
              {album.title}
            </h3>
            <p
              style={{
                fontSize: '0.92rem',
                color: 'rgba(244, 241, 222, 0.72)',
                marginBottom: '16px'
              }}
            >
              {album.artist}
            </p>

            {/* Bottom Meta Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '12px',
                borderTop: '1px solid rgba(244, 241, 222, 0.08)',
                fontSize: '0.78rem',
                color: 'rgba(212, 196, 168, 0.85)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={13} />
                <span>{album.year} • {album.duration}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Music size={13} />
                <span>{album.tracks}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

import React, { useState } from 'react';
import { motion, useTransform, useMotionValue } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Sparkles, Radio } from 'lucide-react';
import { CENTRAL_TRACK } from '../data/musicData';
import DownloadButton from './DownloadButton';

export default function SieloPlayerMockup({
  scrollY,
  mousePos,
  isMobile,
  isHeroMobile = false
}) {
  const [isPlaying, setIsPlaying] = useState(true);
  const fallbackScroll = useMotionValue(0);
  const activeScroll = scrollY || fallbackScroll;

  // Player scroll behavior: stays stable initially, then scales slightly down and rises as scroll progresses
  const playerY = useTransform(
    activeScroll,
    [0, 450, 850],
    [0, -40, -180]
  );

  const playerScale = useTransform(
    activeScroll,
    [0, 450, 850],
    [1, 0.95, 0.82]
  );

  const playerOpacity = useTransform(
    activeScroll,
    [0, 600, 850],
    [1, 1, 0]
  );

  // Mouse tilt / parallax
  const mouseX = isMobile ? 0 : mousePos.x * 6;
  const playerWidth = isMobile ? 212 : 238;

  const playerCard = (
    <div
      className="glass-panel"
      style={{
        width: isHeroMobile ? '100%' : `${playerWidth}px`,
        borderRadius: isMobile ? '18px' : '20px',
        padding: isMobile ? '12px 14px' : '14px 16px',
        position: 'relative',
        background: 'linear-gradient(160deg, rgba(27, 38, 59, 0.88) 0%, rgba(13, 27, 42, 0.96) 100%)',
        border: '1px solid rgba(212, 196, 168, 0.22)',
        boxShadow: 'var(--shadow-player)'
      }}
    >
          {/* Ambient Top Light */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '20%',
              right: '20%',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(212, 196, 168, 0.6), transparent)'
            }}
          />

          {/* Top Header Row with Status & Lossless Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: isMobile ? '8px' : '10px'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontFamily: 'var(--font-heading)',
                fontSize: isMobile ? '0.62rem' : '0.66rem',
                color: 'var(--color-gold)',
                fontWeight: 600,
                letterSpacing: '0.05em'
              }}
            >
              <Radio size={12} className={isPlaying ? 'pulse-slow' : ''} />
              <span>PLAYING NOW</span>
            </div>

            <div
              className="pill-badge"
              style={{ fontSize: '0.58rem', padding: '2px 7px' }}
            >
              <Sparkles size={9} />
              <span>320K LOSSLESS</span>
            </div>
          </div>

          {/* Vinyl Record with Album Art INSIDE the Center */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: isHeroMobile ? 'unset' : '1/1',
              height: isHeroMobile ? '146px' : 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: isMobile ? '8px' : '10px'
            }}
          >
            {/* Spinning Vinyl Record */}
            <div
              className={`spin-vinyl ${isPlaying ? '' : 'spin-vinyl-paused'}`}
              style={{
                width: isHeroMobile ? '140px' : '88%',
                height: isHeroMobile ? '140px' : '88%',
                borderRadius: '50%',
                background: 'repeating-radial-gradient(circle, #081019 0px, #081019 3px, #162436 4px, #081019 5px)',
                boxShadow: '0 8px 22px rgba(0,0,0,0.85), inset 0 0 10px rgba(212, 196, 168, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid rgba(212, 196, 168, 0.18)',
                position: 'relative',
                animationPlayState: isPlaying ? 'running' : 'paused'
              }}
            >
              {/* Circular Album Artwork Label INSIDE the Disc Center */}
              <div
                style={{
                  width: '48%',
                  height: '48%',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  position: 'relative',
                  border: '2px solid #081019',
                  boxShadow: '0 0 10px rgba(0,0,0,0.8)'
                }}
              >
                <img
                  src="/starboy.png"
                  alt="Starboy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
                {/* Center spindle dot */}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#081019',
                    border: '1.5px solid #D4C4A8',
                    boxShadow: '0 0 4px rgba(0,0,0,0.9)'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Track Title and Artist */}
          <div style={{ marginBottom: isMobile ? '6px' : '8px', textAlign: 'center' }}>
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: isMobile ? '0.98rem' : '1.10rem',
                fontWeight: 700,
                color: 'var(--color-ivory)',
                lineHeight: 1.15
              }}
            >
              {CENTRAL_TRACK.title}
            </div>
            <div
              style={{
                fontSize: isMobile ? '0.72rem' : '0.78rem',
                color: 'rgba(244, 241, 222, 0.7)',
                marginTop: '1px'
              }}
            >
              {CENTRAL_TRACK.artist}
            </div>
          </div>

          {/* Waveform Progress Visualizer */}
          <div style={{ marginBottom: isMobile ? '8px' : '10px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '18px',
                gap: '2px',
                padding: '0 2px',
                cursor: 'pointer'
              }}
            >
              {Array.from({ length: 32 }).map((_, index) => {
                const played = index / 32 <= CENTRAL_TRACK.progress;
                const baseHeight = [
                  30, 45, 60, 80, 50, 70, 95, 65, 40, 85, 100, 75, 55, 90, 60, 45,
                  70, 85, 40, 60, 95, 75, 50, 85, 100, 65, 45, 70, 55, 40, 60, 35
                ][index] || 50;

                return (
                  <div
                    key={index}
                    style={{
                      flex: 1,
                      height: `${baseHeight}%`,
                      borderRadius: '2px',
                      background: played
                        ? 'linear-gradient(180deg, #F4F1DE 0%, #D4C4A8 100%)'
                        : 'rgba(65, 90, 119, 0.35)',
                      boxShadow: played ? '0 0 4px rgba(212, 196, 168, 0.25)' : 'none'
                    }}
                  />
                );
              })}
            </div>

            {/* Time stamps */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.64rem',
                color: 'rgba(244, 241, 222, 0.6)',
                marginTop: '3px',
                fontFamily: 'var(--font-heading)'
              }}
            >
              <span>{CENTRAL_TRACK.currentTime}</span>
              <span>{CENTRAL_TRACK.duration}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 4px'
            }}
          >
            <button
              style={{ color: 'rgba(244, 241, 222, 0.5)', transition: 'color 0.2s ease', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              aria-label="Shuffle"
            >
              <Shuffle size={14} />
            </button>

            <button
              style={{ color: 'var(--color-ivory)', transition: 'transform 0.2s ease', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              aria-label="Previous track"
            >
              <SkipBack size={16} />
            </button>

            {/* Large Center Play/Pause button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'var(--color-ivory)',
                color: 'var(--bg-deep)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(244, 241, 222, 0.28)',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                border: 'none',
                cursor: 'pointer'
              }}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause size={16} fill="var(--bg-deep)" />
              ) : (
                <Play size={16} fill="var(--bg-deep)" style={{ marginLeft: '2px' }} />
              )}
            </button>

            <button
              style={{ color: 'var(--color-ivory)', transition: 'transform 0.2s ease', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              aria-label="Next track"
            >
              <SkipForward size={16} />
            </button>

            <button
              style={{ color: 'rgba(244, 241, 222, 0.5)', transition: 'color 0.2s ease', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              aria-label="Repeat"
            >
              <Repeat size={14} />
            </button>
          </div>
        </div>
  );

  if (isHeroMobile) {
    return playerCard;
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: isMobile ? '54%' : '52%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pointerEvents: 'none',
        zIndex: 30
      }}
    >
      <motion.div
        style={{
          width: 'max-content',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          x: mouseX,
          y: playerY,
          scale: playerScale,
          opacity: playerOpacity,
          pointerEvents: 'auto'
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 120 }}
      >
        {playerCard}

        {/* Download Sielo APK Button directly below the player */}
        <div
          id="hero-download-btn-container"
          style={{
            marginTop: isMobile ? '14px' : '18px',
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            transform: 'translateZ(0)',
            WebkitFontSmoothing: 'antialiased'
          }}
        >
          <DownloadButton
            variant="hero"
            href="/Sielo-11.3.2.apk"
            download="Sielo-11.3.2.apk"
            label="Download Sielo"
            subtitle="APK FOR ANDROID • V11.3.2"
          />
        </div>
      </motion.div>
    </div>
  );
}

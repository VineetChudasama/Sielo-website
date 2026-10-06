import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import FloatingMusicField from './FloatingMusicField';
import FloatingMusicCard from './FloatingMusicCard';
import SieloPlayerMockup from './SieloPlayerMockup';
import DownloadButton from './DownloadButton';
import { HERO_CARDS } from '../data/musicData';

export default function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  // Responsive mobile breakpoint detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Desktop mouse parallax tracking
  const handleMouseMove = (e) => {
    if (isMobile) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 2;
    const y = (clientY / innerHeight - 0.5) * 2;
    setMousePos({ x, y });
  };

  // Window scroll tracking (in pixels)
  const { scrollY } = useScroll();

  // Concentric radial rings scale slightly with scroll
  const ringScale = useTransform(scrollY, [0, 900], [1, 1.25]);
  const ringOpacity = useTransform(scrollY, [0, 700, 900], [0.85, 0.4, 0]);

  if (isMobile) {
    return (
      <section
        id="hero-wrapper"
        className="hero hero-mobile"
        style={{
          position: 'relative',
          minHeight: '100svh',
          backgroundColor: 'transparent',
          overflowX: 'clip',
          overflowY: 'visible',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Radial sound-wave background rings */}
        <div
          className="radial-rings-container"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            zIndex: 0
          }}
        >
          <div className="concentric-ring" />
          <div className="concentric-ring" />
          <div className="concentric-ring" />
          <div className="concentric-ring" />
          <div className="concentric-ring" />
          <div className="concentric-ring" />
        </div>

        {/* Ambient atmospheric glow */}
        <div
          className="ambient-hero-glow"
          style={{
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none'
          }}
        />

        {/* Focused Single Music-Player Composition */}
        <div className="hero-content">
          {/* Stage containing Central Player and Left/Right Partial Album Cards */}
          <div className="hero-player-stage">
            {/* Upper Partial Left Album Card */}
            <div className="hero-album-card mobile-card-left mobile-card-top-left">
              <FloatingMusicCard card={HERO_CARDS[0]} isHeroMobileCard={true} />
            </div>

            {/* Upper Partial Right Album Card */}
            <div className="hero-album-card mobile-card-right mobile-card-top-right">
              <FloatingMusicCard card={HERO_CARDS[1]} isHeroMobileCard={true} />
            </div>

            {/* Lower Partial Left Album Card */}
            <div className="hero-album-card mobile-card-bottom-left">
              <FloatingMusicCard card={HERO_CARDS[2]} isHeroMobileCard={true} />
            </div>

            {/* Lower Partial Right Album Card */}
            <div className="hero-album-card mobile-card-bottom-right">
              <FloatingMusicCard card={HERO_CARDS[3]} isHeroMobileCard={true} />
            </div>

            {/* Central Focused Player */}
            <div className="hero-player">
              <SieloPlayerMockup isMobile={true} isHeroMobile={true} />
            </div>
          </div>

          {/* Mobile Download Sielo CTA */}
          <div className="hero-download" id="hero-download-btn-container">
            <DownloadButton
              variant="hero"
              href="/Sielo_10.2.0.apk"
              download="Sielo_10.2.0.apk"
              label="Download Sielo"
              subtitle="APK FOR ANDROID • V10.2.0"
            />
          </div>
        </div>

        {/* Soft bottom feathering blend into subsequent sections */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '80px',
            background: 'linear-gradient(to bottom, transparent 0%, #070B12 100%)',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />
      </section>
    );
  }

  return (
    <section
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative',
        height: '200vh',
        backgroundColor: 'transparent'
      }}
      id="hero-wrapper"
      className="hero hero-desktop"
    >
      {/* Sticky full-screen viewport */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          maskImage: 'linear-gradient(to bottom, black 92%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 92%, transparent 100%)'
        }}
      >
        {/* Radial sound-wave background rings */}
        <motion.div
          className="radial-rings-container"
          style={{
            scale: ringScale,
            opacity: ringOpacity,
            x: isMobile ? 0 : mousePos.x * 12,
            y: isMobile ? 0 : mousePos.y * 12
          }}
        >
          <div className="concentric-ring" />
          <div className="concentric-ring" />
          <div className="concentric-ring" />
          <div className="concentric-ring" />
          <div className="concentric-ring" />
          <div className="concentric-ring" />
        </motion.div>

        {/* Ambient atmospheric glow */}
        <div
          className="ambient-hero-glow"
          style={{
            transform: `translate(calc(-50% + ${mousePos.x * 20}px), calc(-50% + ${mousePos.y * 20}px))`
          }}
        />

        {/* 3D Music Cards & Central Sielo Player Floating Field */}
        <FloatingMusicField
          scrollY={scrollY}
          mousePos={mousePos}
          isMobile={isMobile}
        />

        {/* Soft bottom feathering inside sticky container - sits behind FloatingMusicField */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 'clamp(80px, 10vh, 110px)',
            background: 'linear-gradient(to bottom, transparent 0%, #070B12 100%)',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />
      </div>

      {/* Atmospheric Bottom Blend into Subsequent Sections */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '320px',
          background: 'linear-gradient(to bottom, transparent 0%, #070B12 100%)',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />
    </section>
  );
}

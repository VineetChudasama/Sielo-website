import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

/**
 * Navigation and Link Data
 * Preserves all original functional links and destinations
 */
const NAV_SECTIONS = [
  {
    title: 'PRODUCT',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Tactile Vinyl', href: '#experience' },
      { label: 'Smart Discography', href: '#albums' },
      { label: 'Vibe Radar', href: '#stats' },
      { label: 'Download APK', href: '/Sielo-11.3.1.apk', download: 'Sielo-11.3.1.apk' },
    ]
  },
  {
    title: 'COMMUNITY',
    links: [
      { label: 'GitHub Repository', href: 'https://github.com/VineetChudasama/Sielo', external: true },
      { label: 'Release Changelog', href: 'https://github.com/VineetChudasama/Sielo/releases', external: true },
      { label: 'Report an Issue', href: 'https://github.com/VineetChudasama/Sielo/issues', external: true },
    ]
  },
  {
    title: 'ARCHITECTURE',
    links: [
      { label: 'Jetpack Compose UI', href: '#architecture' },
      { label: 'AndroidX Media3 ExoPlayer', href: '#architecture' },
      { label: 'Dual Stream 320k AAC', href: '#architecture' },
      { label: 'LRCLIB Synced Lyrics', href: 'https://lrclib.net', external: true },
      { label: 'AES-256-GCM Peer Mesh', href: '#architecture' },
    ]
  }
];

const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/VineetChudasama/Sielo', external: true },
];


/**
 * Editorial Back to Top Pill Button
 */
function BackToTopButton() {
  const [isHovered, setIsHovered] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="sielo-back-to-top-wrapper">
      <button
        onClick={scrollToTop}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Back to top of page"
        className="sielo-back-to-top-pill"
      >
        <motion.div
          animate={{ y: isHovered ? -3 : 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ArrowUp size={18} strokeWidth={2.4} />
        </motion.div>
      </button>

      <span className="sielo-back-to-top-label">
        Back<br />to top
      </span>
    </div>
  );
}

/**
 * Individual Navigation Link Item with hover indicator
 */
function FooterNavLink({ link }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <li>
      <a
        href={link.href}
        download={link.download}
        target={link.external ? '_blank' : undefined}
        rel={link.external ? 'noreferrer' : undefined}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="sielo-nav-link"
      >
        <span className="sielo-nav-link-text">{link.label}</span>
        <motion.span
          animate={{
            x: isHovered ? 3 : 0,
            opacity: isHovered ? 1 : 0.55
          }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="sielo-nav-link-arrow"
          aria-hidden="true"
        >
          →
        </motion.span>
      </a>
    </li>
  );
}

/**
 * Cinematic Editorial Footer Component
 * Matches visual authority and spatial architecture of the design reference
 */
export default function Footer() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <footer
      id="site-footer"
      className="sielo-editorial-footer"
      role="contentinfo"
      style={{
        minHeight: 'calc(100vh - 55px)',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        paddingTop: '50px',
        paddingBottom: 0
      }}
    >
      {/* Subtle Grain / Noise Texture Overlay */}
      <div className="sielo-footer-grain" aria-hidden="true" />

      {/* Atmospheric Horizon Light & Ambient Center Vignette */}
      <div className="sielo-footer-ambient-glow" aria-hidden="true" />

      {/* Subtle Celestial & Orbital Sound Waves SVG */}
      <svg
        className="sielo-orbital-canvas"
        viewBox="0 0 1440 800"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* Sweeping left-to-center acoustic orbit */}
        <path
          d="M -120 480 C 180 140, 580 170, 920 370"
          stroke="rgba(244, 241, 222, 0.08)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        {/* Right descending orbital curve */}
        <path
          d="M 1060 210 C 1220 280, 1370 410, 1520 540"
          stroke="rgba(244, 241, 222, 0.07)"
          strokeWidth="1"
        />
        {/* Planetary beacon node above copyright */}
        <circle cx="1260" cy="380" r="14" stroke="rgba(212, 196, 168, 0.14)" strokeWidth="1" />
        <circle cx="1260" cy="380" r="3.5" fill="#D4C4A8" opacity="0.65" />
        {/* Secondary lower right accent harmonic */}
        <path
          d="M 1190 490 C 1290 440, 1390 470, 1490 540"
          stroke="rgba(244, 241, 222, 0.06)"
          strokeWidth="0.9"
        />
      </svg>

      {/* Main Footer Container */}
      <div
        className="sielo-footer-inner"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          flexGrow: 1,
          width: '100%'
        }}
      >
        {/* Top Information Area */}
        <div className="sielo-info-row">
          {/* Back to Top Pill & Brand Information grouped in the same row */}
          <div className="sielo-brand-group">
            {/* Column 1: Back to Top Pill */}
            <div className="sielo-pill-column">
              <BackToTopButton />
            </div>

            {/* Column 2: Brand Tile & Philosophy */}
            <div className="sielo-brand-column">
              {/* Glowing Brand Icon Tile */}
              <div className="sielo-brand-icon-tile">
                <img
                  src="/logo.png"
                  alt="Sielo"
                  className="sielo-brand-icon-img"
                />
              </div>

              <p className="sielo-brand-tagline">
                Built for people who listen.
              </p>

              {/* Social Links List */}
              <div className="sielo-social-list">
                {SOCIAL_LINKS.map((item, idx) => (
                  <React.Fragment key={item.label}>
                    <a
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noreferrer' : undefined}
                      className="sielo-social-link"
                    >
                      {item.label}
                    </a>
                    {idx < SOCIAL_LINKS.length - 1 && (
                      <span className="sielo-social-separator" aria-hidden="true">|</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Columns (Product, Community, Architecture) */}
          <div className="sielo-nav-columns-group">
            {NAV_SECTIONS.map((section) => (
              <div key={section.title} className="sielo-nav-column">
                <h3 className="sielo-nav-heading">
                  {section.title}
                </h3>
                <ul className="sielo-nav-list">
                  {section.links.map((link) => (
                    <FooterNavLink key={link.label} link={link} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Cinematic Monolithic Wordmark Stage */}
        <div
          className="sielo-stage-wrapper"
          style={{ marginTop: 'auto', marginBottom: 0, paddingBottom: 0 }}
        >
          {/* Massive SIELO Architectural Wordmark with Full Headroom */}
          <motion.div
            id="sielo-monolith-wordmark"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="sielo-monolith-text"
          >
            SIELO
          </motion.div>

          {/* Right-Side Brand Statement & Copyright */}
          <div className="sielo-bottom-meta-block">
            <div className="sielo-copyright-text">
              <div>© 2026 Sielo.</div>
              <div>All rights reserved.</div>
            </div>

            <div className="sielo-statement-wrapper">
              <div className="sielo-statement-text">
                MUSIC,<br />
                MADE PERSONAL.
              </div>
              <div className="sielo-statement-line" aria-hidden="true" />
            </div>
          </div>

          {/* Warm Bottom Ambient Bloom */}
          <div className="sielo-ground-bloom" aria-hidden="true" />
        </div>
      </div>

      {/* Scoped CSS Styles adhering strictly to editorial design guidelines */}
      <style>{`
        .sielo-editorial-footer {
          position: relative;
          background: #04070B;
          color: #F4F1DE;
          overflow: clip;
          width: 100%;
          min-height: calc(100vh - 25px);
          box-sizing: border-box;
          padding: 64px 48px 0 48px;
          margin-bottom: 0;
          display: flex;
          flex-direction: column;
          justifyContent: flex-end;
          border-top: 1px solid rgba(212, 196, 168, 0.08);
          z-index: 5;
        }

        /* Subtle Grain texture */
        .sielo-footer-grain {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(244, 241, 222, 0.025) 1px, transparent 0);
          background-size: 24px 24px;
          pointer-events: none;
          z-index: 0;
        }

        /* Ambient subtle atmospheric glow */
        .sielo-footer-ambient-glow {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse 75% 55% at 50% 35%, rgba(27, 38, 59, 0.40) 0%, rgba(13, 27, 42, 0.18) 50%, transparent 75%),
            radial-gradient(ellipse 90% 60% at 50% 95%, rgba(212, 196, 168, 0.08) 0%, transparent 65%),
            radial-gradient(circle at 82% 55%, rgba(212, 196, 168, 0.035) 0%, transparent 50%);
          pointer-events: none;
          z-index: 0;
        }

        /* Orbital sound curves */
        .sielo-orbital-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        /* Inner container */
        .sielo-footer-inner {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 1480px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          justifyContent: flex-end;
          flex-grow: 1;
        }

        /* Top Information Row with Generous Spacing */
        .sielo-info-row {
          display: flex;
          align-items: flex-start;
          justifyContent: space-between;
          gap: clamp(36px, 3.8vw, 68px);
          margin-bottom: clamp(24px, 3.8vh, 48px);
          width: 100%;
        }

        /* Brand & Back to Top Group in the same row */
        .sielo-brand-group {
          display: flex;
          align-items: flex-start;
          gap: clamp(20px, 2.5vw, 40px);
        }

        /* Column 1: Back to top */
        .sielo-pill-column {
          flex-shrink: 0;
        }

        .sielo-back-to-top-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .sielo-back-to-top-pill {
          width: 44px;
          height: 82px;
          border-radius: 999px;
          border: 1px solid rgba(212, 196, 168, 0.25);
          background: transparent;
          color: #D4C4A8;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          outline: none;
          padding: 0;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
        }

        .sielo-back-to-top-pill:hover {
          border-color: rgba(244, 241, 222, 0.6);
          color: #F4F1DE;
          background: rgba(212, 196, 168, 0.05);
          box-shadow: 0 0 22px rgba(212, 196, 168, 0.18);
        }

        .sielo-back-to-top-label {
          margin-top: 10px;
          font-size: 0.72rem;
          color: #8F939B;
          line-height: 1.3;
          text-align: center;
          font-family: var(--font-body);
          letter-spacing: 0.03em;
          user-select: none;
        }

        /* Column 2: Brand Information */
        .sielo-brand-column {
          display: flex;
          flex-direction: column;
          max-width: 250px;
          flex-shrink: 0;
          margin-right: clamp(12px, 2vw, 36px);
        }

        .sielo-brand-icon-tile {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #070B12;
          border: 1px solid rgba(212, 196, 168, 0.22);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.5), 0 0 16px rgba(212, 196, 168, 0.1);
          margin-bottom: 16px;
          overflow: hidden;
        }

        .sielo-brand-icon-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 9px;
          display: block;
        }

        .sielo-brand-tagline {
          font-family: var(--font-heading);
          font-size: 0.95rem;
          color: #F4F1DE;
          font-weight: 500;
          line-height: 1.45;
          margin-bottom: 16px;
        }

        .sielo-social-list {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          font-size: 0.78rem;
          font-family: var(--font-body);
        }

        .sielo-social-link {
          color: #8F939B;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .sielo-social-link:hover {
          color: #F4F1DE;
        }

        .sielo-social-separator {
          color: rgba(244, 241, 222, 0.18);
          margin: 0 10px;
          user-select: none;
        }

        /* Navigation Columns Group with Generous Breathing Room */
        .sielo-nav-columns-group {
          display: flex;
          align-items: flex-start;
          gap: clamp(48px, 5.5vw, 92px);
          flex-wrap: nowrap;
        }

        .sielo-nav-column {
          display: flex;
          flex-direction: column;
          min-width: max-content;
        }

        .sielo-nav-utility-column {
          padding-top: 27px; /* Aligns with links below headers */
        }

        .sielo-nav-heading {
          font-family: var(--font-heading);
          font-size: 0.70rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          color: #D4C4A8;
          text-transform: uppercase;
          margin-bottom: 14px;
        }

        .sielo-nav-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 0;
          margin: 0;
        }

        .sielo-nav-link {
          display: flex;
          align-items: center;
          justifyContent: space-between;
          color: #8F939B;
          font-size: 0.84rem;
          font-family: var(--font-body);
          line-height: 1.95;
          transition: color 0.2s ease;
          text-decoration: none;
          gap: 22px;
        }

        .sielo-nav-link:hover {
          color: #F4F1DE;
        }

        .sielo-nav-link-arrow {
          display: inline-flex;
          align-items: center;
          color: #D4C4A8;
          font-size: 0.85rem;
        }

        /* Thin vertical separator */
        .sielo-nav-divider {
          width: 1px;
          align-self: stretch;
          background: rgba(244, 241, 222, 0.10);
          margin: 0 10px;
          min-height: 120px;
        }

        /* Monolithic SIELO Stage Wrapper with Zero Bottom Padding */
        .sielo-stage-wrapper {
          position: relative;
          width: 100%;
          display: flex;
          align-items: flex-end;
          justifyContent: space-between;
          margin-top: auto;
          padding-bottom: 0px;
          margin-bottom: 0px;
          overflow: visible;
        }

        /* Massive SIELO Monolithic Typography Resting on Floor with Full Headroom */
        .sielo-monolith-text {
          font-family: var(--font-heading);
          font-size: clamp(160px, 26.5vw, 440px);
          font-weight: 800;
          letter-spacing: -0.015em;
          line-height: 0.80;
          padding-top: 10px;
          margin-top: -10px;
          background: linear-gradient(
            180deg,
            #FAF8F0 0%,
            #F4F1DE 24%,
            #D4C4A8 56%,
            #8E897D 82%,
            #524E46 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          user-select: none;
          pointer-events: none;
          position: relative;
          z-index: 2;
          margin-bottom: 0;
          display: block;
        }

        /* Meta block at bottom right */
        .sielo-bottom-meta-block {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          text-align: right;
          z-index: 3;
          margin-bottom: 6px;
          flex-shrink: 0;
          padding-left: 28px;
        }

        .sielo-copyright-text {
          font-size: 0.84rem;
          color: #8F939B;
          font-family: var(--font-body);
          line-height: 1.55;
          margin-bottom: 24px;
        }

        .sielo-statement-wrapper {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .sielo-statement-text {
          font-family: var(--font-heading);
          font-size: 0.84rem;
          font-weight: 600;
          letter-spacing: 0.22em;
          color: #D4C4A8;
          text-transform: uppercase;
          line-height: 1.5;
        }

        .sielo-statement-line {
          width: 44px;
          height: 1.5px;
          background: #D4C4A8;
          margin-top: 10px;
          opacity: 0.75;
        }

        /* Floor warm specular bloom */
        .sielo-ground-bloom {
          position: absolute;
          bottom: 0;
          left: 5%;
          right: 15%;
          height: 140px;
          background: radial-gradient(
            ellipse 65% 100% at 45% 100%,
            rgba(212, 196, 168, 0.24) 0%,
            rgba(195, 175, 140, 0.12) 35%,
            rgba(27, 38, 59, 0.04) 60%,
            transparent 80%
          );
          pointer-events: none;
          filter: blur(20px);
          z-index: 0;
        }

        /* ==========================================================================
           RESPONSIVE BREAKPOINTS
           ========================================================================== */
        @media (max-width: 1200px) {
          .sielo-editorial-footer {
            padding: 80px 32px 0 32px;
          }
          .sielo-info-row {
            flex-wrap: wrap;
            gap: 36px;
          }
          .sielo-nav-columns-group {
            flex-wrap: wrap;
            gap: 36px;
          }
          .sielo-nav-divider {
            display: none;
          }
          .sielo-nav-utility-column {
            padding-top: 0;
          }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .sielo-monolith-text {
            font-size: clamp(140px, 20vw, 240px) !important;
            line-height: 0.82 !important;
          }
        }

        @media (max-width: 768px) {
          .sielo-editorial-footer {
            padding: 48px 24px 24px 24px !important;
            min-height: auto !important;
            justify-content: flex-start !important;
          }
          .sielo-info-row {
            flex-direction: column !important;
            gap: 28px !important;
          }
          .sielo-brand-group {
            display: flex !important;
            flex-direction: row !important;
            align-items: flex-start !important;
            gap: 20px !important;
            width: 100% !important;
          }
          .sielo-brand-column {
            max-width: 100% !important;
            margin-right: 0 !important;
          }
          .sielo-nav-columns-group {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 28px 20px !important;
            width: 100% !important;
          }
          .sielo-nav-column {
            min-width: unset !important;
          }
          .sielo-stage-wrapper {
            display: flex !important;
            flex-direction: row !important;
            align-items: flex-end !important;
            justify-content: space-between !important;
            gap: clamp(10px, 3vw, 24px) !important;
            padding-bottom: 0px !important;
            margin-top: 24px !important;
            width: 100% !important;
          }
          .sielo-monolith-text {
            font-size: clamp(64px, 18.5vw, 160px) !important;
            line-height: 0.82 !important;
            padding-top: 4px !important;
            margin-top: 0 !important;
            flex-shrink: 0 !important;
          }
          .sielo-bottom-meta-block {
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-end !important;
            text-align: right !important;
            padding-left: 0 !important;
            margin-bottom: 4px !important;
            flex-shrink: 0 !important;
          }
          .sielo-copyright-text {
            font-size: clamp(0.50rem, 1.7vw, 0.76rem) !important;
            line-height: 1.35 !important;
            margin-bottom: 8px !important;
          }
          .sielo-statement-wrapper {
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-end !important;
          }
          .sielo-statement-text {
            font-size: clamp(0.50rem, 1.7vw, 0.76rem) !important;
            letter-spacing: 0.16em !important;
            line-height: 1.35 !important;
          }
          .sielo-statement-line {
            width: clamp(24px, 5vw, 38px) !important;
            height: 1.5px !important;
            margin-top: 6px !important;
          }
        }
      `}</style>
    </footer>
  );
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Menu, X, Disc3 } from 'lucide-react';
import GithubIcon from './GithubIcon';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          background: scrolled ? 'rgba(7, 11, 18, 0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(212, 196, 168, 0.12)' : '1px solid transparent',
          padding: scrolled ? '14px 24px' : '22px 32px'
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {/* Logo & Brand */}
          <a
            href="#"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none'
            }}
          >
            <img
              src="/logo.png"
              alt="Sielo"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '9px',
                objectFit: 'contain',
                display: 'block',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)'
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-brand)',
                fontSize: '1.85rem',
                fontWeight: 400,
                color: 'var(--color-ivory)',
                letterSpacing: '0.03em',
                lineHeight: 1
              }}
            >
              Sielo
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '32px'
            }}
            className="desktop-nav"
          >
            <a href="#features" className="nav-link">Features</a>
            <a href="#experience" className="nav-link">Experience</a>
            <a href="#albums" className="nav-link">Discography</a>
            <a href="#stats" className="nav-link">Vibe Radar</a>
            <a href="#listen-together" className="nav-link">Listen Together</a>
          </nav>

          {/* Desktop Right CTA */}
          <div
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '16px'
            }}
            className="desktop-actions"
          >
            <a
              href="https://github.com/VineetChudasama/Sielo"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: 'rgba(244, 241, 222, 0.75)',
                fontSize: '0.9rem',
                fontWeight: 500,
                padding: '8px 14px',
                borderRadius: '8px',
                transition: 'all 0.2s ease'
              }}
              className="ghost-action"
            >
              <GithubIcon size={17} />
              <span>GitHub</span>
            </a>

            <a
              href="/Sielo-11.2.0.apk"
              download="Sielo-11.2.0.apk"
              className="btn-primary"
              style={{
                padding: '9px 20px',
                fontSize: '0.86rem',
                gap: '7px'
              }}
            >
              <Download size={15} />
              <span>Get Sielo</span>
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              border: '1px solid rgba(212, 196, 168, 0.2)',
              color: 'var(--color-ivory)',
              background: 'rgba(27, 38, 59, 0.5)'
            }}
            className="mobile-toggle"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed',
              top: '70px',
              left: '16px',
              right: '16px',
              zIndex: 99,
              background: 'rgba(13, 27, 42, 0.95)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(212, 196, 168, 0.15)',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              boxShadow: '0 25px 50px rgba(0,0,0,0.8)'
            }}
          >
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontSize: '1.05rem', color: 'var(--color-ivory)', padding: '6px 0' }}
            >
              Features
            </a>
            <a
              href="#experience"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontSize: '1.05rem', color: 'var(--color-ivory)', padding: '6px 0' }}
            >
              Experience
            </a>
            <a
              href="#albums"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontSize: '1.05rem', color: 'var(--color-ivory)', padding: '6px 0' }}
            >
              Discography
            </a>
            <a
              href="#stats"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontSize: '1.05rem', color: 'var(--color-ivory)', padding: '6px 0' }}
            >
              Vibe Radar
            </a>
            <a
              href="#listen-together"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontSize: '1.05rem', color: 'var(--color-ivory)', padding: '6px 0' }}
            >
              Listen Together
            </a>

            <div style={{ height: '1px', background: 'rgba(212, 196, 168, 0.12)', margin: '4px 0' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a
                href="/Sielo-11.2.0.apk"
                download="Sielo-11.2.0.apk"
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <Download size={16} />
                <span>Download Sielo APK (v11.2.0)</span>
              </a>
              <a
                href="https://github.com/VineetChudasama/Sielo"
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <GithubIcon size={16} />
                <span>GitHub Repository</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width: 860px) {
          .desktop-nav {
            display: flex !important;
          }
          .desktop-actions {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
        .nav-link {
          font-family: var(--font-body);
          font-size: 0.92rem;
          font-weight: 500;
          color: rgba(244, 241, 222, 0.72);
          transition: color 0.2s ease;
        }
        .nav-link:hover {
          color: var(--color-ivory);
        }
        .ghost-action:hover {
          color: var(--color-ivory) !important;
          background: rgba(244, 241, 222, 0.06);
        }
      `}</style>
    </>
  );
}

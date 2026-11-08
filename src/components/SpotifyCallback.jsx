import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, ExternalLink, Music2, ArrowRight } from 'lucide-react';

export default function SpotifyCallback({ code, error, onBack }) {
  const [forwarded, setForwarded] = useState(false);
  const [forwardError, setForwardError] = useState(null);

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!code) return;

    const desktopLoopbackUrl = `http://127.0.0.1:8888/callback${window.location.search}`;

    // Silent fetch to local desktop loopback server
    try {
      fetch(desktopLoopbackUrl, { mode: 'no-cors' })
        .then(() => setForwarded(true))
        .catch(() => setForwarded(true));
    } catch {
      setForwarded(true);
    }
  }, [code]);

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (_) {}
  };

  const handleManualDesktopReturn = () => {
    window.location.href = `http://127.0.0.1:8888/callback${window.location.search}`;
  };

  const handleMobileAppReturn = () => {
    window.location.href = `sielo://spotify-callback${window.location.search}`;
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at 50% 20%, #1a0a14 0%, #0d060a 60%, #050204 100%)',
      padding: '24px',
      color: '#F4F1DE',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{
          maxWidth: '460px',
          width: '100%',
          background: 'rgba(24, 13, 20, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(30, 215, 96, 0.35)',
          borderRadius: '24px',
          padding: '40px 32px',
          textAlign: 'center',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 40px -10px rgba(30, 215, 96, 0.2)'
        }}
      >
        {/* Brand Icon */}
        <div style={{
          width: '72px',
          height: '72px',
          margin: '0 auto 20px',
          borderRadius: '50%',
          background: error ? 'rgba(229, 43, 74, 0.15)' : 'rgba(30, 215, 96, 0.15)',
          border: error ? '1px solid #E52B4A' : '1px solid #1ED760',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {error ? (
            <AlertTriangle size={36} color="#E52B4A" />
          ) : (
            <CheckCircle2 size={36} color="#1ED760" />
          )}
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: '24px',
          fontWeight: 700,
          color: error ? '#E52B4A' : '#1ED760',
          marginBottom: '10px',
          letterSpacing: '-0.02em'
        }}>
          {error ? 'Spotify Authorization Failed' : 'Spotify Connected!'}
        </h1>

        {/* Description */}
        <p style={{
          fontSize: '15px',
          lineHeight: '1.5',
          color: '#D4C4A8',
          marginBottom: '28px'
        }}>
          {error
            ? `Spotify reported an issue: ${error}. Please try again from the Sielo app.`
            : 'Your Spotify account has been authorized. Returning to Sielo to synchronize your playlists and calibrate your recommendation profile...'}
        </p>

        {!error && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={handleManualDesktopReturn}
              style={{
                width: '100%',
                padding: '13px 20px',
                borderRadius: '12px',
                background: '#1ED760',
                color: '#0A0508',
                border: 'none',
                fontWeight: 600,
                fontSize: '14.5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              <span>Return to Sielo Desktop</span>
              <ArrowRight size={17} />
            </button>

            <button
              onClick={handleCopyLink}
              style={{
                width: '100%',
                padding: '12px 20px',
                borderRadius: '12px',
                background: copied ? 'rgba(30, 215, 96, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                color: copied ? '#1ED760' : '#F4F1DE',
                border: copied ? '1px solid #1ED760' : '1px solid rgba(255, 255, 255, 0.15)',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Authorization Link'}</span>
            </button>
          </div>
        )}

        <div style={{ marginTop: '24px', fontSize: '12px', color: '#888' }}>
          <span>Powered by Sielo Music Engine</span>
        </div>
      </motion.div>
    </div>
  );
}

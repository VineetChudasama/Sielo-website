import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Lock, User, Eye, EyeOff, AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';
import { loginAdmin, checkLockout, clearLockout, resetVaultToDefault } from '../../utils/adminAuth';

export default function AdminLogin({ onLoginSuccess, onBackToSite }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [shakeKey, setShakeKey] = useState(0);
  const [lockoutState, setLockoutState] = useState(() => checkLockout());

  const handleResetLockout = () => {
    resetVaultToDefault();
    clearLockout();
    setLockoutState({ isLocked: false, remainingMinutes: 0 });
    setErrorMessage('');
    setUsername('admin');
    setPassword('SieloAdmin@2026');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (!username.trim() || !password) {
      setErrorMessage('Please enter both your admin username and password.');
      setShakeKey(prev => prev + 1);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      await loginAdmin(username, password);
      onLoginSuccess();
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
      setShakeKey(prev => prev + 1);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#070B12',
        backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(212, 175, 55, 0.08) 0%, transparent 60%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        boxSizing: 'border-box',
        position: 'relative'
      }}
    >
      {/* Back to site button */}
      <button
        onClick={onBackToSite}
        style={{
          position: 'absolute',
          top: '28px',
          left: '28px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(212, 196, 168, 0.15)',
          borderRadius: '12px',
          padding: '10px 18px',
          color: 'rgba(244, 241, 222, 0.8)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.86rem',
          fontFamily: 'var(--font-body)',
          transition: 'all 0.2s ease',
          zIndex: 10
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#F4F1DE';
          e.currentTarget.style.borderColor = 'rgba(212, 196, 168, 0.35)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'rgba(244, 241, 222, 0.8)';
          e.currentTarget.style.borderColor = 'rgba(212, 196, 168, 0.15)';
        }}
      >
        <ArrowLeft size={16} />
        <span>Return to Sielo</span>
      </button>

      {/* Main Login Card */}
      <motion.div
        key={shakeKey}
        initial={{ opacity: 0, y: 16 }}
        animate={{
          opacity: 1,
          y: 0,
          x: shakeKey ? [-6, 6, -4, 4, -2, 2, 0] : 0
        }}
        transition={{ duration: 0.4 }}
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'linear-gradient(165deg, rgba(27, 38, 59, 0.8) 0%, rgba(13, 27, 42, 0.95) 100%)',
          border: '1px solid rgba(212, 196, 168, 0.22)',
          borderRadius: '24px',
          padding: 'clamp(28px, 5vw, 44px) clamp(20px, 4vw, 36px)',
          boxShadow: '0 24px 70px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Top Glow Orb */}
        <div
          style={{
            position: 'absolute',
            top: '-70px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '200px',
            height: '140px',
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        {/* Shield Icon */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.05) 100%)',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(212, 175, 55, 0.15)',
              marginBottom: '16px'
            }}
          >
            <ShieldCheck size={32} color="#D4AF37" />
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.65rem',
              fontWeight: 700,
              color: '#F4F1DE',
              letterSpacing: '0.04em',
              marginBottom: '6px'
            }}
          >
            Sielo Command Center
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.86rem',
              color: 'rgba(212, 196, 168, 0.7)',
              letterSpacing: '0.02em'
            }}
          >
            Restricted Admin Portal • Salted SHA-256 Vault
          </p>
        </div>

        {/* Error Alert */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                background: 'rgba(230, 57, 70, 0.14)',
                border: '1px solid rgba(230, 57, 70, 0.4)',
                borderRadius: '12px',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '20px',
                fontSize: '0.82rem',
                color: '#FFB4B4',
                lineHeight: 1.4
              }}
            >
              <AlertTriangle size={18} color="#E63946" style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {lockoutState.isLocked ? (
          <div
            style={{
              padding: '24px 16px',
              textAlign: 'center',
              background: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '16px',
              border: '1px solid rgba(230, 57, 70, 0.3)'
            }}
          >
            <Lock size={36} color="#E63946" style={{ margin: '0 auto 12px' }} />
            <div style={{ color: '#F4F1DE', fontWeight: 600, marginBottom: '6px' }}>
              Portal Temporarily Locked
            </div>
            <div style={{ fontSize: '0.84rem', color: 'rgba(244, 241, 222, 0.65)', marginBottom: '16px' }}>
              Too many failed login attempts. Please retry in {lockoutState.remainingMinutes} minutes or reset the security cache.
            </div>
            <button
              type="button"
              onClick={handleResetLockout}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                background: 'rgba(212, 175, 55, 0.2)',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                borderRadius: '10px',
                color: '#F4F1DE',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={14} />
              Reset Security Lockout & Master Hash
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Username Input */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'rgba(212, 196, 168, 0.85)',
                  marginBottom: '8px'
                }}
              >
                Admin Username
              </label>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <div style={{ position: 'absolute', left: '16px', color: 'rgba(212, 196, 168, 0.5)' }}>
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin ID"
                  autoComplete="username"
                  required
                  style={{
                    width: '100%',
                    background: 'rgba(7, 11, 18, 0.65)',
                    border: '1px solid rgba(212, 196, 168, 0.2)',
                    borderRadius: '14px',
                    padding: '13px 16px 13px 44px',
                    color: '#F4F1DE',
                    fontSize: '0.92rem',
                    fontFamily: 'var(--font-body)',
                    outline: 'none',
                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#D4AF37';
                    e.target.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(212, 196, 168, 0.2)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'rgba(212, 196, 168, 0.85)',
                  marginBottom: '8px'
                }}
              >
                Admin Master Password
              </label>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <div style={{ position: 'absolute', left: '16px', color: 'rgba(212, 196, 168, 0.5)' }}>
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter master password"
                  autoComplete="current-password"
                  required
                  style={{
                    width: '100%',
                    background: 'rgba(7, 11, 18, 0.65)',
                    border: '1px solid rgba(212, 196, 168, 0.2)',
                    borderRadius: '14px',
                    padding: '13px 44px 13px 44px',
                    color: '#F4F1DE',
                    fontSize: '0.92rem',
                    fontFamily: 'var(--font-body)',
                    outline: 'none',
                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#D4AF37';
                    e.target.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(212, 196, 168, 0.2)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(212, 196, 168, 0.5)',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileTap={{ scale: 0.98 }}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '14px',
                border: 'none',
                background: 'linear-gradient(135deg, #E5C365 0%, #D4AF37 50%, #B89628 100%)',
                color: '#070B12',
                fontFamily: 'var(--font-heading)',
                fontSize: '0.96rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                cursor: isLoading ? 'wait' : 'pointer',
                boxShadow: '0 8px 24px rgba(212, 175, 55, 0.3)',
                marginTop: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'filter 0.2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(1.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.filter = 'brightness(1)')}
            >
              {isLoading ? (
                <span>Computing Hash & Verifying...</span>
              ) : (
                <>
                  <Lock size={18} />
                  <span>Authenticate & Enter</span>
                </>
              )}
            </motion.button>

            <div style={{ textAlign: 'center', marginTop: '6px' }}>
              <button
                type="button"
                onClick={handleResetLockout}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(212, 196, 168, 0.45)',
                  fontSize: '0.76rem',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <RefreshCw size={12} />
                <span>Reset Local Security Cache / Unblock</span>
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}

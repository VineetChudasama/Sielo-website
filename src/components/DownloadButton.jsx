import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';

/**
 * Official Android Robot vector icon
 */
function AndroidIcon({ size = 28, color = '#0D1B2A' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', shapeRendering: 'geometricPrecision' }}
      aria-hidden="true"
    >
      <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997 0-.5511.4482-.9997.9993-.9997.5511 0 .9997.4486.9997.9997 0 .5511-.4486.9997-.9997.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997 0-.5511.4482-.9997.9993-.9997.5511 0 .9997.4486.9997.9997 0 .5511-.4486.9997-.9997.9997m11.4045-6.02l1.996-3.4566c.1146-.1986.0466-.4536-.152-.5682-.1986-.1146-.4536-.0466-.5682.152l-2.0227 3.5034C15.5202 8.3582 13.8277 8 12 8s-3.5202.3582-5.1346.952L4.8427 5.4486c-.1146-.1986-.3696-.2666-.5682-.152-.1986.1146-.2666.3696-.152.5682l1.996 3.4566C2.688 11.0386 0 14.7386 0 19h24c0-4.2614-2.688-7.9614-6.1185-9.6786" />
    </svg>
  );
}

/**
 * Premium Sielo APK Download Button
 * 
 * Features:
 * - Wide tactile pill with authentic Sielo warm gold palette
 * - Physical 3D micro-tilt & cursor parallax (desktop only)
 * - Single-pass specular light sweep on cursor entry
 * - Interactive Glide Animation on tap:
 *     1. Arrow circle smoothly glides across the button track to the right
 *     2. Morphs into a tick (Check) icon & displays "Done"
 *     3. Holds state so user sees confirmation
 *     4. Smoothly glides back to original position and resets
 * - Perfectly balanced padding with tailored sizing for both 'hero' and 'download-section' variants
 * - Ambient breathing glow in resting state (4.5s cycle)
 * - Full reduced-motion support
 */
export default function DownloadButton({
  href = '/Sielo-11.3.2.apk',
  download = 'Sielo-11.3.2.apk',
  variant = 'download-section',
  label = 'Download Sielo',
  subtitle = 'APK for Android',
  className = '',
  style = {}
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [sweepTrigger, setSweepTrigger] = useState(0);

  // Animation Phase: 'idle' | 'gliding' | 'success' | 'returning'
  const [animationPhase, setAnimationPhase] = useState('idle');
  const isHero = variant === 'hero';
  const [glideDistance, setGlideDistance] = useState(isHero ? 238 : 316);

  const buttonRef = useRef(null);
  const surfaceRef = useRef(null);
  const circleRef = useRef(null);
  const timersRef = useRef([]);

  const prefersReducedMotion = useReducedMotion();

  // Detect touch device
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Calculate dynamic glide distance based on actual rendered width
  useEffect(() => {
    const calculateGlide = () => {
      if (surfaceRef.current && circleRef.current) {
        const surfaceWidth = surfaceRef.current.offsetWidth;
        const circleWidth = circleRef.current.offsetWidth;
        // Surface padding: hero (14px + 14px = 28px); section (18px + 14px = 32px)
        const padTotal = isHero ? 28 : 32;
        const distance = surfaceWidth - padTotal - circleWidth;
        setGlideDistance(Math.max(distance, 100));
      }
    };

    calculateGlide();
    window.addEventListener('resize', calculateGlide);
    return () => window.removeEventListener('resize', calculateGlide);
  }, [isHero]);

  // Clean up all timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, []);

  // 3D Tilt motion values with smooth spring physics
  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rawParallaxX = useMotionValue(0);

  const rotateX = useSpring(rawRotateX, { stiffness: 320, damping: 25 });
  const rotateY = useSpring(rawRotateY, { stiffness: 320, damping: 25 });
  const parallaxX = useSpring(rawParallaxX, { stiffness: 300, damping: 22 });

  // Mouse move handler for 3D tilt and internal parallax
  const handleMouseMove = (e) => {
    if (isTouchDevice || prefersReducedMotion || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normX = (x / rect.width - 0.5) * 2; // -1 to +1
    const normY = (y / rect.height - 0.5) * 2; // -1 to +1

    rawRotateX.set(-normY * 2.2); // max 2.2 deg
    rawRotateY.set(normX * 2.2);
    rawParallaxX.set(normX * 2.5); // max 2.5px shift
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setSweepTrigger((prev) => prev + 1); // trigger single light sweep
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
    rawRotateX.set(0);
    rawRotateY.set(0);
    rawParallaxX.set(0);
  };

  const handleClick = (e) => {
    // If an animation cycle is already running, prevent overlapping clicks
    if (animationPhase !== 'idle') {
      return;
    }

    // Clear any previous active timers
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    setIsPressed(true);
    const t0 = setTimeout(() => {
      setIsPressed(false);
    }, 120);

    // Phase 1: Arrow glides smoothly across the button
    setAnimationPhase('gliding');

    // Phase 2: Arrives at the right end after 650ms -> morphs into tick icon & displays "Done"
    const t1 = setTimeout(() => {
      setAnimationPhase('success');
    }, 650);

    // Phase 3: Hold "tick arrow and done" for 1.8 seconds, then glide back
    const t2 = setTimeout(() => {
      setAnimationPhase('returning');
    }, 2450); // 650ms + 1800ms

    // Phase 4: Return glide completes after 650ms -> back to resting idle state
    const t3 = setTimeout(() => {
      setAnimationPhase('idle');
    }, 3100); // 2450ms + 650ms

    timersRef.current.push(t0, t1, t2, t3);
  };

  const isGlidingForward = animationPhase === 'gliding';
  const isSuccess = animationPhase === 'success';
  const isAtRight = isGlidingForward || isSuccess;

  return (
    <div
      style={{
        perspective: '900px',
        display: 'inline-block',
        ...style
      }}
      className={`sielo-download-button-wrapper ${className}`}
    >
      <motion.a
        ref={buttonRef}
        href={href}
        download={download}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        role="button"
        aria-label="Download Sielo APK for Android"
        style={{
          rotateX: prefersReducedMotion ? 0 : rotateX,
          rotateY: prefersReducedMotion ? 0 : rotateY,
          transformStyle: isHovered ? 'preserve-3d' : 'flat',
          willChange: isHovered ? 'transform' : 'auto'
        }}
        animate={{
          y: prefersReducedMotion ? 0 : isPressed ? 1 : isHovered ? -3 : 0,
          scale: isPressed ? 0.97 : 1
        }}
        transition={{
          type: 'spring',
          stiffness: 420,
          damping: 26,
          mass: 0.8
        }}
        className={`sielo-download-pill variant-${variant}`}
      >
        {/* Layer 1: Ambient Breathing Glow (4.5s soft cycle) */}
        {!prefersReducedMotion && (
          <motion.div
            style={{
              position: 'absolute',
              inset: isHero ? '-4px' : '-6px',
              borderRadius: '999px',
              background: 'radial-gradient(circle at 50% 50%, rgba(212, 196, 168, 0.42) 0%, rgba(212, 196, 168, 0.12) 60%, transparent 80%)',
              filter: isHero ? 'blur(12px)' : 'blur(16px)',
              pointerEvents: 'none',
              zIndex: 0,
              transform: 'translateZ(0)'
            }}
            animate={
              isHovered
                ? { opacity: 0.95, scale: 1.04 }
                : { opacity: [0.45, 0.72, 0.45], scale: [0.99, 1.02, 0.99] }
            }
            transition={
              isHovered
                ? { duration: 0.3 }
                : { duration: 4.5, repeat: Infinity, ease: 'easeInOut' }
            }
          />
        )}

        {/* Layer 2: Button Surface */}
        <div
          ref={surfaceRef}
          className="sielo-pill-surface"
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
            borderRadius: '999px',
            background: 'linear-gradient(135deg, #FDFCF7 0%, #D4C4A8 100%)',
            border: isHovered
              ? '1.5px solid rgba(255, 255, 255, 0.9)'
              : '1.5px solid rgba(255, 255, 255, 0.55)',
            boxShadow: isHovered
              ? '0 20px 42px -10px rgba(0, 0, 0, 0.55), 0 0 35px rgba(212, 196, 168, 0.42), inset 0 2px 4px rgba(255, 255, 255, 0.8)'
              : isPressed
              ? '0 6px 16px -4px rgba(0, 0, 0, 0.45), inset 0 2px 4px rgba(0, 0, 0, 0.15)'
              : '0 12px 30px -8px rgba(0, 0, 0, 0.45), 0 0 24px rgba(212, 196, 168, 0.22), inset 0 1px 2px rgba(255, 255, 255, 0.6)',
            overflow: 'hidden',
            padding: isHero ? '8px 14px 8px 14px' : '12px 16px 12px 18px',
            transition: 'border 0.25s ease, box-shadow 0.25s ease',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            textRendering: 'geometricPrecision',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden'
          }}
        >
          {/* Layer 3: Single-pass Specular Light Sweep */}
          {!prefersReducedMotion && (
            <motion.div
              key={sweepTrigger}
              initial={{ x: '-160%', opacity: 0 }}
              animate={sweepTrigger > 0 ? { x: '240%', opacity: 1 } : {}}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: '65%',
                background: 'linear-gradient(110deg, transparent 15%, rgba(255, 255, 255, 0.48) 50%, transparent 85%)',
                transform: 'skewX(-20deg)',
                pointerEvents: 'none',
                zIndex: 6
              }}
            />
          )}

          {/* Layer 4: Subtle Glide Accent Trail */}
          {!prefersReducedMotion && (
            <motion.div
              style={{
                position: 'absolute',
                left: isHero ? '36px' : '49px',
                top: '50%',
                height: isHero ? '2px' : '3px',
                borderRadius: '999px',
                background: 'linear-gradient(90deg, rgba(13, 27, 42, 0.08), rgba(27, 77, 43, 0.25))',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                zIndex: 2
              }}
              animate={{
                width: isAtRight ? `${glideDistance}px` : '0px',
                opacity: isAtRight ? 1 : 0
              }}
              transition={{
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1]
              }}
            />
          )}

          {/* Left Element: Action Circle with Arrow / Tick Glide */}
          <motion.div
            ref={circleRef}
            style={{
              width: isHero ? '44px' : '62px',
              height: isHero ? '44px' : '62px',
              borderRadius: '50%',
              background: isSuccess ? '#1B4D2B' : '#0D1B2A',
              color: '#F4F1DE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              zIndex: 5,
              boxShadow: isGlidingForward
                ? '0 12px 28px rgba(13, 27, 42, 0.55), 0 0 18px rgba(212, 196, 168, 0.45)'
                : isSuccess
                ? '0 8px 24px rgba(27, 77, 43, 0.55), 0 0 16px rgba(46, 111, 64, 0.4)'
                : isHovered
                ? '0 8px 22px rgba(13, 27, 42, 0.45)'
                : '0 4px 14px rgba(13, 27, 42, 0.28)',
              transition: 'background 0.35s ease, box-shadow 0.35s ease'
            }}
            animate={{
              x: !prefersReducedMotion && isAtRight ? glideDistance : 0,
              scale: isPressed ? 0.94 : (isHovered && animationPhase === 'idle') ? 1.05 : 1
            }}
            transition={{
              x: {
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1]
              },
              scale: { type: 'spring', stiffness: 400, damping: 24 }
            }}
          >
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="check-icon"
                  initial={{ scale: 0.3, rotate: -20, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  exit={{ scale: 0.3, rotate: 20, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Check size={isHero ? 20 : 26} strokeWidth={2.8} />
                </motion.div>
              ) : (
                <motion.div
                  key="arrow-icon"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <ArrowRight size={isHero ? 20 : 26} strokeWidth={2.4} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Subtle Vertical Divider */}
          <motion.div
            animate={{
              opacity: isAtRight ? 0 : 1
            }}
            transition={{ duration: 0.25 }}
            style={{
              width: '1px',
              height: isHero ? '26px' : '38px',
              background: 'linear-gradient(180deg, transparent, rgba(13, 27, 42, 0.12), transparent)',
              margin: isHero ? '0 10px' : '0 12px',
              flexShrink: 0
            }}
          />

          {/* Center Element: Typography */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              flex: 1,
              textAlign: 'left',
              minWidth: 0,
              userSelect: 'none',
              zIndex: 3
            }}
          >
            <div style={{ position: 'relative', overflow: 'hidden' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={isSuccess ? 'done' : 'label'}
                  initial={{ y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -8, opacity: 0 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: isHero ? '0.88rem' : '1.05rem',
                    fontWeight: 700,
                    color: '#0D1B2A',
                    letterSpacing: '-0.025em',
                    lineHeight: 1.15,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {isSuccess ? 'Done' : label}
                </motion.div>
              </AnimatePresence>
            </div>

            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: isHero ? '0.56rem' : '0.72rem',
                fontWeight: 600,
                letterSpacing: isHero ? '0.07em' : '0.08em',
                textTransform: 'uppercase',
                color: isSuccess ? '#2E6F40' : '#415A77',
                marginTop: isHero ? '2px' : '3px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                transition: 'color 0.25s ease'
              }}
            >
              {isSuccess ? '✓ APK SAVED TO DEVICE' : subtitle}
            </div>
          </div>

          {/* Right Element: Android Icon Capsule */}
          <motion.div
            style={{
              x: prefersReducedMotion ? 0 : parallaxX,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: isHero ? '44px' : '60px',
              height: isHero ? '44px' : '60px',
              borderRadius: '50%',
              background: 'rgba(13, 27, 42, 0.08)',
              border: '1px solid rgba(13, 27, 42, 0.12)',
              flexShrink: 0,
              marginLeft: isHero ? '10px' : '12px',
              boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.08)',
              zIndex: 2
            }}
            animate={{
              opacity: isAtRight ? 0 : 1,
              scale: isAtRight ? 0.72 : 1
            }}
            transition={{ duration: 0.32, ease: 'easeOut' }}
          >
            <AndroidIcon size={isHero ? 22 : 30} color="#0D1B2A" />
          </motion.div>
        </div>
      </motion.a>

      <style>{`
        .sielo-download-pill {
          position: relative;
          display: inline-flex;
          align-items: center;
          text-decoration: none;
          outline: none;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }

        .sielo-download-pill.variant-download-section {
          width: 410px;
          height: 96px;
        }

        .sielo-download-pill.variant-hero {
          width: 310px;
          height: 64px;
        }

        .sielo-download-pill:focus-visible {
          box-shadow: 0 0 0 3px #0D1B2A, 0 0 0 5px #D4C4A8;
          border-radius: 999px;
        }

        @media (max-width: 860px) and (min-width: 768px) {
          .sielo-download-pill.variant-download-section {
            width: 370px;
            height: 88px;
          }
          .sielo-download-pill.variant-hero {
            width: 286px;
            height: 62px;
          }
        }

        .sielo-pill-surface * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: geometricPrecision;
        }

        @media (max-width: 767px) {
          .sielo-download-pill.variant-hero {
            width: min(88vw, 340px) !important;
            max-width: 340px !important;
            height: 60px !important;
          }
        }

        @media (max-width: 480px) {
          .sielo-download-pill.variant-download-section {
            width: 100%;
            max-width: 360px;
            height: 84px;
          }
          .sielo-download-pill.variant-hero {
            width: min(88vw, 340px) !important;
            max-width: 340px !important;
            height: 60px !important;
          }
        }

        @media (max-width: 360px) {
          .sielo-download-pill.variant-hero .sielo-pill-surface {
            padding: 8px 10px !important;
          }
        }
      `}</style>
    </div>
  );
}

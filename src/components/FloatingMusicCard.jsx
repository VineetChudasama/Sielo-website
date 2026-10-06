import React from 'react';
import { motion, useTransform, useMotionValue } from 'framer-motion';

export default function FloatingMusicCard({
  card,
  scrollY,
  mousePos,
  isMobile,
  isHeroMobileCard = false
}) {
  if (isHeroMobileCard) {
    return (
      <div
        className="glass-card-interactive"
        style={{
          width: '135px',
          height: '185px',
          borderRadius: '16px',
          overflow: 'hidden',
          background: card.gradient,
          border: '1px solid rgba(244, 241, 222, 0.14)',
          boxShadow: '0 16px 36px -8px rgba(0, 0, 0, 0.75), 0 0 20px rgba(212, 196, 168, 0.05)',
          padding: '10px',
          position: 'relative',
          userSelect: 'none'
        }}
      >
        {/* Soft edge reflection light */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 45%)',
            pointerEvents: 'none',
            borderRadius: '16px'
          }}
        />

        {/* Album Artwork */}
        <div
          style={{
            width: '100%',
            aspectRatio: '1/1',
            borderRadius: '10px',
            overflow: 'hidden',
            position: 'relative',
            marginBottom: '8px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.5)'
          }}
        >
          <img
            src={card.cover}
            alt={card.album}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }}
          />

          {/* Type tag pill */}
          <div
            style={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              padding: '2px 6px',
              borderRadius: '9999px',
              background: 'rgba(13, 27, 42, 0.85)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              fontSize: '0.58rem',
              fontWeight: 700,
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-gold)',
              letterSpacing: '0.06em'
            }}
          >
            {card.type}
          </div>
        </div>

        {/* Track / Album Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: 'var(--color-ivory)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {card.title}
          </div>
          <div
            style={{
              fontSize: '0.68rem',
              color: 'rgba(244, 241, 222, 0.65)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {card.artist}
          </div>
        </div>

        {/* Metadata footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '6px',
            paddingTop: '4px',
            borderTop: '1px solid rgba(244, 241, 222, 0.08)',
            fontSize: '0.62rem',
            color: 'rgba(212, 196, 168, 0.8)'
          }}
        >
          <span>{card.year}</span>
          <span>{card.duration}</span>
        </div>
      </div>
    );
  }

  const fallbackScroll = useMotionValue(0);
  const activeScroll = scrollY || fallbackScroll;
  const config = isMobile && card.mobile ? card.mobile : card.desktop;

  // Staggered scroll range offsets based on card index
  const cardIndex = parseInt(card.id.length, 10) || 5;
  const exitOffset = 700 + (cardIndex % 4) * 50;

  // Scroll transforms driven by window scrollY in pixels
  const motionY = useTransform(
    activeScroll,
    [0, exitOffset],
    [config.y, config.y - 720]
  );

  const motionZ = useTransform(
    activeScroll,
    [0, exitOffset],
    [config.z, config.z + 300]
  );

  const baseScale = isMobile ? config.scale : config.scale;
  const motionScale = useTransform(
    activeScroll,
    [0, exitOffset * 0.5, exitOffset],
    [baseScale, baseScale * 1.05, baseScale * 0.8]
  );

  const motionOpacity = useTransform(
    activeScroll,
    [0, exitOffset * 0.75, exitOffset],
    [
      config.depthLayer === 'BACK' ? 0.7 : 1,
      0.85,
      0
    ]
  );

  // Responsive viewport width tracking for proportional spacing
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== 'undefined' ? window.innerWidth : 1440
  );

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mouse parallax offset (desktop only)
  const mouseMultiplier = config.depthLayer === 'FRONT' ? 12 : config.depthLayer === 'MID' ? 7 : 4;
  const mouseX = isMobile ? 0 : mousePos.x * mouseMultiplier;

  const isTablet = !isMobile && windowWidth < 1200;

  // Responsive card sizing: slightly more compact on tablet viewports so cards do not crowd or overlap
  const cardWidth = isMobile ? 140 : isTablet ? 152 : 175;
  const cardHeight = isMobile ? 195 : isTablet ? 208 : 235;

  // Scale X proportionally on tablet / narrower viewports to keep all cards strictly inside the viewing window
  let responsiveX = config.x;
  if (!isMobile) {
    if (windowWidth >= 1280) {
      responsiveX = config.x;
    } else {
      // Keep outer edge of any card strictly within screen boundaries with 20px padding
      const maxSafeOffset = Math.max(160, (windowWidth / 2) - (cardWidth / 2) - 20);
      const scaleFactor = Math.min(1, maxSafeOffset / 590);
      responsiveX = Math.round(config.x * scaleFactor);
    }
  }

  // Staggered idle floating class on inner div
  const idleClass = card.id.length % 2 === 0 ? 'float-idle-a' : 'float-idle-b';

  return (
    <div
      style={{
        position: 'absolute',
        top: isMobile ? '46%' : '44%',
        left: '50%',
        marginLeft: `${-cardWidth / 2}px`,
        marginTop: `${-cardHeight / 2}px`,
        width: `${cardWidth}px`,
        height: `${cardHeight}px`,
        pointerEvents: 'none',
        zIndex: config.depthLayer === 'FRONT' ? 18 : config.depthLayer === 'MID' ? 10 : 2,
        transformStyle: 'preserve-3d'
      }}
    >
      <motion.div
        style={{
          width: '100%',
          height: '100%',
          x: responsiveX + mouseX,
          y: motionY,
          z: motionZ,
          rotateX: config.rotateX,
          rotateY: config.rotateY,
          rotateZ: config.rotateZ,
          scale: motionScale,
          opacity: motionOpacity,
          pointerEvents: 'auto',
          transformStyle: 'preserve-3d'
        }}
      >
        <div
          className={idleClass}
          style={{ width: '100%', height: '100%' }}
        >
          <div
            className="glass-card-interactive"
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '16px',
              overflow: 'hidden',
              background: card.gradient,
              border: '1px solid rgba(244, 241, 222, 0.14)',
              boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.75), 0 0 25px rgba(212, 196, 168, 0.05)',
              padding: '12px',
              position: 'relative',
              cursor: 'pointer'
            }}
          >
            {/* Soft edge reflection light */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 45%)',
                pointerEvents: 'none',
                borderRadius: '16px'
              }}
            />

            {/* Album Artwork */}
            <div
              style={{
                width: '100%',
                aspectRatio: '1/1',
                borderRadius: '10px',
                overflow: 'hidden',
                position: 'relative',
                marginBottom: '10px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.5)'
              }}
            >
              <img
                src={card.cover}
                alt={card.album}
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />

              {/* Type tag pill */}
              <div
                style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  padding: '3px 8px',
                  borderRadius: '9999px',
                  background: 'rgba(13, 27, 42, 0.85)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--color-gold)',
                  letterSpacing: '0.06em'
                }}
              >
                {card.type}
              </div>
            </div>

            {/* Track / Album Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: isMobile ? '0.82rem' : '0.92rem',
                  fontWeight: 700,
                  color: 'var(--color-ivory)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {card.title}
              </div>
              <div
                style={{
                  fontSize: isMobile ? '0.72rem' : '0.78rem',
                  color: 'rgba(244, 241, 222, 0.65)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {card.artist}
              </div>
            </div>

            {/* Subtle metadata footer */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '8px',
                paddingTop: '6px',
                borderTop: '1px solid rgba(244, 241, 222, 0.08)',
                fontSize: '0.68rem',
                color: 'rgba(212, 196, 168, 0.8)'
              }}
            >
              <span>{card.year}</span>
              <span>{card.duration}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

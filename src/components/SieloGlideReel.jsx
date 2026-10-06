import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

/**
 * SieloGlideReel — Perfectly Synchronized Unspooling Golden Tape Reel
 * 
 * 1. Starts docked in the exact circle beside the hero download button (ss1).
 * 2. Glides through the page ALWAYS centered vertically (50vh) while scrolling.
 * 3. Stops and docks directly in the golden circle above 'O' of SIELO (ss3).
 * 4. The unspooling ribbon and the reel are 100% mathematically synchronized:
 *    the ribbon tip and the reel hub share the exact same pixel coordinates on every frame.
 * 5. Enabled strictly for laptops and monitors (window.innerWidth >= 1024px).
 */
export default function SieloGlideReel() {
  const [docHeight, setDocHeight] = useState(0);
  const [winWidth, setWinWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1440);
  const [winHeight, setWinHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 900);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [currentSection, setCurrentSection] = useState('ACOUSTIC MASTER');

  const pathRef = useRef(null);
  const reelRef = useRef(null);
  const dragStartYRef = useRef(0);
  const dragStartScrollRef = useRef(0);
  const animFrameRef = useRef(null);

  // Exact anchor boundary coordinates
  const [boundaryCoords, setBoundaryCoords] = useState({
    startX: 480,
    heroBtnViewportY: 640,
    startDocY: 640,
    endX: 1120,
    footerDockViewportY: 460,
    endDocY: 8800
  });

  // Dynamic live start point anchored to the hero download button
  const [heroP0, setHeroP0] = useState({ x: 480, y: 640 });

  // Track position and unspooled path length in perfect lockstep
  const [reelPos, setReelPos] = useState({
    viewportX: 480,
    viewportY: 640,
    angle: 0,
    pathLength: 0,
    currentPathLength: 0,
    progress: 0
  });

  const [anchorPoints, setAnchorPoints] = useState([]);

  // Query actual section landmark offsets from DOM
  const updateLandmarks = useCallback(() => {
    if (typeof window === 'undefined') return;

    const w = window.innerWidth;
    const vh = window.innerHeight;

    // Strictly laptop & monitor only
    if (w < 1024) {
      setWinWidth(w);
      setWinHeight(vh);
      setAnchorPoints([]);
      return;
    }

    const h = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight
    );

    setDocHeight(h);
    setWinWidth(w);
    setWinHeight(vh);

    const maxScroll = Math.max(1, h - vh);

    const getTop = (sel, fallback) => {
      const el = document.querySelector(sel);
      return el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : fallback;
    };

    // 1. START POINT: Circle in ss1 (precisely to the left of the hero download button)
    let startX = Math.round(w * 0.5 - 195);
    let startBtnViewportY = Math.round(vh * 0.72);
    const heroBtn =
      document.querySelector('#hero-download-btn-container a') ||
      document.querySelector('#hero-download-btn-container') ||
      document.querySelector('.download-sielo-btn');

    if (heroBtn) {
      const r = heroBtn.getBoundingClientRect();
      startX = Math.round(r.left - 42);
      startBtnViewportY = Math.round(r.top + r.height / 2);
    }
    const startDocY = Math.round(window.scrollY + startBtnViewportY);

    setHeroP0({ x: startX, y: startDocY });

    // 2. END POINT: Golden circle in ss3 (right above the upper-right shoulder of 'O' of SIELO)
    let endX = Math.min(w - 72, Math.round(w * 0.82));
    let footerDockViewportY = Math.round(vh * 0.52);
    let endDocY = Math.round(h - 320);

    const monolith =
      document.querySelector('#sielo-monolith-wordmark') ||
      document.querySelector('.sielo-monolith-text');

    if (monolith) {
      const r = monolith.getBoundingClientRect();
      endX = Math.round(r.right - 8);
      endDocY = Math.round(r.top - 12 + window.scrollY);
      footerDockViewportY = Math.round(endDocY - maxScroll);
    }

    setBoundaryCoords({
      startX,
      heroBtnViewportY: startBtnViewportY,
      startDocY,
      endX,
      footerDockViewportY,
      endDocY
    });

    // Landmarks for the continuous document ribbon spline
    const featuresTop = getTop('#features', 1600);
    const playerTop = getTop('.player-main-col', 3450);
    const albumsTop = getTop('#albums', 4250);
    const statsTop = getTop('#stats', 5950);
    const listenTop = getTop('#listen-together', 7300);
    const downloadTop = getTop('#download', 8450);

    // Safe gentle crests: left amplitude reaches 62px-68px (leaving 75px+ gap from text), right amplitude reaches w - 85px
    // Pure alternating peaks (Left -> Right -> Left -> Right) -> ZERO straight lines!
    // Vertical tangent handles (0.42 dy) -> ZERO steep edges, pure continuous C1 sinusoidal wave!
    const leftPeakX = Math.max(50, Math.min(68, Math.round(w * 0.045)));
    const rightPeakX = Math.min(w - 50, Math.max(w - 85, Math.round(w - w * 0.045)));

    const rawPoints = [
      { x: startX, y: startDocY },                                  // P0: Hero Start (circle in ss1)
      { x: leftPeakX, y: Math.max(startDocY + 450, featuresTop + 300) }, // P1: Core Architecture (curves left)
      { x: rightPeakX, y: playerTop + 240 },                        // P2: Tactile Player (curves right)
      { x: leftPeakX, y: albumsTop + 50 },                          // P3: Smart Discography (smooth curve slightly above badge & heading)
      { x: rightPeakX, y: statsTop + 280 },                         // P4: Vibe Radar (curves right)
      { x: leftPeakX, y: listenTop + 280 },                         // P5: Listen Together (curves left)
      { x: rightPeakX, y: downloadTop + 240 },                      // P6: Final Download (curves right)
      { x: endX, y: endDocY }                                       // P7: Footer Dock (golden circle in ss3)
    ];

    // Ensure strictly monotonic Y values
    let prevY = startDocY;
    const sanitizedPoints = rawPoints.map((pt, idx) => {
      if (idx === 0) return pt;
      const y = Math.max(prevY + 200, pt.y);
      prevY = y;
      return { x: pt.x, y };
    });

    setAnchorPoints(sanitizedPoints);
  }, []);

  // Compute smooth continuous Catmull-Rom cubic bezier spline through the anchor nodes
  // Eliminates all sharp V-edges, elbows, and flat straight lines with naturally rounded curves around every turn!
  const pathD = React.useMemo(() => {
    if (!anchorPoints || anchorPoints.length < 2) return '';

    // Dynamically replace P0 with heroP0 so the start point is 100% locked to the hero button on screen
    const pts = [{ x: heroP0.x, y: heroP0.y }, ...anchorPoints.slice(1)];

    let d = `M ${pts[0].x} ${pts[0].y}`;

    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = i > 0 ? pts[i - 1] : pts[0];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = i < pts.length - 2 ? pts[i + 2] : p2;

      // Catmull-Rom to Cubic Bezier conversion:
      // Guarantees C1 continuity, equal handle balancing across adjacent segments,
      // and natural round curvature around every apex without edges or kinks!
      const cp1x = Math.round(p1.x + (p2.x - p0.x) / 6);
      const cp1y = Math.round(p1.y + (p2.y - p0.y) / 6);
      const cp2x = Math.round(p2.x - (p3.x - p1.x) / 6);
      const cp2y = Math.round(p2.y - (p3.y - p1.y) / 6);

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    return d;
  }, [anchorPoints, heroP0]);

  // Synchronize reel and ribbon unspooling with mathematical precision
  const syncReelWithScroll = useCallback(() => {
    if (typeof window === 'undefined') return;
    const pathEl = pathRef.current;
    if (!pathEl) return;

    let totalLen = 0;
    try {
      totalLen = pathEl.getTotalLength();
    } catch {
      return;
    }
    if (!totalLen || isNaN(totalLen) || totalLen <= 0) return;

    const sy = window.scrollY;
    const vh = window.innerHeight;
    const maxScroll = Math.max(1, docHeight - vh);
    const scrollProgress = Math.min(1, Math.max(0, sy / maxScroll));

    // Live query hero download button for landing hero pinning
    let currentHeroBtnX = boundaryCoords.startX;
    let currentHeroBtnY = boundaryCoords.heroBtnViewportY;
    const heroBtnEl = document.querySelector('#hero-download-btn-container');
    if (heroBtnEl) {
      const r = heroBtnEl.getBoundingClientRect();
      currentHeroBtnX = Math.round(r.left - 42);
      currentHeroBtnY = Math.round(r.top + r.height / 2);
    }

    // While hero is active, dynamically update heroP0 so P0 renders exactly at currentHeroBtnY in viewport
    if (sy < 850) {
      const liveHeroDocY = Math.round(sy + currentHeroBtnY);
      if (Math.abs(heroP0.y - liveHeroDocY) > 1 || Math.abs(heroP0.x - currentHeroBtnX) > 1) {
        setHeroP0({ x: currentHeroBtnX, y: liveHeroDocY });
      }
    }

    // 1. Calculate Target Viewport Position:
    // - While on landing hero (sy <= 700px): stay 100% pinned inside the circle beside the hero download button (ss1)!
    //   Zero upward shift! Ribbon stays completely wound.
    // - From sy = 700px to 900px: smoothly unspools from button circle into vh * 0.5 (center of viewport)!
    // - During all main scroll (sy >= 900px): LOCKED to vh * 0.5 (Always in vertical center)
    // - Near footer (last 340px): smoothly ease into footerDockViewportY (golden circle in ss3)
    // - At bottom: directly in footerDockViewportY
    const vCenter = Math.round(vh * 0.5);
    const footerTransitionPx = 340;
    const remainingScroll = maxScroll - sy;
    let targetViewportY = vCenter;
    let isHeroPinned = false;

    if (sy <= 700) {
      // Pure landing screen: 100% docked inside the circle beside the button
      isHeroPinned = true;
      targetViewportY = currentHeroBtnY;
    } else if (sy < 900) {
      // Smooth unspooling transition from button circle into vertical center (50vh)
      const t = (sy - 700) / 200;
      const easeT = t * t * (3 - 2 * t);
      targetViewportY = Math.round(currentHeroBtnY * (1 - easeT) + vCenter * easeT);
    } else if (remainingScroll < footerTransitionPx) {
      const t = Math.min(1, Math.max(0, 1 - remainingScroll / footerTransitionPx));
      const easeT = t * t * (3 - 2 * t);
      targetViewportY = Math.round(vCenter * (1 - easeT) + boundaryCoords.footerDockViewportY * easeT);
    }

    if (isHeroPinned) {
      setReelPos({
        viewportX: currentHeroBtnX,
        viewportY: currentHeroBtnY,
        angle: 0,
        pathLength: totalLen,
        currentPathLength: 0,
        progress: scrollProgress
      });
      return;
    }

    // 2. The exact document Y coordinate where the reel and ribbon tip must meet:
    const targetDocY = sy + targetViewportY;

    // 3. Binary search to find the exact arc length on the SVG spline
    let low = 0;
    let high = totalLen;

    const startPt = pathEl.getPointAtLength(0);
    const endPt = pathEl.getPointAtLength(totalLen);

    let currentLen = 0;
    if (targetDocY <= startPt.y) {
      currentLen = 0;
    } else if (targetDocY >= endPt.y) {
      currentLen = totalLen;
    } else {
      for (let i = 0; i < 15; i++) {
        const mid = (low + high) * 0.5;
        const pt = pathEl.getPointAtLength(mid);
        if (pt.y < targetDocY) {
          low = mid;
        } else {
          high = mid;
        }
      }
      currentLen = (low + high) * 0.5;
    }

    // 4. Point on path at length currentLen
    const pt = pathEl.getPointAtLength(currentLen);

    // Compute tangent angle for reel orientation
    const nextLen = Math.min(totalLen, currentLen + 2);
    const nextPt = pathEl.getPointAtLength(nextLen);
    const dx = nextPt.x - pt.x;
    const dy = nextPt.y - pt.y;
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

    setReelPos({
      viewportX: Math.round(pt.x),
      viewportY: Math.round(targetViewportY),
      angle: angle || 0,
      pathLength: totalLen,
      currentPathLength: currentLen,
      progress: scrollProgress
    });
  }, [docHeight, boundaryCoords]);

  // RequestAnimationFrame listener on scroll for instantaneous 120fps sync
  useEffect(() => {
    const handleScroll = () => {
      if (animFrameRef.current) return;
      animFrameRef.current = requestAnimationFrame(() => {
        syncReelWithScroll();
        animFrameRef.current = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [syncReelWithScroll]);

  // Re-run sync immediately whenever path changes or landmarks update
  useEffect(() => {
    syncReelWithScroll();
  }, [pathD, syncReelWithScroll]);

  // Window resize, load and observer
  useEffect(() => {
    updateLandmarks();
    window.addEventListener('resize', updateLandmarks);
    window.addEventListener('load', updateLandmarks);

    const observer = new ResizeObserver(() => updateLandmarks());
    observer.observe(document.body);

    const t1 = setTimeout(updateLandmarks, 250);
    const t2 = setTimeout(updateLandmarks, 1000);

    return () => {
      window.removeEventListener('resize', updateLandmarks);
      window.removeEventListener('load', updateLandmarks);
      observer.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [updateLandmarks]);

  // Section landmark detection for the interactive tooltip
  useEffect(() => {
    const handleSectionDetect = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.5;
      const featuresEl = document.getElementById('features');
      const playerEl = document.getElementById('player') || document.querySelector('.player-main-col');
      const albumsEl = document.getElementById('albums');
      const statsEl = document.getElementById('stats');
      const listenEl = document.getElementById('listen-together');
      const downloadEl = document.getElementById('download');
      const footerEl = document.querySelector('.sielo-editorial-footer');

      if (footerEl && scrollPos >= footerEl.offsetTop - 80) {
        setCurrentSection('FOOTER ARCHIVE');
      } else if (downloadEl && scrollPos >= downloadEl.offsetTop) {
        setCurrentSection('DOWNLOAD SIELO');
      } else if (listenEl && scrollPos >= listenEl.offsetTop) {
        setCurrentSection('LISTEN TOGETHER');
      } else if (statsEl && scrollPos >= statsEl.offsetTop) {
        setCurrentSection('VIBE RADAR');
      } else if (albumsEl && scrollPos >= albumsEl.offsetTop) {
        setCurrentSection('SMART DISCOGRAPHY');
      } else if (playerEl && scrollPos >= playerEl.offsetTop) {
        setCurrentSection('TACTILE PLAYER');
      } else if (featuresEl && scrollPos >= featuresEl.offsetTop) {
        setCurrentSection('ARCHITECTURE');
      } else {
        setCurrentSection('ACOUSTIC MASTER');
      }
    };

    window.addEventListener('scroll', handleSectionDetect, { passive: true });
    return () => window.removeEventListener('scroll', handleSectionDetect);
  }, []);

  // Handle interactive scrubbing by clicking and dragging the reel
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartYRef.current = e.clientY;
    dragStartScrollRef.current = window.scrollY;

    const handleMouseMove = (moveEvent) => {
      const deltaY = moveEvent.clientY - dragStartYRef.current;
      const scrollFactor = (docHeight - window.innerHeight) / (window.innerHeight * 0.85);
      window.scrollTo({
        top: dragStartScrollRef.current + deltaY * scrollFactor,
        behavior: 'auto'
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Click on the SVG ribbon track to smoothly glide there
  const handleTrackClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const targetScroll = Math.max(0, Math.min(docHeight - window.innerHeight, clickY - window.innerHeight * 0.5));
    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
  };

  // Only render on laptops & monitors (>= 1024px)
  if (!docHeight || docHeight < 1000 || winWidth < 1024) return null;

  // Unspool rotation of reel (full 360 spins proportional to unspooled length)
  const reelSpin = reelPos.pathLength > 0
    ? (reelPos.currentPathLength / reelPos.pathLength) * 2160
    : 0;

  const isNearFooter = reelPos.progress > 0.95;

  // Exact stroke dashoffset: unspools up to reelPos.currentPathLength
  const dashOffset = reelPos.pathLength
    ? Math.max(0, reelPos.pathLength - reelPos.currentPathLength)
    : 10000;

  return (
    <>
      {/* Full-Document SVG Curving Ribbon Trail */}
      <svg
        className="sielo-glide-svg"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: `${docHeight}px`,
          pointerEvents: 'none',
          zIndex: 19,
          overflow: 'visible'
        }}
      >
        <defs>
          {/* Champagne-Gold Metallic Gradient for the Unspooling Magnetic Ribbon */}
          <linearGradient id="sieloRibbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F4F1DE" stopOpacity="0.85" />
            <stop offset="35%" stopColor="#D4C4A8" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#A89676" stopOpacity="0.80" />
            <stop offset="100%" stopColor="#D4C4A8" stopOpacity="0.95" />
          </linearGradient>

          {/* Ribbon Soft Specular Bloom */}
          <filter id="ribbonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Subtle Background Guide Track (Barely visible acoustic groove) */}
        <path
          d={pathD}
          fill="none"
          stroke="rgba(212, 196, 168, 0.05)"
          strokeWidth="6"
          strokeLinecap="round"
          style={{
            pointerEvents: reelPos.currentPathLength > 0 ? 'stroke' : 'none',
            cursor: 'pointer',
            opacity: reelPos.currentPathLength > 0 ? 1 : 0,
            transition: 'opacity 0.4s ease'
          }}
          onClick={handleTrackClick}
        />

        {/* Ambient Specular Outer Glow of the Unspooling Ribbon */}
        <path
          d={pathD}
          fill="none"
          stroke="rgba(212, 196, 168, 0.16)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={reelPos.pathLength || 10000}
          strokeDashoffset={dashOffset}
          filter="url(#ribbonGlow)"
        />

        {/* Primary Glowing Champagne-Gold Magnetic Ribbon */}
        <path
          ref={pathRef}
          d={pathD}
          fill="none"
          stroke="url(#sieloRibbonGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={reelPos.pathLength || 10000}
          strokeDashoffset={dashOffset}
        />
      </svg>

      {/* Floating 3D Tape Reel Glider — Positioned in Viewport Space (ALWAYS in vertical center) */}
      <div
        ref={reelRef}
        className="sielo-glide-reel-anchor download-disc"
        onMouseDown={handleMouseDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'fixed',
          left: `${reelPos.viewportX}px`,
          top: `${reelPos.viewportY}px`,
          transform: 'translate(-50%, -50%)',
          width: '54px',
          height: '54px',
          zIndex: 20,
          cursor: isDragging ? 'grabbing' : 'grab',
          pointerEvents: 'auto',
          userSelect: 'none',
          touchAction: 'none'
        }}
      >
        {/* Ambient Warm Halo beneath the Reel */}
        <div
          style={{
            position: 'absolute',
            inset: '-12px',
            borderRadius: '50%',
            background: isNearFooter
              ? 'radial-gradient(circle, rgba(212, 196, 168, 0.38) 0%, rgba(212, 196, 168, 0.08) 50%, transparent 75%)'
              : 'radial-gradient(circle, rgba(212, 196, 168, 0.22) 0%, rgba(27, 38, 59, 0.2) 50%, transparent 75%)',
            filter: 'blur(8px)',
            transition: 'all 0.3s ease',
            pointerEvents: 'none'
          }}
        />

        {/* 3D Physical Studio Tape Reel */}
        <motion.div
          animate={{
            rotate: reelSpin,
            scale: isDragging ? 1.12 : isHovered ? 1.08 : 1,
          }}
          transition={{
            rotate: { ease: 'linear', duration: 0 },
            scale: { type: 'spring', stiffness: 350, damping: 22 }
          }}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            position: 'relative',
            perspective: '800px',
            transformStyle: 'preserve-3d',
            filter: 'drop-shadow(0 10px 24px rgba(0, 0, 0, 0.85))'
          }}
        >
          {/* Outer Polished Aluminum Flange */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 30%, #415A77 0%, #1B263B 45%, #0D1B2A 85%, #070B12 100%)',
              border: '1.5px solid rgba(212, 196, 168, 0.65)',
              boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.9), 0 0 14px rgba(212, 196, 168, 0.22)'
            }}
          />

          {/* Wound Gold Magnetic Tape Layer (Simulated depth) */}
          <div
            style={{
              position: 'absolute',
              inset: '7px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #D4C4A8 0%, #8E897D 50%, #3A352D 100%)',
              opacity: Math.max(0.45, 1 - reelPos.progress * 0.4),
              boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.8)'
            }}
          />

          {/* Studio 3-Cutout Precision Rotor Flange */}
          <svg
            viewBox="0 0 100 100"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%'
            }}
          >
            {/* Cutout Hole 1 */}
            <circle cx="50" cy="24" r="10" fill="#070B12" stroke="rgba(212, 196, 168, 0.45)" strokeWidth="1.2" />
            {/* Cutout Hole 2 */}
            <circle cx="27.5" cy="63" r="10" fill="#070B12" stroke="rgba(212, 196, 168, 0.45)" strokeWidth="1.2" />
            {/* Cutout Hole 3 */}
            <circle cx="72.5" cy="63" r="10" fill="#070B12" stroke="rgba(212, 196, 168, 0.45)" strokeWidth="1.2" />

            {/* Inner Studio Machined Center Hub */}
            <circle cx="50" cy="50" r="14" fill="url(#hubGrad)" stroke="rgba(212, 196, 168, 0.9)" strokeWidth="1.8" />
            {/* Spindle Center Hole */}
            <circle cx="50" cy="50" r="5" fill="#070B12" stroke="#D4C4A8" strokeWidth="1.5" />
            
            {/* 3 Center Drive Notches */}
            <rect x="48.5" y="42" width="3" height="4" fill="#D4C4A8" rx="0.5" />
            <rect x="42.5" y="52" width="4" height="3" fill="#D4C4A8" rx="0.5" transform="rotate(-30 44.5 53.5)" />
            <rect x="53.5" y="52" width="4" height="3" fill="#D4C4A8" rx="0.5" transform="rotate(30 55.5 53.5)" />

            <defs>
              <linearGradient id="hubGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F4F1DE" />
                <stop offset="50%" stopColor="#D4C4A8" />
                <stop offset="100%" stopColor="#6C6556" />
              </linearGradient>
            </defs>
          </svg>

          {/* Dynamic Specular Sheen (Sweeps across as wheel turns) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.28) 0%, transparent 45%, rgba(212, 196, 168, 0.15) 100%)',
              pointerEvents: 'none'
            }}
          />
        </motion.div>

        {/* Interactive Floating Chapter Pill Tooltip */}
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.9 }}
          animate={{
            opacity: isHovered || isDragging ? 1 : 0,
            y: isHovered || isDragging ? 0 : 8,
            scale: isHovered || isDragging ? 1 : 0.9
          }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute',
            top: '-36px',
            left: '50%',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            background: 'rgba(7, 11, 18, 0.92)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(212, 196, 168, 0.35)',
            borderRadius: '999px',
            padding: '4px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.7), 0 0 16px rgba(212, 196, 168, 0.15)'
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#D4C4A8',
              boxShadow: '0 0 6px #D4C4A8'
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '0.72rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              color: '#F4F1DE',
              textTransform: 'uppercase'
            }}
          >
            {currentSection}
          </span>
          <span
            style={{
              fontSize: '0.68rem',
              color: 'rgba(212, 196, 168, 0.65)',
              fontFamily: 'var(--font-body)',
              marginLeft: '2px'
            }}
          >
            {Math.round(reelPos.progress * 100)}%
          </span>
        </motion.div>

        {/* Lock-in Harmonic Ring upon Footer Docking */}
        {isNearFooter && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [1, 1.45, 1.2], opacity: [0.8, 0, 0.6] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              inset: '-10px',
              borderRadius: '50%',
              border: '1.5px solid #D4C4A8',
              pointerEvents: 'none'
            }}
          />
        )}
      </div>
    </>
  );
}

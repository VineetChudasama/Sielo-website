import React from 'react';
import FloatingMusicCard from './FloatingMusicCard';
import SieloPlayerMockup from './SieloPlayerMockup';
import { HERO_CARDS } from '../data/musicData';

export default function FloatingMusicField({
  scrollY,
  mousePos,
  isMobile
}) {
  // Desktop renders 8 cards; mobile renders 4 cards
  const displayCards = isMobile
    ? HERO_CARDS.filter((c) => c.mobile !== null)
    : HERO_CARDS;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        perspective: '1200px',
        perspectiveOrigin: '50% 50%',
        transformStyle: 'preserve-3d',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
        zIndex: 5
      }}
    >
      {/* 3D Depth Floating Cards */}
      {displayCards.map((card) => (
        <FloatingMusicCard
          key={card.id}
          card={card}
          scrollY={scrollY}
          mousePos={mousePos}
          isMobile={isMobile}
        />
      ))}

      {/* Centerpiece 3D Sielo Player */}
      <SieloPlayerMockup
        scrollY={scrollY}
        mousePos={mousePos}
        isMobile={isMobile}
      />
    </div>
  );
}

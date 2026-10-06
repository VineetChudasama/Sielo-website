import React from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeatureSection from './components/FeatureSection';
import PlayerShowcase from './components/PlayerShowcase';
import AlbumShowcase from './components/AlbumShowcase';
import StatsShowcase from './components/StatsShowcase';
import ListenTogether from './components/ListenTogether';
import DownloadCTA from './components/DownloadCTA';
import Footer from './components/Footer';
import SieloGlideReel from './components/SieloGlideReel';

function App() {
  return (
    <ErrorBoundary>
      <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: 'transparent' }}>
      {/* Interactive 3D Curving Tape Reel & Sonic Ribbon */}
      <SieloGlideReel />

      {/* Subtle static film grain & vignette */}
      <div className="film-grain" aria-hidden="true" />
      <div className="vignette-overlay" aria-hidden="true" />

      {/* Floating Navbar */}
      <Navbar />

      {/* Primary Scroll-Driven 3D Musical Universe Hero */}
      <Hero />

      {/* Architectural Features */}
      <FeatureSection />

      {/* In-depth Tactile Player Showcase */}
      <PlayerShowcase />

      {/* Smart Discography & Visual Album Cards */}
      <AlbumShowcase />

      {/* Celestial Stats & Vibe Radar */}
      <StatsShowcase />

      {/* Private P2P Sessions: Listen Together */}
      <ListenTogether />

      {/* Final Download Section */}
      <DownloadCTA />

      {/* Footer */}
      <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;

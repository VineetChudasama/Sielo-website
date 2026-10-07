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
import DeepLinkFallback from './components/DeepLinkFallback';

function App() {
  const [routeInfo, setRouteInfo] = React.useState(() => parseCurrentRoute());

  React.useEffect(() => {
    const handlePopState = () => {
      setRouteInfo(parseCurrentRoute());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  function parseCurrentRoute() {
    try {
      const pathname = window.location.pathname.replace(/\/+$/, '');
      const searchParams = new URLSearchParams(window.location.search);

      // 1. /song/:songId or /track/:songId or query ?song= or ?track=
      const songMatch = pathname.match(/^\/(?:song|track)\/([^/?#]+)/i);
      if (songMatch) {
        return {
          type: 'song',
          id: decodeURIComponent(songMatch[1]),
          title: searchParams.get('title') || '',
          artist: searchParams.get('artist') || ''
        };
      }
      if (pathname === '/track' || pathname === '/song') {
        const id = searchParams.get('id');
        if (id) {
          return {
            type: 'song',
            id,
            title: searchParams.get('title') || '',
            artist: searchParams.get('artist') || ''
          };
        }
      }

      // 2. /album/:albumId or query ?album=
      const albumMatch = pathname.match(/^\/album\/([^/?#]+)/i);
      if (albumMatch) {
        return {
          type: 'album',
          id: decodeURIComponent(albumMatch[1]),
          title: searchParams.get('title') || '',
          artist: searchParams.get('artist') || ''
        };
      }
      if (pathname === '/album') {
        const id = searchParams.get('id');
        if (id) {
          return {
            type: 'album',
            id,
            title: searchParams.get('title') || '',
            artist: searchParams.get('artist') || ''
          };
        }
      }

      // 3. /listen/:roomId or /room/:roomId
      const listenMatch = pathname.match(/^\/(?:listen|room)\/([^/?#]+)/i);
      if (listenMatch) {
        return {
          type: 'listen',
          id: decodeURIComponent(listenMatch[1])
        };
      }
      if (pathname === '/listen' || pathname === '/room') {
        const id = searchParams.get('id') || searchParams.get('room');
        if (id) {
          return {
            type: 'listen',
            id
          };
        }
      }

      return null;
    } catch {
      return null;
    }
  }

  const handleBackToHome = () => {
    window.history.pushState({}, '', '/');
    setRouteInfo(null);
  };

  if (routeInfo) {
    return (
      <ErrorBoundary>
        <DeepLinkFallback
          type={routeInfo.type}
          id={routeInfo.id}
          title={routeInfo.title}
          artist={routeInfo.artist}
          onBack={handleBackToHome}
        />
      </ErrorBoundary>
    );
  }

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

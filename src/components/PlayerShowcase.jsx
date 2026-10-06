import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Play, Pause, SkipBack, SkipForward, Shuffle, Repeat,
  ListMusic, Mic2, Disc3, Radio, Sparkles
} from 'lucide-react';
import Waveform from './Waveform';

const TOTAL_DURATION_SEC = 230; // 03:50

const SYNCED_LYRICS = [
  { seconds: 0, time: '00:00', text: "(Instrumental Intro • Daft Punk & The Weeknd)" },
  { seconds: 3, time: '00:03', text: "(Synths swell into groove)" },
  { seconds: 6, time: '00:06', text: "(Ah, ah, ah, ah)" },
  { seconds: 9, time: '00:09', text: "(Ah, ah, ah, ah)" },
  { seconds: 12, time: '00:12', text: "Yeah, yeah, yeah" },
  { seconds: 15, time: '00:15', text: "I'm tryna put you in the worst mood, ah" },
  { seconds: 18, time: '00:18', text: "P1 cleaner than your church shoes, ah" },
  { seconds: 21, time: '00:21', text: "Milli point two just to hurt you, ah" },
  { seconds: 24, time: '00:24', text: "All red Lamb' just to tease you, ah" },
  { seconds: 27, time: '00:27', text: "None of these toys on lease too, ah" },
  { seconds: 30, time: '00:30', text: "Made your whole year in a week too, yah" },
  { seconds: 33, time: '00:33', text: "Main girl out your league too, ah" },
  { seconds: 36, time: '00:36', text: "Side girl out of your league too, ah" },
  { seconds: 39, time: '00:39', text: "House so empty, need a centerpiece" },
  { seconds: 42, time: '00:42', text: "Twenty racks a table cut from ebony" },
  { seconds: 45, time: '00:45', text: "Cut that ivory into skinny pieces" },
  { seconds: 48, time: '00:48', text: "Then she clean it with her face, man I love my baby" },
  { seconds: 51, time: '00:51', text: "You talking money, need a hearing aid" },
  { seconds: 54, time: '00:54', text: "You talking 'bout me, I don't see a shade" },
  { seconds: 57, time: '00:57', text: "Switch up my style, I take any lane" },
  { seconds: 60, time: '01:00', text: "Switch up my cup, I kill any pain" },
  { seconds: 63, time: '01:03', text: "(Ha-ha-ha-ha-ha)" },
  { seconds: 66, time: '01:06', text: "Look what you've done" },
  { seconds: 69, time: '01:09', text: "I'm a motherf***in' starboy" },
  { seconds: 72, time: '01:12', text: "Look what you've done" },
  { seconds: 75, time: '01:15', text: "I'm a motherf***in' starboy" },
  { seconds: 78, time: '01:18', text: "Look what you've done" },
  { seconds: 81, time: '01:21', text: "I'm a motherf***in' starboy" },
  { seconds: 84, time: '01:24', text: "Look what you've done" },
  { seconds: 87, time: '01:27', text: "I'm a motherf***in' starboy" },
  { seconds: 90, time: '01:30', text: "Every day a lover try to test me, ah" },
  { seconds: 93, time: '01:33', text: "Every day a hater try to end me, ah" },
  { seconds: 96, time: '01:36', text: "Pull off in that Roadster SV, ah" },
  { seconds: 99, time: '01:39', text: "Pockets overweight, gettin' hefty, ah" },
  { seconds: 102, time: '01:42', text: "Coming for the king, that's a far cry, ah" },
  { seconds: 105, time: '01:45', text: "I come alive in the fall time, I" },
  { seconds: 108, time: '01:48', text: "No competition, I don't really listen" },
  { seconds: 111, time: '01:51', text: "I'm in the blue Mulsanne bumping New Edition" },
  { seconds: 114, time: '01:54', text: "House so empty, need a centerpiece" },
  { seconds: 117, time: '01:57', text: "Twenty racks a table cut from ebony" },
  { seconds: 120, time: '02:00', text: "Cut that ivory into skinny pieces" },
  { seconds: 123, time: '02:03', text: "Then she clean it with her face, man I love my baby" },
  { seconds: 126, time: '02:06', text: "You talking money, need a hearing aid" },
  { seconds: 129, time: '02:09', text: "You talking 'bout me, I don't see a shade" },
  { seconds: 132, time: '02:12', text: "Switch up my style, I take any lane" },
  { seconds: 135, time: '02:15', text: "Switch up my cup, I kill any pain" },
  { seconds: 138, time: '02:18', text: "(Ha-ha-ha-ha-ha)" },
  { seconds: 141, time: '02:21', text: "Look what you've done" },
  { seconds: 144, time: '02:24', text: "I'm a motherf***in' starboy" },
  { seconds: 147, time: '02:27', text: "Look what you've done" },
  { seconds: 150, time: '02:30', text: "I'm a motherf***in' starboy" },
  { seconds: 153, time: '02:33', text: "Look what you've done" },
  { seconds: 156, time: '02:36', text: "I'm a motherf***in' starboy" },
  { seconds: 159, time: '02:39', text: "Look what you've done" },
  { seconds: 162, time: '02:42', text: "I'm a motherf***in' starboy" },
  { seconds: 165, time: '02:45', text: "Let a n***a brag kill a vibe, yo" },
  { seconds: 168, time: '02:48', text: "Hit a woman, that's a whole lie, yo" },
  { seconds: 171, time: '02:51', text: "Talkin' 'bout me, never cross my mind, yo" },
  { seconds: 174, time: '02:54', text: "Hundred on the dash get me close to God" },
  { seconds: 177, time: '02:57', text: "We don't pray for love, we just pray for cars" },
  { seconds: 180, time: '03:00', text: "Living on the edge, yeah I never slip" },
  { seconds: 183, time: '03:03', text: "Hundred thousand on a single trip" },
  { seconds: 186, time: '03:06', text: "House so empty, need a centerpiece" },
  { seconds: 189, time: '03:09', text: "Twenty racks a table cut from ebony" },
  { seconds: 192, time: '03:12', text: "Cut that ivory into skinny pieces" },
  { seconds: 195, time: '03:15', text: "Look what you've done" },
  { seconds: 198, time: '03:18', text: "I'm a motherf***in' starboy" },
  { seconds: 201, time: '03:21', text: "Look what you've done" },
  { seconds: 204, time: '03:24', text: "I'm a motherf***in' starboy" },
  { seconds: 207, time: '03:27', text: "(Look what you've done)" },
  { seconds: 210, time: '03:30', text: "I'm a motherf***in' starboy" },
  { seconds: 213, time: '03:33', text: "(Look what you've done)" },
  { seconds: 216, time: '03:36', text: "I'm a motherf***in' starboy" },
  { seconds: 219, time: '03:39', text: "(Daft Punk Vocoder Outro)" },
  { seconds: 222, time: '03:42', text: "Look what you've done" },
  { seconds: 225, time: '03:45', text: "I'm a motherf***in' starboy" },
  { seconds: 228, time: '03:48', text: "(Beat fade out • Master Outro)" }
];

export default function PlayerShowcase() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentSec, setCurrentSec] = useState(114); // starts at 01:54: "Look what you've done"
  const [activeTab, setActiveTab] = useState('lyrics');
  const lyricsContainerRef = useRef(null);
  const activeLyricRef = useRef(null);

  // Playback simulation timer: advances every 1 second (purely visual display, no volume)
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentSec((prev) => {
        if (prev >= TOTAL_DURATION_SEC) return 0;
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Precise lyric synchronization: Find the exact active lyric matching currentSec
  const currentLineIndex = SYNCED_LYRICS.reduce((accIndex, line, idx) => {
    return currentSec >= line.seconds ? idx : accIndex;
  }, 0);

  // Auto-scroll active lyric into view smoothly so it is ALWAYS in the exact center
  useEffect(() => {
    if (activeLyricRef.current && lyricsContainerRef.current) {
      const container = lyricsContainerRef.current;
      const element = activeLyricRef.current;
      const elementCenter = element.offsetTop + element.offsetHeight / 2;
      const containerCenter = container.clientHeight / 2;
      const targetScroll = elementCenter - containerCenter;
      container.scrollTo({ top: Math.max(0, targetScroll), behavior: 'smooth' });
    }
  }, [currentLineIndex]);

  // Handle scrubber seek
  const handleSeek = (progressRatio) => {
    const newSec = Math.round(progressRatio * TOTAL_DURATION_SEC);
    setCurrentSec(newSec);
  };

  // Jump to specific lyric timestamp
  const handleLyricClick = (seconds) => {
    setCurrentSec(seconds);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const progress = currentSec / TOTAL_DURATION_SEC;

  const queueTracks = [
    { title: 'Die For You', artist: 'The Weeknd', duration: '3:50', quality: '320K' },
    { title: 'Get Lucky', artist: 'Daft Punk, Pharrell Williams', duration: '4:08', quality: '320K' },
    { title: 'Pink + White', artist: 'Frank Ocean', duration: '3:04', quality: '320K' },
    { title: 'Let It Happen', artist: 'Tame Impala', duration: '7:46', quality: '320K' }
  ];

  return (
    <section
      id="experience"
      style={{
        position: 'relative',
        zIndex: 20,
        padding: '120px 24px',
        maxWidth: 'var(--max-w-content)',
        margin: '0 auto'
      }}
    >
      {/* Section Header */}
      <div style={{ textAlign: 'center', marginBottom: '72px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <span className="pill-badge">
            <Disc3 size={13} />
            <span>PLAYER EXPERIENCE</span>
          </span>
        </div>
        <h2
          style={{
            fontSize: 'clamp(2.2rem, 5vw, 4.2rem)',
            fontWeight: 700,
            textTransform: 'uppercase',
            lineHeight: 1.08,
            color: 'var(--color-ivory)',
            marginBottom: '18px'
          }}
        >
          BUILT AROUND
          <br />
          <span style={{ color: 'var(--color-gold)' }}>THE MOMENT YOU LISTEN.</span>
        </h2>
        <p
          style={{
            fontSize: '1.15rem',
            color: 'rgba(244, 241, 222, 0.72)',
            maxWidth: '640px',
            margin: '0 auto'
          }}
        >
          Tactile vinyl interaction, millisecond vocal synchrony, and an interactive
          scrubbable waveform that turns audio playback into a physical sensory experience.
        </p>
      </div>

      {/* Main Player Display Showcase Card */}
      <div
        className="glass-panel"
        style={{
          borderRadius: '32px',
          padding: 'clamp(24px, 4vw, 48px)',
          background: 'linear-gradient(160deg, rgba(27, 38, 59, 0.75) 0%, rgba(13, 27, 42, 0.95) 100%)',
          border: '1px solid rgba(212, 196, 168, 0.2)',
          boxShadow: 'var(--shadow-player)',
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '40px',
          alignItems: 'center'
        }}
      >
        {/* Left Side: Physical Vinyl & Player Controls */}
        <div
          style={{
            gridColumn: 'span 12'
          }}
          className="player-main-col"
        >
          {/* Top Marquee Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '28px',
              paddingBottom: '16px',
              borderBottom: '1px solid rgba(244, 241, 222, 0.08)',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: isPlaying ? '#778D7A' : 'rgba(212, 196, 168, 0.4)',
                  boxShadow: isPlaying ? '0 0 10px #778D7A' : 'none'
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  color: 'var(--color-ivory)'
                }}
              >
                TACTILE VINYL ENGINE
              </span>
            </div>

            {/* Badges Group */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="pill-badge" style={{ fontSize: '0.72rem', padding: '4px 12px' }}>
                <Sparkles size={12} />
                <span>320 KBPS CD-AAC</span>
              </span>
              <span
                className="pill-badge"
                style={{
                  fontSize: '0.72rem',
                  padding: '4px 12px',
                  background: 'rgba(119, 141, 122, 0.15)',
                  border: '1px solid rgba(119, 141, 122, 0.35)',
                  color: '#A3B8A6'
                }}
              >
                <Radio size={12} />
                <span>MEDIA3 SERVICE</span>
              </span>
            </div>
          </div>

          {/* Centered Large Vinyl Record with User Uploaded Starboy Artwork INSIDE the Disc Center */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '32px 0 28px 0'
            }}
          >
            {/* Large Spinning Vinyl Record */}
            <div
              className={`player-main-vinyl spin-vinyl ${isPlaying ? '' : 'spin-vinyl-paused'}`}
              style={{
                width: 'clamp(210px, 30vw, 270px)',
                height: 'clamp(210px, 30vw, 270px)',
                borderRadius: '50%',
                background: 'repeating-radial-gradient(circle, #081019 0px, #081019 3px, #162436 4px, #081019 5px)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.85), inset 0 0 25px rgba(212, 196, 168, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '3px solid rgba(212, 196, 168, 0.2)',
                position: 'relative',
                animationPlayState: isPlaying ? 'running' : 'paused'
              }}
            >
              {/* Circular Album Artwork Label INSIDE Disc Center using uploaded starboy.png */}
              <div
                style={{
                  width: '48%',
                  height: '48%',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  position: 'relative',
                  border: '3px solid #081019',
                  boxShadow: '0 0 20px rgba(0,0,0,0.9)'
                }}
              >
                <img
                  src="/starboy.png"
                  alt="Starboy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
                {/* Center Spindle Dot */}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: '#081019',
                    border: '2px solid #D4C4A8',
                    boxShadow: '0 0 8px rgba(0,0,0,0.95)'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Track Details */}
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <h3
              className="player-main-track-title"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.75rem',
                fontWeight: 700,
                color: 'var(--color-ivory)'
              }}
            >
              Starboy
            </h3>
            <p style={{ color: 'rgba(244, 241, 222, 0.7)', fontSize: '1rem', marginTop: '4px' }}>
              The Weeknd, Daft Punk • Starboy
            </p>
          </div>

          {/* Interactive Scrubbable Waveform in Sync with Playback & Lyrics */}
          <div style={{ margin: '24px 0' }}>
            <Waveform
              progress={progress}
              onSeek={handleSeek}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.78rem',
                color: 'rgba(244, 241, 222, 0.65)',
                fontFamily: 'var(--font-heading)'
              }}
            >
              <span>{formatTime(currentSec)}</span>
              <span>03:50</span>
            </div>
          </div>

          {/* Large Tactile Controls */}
          <div
            className="player-main-controls"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '24px',
              paddingTop: '8px'
            }}
          >
            <button
              style={{ color: 'rgba(244, 241, 222, 0.6)', transition: 'color 0.2s' }}
              aria-label="Shuffle"
            >
              <Shuffle size={20} />
            </button>

            <button
              onClick={() => setCurrentSec((p) => Math.max(0, p - 10))}
              style={{ color: 'var(--color-ivory)', transition: 'transform 0.2s' }}
              aria-label="Previous"
            >
              <SkipBack size={24} />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--color-ivory)',
                color: 'var(--bg-deep)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 25px rgba(244, 241, 222, 0.35)',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause size={24} fill="var(--bg-deep)" />
              ) : (
                <Play size={24} fill="var(--bg-deep)" style={{ marginLeft: '3px' }} />
              )}
            </button>

            <button
              onClick={() => setCurrentSec((p) => Math.min(TOTAL_DURATION_SEC, p + 10))}
              style={{ color: 'var(--color-ivory)', transition: 'transform 0.2s' }}
              aria-label="Next"
            >
              <SkipForward size={24} />
            </button>

            <button
              style={{ color: 'rgba(244, 241, 222, 0.6)', transition: 'color 0.2s' }}
              aria-label="Repeat"
            >
              <Repeat size={20} />
            </button>
          </div>
        </div>

        {/* Right Side: Lyrics & Queue Tabs in Exact Vocal Sync */}
        <div
          style={{
            gridColumn: 'span 12'
          }}
          className="player-side-col"
        >
          <div
            className="player-side-inner"
            style={{
              borderRadius: '24px',
              background: 'rgba(13, 27, 42, 0.65)',
              border: '1px solid rgba(65, 90, 119, 0.3)',
              padding: '28px',
              minHeight: '440px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Tab switch */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '20px',
                borderBottom: '1px solid rgba(244, 241, 222, 0.08)',
                paddingBottom: '14px'
              }}
            >
              <button
                onClick={() => setActiveTab('lyrics')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: activeTab === 'lyrics' ? 'var(--color-gold)' : 'rgba(244, 241, 222, 0.5)',
                  transition: 'color 0.2s'
                }}
              >
                <Mic2 size={16} />
                <span>Synchronized Lyrics</span>
              </button>

              <button
                onClick={() => setActiveTab('queue')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: activeTab === 'queue' ? 'var(--color-gold)' : 'rgba(244, 241, 222, 0.5)',
                  transition: 'color 0.2s'
                }}
              >
                <ListMusic size={16} />
                <span>Up Next Queue</span>
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'lyrics' ? (
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: '340px' }}>
                <div style={{ fontSize: '0.72rem', color: 'rgba(212, 196, 168, 0.65)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '14px' }}>
                  Tap any line to jump audio • Real-time LRCLIB Sync
                </div>

                {/* Scrollable live lyrics box with center alignment */}
                <div
                  ref={lyricsContainerRef}
                  className="player-lyrics-scroll"
                  style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    height: '380px',
                    overflowY: 'auto',
                    padding: '165px 12px',
                    scrollBehavior: 'smooth'
                  }}
                >
                  {SYNCED_LYRICS.map((line, idx) => {
                    const isActive = idx === currentLineIndex;
                    return (
                      <div
                        key={line.seconds}
                        ref={isActive ? activeLyricRef : null}
                        onClick={() => handleLyricClick(line.seconds)}
                        style={{
                          padding: '12px 18px',
                          borderRadius: '14px',
                          background: isActive ? 'rgba(212, 196, 168, 0.16)' : 'transparent',
                          border: isActive ? '1px solid rgba(212, 196, 168, 0.38)' : '1px solid transparent',
                          boxShadow: isActive ? '0 4px 18px rgba(0,0,0,0.35)' : 'none',
                          cursor: 'pointer',
                          transition: 'all 0.25s ease',
                          display: 'flex',
                          alignItems: 'baseline',
                          gap: '14px',
                          opacity: isActive ? 1 : 0.45
                        }}
                      >
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontFamily: 'var(--font-heading)',
                            color: isActive ? 'var(--color-gold)' : 'rgba(244, 241, 222, 0.35)',
                            minWidth: '42px',
                            fontWeight: 600
                          }}
                        >
                          {line.time}
                        </span>
                        <span
                          style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: isActive ? '1.14rem' : '0.95rem',
                            fontWeight: isActive ? 700 : 400,
                            color: isActive ? 'var(--color-ivory)' : 'rgba(244, 241, 222, 0.55)',
                            lineHeight: 1.35
                          }}
                        >
                          {line.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
                <div style={{ fontSize: '0.75rem', color: 'rgba(212, 196, 168, 0.6)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Autoplay Replenishment Active
                </div>
                {queueTracks.map((track, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      background: 'rgba(27, 38, 59, 0.4)',
                      border: '1px solid rgba(65, 90, 119, 0.2)'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--color-ivory)' }}>
                        {track.title}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'rgba(244, 241, 222, 0.6)' }}>
                        {track.artist}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className="pill-badge" style={{ fontSize: '0.62rem', padding: '2px 8px' }}>
                        {track.quality}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'rgba(244, 241, 222, 0.5)' }}>
                        {track.duration}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 960px) {
          .player-main-col {
            grid-column: span 7 !important;
          }
          .player-side-col {
            grid-column: span 5 !important;
          }
        }

        @media (max-width: 767px) {
          #experience {
            padding: 50px 16px !important;
          }
          #experience .glass-panel {
            padding: 20px 14px !important;
            gap: 20px !important;
            border-radius: 20px !important;
          }
          .player-main-vinyl {
            width: 175px !important;
            height: 175px !important;
            max-width: 175px !important;
            max-height: 175px !important;
            margin: 16px auto 14px auto !important;
          }
          .player-main-track-title {
            font-size: 1.35rem !important;
          }
          .player-main-controls {
            gap: 16px !important;
          }
          .player-main-controls button[aria-label="Play"],
          .player-main-controls button[aria-label="Pause"] {
            width: 50px !important;
            height: 50px !important;
          }
          .player-side-inner {
            padding: 16px 12px !important;
            min-height: auto !important;
          }
          .player-lyrics-scroll {
            height: 240px !important;
            padding: 24px 8px !important;
          }
        }
      `}</style>
    </section>
  );
}

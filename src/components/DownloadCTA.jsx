import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, CheckCircle2 } from 'lucide-react';
import GithubIcon from './GithubIcon';
import DownloadButton from './DownloadButton';

export default function DownloadCTA() {
  return (
    <section
      id="download"
      style={{
        position: 'relative',
        zIndex: 20,
        padding: '140px 24px 100px 24px',
        textAlign: 'center',
        maxWidth: '920px',
        margin: '0 auto'
      }}
    >
      {/* Background soft ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(212, 196, 168, 0.09) 0%, rgba(65, 90, 119, 0.05) 50%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Large Sielo Logo & Brand Name */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '28px'
          }}
        >
          <img
            src="/logo.png"
            alt="Sielo"
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '18px',
              objectFit: 'contain',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.7), 0 0 25px rgba(212, 196, 168, 0.15)'
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-brand)',
              fontSize: '2.5rem',
              color: 'var(--color-ivory)',
              letterSpacing: '0.04em',
              lineHeight: 1
            }}
          >
            Sielo
          </span>
        </motion.div>

        {/* Section Heading */}
        <h2
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            fontWeight: 700,
            textTransform: 'uppercase',
            lineHeight: 1.05,
            color: 'var(--color-ivory)',
            marginBottom: '16px'
          }}
        >
          YOUR MUSIC.
          <br />
          <span
            style={{
              background: 'linear-gradient(180deg, #FFFFFF 0%, #D4C4A8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            YOUR UNIVERSE.
          </span>
        </h2>

        <p
          style={{
            fontSize: '1.2rem',
            color: 'rgba(244, 241, 222, 0.75)',
            maxWidth: '540px',
            margin: '0 auto 36px auto'
          }}
        >
          Ready to experience music without compromises? Download Sielo for Android
          and elevate every listening session.
        </p>

        {/* Primary CTA Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            flexWrap: 'wrap',
            marginBottom: '40px'
          }}
        >
          <DownloadButton
            href="/Sielo-11.2.0.apk"
            download="Sielo-11.2.0.apk"
            variant="download-section"
            label="Download Sielo"
            subtitle="APK FOR ANDROID • V11.2.0"
          />

          <a
            href="https://github.com/VineetChudasama/Sielo"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary"
            style={{
              padding: '16px 32px',
              fontSize: '1.02rem',
              borderRadius: '999px',
              height: '56px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <GithubIcon size={19} />
            <span>View Source on GitHub</span>
          </a>
        </div>

        {/* Badges / Guarantees */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            flexWrap: 'wrap',
            fontSize: '0.85rem',
            color: 'rgba(244, 241, 222, 0.65)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={16} color="var(--color-gold)" />
            <span>Android 8.0 & Above</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={16} color="var(--color-gold)" />
            <span>100% Free & Open Source</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={16} color="var(--color-gold)" />
            <span>Zero Tracking or Commercial Ads</span>
          </div>
        </div>
      </div>
    </section>
  );
}

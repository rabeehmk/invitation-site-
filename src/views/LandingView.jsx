import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Sparkles, ArrowRight, ClipboardList, Camera, QrCode, Music, Globe, PartyPopper } from 'lucide-react';
import { useScroll } from 'framer-motion';
import AnimatedCouple from '../components/AnimatedCouple';
import { getSampleInvitationHash } from '../utils/helpers';
import { RELIGIONS, RELIGION_IDS } from '../config/religions';

const CYCLING_WORDS = ['Weddings', 'Nikah', 'Holy Matrimony', 'Receptions', 'Celebrations'];

const FEATURES = [
  { icon: Camera, label: 'Selfie with Couple' },
  { icon: QrCode, label: 'QR & WhatsApp Share' },
  { icon: Music, label: 'Ambient Music' },
  { icon: Globe, label: 'English · Hindi · Arabic' }
];

const STEPS = [
  { num: '01', title: 'Choose Tradition', desc: 'Hindu, Muslim, Christian, or custom — each with its own fields & templates.' },
  { num: '02', title: 'Customize & Fill', desc: 'Add names, dates, venue, photos, schedule, and RSVP details.' },
  { num: '03', title: 'Share on WhatsApp', desc: 'Publish instantly — guests tap the link and see your animated card.' }
];

export default function LandingView({ onNavigate }) {
  const sampleHash = useMemo(() => getSampleInvitationHash(), []);

  const [wordIdx, setWordIdx] = useState(0);
  const [fadeState, setFadeState] = useState('fade-in');
  const [particles, setParticles] = useState([]);
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const sceneRef = useRef(null);
  const landingHeroRef = useRef(null);

  const { scrollYProgress: pageScroll } = useScroll({
    target: landingHeroRef,
    offset: ['start start', 'end end']
  });

  useEffect(() => {
    const wordInterval = setInterval(() => {
      setFadeState('fade-out');
      setTimeout(() => {
        setWordIdx((prev) => (prev + 1) % CYCLING_WORDS.length);
        setFadeState('fade-in');
      }, 400);
    }, 2800);
    return () => clearInterval(wordInterval);
  }, []);

  useEffect(() => {
    setParticles(
      Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 8}s`,
        duration: `${6 + Math.random() * 12}s`,
        size: `${2 + Math.random() * 4}px`
      }))
    );
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(Math.min(window.scrollY, 600));
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseMove = (e) => {
    if (!sceneRef.current) return;
    const rect = sceneRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5
    });
  };

  const getCard3DStyle = () => {
    const baseRotY = -12 + scrollY * 0.06;
    const baseRotX = 10 - scrollY * 0.025;
    const mouseTiltX = isHovered ? mousePos.x * 18 : 0;
    const mouseTiltY = isHovered ? mousePos.y * -18 : 0;
    return {
      transform: `rotateX(${baseRotX + mouseTiltY}deg) rotateY(${baseRotY + mouseTiltX}deg) rotateZ(2deg)`
    };
  };

  const viewSampleCard = () => {
    window.location.hash = `#/i/${sampleHash}`;
  };

  return (
    <div className="landing-container">
      <div className="landing-orb landing-orb-1" />
      <div className="landing-orb landing-orb-2" />

      <div className="particles-bg">
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle landing-particle"
            style={{
              left: p.left,
              animationDelay: p.delay,
              animationDuration: p.duration,
              width: p.size,
              height: p.size
            }}
          />
        ))}
      </div>

      <div className="landing-glow" />

      <nav className="landing-nav">
        <div className="landing-logo landing-logo-shimmer">
          <Sparkles size={22} style={{ color: 'var(--studio-accent)' }} />
          AURA<span>INVITE</span>
        </div>
        <div className="landing-nav-actions">
          <button type="button" className="btn-nav-ghost" onClick={() => onNavigate('studio')}>
            Create Card
          </button>
          <button type="button" className="btn-nav-action" onClick={() => onNavigate('rsvps')}>
            <ClipboardList size={14} /> RSVP Dashboard
          </button>
        </div>
      </nav>

      <header className="landing-hero" ref={landingHeroRef}>
        <div className="landing-hero-content landing-hero-enter">
          <div className="landing-hero-tagline landing-tagline-glow">
            <span>✨ Kerala&apos;s Digital Invitation Studio</span>
          </div>

          <h1 className="landing-hero-title">
            Beautiful Invites
            <br />
            For Every{' '}
            <span className={`landing-cycling-word ${fadeState}`}>{CYCLING_WORDS[wordIdx]}</span>
          </h1>

          <p className="landing-hero-description">
            Hindu Muhurtham, Muslim Nikah, Christian Holy Matrimony — authentic templates,
            animated couple reveal, and one-tap WhatsApp sharing.
          </p>

          <div className="landing-feature-pills">
            {FEATURES.map(({ icon: Icon, label }) => (
              <span key={label} className="landing-pill">
                <Icon size={13} /> {label}
              </span>
            ))}
          </div>

          <div className="landing-cta-row">
            <button type="button" onClick={() => onNavigate('studio')} className="btn-cta-primary landing-cta-shine">
              Start Designing <ArrowRight size={16} />
            </button>
            <button type="button" onClick={viewSampleCard} className="btn-cta-secondary landing-cta-outline-glow">
              View Sample Card
            </button>
          </div>
        </div>

        <div
          className="landing-hero-mockups landing-mockup-enter"
          ref={sceneRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => { setIsHovered(false); setMousePos({ x: 0, y: 0 }); }}
        >
          <div className="card-3d-scene">
            <div className="card-3d-ring" aria-hidden="true" />
            <div className="card-3d-container" style={getCard3DStyle()}>
              <div className="card-3d-shadow" style={{ opacity: isHovered ? 0.85 : 0.55 }} />
              <div className="card-3d-sheet">
                <div className="card-3d-gold-leaves-top" />
                <div className="card-3d-diamond-frame card-3d-diamond-frame--animated">
                  <AnimatedCouple theme="dark-gold" heroMode scrollProgress={pageScroll} autoplay={false} />
                  <div className="card-3d-diamond-overlay" />
                </div>
                <div>
                  <h3 className="card-3d-names">Ananya & Arjun</h3>
                  <h2 className="card-3d-heading">Save<span>THE</span>Date</h2>
                  <p className="card-3d-date">Sunday, 20 September 2026</p>
                </div>
                <div className="card-3d-gold-leaves-bottom" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="landing-traditions">
        <h2 className="landing-section-title">Built for Kerala&apos;s Traditions</h2>
        <p className="landing-section-sub">
          Not one generic template reskinned — each community gets its own fields, motifs, and layouts.
        </p>
        <div className="landing-tradition-grid">
          {RELIGION_IDS.map((id) => {
            const r = RELIGIONS[id];
            return (
              <button
                key={id}
                type="button"
                className={`landing-tradition-card landing-tradition-card--${id}`}
                onClick={() => onNavigate(`studio?rel=${id}`)}
              >
                <span className="landing-tradition-icon">{r.icon}</span>
                <h3>{r.label}</h3>
                <p>{r.description}</p>
                <span className="landing-tradition-link">Create {r.label} invite →</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="landing-steps">
        <h2 className="landing-section-title">How It Works</h2>
        <div className="landing-steps-grid">
          {STEPS.map((step) => (
            <div key={step.num} className="landing-step-card">
              <span className="landing-step-num">{step.num}</span>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-cta-banner">
        <PartyPopper size={28} style={{ color: 'var(--studio-accent)' }} />
        <h2>Ready to impress your guests?</h2>
        <p>Free to design. Share in seconds. Works perfectly on mobile.</p>
        <button type="button" className="btn-cta-primary" onClick={() => onNavigate('studio')}>
          Create Your Invitation <ArrowRight size={16} />
        </button>
      </section>

      <footer className="landing-footer">
        <div className="landing-logo">
          <Sparkles size={16} style={{ color: 'var(--studio-accent)' }} />
          AURA<span>INVITE</span>
        </div>
        <p>Digital invitations for Kerala & India — Hindu · Muslim · Christian · Custom</p>
      </footer>
    </div>
  );
}

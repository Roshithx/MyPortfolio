import { useState, useEffect } from 'react';
import { usePortfolioStore } from '../store/usePortfolioStore';
import './HeroSection.css';

export default function HeroSection() {
  const profile = usePortfolioStore((s) => s.profile);
  const contact = usePortfolioStore((s) => s.contact);
  const [titleIdx, setTitleIdx] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);

  const titles = profile.titles && profile.titles.length > 0 ? profile.titles : ["DEVELOPER"];

  // Typing effect logic
  useEffect(() => {
    const currentFullText = titles[titleIdx];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing forward
        setText(currentFullText.substring(0, text.length + 1));
        
        // If reached the end of the word
        if (text === currentFullText) {
          setTimeout(() => setIsDeleting(true), 2500); // Pause before deleting
        }
      } else {
        // Deleting backward
        setText(currentFullText.substring(0, text.length - 1));
        
        // If entirely deleted
        if (text === "") {
          setIsDeleting(false);
          setTitleIdx((prev) => (prev + 1) % titles.length);
          
          // Trigger camera flash!
          setIsFlashing(true);
          setTimeout(() => setIsFlashing(false), 300); // Super fast flash duration
        }
      }
    }, isDeleting ? 40 : 100); // Delete faster than typing

    return () => clearTimeout(timeout);
  }, [text, isDeleting, titleIdx, titles]);

  return (
    <section id="hero" className="hero-section">
      {/* Top Black Section */}
      <div className="hero-top-section">
        <div className="hero-container">
          {/* Big Title */}
          <h1 className={`hero-title ${titles[titleIdx]?.length > 15 ? 'hero-title-long' : ''}`}>
            <span className="title-word">{text}</span>
            <span className="typing-cursor">|</span>
          </h1>

          {/* Intro Columns and CTA */}
          <div className="hero-intro-row">
            <p className="intro-col intro-col-1">
              {profile.heroIntro || "AI Engineer specializing in building intelligent systems."}
            </p>
            <p className="intro-col intro-col-2">
               {/* Left empty to match the 2-column look if he didn't provide second column text, 
                   but wait, in his CSS he might want 2 columns. Let's split his text or leave the
                   second column empty. Let's split the text over two columns like the design. */}
            </p>
            <div className="intro-cta">
              <div className="hero-cta-wrapper">
                <a href="#contact" className="hero-cta-button">
                  GET IN TOUCH &rarr;
                </a>
                <div className="hero-socials">
                  <a href={contact.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                  </a>
                  <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                  </a>
                  <a href={`mailto:${contact.email}`} aria-label="Email">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid Shape Section */}
      <div className="hero-bottom-section">
        <div className="hero-grid-shape">
          {/* Grid lines inside the shape */}
          <div className="grid-lines"></div>

          {/* Person Image */}
          <div className="hero-img-container">
            <div className="hero-img-wrapper">
              <img src="/me.png" alt="Roshith P" className="hero-person-img" />
              {/* The actual intense camera flash orb positioned right over the phone lenses */}
              <div className={`phone-camera-flash ${isFlashing ? 'flashing' : ''}`}></div>
            </div>
          </div>

          {/* BADGES */}
          
          {/* Badge 1: MLOps STRATEGY — teal circle, upper-left */}
          <div className="badge badge-1 badge-circle">
            <span className="badge-content badge-teal">
              <div className="badge-icon-top">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Z"/>
                  <path d="M7 12a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z"/>
                </svg>
              </div>
              <strong className="badge-title">MLOps<br/>STRATEGY</strong>
              <span className="badge-sub">Optimizing<br/>deployment of<br/>models</span>
            </span>
          </div>

          {/* Badge 2: COMPUTER. VISION. EXPERIENCES — yellow, left side */}
          <div className="badge badge-2 badge-rect">
            <span className="badge-content badge-yellow">
              <strong>COMPUTER. VISION.<br/>⊙ EXPERIENCES ✱</strong>
            </span>
          </div>

          {/* Badge 3: NEURAL NET & ARCHITECTURE DESIGN — orange, bottom-left */}
          <div className="badge badge-3 badge-rect">
            <span className="badge-content badge-orange">
              <strong>NEURAL NET &<br/>ARCHITECTURE<br/>&rarr; DESIGN</strong>
            </span>
          </div>

          {/* Badge 4: DATA SCIENCE PRACTICES — pink, mid right */}
          <div className="badge badge-4 badge-rect">
            <span className="badge-content badge-pink">
              <strong>DATA<br/>SCIENCE<br/>PRACTICES &copy;</strong>
            </span>
          </div>

          {/* Badge 5: LLM & GEN AI DEVELOP — cyan, far right */}
          <div className="badge badge-5 badge-rect">
            <span className="badge-content badge-cyan">
              <strong>LLM &amp; GEN AI<br/>&rarr; DEVELOP ✱</strong>
            </span>
          </div>

          {/* Badge 6: NLP & NLU ring — green circle with rotating text, bottom-right */}
          <div className="badge badge-6 badge-ring">
            <div className="badge-ring-inner">
              <svg viewBox="0 0 120 120" className="ring-text-svg">
                <defs>
                  <path id="ringPath" d="M 60,60 m -46,0 a 46,46 0 1,1 92,0 a 46,46 0 1,1 -92,0" />
                </defs>
                <text className="ring-text">
                  <textPath href="#ringPath" startOffset="0%">
                    ✦ NLP & NLU ✦ TESTING ✦ EXPERTISE ✦ NLP & NLU ✦ TESTING
                  </textPath>
                </text>
              </svg>
              <div className="ring-center-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2BBAA0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"></path>
                  <path d="M2 12h20"></path>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

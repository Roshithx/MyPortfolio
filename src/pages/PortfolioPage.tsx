import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import SkillsSection from '../components/SkillsSection';
import ExperienceSection from '../components/ExperienceSection';
import ProjectsSection from '../components/ProjectsSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import './PortfolioPage.css';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

import { usePortfolioStore } from '../store/usePortfolioStore';

export default function PortfolioPage() {
  const mainRef = useRef<HTMLDivElement>(null);
  const isLoading = usePortfolioStore(state => state.isLoading);

  useEffect(() => {
    if (isLoading) return;
    
    const ctx = gsap.context(() => {
      // Parallax on hero grid background
      gsap.to('.hero-grid-bg', {
        y: 150,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      // Fade in hero elements
      gsap.from('.hero-title', {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.2,
      });

      gsap.from('.hero-description', {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.5,
      });

      gsap.from('.hero-cta', {
        x: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.7,
      });

      gsap.from('.hero-oval', {
        scale: 0.85,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.4,
      });

      // Stagger skill badges
      gsap.from('.skill-badge', {
        scale: 0,
        opacity: 0,
        duration: 0.6,
        ease: 'back.out(1.7)',
        stagger: 0.1,
        delay: 0.8,
      });

      // Section animations with ScrollTrigger
      const sections = [
        '#about', '#skills', '#experience',
        '#projects', '#contact'
      ];

      sections.forEach((selector) => {
        gsap.from(`${selector} .section-title`, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: selector,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });

        gsap.from(`${selector} .section-heading`, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          delay: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: selector,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      });

      // Card animations
      gsap.utils.toArray<Element>('.glass-card').forEach((card) => {
        gsap.from(card, {
          y: 40,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        });
      });

      // Timeline dots
      gsap.utils.toArray<Element>('.timeline-dot').forEach((dot) => {
        gsap.from(dot, {
          scale: 0,
          duration: 0.5,
          ease: 'back.out(2)',
          scrollTrigger: {
            trigger: dot,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      });

      // Stat numbers
      gsap.from('.stat-number', {
        textContent: 0,
        duration: 2,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: '.about-stats',
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });

    }, mainRef);

    return () => ctx.revert();
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="portfolio-loading">
        <div className="loader"></div>
        <p>Loading Portfolio...</p>
      </div>
    );
  }

  return (
    <div ref={mainRef} className="portfolio-page">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
      <ProjectsSection />
      <ContactSection />
      <Footer />
    </div>
  );
}

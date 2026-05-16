import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

// Custom Hook for Scroll Reveal
function useScrollReveal(options = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }) {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target);
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.disconnect();
      }
    };
  }, [options]);

  return ref;
}

// Custom Hook & Component for CountUp Animation
function CountUp({ end, duration = 2000, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasStarted) {
        setHasStarted(true);
        let startTimestamp = null;
        const step = (timestamp) => {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          // easeOutExpo
          const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          setCount(Math.floor(easeProgress * end));
          if (progress < 1) {
            window.requestAnimationFrame(step);
          }
        };
        window.requestAnimationFrame(step);
        observer.disconnect();
      }
    }, { threshold: 0.5 });

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [end, duration, hasStarted]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

export default function About() {
  const heroRef = useScrollReveal();
  const statsRef = useScrollReveal();
  const cardsRef = useScrollReveal();
  const quoteRef = useScrollReveal();
  const valuesRef = useScrollReveal();

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="position-relative d-flex align-items-center justify-content-center text-center overflow-hidden" style={{ minHeight: '90vh', paddingTop: '80px' }}>
        <div className="about-hero-bg"></div>
        <div className="container px-4 reveal-hidden" ref={heroRef}>
          <h1 className="fw-bold mb-4 mx-auto" style={{ maxWidth: '800px', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1.1 }}>
            Where <em className="hero-accent">experiences</em> find their people.
          </h1>
          <p className="lead text-muted mx-auto mb-5" style={{ maxWidth: '600px', fontSize: '1.2rem' }}>
            The Social Klub is a platform designed to connect people through shared experiences. Whether you're here to discover something new or bring your own vision to life, we provide the tools to make it happen.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-5 my-md-5">
        <div className="container">
          <div className="row text-center g-4 reveal-hidden" ref={statsRef}>
            <div className="col-4">
              <h2 className="display-4 fw-bold text-primary mb-2">
                <CountUp end={50} suffix="+" />
              </h2>
              <p className="text-muted fw-medium text-uppercase tracking-wide small mb-0">Events Hosted</p>
            </div>
            <div className="col-4">
              <h2 className="display-4 fw-bold text-primary mb-2">
                <CountUp end={10} suffix="K+" />
              </h2>
              <p className="text-muted fw-medium text-uppercase tracking-wide small mb-0">Members</p>
            </div>
            <div className="col-4">
              <h2 className="display-4 fw-bold text-primary mb-2">
                <CountUp end={5} suffix="+" />
              </h2>
              <p className="text-muted fw-medium text-uppercase tracking-wide small mb-0">Cities</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Card Section */}
      <section className="py-5 my-md-5">
        <div className="container px-4">
          <div className="text-center mb-5 reveal-hidden" ref={cardsRef}>
            <h2 className="fw-bold mb-3">Every member is both an attendee and a host.</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>Experience everything the Klub has to offer by taking part in existing passions or sharing your own with the community.</p>
          </div>
          
          <div className="row g-4 justify-content-center">
            {/* Attend Card */}
            <div className="col-md-6 col-lg-5 reveal-hidden delay-100" ref={useScrollReveal()}>
              <div className="glass-card p-5 h-100 d-flex flex-column text-center align-items-center">
                <div className="bg-dark rounded-circle d-flex align-items-center justify-content-center mb-4" style={{ width: '64px', height: '64px', border: '1px solid rgba(212, 169, 106, 0.2)' }}>
                  <i className="bi bi-compass fs-3 text-primary"></i>
                </div>
                <h3 className="fw-bold mb-3">Attend Events</h3>
                <p className="text-muted mb-4 flex-grow-1">Discover a curated list of events around you. Easily browse what's trending, RSVP to save your spot, and manage your upcoming schedule all in one place.</p>
                <Link to="/discovery" className="btn btn-outline-primary rounded-pill px-5 py-2 fw-semibold">
                  Start Discovering
                </Link>
              </div>
            </div>

            {/* Host Card */}
            <div className="col-md-6 col-lg-5 reveal-hidden delay-200" ref={useScrollReveal()}>
              <div className="glass-card p-5 h-100 d-flex flex-column text-center align-items-center">
                <div className="bg-dark rounded-circle d-flex align-items-center justify-content-center mb-4" style={{ width: '64px', height: '64px', border: '1px solid rgba(212, 169, 106, 0.2)' }}>
                  <i className="bi bi-stars fs-3 text-primary"></i>
                </div>
                <h3 className="fw-bold mb-3">Host Events</h3>
                <p className="text-muted mb-4 flex-grow-1">Bring your vision to life. Create custom events, manage access, keep track of your attendees, and build your own sub-community within the Klub.</p>
                <Link to="/home" className="btn btn-primary rounded-pill px-5 py-2 fw-semibold text-dark">
                  Become a Host
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-5 my-md-5 bg-dark position-relative" style={{ borderTop: '1px solid rgba(212, 169, 106, 0.1)', borderBottom: '1px solid rgba(212, 169, 106, 0.1)' }}>
        <div className="container py-5 text-center px-4 reveal-hidden" ref={quoteRef}>
          <p className="about-quote-text">
            "The best nights aren't stumbled into — they're curated, shared, and remembered."
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-5 my-md-5 mb-5 pb-5">
        <div className="container px-4 reveal-hidden" ref={valuesRef}>
          <h2 className="fw-bold mb-5 pb-2 text-center text-md-start">Built on three things.</h2>
          <div className="row g-4">
            <div className="col-md-4 value-col reveal-hidden delay-100" ref={useScrollReveal()}>
              <h6 className="text-primary fw-bold mb-3">01</h6>
              <h4 className="fw-bold mb-3">Genuine connection</h4>
              <p className="text-muted">We prioritize quality over quantity. Every event is an opportunity to meet real people and forge relationships that extend beyond a single evening.</p>
            </div>
            <div className="col-md-4 value-col reveal-hidden delay-200" ref={useScrollReveal()}>
              <h6 className="text-primary fw-bold mb-3">02</h6>
              <h4 className="fw-bold mb-3">No barriers to hosting</h4>
              <p className="text-muted">You don't need to be a professional promoter to throw a great event. We provide the platform so you can focus on the experience, not the logistics.</p>
            </div>
            <div className="col-md-4 value-col reveal-hidden delay-300" ref={useScrollReveal()}>
              <h6 className="text-primary fw-bold mb-3">03</h6>
              <h4 className="fw-bold mb-3">Discovery first</h4>
              <p className="text-muted">Our algorithms exist to help you step out of your comfort zone and try new things, rather than keeping you in an echo chamber.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

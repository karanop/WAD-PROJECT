import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const CAROUSEL_INTERVAL_MS = 4500;
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&h=900&fit=crop';
const OVERLAY_GRADIENT = 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6))';

const SLIDES = [
  {
    src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&h=900&fit=crop',
    caption: 'Where Your Community Comes Alive',
    description: 'Engaging networking sessions and vibrant community meetups.',
  },
  {
    src: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=1600&h=900&fit=crop',
    caption: 'Events Made for Real Connections',
    description: 'Unforgettable moments shared with friends and loved ones.',
  },
  {
    src: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1600&h=900&fit=crop',
    caption: 'Find Your People. Join The Klub.',
    description: 'Immersive live entertainment and bustling social venues.',
  },
  {
    src: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1600&h=900&fit=crop',
    caption: 'Discover Events Happening Near You',
    description: 'Uncover local culinary experiences, dining, and nightlife.',
  },
  {
    src: 'https://images.unsplash.com/photo-1496337589254-7e19d01cec44?w=1600&h=900&fit=crop',
    caption: 'Every Gathering Starts With One Click',
    description: 'Exciting festivals and large-scale social events await.',
  },
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, CAROUSEL_INTERVAL_MS);
    return () => clearInterval(intervalRef.current);
  }, [paused]);

  const goTo = (i) => setIndex(i);
  const goPrev = () => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length);
  const goNext = () => setIndex((i) => (i + 1) % SLIDES.length);

  return (
    <section
      className="hero-carousel position-relative overflow-hidden"
      style={{ marginTop: '0', paddingTop: '0' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="position-relative d-flex align-items-center justify-content-center hero-carousel-inner"
        style={{ minHeight: '80vh', height: '80vh' }}
      >
        {/* Background Images Layer */}
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{
              opacity: i === index ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
              zIndex: 0,
            }}
          >
            <img
              src={slide.src}
              alt="Hero Background"
              className="w-100 h-100"
              style={{
                objectFit: 'cover',
                objectPosition: 'center top',
              }}
              loading={i === 0 ? 'eager' : 'lazy'}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = FALLBACK_IMAGE;
              }}
            />
          </div>
        ))}

        {/* Global Dark Gradient Overlay for optimal readability */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: 'linear-gradient(to bottom, rgba(20,20,20,0.45) 0%, rgba(20,20,20,0.92) 100%)',
            zIndex: 1,
            pointerEvents: 'none'
          }}
        ></div>

        {/* Static Content Layer (Redesigned) */}
        <div 
          className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-center px-3 animate-fade-in-up" 
          style={{ zIndex: 2 }}
        >
          <div style={{ maxWidth: '850px', marginTop: '0' }}>
            <h1 className="fw-bolder mb-2 text-white text-shadow-hero" style={{ fontSize: 'clamp(2.2rem, 4vw, 2.8rem)', letterSpacing: '-1px' }}>
              Find Your People This Weekend
            </h1>
            <p className="lead text-white-50 mb-4 fw-medium mx-auto" style={{ maxWidth: '600px', fontSize: '1.15rem' }}>
              Discover events, meet people, and make your weekends count.
            </p>
            
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center align-items-center mb-4">
              <Link
                to="/discovery"
                className="btn btn-primary btn-lg rounded-pill px-4 py-2 fw-bold shadow-sm"
                style={{ minWidth: '220px' }}
              >
                Explore Events Near Me
              </Link>
              <Link
                to="/catalog"
                className="btn btn-outline-primary btn-lg rounded-pill px-4 py-2 fw-bold"
                style={{ minWidth: '220px' }}
              >
                Browse All Events
              </Link>
            </div>

            {/* Trust Indicator */}
            <div className="d-flex align-items-center justify-content-center gap-2 mt-2 opacity-100">
              <span className="fs-5">🔥</span>
              <small className="text-white fw-semibold tracking-wide" style={{ fontSize: '0.9rem' }}>
                10,000+ people joined events this month
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button
        type="button"
        className="position-absolute top-50 start-0 translate-middle-y btn btn-link text-white p-3 opacity-75 hover-opacity-100 d-none d-md-flex align-items-center justify-content-center"
        style={{ zIndex: 10, left: '8px' }}
        onClick={goPrev}
        aria-label="Previous slide"
      >
        <i className="bi bi-chevron-left fs-1"></i>
      </button>
      <button
        type="button"
        className="position-absolute top-50 end-0 translate-middle-y btn btn-link text-white p-3 opacity-75 hover-opacity-100 d-none d-md-flex align-items-center justify-content-center"
        style={{ zIndex: 10, right: '8px' }}
        onClick={goNext}
        aria-label="Next slide"
      >
        <i className="bi bi-chevron-right fs-1"></i>
      </button>

      {/* Dots */}
      <div
        className="position-absolute bottom-0 start-0 end-0 d-flex justify-content-center gap-2 pb-4"
        style={{ zIndex: 10 }}
      >
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            className="rounded-circle border-0 p-0"
            style={{
              width: '10px',
              height: '10px',
              backgroundColor: i === index ? 'white' : 'rgba(255,255,255,0.5)',
              transition: 'background-color 0.2s',
            }}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

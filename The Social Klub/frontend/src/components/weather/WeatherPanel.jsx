import React, { useState, useEffect, useContext } from 'react';
import { WeatherContext } from '../../context/WeatherContext';
import WeatherSearch from './WeatherSearch';
import WeatherList from './WeatherList';

const TRANSITION_MS = 320;

export default function WeatherPanel({ isOpen, onClose }) {
  const { cityCount, unit, toggleUnit, refreshAll, error, setError } = useContext(WeatherContext);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  // Animate open
  useEffect(() => {
    if (isOpen) {
      setClosing(false);
      const t = requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
      return () => cancelAnimationFrame(t);
    }
  }, [isOpen]);

  // Animate close
  const handleClose = () => {
    setVisible(false);
    setClosing(true);
    setTimeout(() => {
      onClose();
      setClosing(false);
    }, TRANSITION_MS);
  };

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  if (!isOpen && !closing) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="weather-backdrop"
        style={{ opacity: visible ? 1 : 0 }}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className="weather-drawer"
        style={{ transform: visible ? 'translateX(0)' : 'translateX(100%)' }}
        role="dialog"
        aria-label="Weather panel"
      >
        {/* Header */}
        <div className="weather-drawer-header">
          <div className="weather-drawer-title-row">
            <div>
              <h5 className="weather-drawer-title">Weather</h5>
              <span className="weather-drawer-subtitle">
                {cityCount} {cityCount === 1 ? 'city' : 'cities'} saved
              </span>
            </div>
            <div className="weather-header-actions">
              {/* Unit toggle */}
              <button
                id="weather-unit-toggle"
                type="button"
                className="weather-unit-btn"
                onClick={toggleUnit}
                aria-label="Toggle temperature unit"
                title={unit === 'metric' ? 'Switch to °F' : 'Switch to °C'}
              >
                {unit === 'metric' ? '°C' : '°F'}
              </button>
              {/* Refresh */}
              <button
                id="weather-refresh-btn"
                type="button"
                className="weather-refresh-btn"
                onClick={refreshAll}
                aria-label="Refresh weather"
                title="Refresh all"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10" />
                  <polyline points="1 20 1 14 7 14" />
                  <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
                </svg>
              </button>
              {/* Close */}
              <button
                id="weather-close-btn"
                type="button"
                className="weather-close-btn"
                onClick={handleClose}
                aria-label="Close weather panel"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="weather-error-banner">
            <span>{error}</span>
            <button type="button" onClick={() => setError(null)} aria-label="Dismiss error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}

        {/* Search */}
        <div className="weather-drawer-search-section">
          <WeatherSearch />
        </div>

        {/* List */}
        <div className="weather-drawer-list-section">
          <WeatherList />
        </div>
      </div>
    </>
  );
}

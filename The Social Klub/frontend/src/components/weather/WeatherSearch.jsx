import React, { useState, useContext } from 'react';
import { WeatherContext } from '../../context/WeatherContext';

export default function WeatherSearch() {
  const { addCity, loading } = useContext(WeatherContext);
  const [text, setText] = useState('');
  const [searching, setSearching] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || searching) return;
    setSearching(true);
    const success = await addCity(text);
    if (success) setText('');
    setSearching(false);
  };

  return (
    <form className="weather-search-row" onSubmit={handleSubmit}>
      <input
        id="weather-city-input"
        type="text"
        className="weather-search-field"
        placeholder="Search city, e.g. London..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        autoComplete="off"
      />
      <button
        id="weather-search-btn"
        type="submit"
        className="weather-search-btn"
        disabled={!text.trim() || searching}
        aria-label="Search city"
      >
        {searching ? (
          <svg className="weather-spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 11-6.219-8.56" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        )}
      </button>
    </form>
  );
}

import React, { useContext } from 'react';
import { WeatherContext } from '../../context/WeatherContext';
import WeatherCard from './WeatherCard';

export default function WeatherList() {
  const { cities } = useContext(WeatherContext);

  if (cities.length === 0) {
    return (
      <div className="weather-empty-state">
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.25 }}>
          <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
        </svg>
        <p>No cities added yet</p>
        <span>Search for a city above to see current weather</span>
      </div>
    );
  }

  return (
    <div className="weather-list">
      {cities.map((city) => (
        <WeatherCard key={city.id} city={city} />
      ))}
    </div>
  );
}

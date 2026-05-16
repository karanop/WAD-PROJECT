import React, { useContext } from 'react';
import { WeatherContext } from '../../context/WeatherContext';

function getWeatherIcon(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

function formatTime(timestamp, timezoneOffset) {
  const date = new Date((timestamp + timezoneOffset) * 1000);
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  });
}

export default function WeatherCard({ city }) {
  const { weatherData, removeCity, unit } = useContext(WeatherContext);
  const data = weatherData[city.id];

  if (!data) {
    return (
      <div className="weather-card weather-card--loading">
        <div className="weather-card-shimmer" />
      </div>
    );
  }

  const temp = Math.round(data.main?.temp ?? 0);
  const feelsLike = Math.round(data.main?.feels_like ?? 0);
  const description = data.weather?.[0]?.description || 'N/A';
  const icon = data.weather?.[0]?.icon || '01d';
  const humidity = data.main?.humidity ?? 0;
  const windSpeed = Math.round(data.wind?.speed ?? 0);
  const visibility = data.visibility ? (data.visibility / 1000).toFixed(1) : 'N/A';
  const sunrise = data.sys?.sunrise ? formatTime(data.sys.sunrise, data.timezone || 0) : '--';
  const sunset = data.sys?.sunset ? formatTime(data.sys.sunset, data.timezone || 0) : '--';
  const unitSymbol = unit === 'metric' ? '°C' : '°F';
  const windUnit = unit === 'metric' ? 'm/s' : 'mph';

  // Determine background gradient based on weather
  const weatherMain = (data.weather?.[0]?.main || '').toLowerCase();
  let cardGradient = 'linear-gradient(135deg, rgba(212, 169, 106, 0.08) 0%, rgba(31, 31, 31, 0.4) 100%)';
  if (weatherMain.includes('rain') || weatherMain.includes('drizzle')) {
    cardGradient = 'linear-gradient(135deg, rgba(100, 149, 237, 0.12) 0%, rgba(31, 31, 31, 0.4) 100%)';
  } else if (weatherMain.includes('snow')) {
    cardGradient = 'linear-gradient(135deg, rgba(200, 220, 240, 0.12) 0%, rgba(31, 31, 31, 0.4) 100%)';
  } else if (weatherMain.includes('cloud')) {
    cardGradient = 'linear-gradient(135deg, rgba(160, 160, 170, 0.1) 0%, rgba(31, 31, 31, 0.4) 100%)';
  } else if (weatherMain.includes('clear')) {
    cardGradient = 'linear-gradient(135deg, rgba(255, 200, 80, 0.1) 0%, rgba(31, 31, 31, 0.4) 100%)';
  } else if (weatherMain.includes('thunder')) {
    cardGradient = 'linear-gradient(135deg, rgba(140, 100, 200, 0.12) 0%, rgba(31, 31, 31, 0.4) 100%)';
  }

  return (
    <div className="weather-card" style={{ background: cardGradient }}>
      {/* Header row */}
      <div className="weather-card-header">
        <div className="weather-card-location">
          <h6 className="weather-card-city">{data.name}</h6>
          <span className="weather-card-country">{city.country}</span>
        </div>
        <button
          className="weather-card-remove"
          onClick={() => removeCity(city.id)}
          aria-label={`Remove ${data.name}`}
          type="button"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Main temperature row */}
      <div className="weather-card-main">
        <div className="weather-card-temp-group">
          <span className="weather-card-temp">{temp}{unitSymbol}</span>
          <span className="weather-card-feels">Feels like {feelsLike}{unitSymbol}</span>
        </div>
        <div className="weather-card-icon-wrap">
          <img
            src={getWeatherIcon(icon)}
            alt={description}
            className="weather-card-icon"
          />
        </div>
      </div>

      {/* Description */}
      <p className="weather-card-desc">{description}</p>

      {/* Details grid */}
      <div className="weather-card-details">
        <div className="weather-detail-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
          </svg>
          <span>{humidity}%</span>
        </div>
        <div className="weather-detail-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2" />
          </svg>
          <span>{windSpeed} {windUnit}</span>
        </div>
        <div className="weather-detail-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
          <span>{sunrise}</span>
        </div>
        <div className="weather-detail-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 18a5 5 0 00-10 0" />
            <line x1="12" y1="9" x2="12" y2="2" />
            <line x1="4.22" y1="10.22" x2="5.64" y2="11.64" />
            <line x1="1" y1="18" x2="3" y2="18" />
            <line x1="21" y1="18" x2="23" y2="18" />
            <line x1="18.36" y1="11.64" x2="19.78" y2="10.22" />
            <line x1="23" y1="22" x2="1" y2="22" />
          </svg>
          <span>{sunset}</span>
        </div>
      </div>
    </div>
  );
}

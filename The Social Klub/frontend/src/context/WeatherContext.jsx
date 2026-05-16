import { createContext, useState, useEffect, useCallback, useMemo } from 'react';

const WEATHER_STORAGE_KEY = 'social_klub_weather_cities';
const WEATHER_API_KEY = '4d8fb5b93d4af21d66a2948710284366'; // Free OpenWeatherMap key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const WeatherContext = createContext();

export function WeatherProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [weatherData, setWeatherData] = useState({}); // { cityId: data }
  const [loading, setLoading] = useState({});           // { cityId: boolean }
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('metric'); // 'metric' | 'imperial'

  // Load saved cities from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(WEATHER_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setCities(parsed);
      }
    } catch (e) {
      console.error('Failed to load weather cities from localStorage:', e);
    }
  }, []);

  // Persist cities to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(WEATHER_STORAGE_KEY, JSON.stringify(cities));
    } catch (e) {
      console.error('Failed to save weather cities to localStorage:', e);
    }
  }, [cities]);

  // Fetch weather for a city name
  const fetchWeather = useCallback(async (cityName) => {
    const key = cityName.toLowerCase().trim();
    setLoading((prev) => ({ ...prev, [key]: true }));
    setError(null);

    try {
      const res = await fetch(
        `${BASE_URL}/weather?q=${encodeURIComponent(cityName)}&units=${unit}&appid=${WEATHER_API_KEY}`
      );
      if (!res.ok) {
        if (res.status === 404) throw new Error('City not found');
        throw new Error('Weather service unavailable');
      }
      const data = await res.json();
      setWeatherData((prev) => ({ ...prev, [data.id]: data }));
      setLoading((prev) => ({ ...prev, [key]: false }));
      return data;
    } catch (err) {
      setError(err.message);
      setLoading((prev) => ({ ...prev, [key]: false }));
      return null;
    }
  }, [unit]);

  // Add a city
  const addCity = useCallback(async (cityName) => {
    const trimmed = cityName.trim();
    if (!trimmed) return false;

    // Don't add duplicates
    const existing = cities.find(
      (c) => c.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (existing) {
      setError('City already added');
      return false;
    }

    const data = await fetchWeather(trimmed);
    if (!data) return false;

    const newCity = {
      id: data.id,
      name: data.name,
      country: data.sys?.country || '',
      addedAt: Date.now(),
    };
    setCities((prev) => [newCity, ...prev]);
    setError(null);
    return true;
  }, [cities, fetchWeather]);

  // Remove a city
  const removeCity = useCallback((cityId) => {
    setCities((prev) => prev.filter((c) => c.id !== cityId));
    setWeatherData((prev) => {
      const next = { ...prev };
      delete next[cityId];
      return next;
    });
  }, []);

  // Refresh all saved cities
  const refreshAll = useCallback(async () => {
    if (cities.length === 0) return;

    const cityIds = cities.map((c) => c.id).join(',');
    try {
      // Use group endpoint for efficiency
      const res = await fetch(
        `${BASE_URL}/group?id=${cityIds}&units=${unit}&appid=${WEATHER_API_KEY}`
      );
      if (res.ok) {
        const data = await res.json();
        const newWeatherData = {};
        data.list.forEach((item) => {
          newWeatherData[item.id] = item;
        });
        setWeatherData((prev) => ({ ...prev, ...newWeatherData }));
      }
    } catch (err) {
      console.error('Failed to refresh weather data:', err);
    }
  }, [cities, unit]);

  // Refresh weather on mount and when cities/unit changes
  useEffect(() => {
    if (cities.length > 0) {
      refreshAll();
    }
  }, [cities.length, unit]); // eslint-disable-line react-hooks/exhaustive-deps

  // Toggle temperature units
  const toggleUnit = useCallback(() => {
    setUnit((prev) => (prev === 'metric' ? 'imperial' : 'metric'));
  }, []);

  const cityCount = useMemo(() => cities.length, [cities]);

  const value = {
    cities,
    weatherData,
    loading,
    error,
    setError,
    unit,
    toggleUnit,
    addCity,
    removeCity,
    refreshAll,
    cityCount,
    fetchWeather,
  };

  return (
    <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
  );
}

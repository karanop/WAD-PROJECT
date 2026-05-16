import React, { useState, useEffect } from 'react';
import EventCard from '../../components/LiveEventCard';
import { fetchPublicEvents } from '../../api/events';
import { eventsCatalog as fallbackEvents } from '../../data/content';

const Discovery = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const liveEvents = await fetchPublicEvents();
        setEvents(liveEvents);
      } catch (error) {
        console.error("Error fetching discovery events:", error);
        setEvents(fallbackEvents);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="discovery-container pb-5">
      <div className="text-center py-5 mb-3">
        <h1 className="fw-bold display-5 mb-3">Discover Local Events</h1>
        <p className="text-muted fs-5 mb-0">Explore our beautifully curated catalog.</p>
      </div>
      
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="masonry-grid px-3 px-md-5">
          {events.map((event, index) => (
            <EventCard key={event.id} event={event} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Discovery;

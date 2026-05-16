import React, { useState, useEffect } from 'react';
import EventCard from '../../components/LiveEventCard';
import { fetchPublicEvents } from '../../api/events';
import { eventsCatalog as fallbackEvents } from '../../data/content';

function Catalog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [eventsCatalog, setEventsCatalog] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const liveEvents = await fetchPublicEvents();
        setEventsCatalog(liveEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEventsCatalog(fallbackEvents);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = eventsCatalog.filter(event => 
    (event.title && event.title.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (event.category && event.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (event.location && event.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mt-5 pt-5 mb-5 pb-5">
      <div className="text-center mb-5">
        <h2 className="display-5 fw-bold mb-3" style={{letterSpacing: '-1px'}}>Full Event Catalog</h2>
        <p className="lead text-secondary">Browse {eventsCatalog.length} available events across our network.</p>
        
        <div className="mx-auto mt-4 w-100" style={{maxWidth: '600px'}}>
          <div className="input-group input-group-lg shadow-sm rounded-pill overflow-hidden">
            <span className="input-group-text bg-white border-0 ps-4">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input 
              type="text" 
              className="form-control border-0 ps-2 fs-6 shadow-none" 
              placeholder="Search by title or category..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row g-4 row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 masonry-grid-none">
          {filteredEvents.map((event, index) => (
            <div key={event.id} className="col">
              <EventCard event={event} index={index} layout="grid" />
            </div>
          ))}
        </div>
      )}
      
      {!loading && filteredEvents.length === 0 && (
        <div className="text-center text-muted py-5 my-5">
          <i className="bi bi-search fs-1 mb-3 d-block"></i>
          <h5>No events found matching your search.</h5>
        </div>
      )}
    </div>
  );
}

export default Catalog;

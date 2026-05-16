import React from 'react';
import { Link } from 'react-router-dom';
import { eventsCatalog } from '../../data/content';

function SiteMap() {
  return (
    <div className="container mt-5 pt-5 mb-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold" style={{ fontSize: '3rem', letterSpacing: '-1.5px' }}>Site Map / All Categories</h1>
        <p className="lead text-secondary mt-3">Browse all event pages in our catalog.</p>
      </div>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {eventsCatalog.map((event) => (
          <div key={event.id} className="col">
            <Link 
              to={`/event/${event.id}`} 
              className="text-decoration-none text-dark d-block h-100"
            >
              <div 
                className="p-4 border border-light bg-light rounded-4 h-100 d-flex flex-column align-items-start transition shadow-sm hover-shadow"
                style={{ transition: 'all 0.3s ease' }}
              >
                <span className="badge bg-secondary mb-3 rounded-pill px-3 py-2 fw-medium">{event.category}</span>
                <h5 className="fw-bold fs-5 mb-2">{event.title}</h5>
                <p className="text-muted small mb-0 flex-grow-1">View details for event #{event.id}</p>
                <div className="mt-4 text-primary fw-semibold small d-flex align-items-center">
                  Explore Event <i className="bi bi-arrow-right ms-2"></i>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SiteMap;

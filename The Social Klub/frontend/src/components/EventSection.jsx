import React from 'react';
import EventCard from './LiveEventCard';

const EventSection = ({ title, subtitle, events, layout = 'carousel', extraHeaderChild }) => {
  if (!events || events.length === 0) return null;

  return (
    <section className="py-5 bg-white event-section border-bottom position-relative">
      <div className="container">
        {extraHeaderChild}
        <div className="d-flex flex-column mb-4">
          <h2 className="fw-bold mb-1">{title}</h2>
          {subtitle && <p className="text-secondary fs-5">{subtitle}</p>}
        </div>

        {layout === 'carousel' ? (
          <div className="horizontal-carousel d-flex gap-4 pb-3 hide-scrollbar">
            {events.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} layout="carousel" />
            ))}
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4 pb-3">
            {events.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} layout="grid" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default EventSection;

import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { ToastContext } from './Toast';
import { getEventImageUrl, getCategoryImageUrl, DEFAULT_EVENT_IMAGE } from '../utils/eventImage';
import { formatEventDate, formatEventTime, getEventSnippet, normalizeEvent } from '../api/events';

const LiveEventCard = ({ event, index, layout = 'masonry' }) => {
  const { addItem, isInCart } = useContext(CartContext);
  const { show: showToast } = useContext(ToastContext);
  const normalizedEvent = normalizeEvent(event);
  const [imageLoaded, setImageLoaded] = useState(false);

  const heights = [280, 340, 400, 260, 380];
  const cardHeight = layout === 'masonry' ? heights[index % heights.length] : 280;
  const imageSrc = getEventImageUrl(normalizedEvent, 400, cardHeight);
  const fallbackSrc = getCategoryImageUrl(normalizedEvent.category, 400, cardHeight);
  const inCart = isInCart(normalizedEvent.id);

  const wrapperClass = layout === 'carousel'
    ? 'carousel-card-wrapper flex-shrink-0'
    : layout === 'grid'
      ? 'col'
      : 'masonry-item mb-4';

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const added = addItem({
      id: normalizedEvent.id,
      title: normalizedEvent.title,
      image: normalizedEvent.image,
      location: normalizedEvent.location,
      date: normalizedEvent.date,
      time: normalizedEvent.time,
      price: normalizedEvent.price,
    });

    if (!added) {
      showToast('Already in cart', 'info');
    }
  };

  return (
    <div className={wrapperClass} style={layout === 'carousel' ? { width: '320px', scrollSnapAlign: 'start' } : {}}>
      <div className="card event-card border-0 h-100 overflow-hidden">
        <Link to={`/event/${normalizedEvent.id}`} className="text-decoration-none text-dark d-block h-100 d-flex flex-column">
          <div className="card-img-top event-img position-relative overflow-hidden flex-shrink-0" style={{ height: `${cardHeight}px` }}>
            {!imageLoaded && (
              <div className="position-absolute top-0 start-0 end-0 bottom-0 skeleton" style={{ zIndex: 0 }} aria-hidden="true" />
            )}
            <img
              src={imageSrc}
              alt={normalizedEvent.title || 'Event'}
              loading="lazy"
              className="w-100 h-100 position-relative"
              style={{ objectFit: 'cover', opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.3s ease', zIndex: 1 }}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = fallbackSrc || DEFAULT_EVENT_IMAGE;
              }}
            />
            <div className="img-overlay d-flex flex-column justify-content-between p-3 text-white w-100 h-100" style={{ zIndex: 2 }}>
              <div className="d-flex justify-content-between align-items-start gap-2">
                <span className="event-card-chip">{normalizedEvent.category || 'Featured'}</span>
                <span className="event-card-price">{normalizedEvent.price > 0 ? `$${normalizedEvent.price}` : 'Free'}</span>
              </div>
              <div>
                <h5 className="fw-bold mb-2 text-white lh-sm">{normalizedEvent.title}</h5>
                <div className="event-card-meta">
                  <span><i className="bi bi-calendar-event me-2"></i>{formatEventDate(normalizedEvent.date)}</span>
                  <span><i className="bi bi-clock me-2"></i>{formatEventTime(normalizedEvent.time)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card-body p-4 flex-grow-1 d-flex flex-column justify-content-between">
            <div>
              <p className="card-text text-muted small mb-2 fw-medium event-card-location">
                <i className="bi bi-geo-alt-fill text-primary me-2"></i>
                {normalizedEvent.location}
              </p>
              <p className="event-card-description mb-0">{getEventSnippet(normalizedEvent.description)}</p>
            </div>
            <div className="d-flex justify-content-between align-items-center mt-4">
              <span className="event-card-footer">
                {normalizedEvent.slots_available > 0 ? `${normalizedEvent.slots_available} spots left` : 'Join the waitlist'}
              </span>
              <span className="event-card-arrow"><i className="bi bi-arrow-up-right"></i></span>
            </div>
          </div>
        </Link>

        <div className="card-hover-action">
          {inCart ? (
            <span className="badge bg-success rounded-pill px-3 py-2">Added</span>
          ) : (
            <button type="button" className="btn btn-primary rounded-pill shadow-sm px-4 py-2 fw-semibold" onClick={handleAddToCart}>
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveEventCard;

import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { ToastContext } from './Toast';
import { getEventImageUrl, getCategoryImageUrl, DEFAULT_EVENT_IMAGE } from '../utils/eventImage';

const EventCard = ({ event, index, layout = 'masonry' }) => {
  const { addItem, removeItem, isInCart } = useContext(CartContext);
  const { show: showToast } = useContext(ToastContext);

  const heights = [280, 340, 400, 260, 380];
  // fixed height for carousel/grid to maintain alignment
  const cardHeight = layout === 'masonry' ? heights[index % heights.length] : 280;
  const imageSrc = getEventImageUrl(event, 400, cardHeight);
  const fallbackSrc = getCategoryImageUrl(event?.category, 400, cardHeight);
  const inCart = isInCart(event.id);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const item = {
      id: event.id,
      title: event.title,
      image: event.image || imageSrc || fallbackSrc,
      location: event.location || 'Various locations',
      date: event.date || 'TBD',
      time: event.time || 'TBD',
      price: event.price ?? 'Free',
    };
    const added = addItem(item);
    if (!added) showToast('Already in cart', 'info');
  };

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    removeItem(event.id);
  };

  // Wrapper class adjusts based on layout type
  const wrapperClass = layout === 'carousel' 
    ? "carousel-card-wrapper flex-shrink-0" 
    : layout === 'grid' 
      ? "col" 
      : "masonry-item mb-4";

  return (
    <div className={wrapperClass} style={layout === 'carousel' ? { width: '300px', scrollSnapAlign: 'start' } : {}}>
      <div className="card event-card border-0 h-100 overflow-hidden" style={{ borderRadius: '16px', transition: 'transform 0.3s ease, box-shadow 0.3s ease', boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}>
        <Link to={`/event/${event.id}`} className="text-decoration-none text-dark d-block h-100 d-flex flex-column">
          <div
            className="card-img-top event-img position-relative overflow-hidden flex-shrink-0"
            style={{ height: `${cardHeight}px`, borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}
          >
            {!imageLoaded && (
              <div
                className="position-absolute top-0 start-0 end-0 bottom-0 skeleton"
                style={{ zIndex: 0 }}
                aria-hidden="true"
              />
            )}
            <img
              src={imageSrc}
              alt={event.title || 'Event'}
              loading="lazy"
              className="w-100 h-100 position-relative"
              style={{ objectFit: 'cover', opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.3s ease', zIndex: 1 }}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = fallbackSrc || DEFAULT_EVENT_IMAGE;
              }}
            />
            <div 
              className="img-overlay d-flex flex-column justify-content-end p-3 text-white w-100 h-100"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0) 100%)', zIndex: 2 }}
            >
              <h5 className="fw-bold mb-1 text-shadow text-white lh-sm" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                {event.title}
              </h5>
              {event.slots != null && (
                <span className="badge bg-light text-dark align-self-start mt-2 rounded-pill fw-semibold shadow-sm px-3 py-2">
                  {event.slots} slots left
                </span>
              )}
            </div>
          </div>
          <div className="card-body p-4 pt-3 flex-grow-1 d-flex flex-column justify-content-between">
            <p className="card-text text-muted small mb-0 fw-medium">
              <i className="bi bi-geo-alt-fill text-primary me-1"></i>
              {event.location || 'Various locations'}
            </p>
            {/* Added short category tag mimicking Pinterest pin detail if not masonry */}
            {layout !== 'masonry' && event.category && (
              <p className="small text-secondary mt-2 mb-0 fw-bold text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.8px' }}>
                {event.category}
              </p>
            )}
          </div>
        </Link>

        <div className="card-hover-action" style={{ opacity: 0, position: 'absolute', bottom: '16px', right: '16px', transition: 'all 0.3s ease' }}>
          {inCart ? (
            <div className="d-flex flex-column gap-1 align-items-center">
              <span className="badge bg-success rounded-pill px-3 py-2">Added ✓</span>
            </div>
          ) : (
            <button
              type="button"
              className="btn btn-primary rounded-pill shadow-sm px-4 py-2 fw-semibold"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;

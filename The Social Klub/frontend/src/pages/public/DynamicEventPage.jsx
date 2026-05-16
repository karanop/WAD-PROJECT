import React, { useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { eventsCatalog } from '../../data/content';
import { CartContext } from '../../context/CartContext';
import { ToastContext } from '../../components/Toast';
import { getEventImageUrl, getCategoryImageUrl, DEFAULT_EVENT_IMAGE } from '../../utils/eventImage';

function DynamicEventPage() {
  const { id } = useParams();
  const event = eventsCatalog.find(e => e.id === parseInt(id));
  const { addItem, removeItem, isInCart } = useContext(CartContext);
  const { show: showToast } = useContext(ToastContext);

  if (!event) {
    return (
      <div className="container mt-5 pt-5 text-center">
        <h2 className="mb-4">Event Not Found</h2>
        <p className="text-muted mb-4">The event you are looking for does not exist.</p>
        <Link to="/home" className="btn btn-dark rounded-pill px-4">Back to Discovery</Link>
      </div>
    );
  }

  return (
    <div className="container mt-5 pt-4">
      <Link to="/home" className="text-decoration-none text-dark mb-4 d-inline-block fw-semibold">
        &larr; Back to Events
      </Link>
      
      <div className="row g-5 align-items-center">
        <div className="col-lg-6">
          <div className="position-relative" style={{ borderRadius: '24px', overflow: 'hidden' }}>
            <img
              src={getEventImageUrl(event, 800, 500)}
              alt={event.title}
              className="img-fluid w-100"
              style={{ objectFit: 'cover', height: '500px' }}
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = getCategoryImageUrl(event.category, 800, 500) || DEFAULT_EVENT_IMAGE;
              }}
            />
            <span className="position-absolute top-0 start-0 m-4 badge bg-white text-dark rounded-pill px-3 py-2 fw-bold shadow-sm">
              {event.category}
            </span>
          </div>
        </div>
        
        <div className="col-lg-6">
          <h1 className="fw-bold mb-3" style={{ fontSize: '3rem', letterSpacing: '-1px' }}>{event.title}</h1>
          
          <div className="d-flex align-items-center mb-4 text-muted">
            <i className="bi bi-calendar-event me-2"></i>
            <span className="me-4 fw-medium">Upcoming Event</span>
            <i className="bi bi-geo-alt me-2"></i>
            <span className="fw-medium">The Social Klub Venue</span>
          </div>
          
          <p className="lead text-secondary mb-5" style={{ lineHeight: '1.8' }}>
            {event.description}
          </p>

          {(() => {
            const inCart = isInCart(event.id);
            const cartItem = {
              id: event.id,
              title: event.title,
              image: getEventImageUrl(event),
              location: event.location || 'Various locations',
              date: event.date || 'TBD',
              time: event.time || 'TBD',
              price: event.price ?? 'Free',
            };
            return inCart ? (
              <div className="d-flex align-items-center gap-2 mb-3">
                <span className="badge bg-success rounded-pill px-3 py-2 fs-6">Added to cart ✓</span>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm rounded-pill"
                  onClick={() => removeItem(event.id)}
                >
                  Remove from cart
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="btn btn-dark rounded-pill px-5 py-3 fw-bold fs-6 shadow-sm mb-3"
                onClick={() => {
                  const added = addItem(cartItem);
                  if (!added) showToast('Already in cart', 'info');
                }}
              >
                Add to Cart
              </button>
            );
          })()}
          
          <div className="d-flex gap-3">
            <Link to="/checkout" className="btn btn-outline-dark rounded-pill px-5 py-3 fw-semibold">
              Proceed to Checkout
            </Link>
            <button className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px' }}>
              <i className="bi bi-heart fs-5"></i>
            </button>
            <button className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px' }}>
              <i className="bi bi-share fs-5"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DynamicEventPage;

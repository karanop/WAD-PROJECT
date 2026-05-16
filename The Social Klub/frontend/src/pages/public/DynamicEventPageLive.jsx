import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { ToastContext } from '../../components/Toast';
import { eventsCatalog as fallbackEvents } from '../../data/content';
import { fetchPublicEventById, formatEventDate, formatEventTime, normalizeEvent } from '../../api/events';
import { getEventImageUrl, getCategoryImageUrl, DEFAULT_EVENT_IMAGE } from '../../utils/eventImage';

function DynamicEventPageLive() {
  const { id } = useParams();
  const { addItem, removeItem, isInCart } = useContext(CartContext);
  const { show: showToast } = useContext(ToastContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadEvent = async () => {
      try {
        const liveEvent = await fetchPublicEventById(id);
        if (isMounted) {
          setEvent(liveEvent);
        }
      } catch (error) {
        console.error('Failed to fetch event detail:', error);
        const fallbackEvent = fallbackEvents.find((entry) => entry.id === Number(id));

        if (isMounted) {
          if (fallbackEvent) {
            setEvent(normalizeEvent(fallbackEvent));
          } else {
            setNotFound(true);
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadEvent();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="container mt-5 pt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (notFound || !event) {
    return (
      <div className="container mt-5 pt-5 text-center">
        <h2 className="mb-4">Event Not Found</h2>
        <p className="text-muted mb-4">The event you are looking for does not exist.</p>
        <Link to="/catalog" className="btn btn-dark rounded-pill px-4">Back to Catalog</Link>
      </div>
    );
  }

  const inCart = isInCart(event.id);
  const imageSrc = getEventImageUrl(event, 1200, 700);
  const fallbackSrc = getCategoryImageUrl(event.category, 1200, 700) || DEFAULT_EVENT_IMAGE;
  const cartItem = {
    id: event.id,
    title: event.title,
    image: event.image,
    location: event.location,
    date: event.date || 'TBD',
    time: event.time || 'TBD',
    price: event.price,
  };

  return (
    <div className="container mt-5 pt-4 pb-5">
      <Link to="/catalog" className="text-decoration-none text-dark mb-4 d-inline-flex align-items-center fw-semibold gap-2">
        <i className="bi bi-arrow-left"></i>
        Back to Events
      </Link>

      <div className="event-detail-shell">
        <div className="event-detail-image-wrap">
          <img
            src={imageSrc}
            alt={event.title}
            className="img-fluid w-100 event-detail-image"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = fallbackSrc;
            }}
          />
          <div className="event-detail-overlay">
            <span className="event-card-chip">{event.category || 'Featured event'}</span>
            <h1>{event.title}</h1>
            <p>{event.description}</p>
          </div>
        </div>

        <div className="event-detail-panel">
          <div className="event-detail-stat-grid">
            <div className="event-detail-stat">
              <span>Date</span>
              <strong>{formatEventDate(event.date)}</strong>
            </div>
            <div className="event-detail-stat">
              <span>Time</span>
              <strong>{formatEventTime(event.time)}</strong>
            </div>
            <div className="event-detail-stat">
              <span>Location</span>
              <strong>{event.location}</strong>
            </div>
            <div className="event-detail-stat">
              <span>Entry</span>
              <strong>{event.price > 0 ? `$${event.price}` : 'Free'}</strong>
            </div>
          </div>

          <div className="event-detail-copy">
            <h4>What to expect</h4>
            <p>{event.description}</p>
            <div className="event-detail-host">
              <span>Hosted by</span>
              <strong>{event.host_name || 'The Social Klub'}</strong>
            </div>
          </div>

          <div className="d-flex flex-column flex-sm-row gap-3">
            {inCart ? (
              <>
                <span className="badge bg-success rounded-pill px-4 py-3 fs-6 align-self-start">Added to cart</span>
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-pill px-4 py-3 fw-semibold"
                  onClick={() => removeItem(event.id)}
                >
                  Remove from cart
                </button>
              </>
            ) : (
              <button
                type="button"
                className="btn btn-dark rounded-pill px-5 py-3 fw-bold fs-6 shadow-sm"
                onClick={() => {
                  const added = addItem(cartItem);
                  if (!added) {
                    showToast('Already in cart', 'info');
                  }
                }}
              >
                Save Spot
              </button>
            )}
            <Link to="/checkout" className="btn btn-outline-dark rounded-pill px-5 py-3 fw-semibold">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DynamicEventPageLive;

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DEFAULT_EVENT_IMAGE } from '../../utils/eventImage';

function formatPrice(price) {
  if (price === 'Free' || price == null || price === '') return 'Free';
  const n = Number(price);
  return Number.isFinite(n) ? `$${n.toFixed(2)}` : 'Free';
}

export default function Confirmation() {
  const location = useLocation();
  const orderSummary = location.state?.orderSummary;

  if (!orderSummary) {
    return (
      <div className="container mt-5 pt-5 text-center">
        <h2 className="mb-3">Booking summary not found</h2>
        <p className="text-muted mb-4">You may have arrived here without completing a booking.</p>
        <Link to="/catalog" className="btn btn-dark rounded-pill px-4">
          Browse Events
        </Link>
      </div>
    );
  }

  const { items, total } = orderSummary;

  return (
    <div className="container mt-5 pt-5 mb-5 pb-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="text-center mb-5">
            <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 80, height: 80 }}>
              <i className="bi bi-check-lg text-success display-4"></i>
            </div>
            <h1 className="fw-bold mb-2">Booking confirmed</h1>
            <p className="lead text-muted">Thank you for your order. Here is your booking summary.</p>
          </div>

          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Events booked</h5>
              <ul className="list-unstyled mb-0">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="d-flex gap-3 align-items-center py-3 border-bottom"
                  >
                    <div
                      className="rounded-3 flex-shrink-0 bg-secondary"
                      style={{
                        width: 64,
                        height: 64,
                        backgroundImage: `url(${item.image || DEFAULT_EVENT_IMAGE})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                    <div className="flex-grow-1 min-w-0">
                      <h6 className="fw-semibold mb-0">{item.title}</h6>
                      <small className="text-muted">
                        {item.date} · {item.time} · {item.location}
                      </small>
                    </div>
                    <span className="fw-semibold flex-shrink-0">{formatPrice(item.price)}</span>
                  </li>
                ))}
              </ul>
              <div className="d-flex justify-content-between fw-bold fs-5 pt-4 mt-2">
                <span>Total</span>
                <span>{total === 0 ? 'Free' : `$${total.toFixed(2)}`}</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link to="/" className="btn btn-outline-dark rounded-pill px-4 me-2">
              Home
            </Link>
            <Link to="/catalog" className="btn btn-dark rounded-pill px-4">
              Browse more events
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

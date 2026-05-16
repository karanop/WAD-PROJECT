import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { DEFAULT_EVENT_IMAGE } from '../../utils/eventImage';

function parsePrice(price) {
  if (price === 'Free' || price == null || price === '') return 0;
  const n = Number(price);
  return Number.isFinite(n) ? n : 0;
}

function formatPrice(price) {
  const p = parsePrice(price);
  return p === 0 ? 'Free' : `$${p.toFixed(2)}`;
}

export default function Checkout() {
  const { cart, subtotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    paymentMethod: 'credit_card',
  });
  const [errors, setErrors] = useState({});

  const allFree = subtotal === 0;
  const paymentOptions = [
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'paypal', label: 'PayPal' },
    ...(allFree ? [{ value: 'free', label: 'Free' }] : []),
  ];

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Full name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      const orderSummary = {
        items: cart.map((i) => ({ ...i })),
        total: subtotal,
        fullName: form.fullName,
        email: form.email,
        paymentMethod: form.paymentMethod,
      };
      clearCart();
      navigate('/confirmation', { state: { orderSummary } });
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mt-5 pt-5 text-center">
        <h2 className="mb-3">Your cart is empty</h2>
        <p className="text-muted mb-4">Add events from the catalog to proceed to checkout.</p>
        <Link to="/catalog" className="btn btn-dark rounded-pill px-4">
          Browse Events
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-5 pt-5 mb-5 pb-5">
      <h1 className="fw-bold mb-4">Checkout</h1>

      <form onSubmit={handleSubmit} className="row">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Order details</h5>
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="d-flex gap-3 align-items-center py-3 border-bottom"
                >
                  <div
                    className="rounded-3 flex-shrink-0 bg-secondary"
                    style={{
                      width: 80,
                      height: 80,
                      backgroundImage: `url(${item.image || DEFAULT_EVENT_IMAGE})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <div className="flex-grow-1 min-w-0">
                    <h6 className="fw-semibold mb-1">{item.title}</h6>
                    <small className="text-muted d-block">
                      {item.date} · {item.time} · {item.location}
                    </small>
                    <span className="fw-semibold">{formatPrice(item.price)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Contact & payment</h5>
              <div className="mb-4">
                <label htmlFor="fullName" className="form-label fw-semibold">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className={`form-control rounded-3 ${errors.fullName ? 'is-invalid' : ''}`}
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                />
                {errors.fullName && (
                  <div className="invalid-feedback">{errors.fullName}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="form-label fw-semibold">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-control rounded-3 ${errors.email ? 'is-invalid' : ''}`}
                  value={form.email}
                  onChange={handleChange}
                  placeholder="jane@example.com"
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>
              <div>
                <label className="form-label fw-semibold">Payment method</label>
                <div className="d-flex flex-column gap-2">
                  {paymentOptions.map((opt) => (
                    <div key={opt.value} className="form-check">
                      <input
                        type="radio"
                        name="paymentMethod"
                        id={opt.value}
                        value={opt.value}
                        className="form-check-input"
                        checked={form.paymentMethod === opt.value}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor={opt.value}>
                        {opt.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 sticky-top">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Order summary</h5>
              <ul className="list-unstyled mb-4">
                {cart.map((item) => (
                  <li
                    key={item.id}
                    className="d-flex justify-content-between py-2 border-bottom small"
                  >
                    <span className="text-truncate me-2">{item.title}</span>
                    <span className="flex-shrink-0">{formatPrice(item.price)}</span>
                  </li>
                ))}
              </ul>
              <div className="d-flex justify-content-between fw-bold fs-5 pt-2">
                <span>Total</span>
                <span>{subtotal === 0 ? 'Free' : `$${subtotal.toFixed(2)}`}</span>
              </div>
              <button
                type="submit"
                className="btn btn-dark rounded-pill w-100 mt-4 py-3 fw-semibold"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Processing...
                  </>
                ) : (
                  'Confirm Booking'
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

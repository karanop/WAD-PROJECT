import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { DEFAULT_EVENT_IMAGE } from '../utils/eventImage';

function parsePrice(price) {
  if (price === 'Free' || price == null || price === '') return 0;
  const n = Number(price);
  return Number.isFinite(n) ? n : 0;
}

function formatPrice(price) {
  const p = parsePrice(price);
  return p === 0 ? 'Free' : `$${p.toFixed(2)}`;
}

const DRAWER_TRANSITION_MS = 300;

export default function CartDrawer({ isOpen, onClose, theme = 'light' }) {
  const { cart, removeItem, clearCart, subtotal } = useContext(CartContext);
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setClosing(false);
      const t = requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
      return () => cancelAnimationFrame(t);
    }
  }, [isOpen]);

  const handleClose = () => {
    setVisible(false);
    setClosing(true);
    setTimeout(() => {
      onClose();
      setClosing(false);
    }, DRAWER_TRANSITION_MS);
  };

  const handleProceedToCheckout = () => {
    handleClose();
    navigate('/checkout');
  };

  const handleClearCart = () => {
    clearCart();
  };

  if (!isOpen && !closing) return null;

  const isDark = theme === 'dark';

  return (
    <>
      <div
        className="position-fixed top-0 start-0 end-0 bottom-0 bg-dark bg-opacity-50"
        style={{
          zIndex: 1040,
          opacity: visible ? 1 : 0,
          transition: `opacity ${DRAWER_TRANSITION_MS}ms ease`,
        }}
        onClick={handleClose}
        aria-hidden="true"
      />
      <div
        className={`position-fixed top-0 end-0 bottom-0 shadow-lg overflow-auto ${isDark ? 'bg-dark text-light' : 'bg-white'}`}
        style={{
          width: 'min(100%, 380px)',
          zIndex: 1050,
          transform: visible ? 'translateX(0)' : 'translateX(100%)',
          transition: `transform ${DRAWER_TRANSITION_MS}ms ease`,
        }}
      >
        <div className="d-flex flex-column h-100">
          <div className="d-flex align-items-center justify-content-between border-bottom p-3">
            <h5 className="mb-0 fw-bold">Your Cart</h5>
            <button
              type="button"
              className="btn btn-link p-0 text-decoration-none"
              onClick={handleClose}
              aria-label="Close cart"
            >
              <i className="bi bi-x-lg fs-4"></i>
            </button>
          </div>

          <div className="flex-grow-1 overflow-auto p-3">
            {cart.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-cart3 display-4 text-muted"></i>
                <p className="mt-3 text-muted">Your cart is empty.</p>
                <Link
                  to="/catalog"
                  className="btn btn-dark rounded-pill px-4 mt-2"
                  onClick={handleClose}
                >
                  Browse Events
                </Link>
              </div>
            ) : (
              <>
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className={`d-flex gap-3 p-2 rounded-3 mb-2 ${isDark ? 'bg-secondary bg-opacity-25' : 'bg-light'}`}
                  >
                    <div
                      className="rounded-2 flex-shrink-0 bg-secondary"
                      style={{
                        width: 64,
                        height: 64,
                        backgroundImage: `url(${item.image || DEFAULT_EVENT_IMAGE})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                    <div className="flex-grow-1 min-w-0">
                      <h6 className="fw-semibold text-truncate mb-0">{item.title}</h6>
                      <small className="text-muted">{item.date}</small>
                      <div className="d-flex align-items-center justify-content-between mt-1">
                        <span className="fw-semibold small">{formatPrice(item.price)}</span>
                        <button
                          type="button"
                          className="btn btn-link btn-sm p-0 text-danger text-decoration-none"
                          onClick={() => removeItem(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-top p-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-semibold">Subtotal</span>
                <span className="fw-bold">
                  {subtotal === 0 ? 'Free' : `$${subtotal.toFixed(2)}`}
                </span>
              </div>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm w-100 mb-2"
                onClick={handleClearCart}
              >
                Clear Cart
              </button>
              <button
                type="button"
                className="btn btn-dark rounded-pill w-100 fw-semibold"
                onClick={handleProceedToCheckout}
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

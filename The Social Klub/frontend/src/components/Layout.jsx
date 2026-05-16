import React, { useContext, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { TodoContext } from '../context/TodoContext';
import { WeatherContext } from '../context/WeatherContext';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import TodoPanel from './todo/TodoPanel';
import WeatherPanel from './weather/WeatherPanel';

function Navigation({ onCartClick, onTodoClick, onWeatherClick }) {
  const { user, mode, openAuthModal } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const { activeCount } = useContext(TodoContext);
  const { cityCount } = useContext(WeatherContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMobileMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen(prev => !prev), []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark border-bottom fixed-top" style={{ backdropFilter: 'blur(12px)', backgroundColor: 'rgba(20, 20, 20, 0.85)' }}>
      <div className="container-fluid px-3 px-lg-4">
        <Link className="navbar-brand fw-bold fs-4 ms-1 ms-lg-2 text-white" style={{letterSpacing: '-0.5px'}} to="/" onClick={closeMobileMenu}>The Social Klub</Link>
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          onClick={toggleMenu}
          aria-controls="navbarNav"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            {/* Explore */}
            <li className="nav-item">
              <Link className="nav-link fw-semibold px-3" to="/" onClick={closeMobileMenu}>Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold px-3" to="/discovery" onClick={closeMobileMenu}>Discovery</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold px-3" to="/catalog" onClick={closeMobileMenu}>Catalog</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold px-3" to="/about" onClick={closeMobileMenu}>About</Link>
            </li>
            {/* Account */}
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold px-3" to="/my-events" onClick={closeMobileMenu}>
                    My Events
                  </Link>
                </li>
                <li className="nav-item ms-lg-2">
                  <Link className="d-flex align-items-center text-decoration-none" to="/profile" onClick={closeMobileMenu}>
                    <div className="bg-primary text-dark rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{width: '36px', height: '36px'}}>
                      {user.first_name?.charAt(0) || 'U'}
                    </div>
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item mt-2 mt-lg-0">
                  <button className="btn btn-outline-primary rounded-pill px-4 text-decoration-none" onClick={() => { openAuthModal('login'); closeMobileMenu(); }}>Login</button>
                </li>
                <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
                  <button className="btn btn-primary rounded-pill px-4" onClick={() => { openAuthModal('register'); closeMobileMenu(); }}>Join</button>
                </li>
              </>
            )}
            {/* Utility icons */}
            <li className="nav-item ms-lg-2 d-flex align-items-center mt-3 mt-lg-0">
              <div className="d-flex align-items-center gap-2">
                {/* Weather */}
                <button
                  id="weather-navbar-icon"
                  type="button"
                  className="btn btn-link position-relative p-0 px-2 text-decoration-none border-0 text-white"
                  onClick={() => { onWeatherClick(); closeMobileMenu(); }}
                  aria-label="Open weather"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle' }}>
                    <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
                  </svg>
                  {cityCount > 0 && (
                    <span className="weather-navbar-badge">
                      {cityCount}
                    </span>
                  )}
                </button>
                {/* Todo */}
                <button
                  id="todo-navbar-icon"
                  type="button"
                  className="btn btn-link position-relative p-0 px-2 text-decoration-none border-0 text-white"
                  onClick={() => { onTodoClick(); closeMobileMenu(); }}
                  aria-label="Open tasks"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle' }}>
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                  </svg>
                  {activeCount > 0 && (
                    <span className="todo-navbar-badge">
                      {activeCount}
                    </span>
                  )}
                </button>
                {/* Cart */}
                <button
                  type="button"
                  className="btn btn-link position-relative p-0 px-2 text-decoration-none border-0 text-white"
                  onClick={() => { onCartClick(); closeMobileMenu(); }}
                  aria-label="Open cart"
                >
                  <i className="bi bi-cart3 fs-5"></i>
                  {cartCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem' }}>
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default function Layout({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [todoOpen, setTodoOpen] = useState(false);
  const [weatherOpen, setWeatherOpen] = useState(false);

  return (
    <>
      <Navigation
        onCartClick={() => setDrawerOpen(true)}
        onTodoClick={() => setTodoOpen(true)}
        onWeatherClick={() => setWeatherOpen(true)}
      />
      <main className="main-content" style={{ marginTop: '-19px' }}>
        {children}
      </main>
      <Footer />
      <CartDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <TodoPanel isOpen={todoOpen} onClose={() => setTodoOpen(false)} />
      <WeatherPanel isOpen={weatherOpen} onClose={() => setWeatherOpen(false)} />
    </>
  );
}

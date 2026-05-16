/*
 * SITE ROUTE MAP
 * Public:     /, /home, /discovery, /catalog, /about, /event/:id, /sitemap, /checkout, /confirmation
 * Auth:       /login, /register
 * Protected:  /profile, /my-events
 */
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { TodoProvider } from './context/TodoContext';
import { WeatherProvider } from './context/WeatherContext';
import { ToastProvider } from './components/Toast';
import Home from './pages/public/Home';
import Discovery from './pages/public/Discovery';
import Catalog from './pages/public/Catalog';
import MyEvents from './pages/app/MyEventsV2';
import Profile from './pages/app/Profile';
import About from './pages/public/About';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DynamicEventPage from './pages/public/DynamicEventPageLive';
import SiteMap from './pages/public/SiteMap';
import Checkout from './pages/public/Checkout';
import Confirmation from './pages/public/Confirmation';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import AuthModal from './components/AuthModal';
import './index.css';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <div key={location.key} className="page-transition-wrap">
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/discovery" element={<Discovery />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/about" element={<About />} />
        <Route path="/event/:id" element={<DynamicEventPage />} />
        <Route path="/sitemap" element={<SiteMap />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/confirmation" element={<Confirmation />} />
        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Protected */}
        <Route path="/my-events" element={<PrivateRoute><MyEvents /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <TodoProvider>
          <WeatherProvider>
            <ToastProvider>
              <Router>
                <div className="app-container">
                  <Layout>
                    <AnimatedRoutes />
                    <AuthModal />
                  </Layout>
                </div>
              </Router>
            </ToastProvider>
          </WeatherProvider>
        </TodoProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer mt-auto py-5 bg-dark text-white text-center">
      <div className="container">
        <h5 className="mb-4 fw-bold pb-2 border-bottom border-light d-inline-block" style={{ width: 'fit-content' }}>
          Explore Our Catalog
        </h5>
        <div className="d-flex justify-content-center flex-column flex-sm-row gap-3">
          <Link to="/home" className="text-decoration-none text-light hover-opacity transition">
            Discovery
          </Link>
          <span className="text-muted d-none d-sm-inline">|</span>
          <Link to="/catalog" className="text-decoration-none text-light hover-opacity transition">
            Browse All events
          </Link>
          <span className="text-muted d-none d-sm-inline">|</span>
          <Link to="/sitemap" className="text-decoration-none text-info fw-bold hover-opacity transition">
            Site Map
          </Link>
        </div>
        <p className="mt-4 mb-0 text-muted small">
          &copy; {new Date().getFullYear()} The Social Klub. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;

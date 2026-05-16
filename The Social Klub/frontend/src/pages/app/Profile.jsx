import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

function Profile() {
  const { user, mode, toggleMode, logout } = useContext(AuthContext);

  return (
    <div className="container mt-5 pt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm border-0 rounded-4 p-4">
            <div className="d-flex align-items-center mb-4">
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '64px', height: '64px', fontSize: '24px'}}>
                {user.first_name?.charAt(0) || 'U'}
              </div>
              <div>
                <h3 className="mb-0">{user.first_name} {user.last_name}</h3>
                <p className="text-muted mb-0">{user.email}</p>
              </div>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-12 col-sm-6">
                <Link to="/my-events" className="text-decoration-none h-100 d-block">
                  <div className="card h-100 border-0 bg-light shadow-sm hover-scale rounded-3 p-4 text-center" style={{transition: 'transform 0.2s'}}>
                    <div className="fs-1 mb-2">🎉</div>
                    <h5 className="mb-0 text-dark fw-bold">Host an Event</h5>
                  </div>
                </Link>
              </div>
              <div className="col-12 col-sm-6">
                <Link to="/discovery" className="text-decoration-none h-100 d-block">
                  <div className="card h-100 border-0 bg-light shadow-sm hover-scale rounded-3 p-4 text-center" style={{transition: 'transform 0.2s'}}>
                    <div className="fs-1 mb-2">🔍</div>
                    <h5 className="mb-0 text-dark fw-bold">Browse Events</h5>
                  </div>
                </Link>
              </div>
            </div>

            <button className="btn btn-dark w-100 rounded-pill" onClick={logout}>
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

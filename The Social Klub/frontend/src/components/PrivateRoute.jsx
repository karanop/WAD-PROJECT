import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * Wraps protected route content. Redirects to /login with ?redirect=currentPath
 * when user is not authenticated, so they can be sent back after login.
 */
function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    const redirectPath = location.pathname + location.search;
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirectPath)}`} state={{ from: location }} replace />;
  }

  return children;
}

export default PrivateRoute;

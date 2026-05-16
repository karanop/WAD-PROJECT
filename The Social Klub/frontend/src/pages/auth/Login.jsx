import React, { useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, openAuthModal } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      const params = new URLSearchParams(location.search);
      const redirect = params.get('redirect') || '/catalog';
      navigate(redirect, { replace: true });
    } else {
      navigate('/', { replace: true });
      // Small timeout ensures the modal is opened AFTER route transition mounts App layout
      setTimeout(() => openAuthModal('login'), 100);
    }
  }, [user, navigate, location, openAuthModal]);

  return null;
}

export default Login;

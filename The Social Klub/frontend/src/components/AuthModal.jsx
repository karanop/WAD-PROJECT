import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';

function OAuthButtons() {
  return (
    <div className="d-flex flex-column gap-2 mb-3">
      <button type="button" className="btn btn-outline-light w-100 rounded-pill py-2 d-flex align-items-center justify-content-center gap-2 fw-semibold" style={{borderColor: 'rgba(245, 240, 232, 0.15)', color: 'var(--eb-cream)'}}>
        <i className="bi bi-google"></i> Continue with Google
      </button>
      <button type="button" className="btn btn-outline-light w-100 rounded-pill py-2 d-flex align-items-center justify-content-center gap-2 fw-semibold" style={{borderColor: 'rgba(245, 240, 232, 0.15)', color: 'var(--eb-cream)'}}>
        <i className="bi bi-apple"></i> Continue with Apple
      </button>
      <button type="button" className="btn btn-outline-light w-100 rounded-pill py-2 d-flex align-items-center justify-content-center gap-2 fw-semibold" style={{borderColor: 'rgba(245, 240, 232, 0.15)', color: 'var(--eb-cream)'}}>
        <i className="bi bi-facebook"></i> Continue with Facebook
      </button>
    </div>
  );
}

function Divider() {
  return (
    <div className="d-flex align-items-center my-3 text-muted small">
      <hr className="flex-grow-1" style={{opacity: 0.15}} />
      <span className="px-3" style={{color: 'var(--eb-mid)'}}>or</span>
      <hr className="flex-grow-1" style={{opacity: 0.15}} />
    </div>
  );
}

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalTab, login } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '', password: '', first_name: '', last_name: '',
    phone_number: '', date_of_birth: '', city: '', confirm_password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  // Sync mode with Context
  useEffect(() => {
    if (isAuthModalOpen) {
      document.body.style.overflow = 'hidden';
      setIsLogin(authModalTab !== 'register');
      setFormData({email: '', password: '', first_name: '', last_name: '', phone_number: '', date_of_birth: '', city: '', confirm_password: ''});
      setErrors({});
      setServerError('');
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isAuthModalOpen, authModalTab]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isAuthModalOpen) closeAuthModal();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isAuthModalOpen, closeAuthModal]);

  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) closeAuthModal();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
    setServerError('');
  };

  const validate = () => {
    let errs = {};
    if (!formData.email) errs.email = 'Required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Invalid';
    if (!formData.password) errs.password = 'Required';
    
    if (!isLogin) {
      if (!formData.first_name.trim()) errs.first_name = 'Required';
      if (!formData.last_name.trim()) errs.last_name = 'Required';
      if (!formData.phone_number.trim()) errs.phone_number = 'Required';
      if (!formData.date_of_birth) errs.date_of_birth = 'Required';
      if (!formData.city.trim()) errs.city = 'Required';
      if (formData.password.length < 6) errs.password = 'Min 6 chars';
      if (formData.password !== formData.confirm_password) errs.confirm_password = 'Must match';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      try {
        if (isLogin) {
          const res = await axios.post('/api/users/login', {email: formData.email, password: formData.password});
          const tempPref = localStorage.getItem('tempUserPreferences');
          if (tempPref) {
            localStorage.setItem('userPreferences', tempPref);
            localStorage.removeItem('tempUserPreferences');
          }
          login(res.data.token, res.data.user || { id: res.data.userId, role: res.data.role });
          closeAuthModal();
        } else {
          const payload = { ...formData };
          delete payload.confirm_password;
          await axios.post('/api/users/register', payload);
          // auto switch to login
          setIsLogin(true);
          setServerError('Registration complete. Please log in.');
        }
      } catch (err) {
        setServerError(err.response?.data?.message || (isLogin ? 'Login failed.' : 'Registration failed.'));
      } finally {
        setLoading(false);
      }
    }
  };

  if (!isAuthModalOpen) return null;

  return (
    <>
      <div className="modal fade show d-flex align-items-center justify-content-center p-3 animate-fade-in" style={{ display: 'flex', zIndex: 1060 }} tabIndex="-1" onClick={handleBackdropClick}>
        <div className="modal-dialog m-0 w-100" style={{ maxWidth: '440px', transform: 'scale(1)', transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }} ref={modalRef}>
          <div className="modal-content border-0 shadow-lg p-4 p-md-5" style={{ borderRadius: '24px', backgroundColor: 'var(--eb-black2)' }}>
            
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bolder mb-0 text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {isLogin ? 'Welcome Back' : 'Create an Account'}
              </h4>
              <button type="button" className="btn-close rounded-circle p-2 shadow-sm" style={{ fontSize: '0.75rem', filter: 'invert(1)' }} onClick={closeAuthModal} aria-label="Close"></button>
            </div>

            <OAuthButtons />
            <Divider />

            <form onSubmit={handleSubmit} noValidate className="d-flex flex-column">
              {serverError && <div className={`alert py-2 rounded-3 text-center border-0 small fw-medium ${serverError.includes('complete') ? 'alert-success text-dark' : 'alert-danger'}`}>{serverError}</div>}
              
              {!isLogin && (
                <>
                  <div className="row g-2 mb-2">
                    <div className="col-6">
                      <input type="text" name="first_name" className={`form-control rounded-3 py-2 px-3 shadow-none ${errors.first_name ? 'is-invalid' : ''}`} placeholder="First Name" value={formData.first_name} onChange={handleChange} />
                    </div>
                    <div className="col-6">
                      <input type="text" name="last_name" className={`form-control rounded-3 py-2 px-3 shadow-none ${errors.last_name ? 'is-invalid' : ''}`} placeholder="Last Name" value={formData.last_name} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="row g-2 mb-2">
                    <div className="col-6">
                      <input type="tel" name="phone_number" className={`form-control rounded-3 py-2 px-3 shadow-none ${errors.phone_number ? 'is-invalid' : ''}`} placeholder="Phone" value={formData.phone_number} onChange={handleChange} />
                    </div>
                    <div className="col-6">
                      <input type="text" onClick={(e) => e.target.type='date'} name="date_of_birth" className={`form-control rounded-3 py-2 px-3 shadow-none ${errors.date_of_birth ? 'is-invalid' : ''}`} placeholder="Date of Birth" value={formData.date_of_birth} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="mb-2">
                    <input type="text" name="city" className={`form-control rounded-3 py-2 px-3 shadow-none ${errors.city ? 'is-invalid' : ''}`} placeholder="City" value={formData.city} onChange={handleChange} />
                  </div>
                </>
              )}

              <div className="mb-2">
                <input type="email" name="email" className={`form-control rounded-3 py-2 px-3 shadow-none ${errors.email ? 'is-invalid' : ''}`} placeholder="Email Address" value={formData.email} onChange={handleChange} />
              </div>
              
              <div className="row g-2 mb-4">
                <div className={!isLogin ? "col-6" : "col-12"}>
                  <input type="password" name="password" className={`form-control rounded-3 py-2 px-3 shadow-none ${errors.password ? 'is-invalid' : ''}`} placeholder="Password" value={formData.password} onChange={handleChange} />
                </div>
                {!isLogin && (
                  <div className="col-6">
                    <input type="password" name="confirm_password" className={`form-control rounded-3 py-2 px-3 shadow-none ${errors.confirm_password ? 'is-invalid' : ''}`} placeholder="Confirm Password" value={formData.confirm_password} onChange={handleChange} />
                  </div>
                )}
              </div>
              
              <button type="submit" className="btn btn-primary btn-lg w-100 rounded-pill fw-bold hover-scale shadow-sm py-3" disabled={loading}>
                {loading ? <span className="spinner-border spinner-border-sm me-2" /> : (isLogin ? 'Log In' : 'Create Account')}
              </button>
            </form>

            <div className="text-center mt-4 pt-3 border-top" style={{borderColor: 'rgba(212, 169, 106, 0.12)'}}>
              <span className="text-muted small fw-medium">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button type="button" className="btn btn-link p-0 fw-bold text-primary text-decoration-none small mx-1" style={{transform: 'translateY(-1px)'}} onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "Sign Up" : "Log In"}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="modal-backdrop fade show animate-fade-in" style={{ zIndex: 1055, backgroundColor: 'rgba(10,10,10,0.6)', backdropFilter: 'blur(8px)' }}></div>
    </>
  );
}

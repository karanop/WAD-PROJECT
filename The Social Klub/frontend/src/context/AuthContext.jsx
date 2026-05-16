import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState('attendee'); // 'attendee' or 'host'
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');

  useEffect(() => {
    // If token exists, we could also decode it or hit a /me endpoint to verify
    // For now we'll just check if there's a user stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
         console.error('Failed to parse user from local storage:', e);
      }
    }
  }, []);

  const login = (tokenData, userData) => {
    setToken(tokenData);
    setUser(userData);
    localStorage.setItem('token', tokenData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setMode('attendee'); // Reset to default mode on logout
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'attendee' ? 'host' : 'attendee'));
  };

  const openAuthModal = (tab = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, token, mode, login, logout, toggleMode, 
      isAuthModalOpen, authModalTab, openAuthModal, closeAuthModal 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

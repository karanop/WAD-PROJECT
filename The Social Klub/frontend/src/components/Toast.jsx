import React, { createContext, useState, useCallback, useEffect } from 'react';

export const ToastContext = createContext();

const TOAST_DURATION_MS = 3000;

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const show = useCallback((message, variant = 'info') => {
    setToast({ message, variant });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), TOAST_DURATION_MS);
    return () => clearTimeout(id);
  }, [toast]);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {toast && (
        <div
          className="position-fixed top-0 end-0 p-3 m-3 z-9999"
          style={{ zIndex: 9999 }}
        >
          <div
            className={`app-toast alert alert-${toast.variant === 'error' ? 'danger' : toast.variant === 'success' ? 'success' : 'info'} shadow-lg border-0 d-flex align-items-center`}
            role="alert"
          >
            <span className="me-2">
              {toast.variant === 'success' ? 'Success' : toast.variant === 'error' ? 'Error' : 'Heads up'}
            </span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

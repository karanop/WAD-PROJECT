import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const STEPS = [
  {
    title: 'What are you interested in?',
    field: 'interest',
    options: [
      { label: '🎵 Music', value: 'music' },
      { label: '💻 Tech', value: 'tech' },
      { label: '🎨 Art', value: 'art' },
      { label: '🍽 Social', value: 'social' }
    ]
  },
  {
    title: 'What’s your vibe?',
    field: 'mood',
    options: [
      { label: 'Chill', value: 'chill' },
      { label: 'Energetic', value: 'energetic' },
      { label: 'Professional', value: 'professional' },
      { label: 'Fun & Casual', value: 'fun' }
    ]
  },
  {
    title: 'How are you going?',
    field: 'group',
    options: [
      { label: 'Solo', value: 'solo' },
      { label: 'With Friends', value: 'friends' },
      { label: 'Networking', value: 'networking' }
    ]
  }
];

export default function QuizModal({ isOpen, onClose }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ interest: '', mood: '', group: '' });
  const navigate = useNavigate();
  const { openAuthModal } = useContext(AuthContext);

  useEffect(() => {
    if (isOpen) {
      setStep(0);
      setAnswers({ interest: '', mood: '', group: '' });
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelect = (field, value) => {
    const newAnswers = { ...answers, [field]: value };
    setAnswers(newAnswers);

    if (step < STEPS.length - 1) {
      setTimeout(() => setStep(step + 1), 200);
    } else {
      localStorage.setItem('tempUserPreferences', JSON.stringify(newAnswers));
      setTimeout(() => setStep(STEPS.length), 300);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const isLockScreen = step === STEPS.length;

  return (
    <>
      <div 
        className="modal fade show" 
        style={{ display: 'block', zIndex: 1055 }} 
        tabIndex="-1"
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="modal-header border-0 pb-0">
              <button 
                type="button" 
                className="btn-close" 
                onClick={onClose} 
                aria-label="Close"
              ></button>
            </div>
            
            {!isLockScreen ? (
              <div className="modal-body p-4 p-md-5 pt-0 d-flex flex-column" style={{ minHeight: '400px' }}>
                {/* Progress Bar */}
                <div className="w-100 bg-light rounded-pill mb-4 mt-2" style={{ height: '6px', overflow: 'hidden' }}>
                  <div 
                    className="bg-dark h-100" 
                    style={{ width: `${((step + 1) / STEPS.length) * 100}%`, transition: 'width 0.4s ease' }}
                  ></div>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <span className="text-secondary fw-semibold small text-uppercase tracking-wide">Step {step + 1} of {STEPS.length}</span>
                  {step > 0 && (
                    <button onClick={handleBack} className="btn btn-link text-muted p-0 text-decoration-none fw-medium small">
                      ← Back
                    </button>
                  )}
                </div>

                <h3 className="fw-bold mb-4">{STEPS[step].title}</h3>

                <div className="d-flex flex-column gap-3 mt-auto">
                  {STEPS[step].options.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect(STEPS[step].field, opt.value)}
                      className={`btn btn-lg rounded-pill fw-medium border-2 
                        ${answers[STEPS[step].field] === opt.value ? 'btn-dark' : 'btn-outline-dark'}
                      `}
                      style={{ transition: 'all 0.2s ease', textAlign: 'left', paddingLeft: '1.5rem' }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                
                <div className="mt-4 text-center">
                   <button onClick={onClose} className="btn btn-link text-muted text-decoration-none small">
                     Skip Quiz
                   </button>
                </div>
              </div>
            ) : (
              <div className="modal-body p-5 text-center position-relative overflow-hidden">
                 <div className="position-absolute w-100 h-100" style={{ 
                   top: 0, left: 0, opacity: 0.05, 
                   background: 'repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 2px, transparent 10px)',
                   zIndex: 0
                 }}></div>
                 
                 <div className="position-relative" style={{ zIndex: 1, padding: '20px 0' }}>
                   <div className="mb-4">
                     <span className="display-1">🎯</span>
                   </div>
                   <h3 className="fw-bolder mb-3">We’ve found events you’ll love</h3>
                   <p className="text-secondary mb-5 px-3">
                     Log in to unlock your personalized recommendations and start making plans.
                   </p>
                   
                   <div className="d-flex flex-column gap-3">
                     <button 
                       onClick={() => {
                         onClose();
                         openAuthModal('login');
                       }} 
                       className="btn btn-dark btn-lg rounded-pill fw-bold shadow-sm"
                     >
                       Log In
                     </button>
                     <button 
                       onClick={() => {
                         onClose();
                         openAuthModal('register');
                       }} 
                       className="btn btn-outline-dark btn-lg rounded-pill fw-bold"
                     >
                       Sign Up
                     </button>
                   </div>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Bootstrap Modal Backdrop */}
      <div className="modal-backdrop fade show" style={{ zIndex: 1050, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}></div>
    </>
  );
}

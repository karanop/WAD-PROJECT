import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEventImageUrl, getCategoryImageUrl, DEFAULT_EVENT_IMAGE } from '../utils/eventImage';

export default function PickForMeModal({ isOpen, onClose, events, fallbackEvents }) {
  const [currentEvent, setCurrentEvent] = useState(null);
  const [picksExplored, setPicksExplored] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();

  const sourceEvents = events?.length > 0 ? events : fallbackEvents;

  const pickRandomEvent = () => {
    if (!sourceEvents || sourceEvents.length === 0) return;
    
    setIsTransitioning(true);
    
    setTimeout(() => {
      let nextEvent;
      if (sourceEvents.length === 1) {
        nextEvent = sourceEvents[0];
      } else {
        do {
          const randomIndex = Math.floor(Math.random() * sourceEvents.length);
          nextEvent = sourceEvents[randomIndex];
        } while (currentEvent && nextEvent.id === currentEvent.id);
      }
      
      setCurrentEvent(nextEvent);
      setPicksExplored(prev => prev + 1);
      setIsTransitioning(false);
    }, 250); // duration for fade out
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (!currentEvent) {
        pickRandomEvent();
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const imageSrc = currentEvent ? getEventImageUrl(currentEvent, 800, 500) : null;
  const fallbackSrc = currentEvent ? getCategoryImageUrl(currentEvent.category, 800, 500) : DEFAULT_EVENT_IMAGE;

  return (
    <>
      <div 
        className="modal fade show d-flex align-items-center justify-content-center p-md-4" 
        style={{ display: 'flex', zIndex: 1055, padding: '15px' }} 
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg m-0 w-100" style={{ maxWidth: '800px' }}>
          <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden bg-white w-100" style={{ maxHeight: '90vh' }}>
            <div className="modal-header border-0 pb-0 position-absolute w-100 p-3" style={{ zIndex: 10 }}>
              <div className="d-flex w-100 justify-content-end">
                  <button 
                    type="button" 
                    className="btn-close bg-white rounded-circle p-2 shadow" 
                    onClick={onClose} 
                    aria-label="Close"
                    style={{ opacity: 1, border: '2px solid #eee' }}
                  ></button>
              </div>
            </div>
            
            <div className="modal-body p-0 text-center d-flex flex-column h-100">
              <div 
                className="flex-grow-1 d-flex flex-column transition-opacity h-100"
                style={{ 
                  opacity: isTransitioning ? 0 : 1, 
                  transition: 'opacity 0.25s ease-in-out',
                  transform: isTransitioning ? 'scale(0.98)' : 'scale(1)',
                }}
              >
                 {currentEvent ? (
                    <>
                      <div className="position-relative w-100 flex-shrink-0" style={{ height: '35vh', minHeight: '250px', backgroundColor: '#f8f9fa' }}>
                         <img 
                           src={imageSrc}
                           alt={currentEvent.title}
                           className="w-100 h-100"
                           style={{ objectFit: 'cover' }}
                           onError={(e) => {
                             e.target.onerror = null;
                             e.target.src = fallbackSrc || DEFAULT_EVENT_IMAGE;
                           }}
                         />
                         <div className="position-absolute bottom-0 start-0 w-100 p-4 pb-3 text-start d-flex flex-column justify-content-end"
                              style={{ height: '100%', background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }}>
                            <div>
                                <span className="badge rounded-pill mb-2 px-3 py-2 fw-semibold shadow-sm" style={{ backgroundColor: '#e60023', color: 'white' }}>
                                {currentEvent.category || 'Special Event'}
                                </span>
                            </div>
                            <h2 className="text-white fw-bolder mb-1" style={{ textShadow: '0 2px 5px rgba(0,0,0,0.5)' }}>{currentEvent.title}</h2>
                            <p className="text-white mb-0 fw-medium d-flex align-items-center gap-2 flex-wrap" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                               <span><i className="bi bi-geo-alt-fill me-1 text-danger"></i>{currentEvent.location || 'Various locations'}</span>
                               {currentEvent.date && <span>• {currentEvent.date}</span>}
                            </p>
                         </div>
                      </div>
                      <div className="p-4 p-md-5 d-flex flex-column flex-grow-1 justify-content-center bg-white overflow-auto">
                         <p className="fs-5 text-secondary mb-4 px-md-3 lh-base">
                           {currentEvent.description || "A highly curated experience waiting just for you. Expand your horizons and create new memories today."}
                         </p>
                         
                         <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center mt-auto">
                            <button 
                              onClick={() => {
                                onClose();
                                navigate(`/event/${currentEvent.id}`);
                              }}
                              className="btn btn-dark btn-lg rounded-pill px-4 fw-bold shadow-sm"
                              style={{ transition: 'transform 0.2s' }}
                              onMouseEnter={(e) => e.target.style.transform = 'scale(1.03)'}
                              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                            >
                              👍 Interested
                            </button>
                            <button 
                              onClick={pickRandomEvent}
                              className="btn btn-outline-dark btn-lg rounded-pill px-4 fw-bold"
                              disabled={isTransitioning}
                              style={{ transition: 'transform 0.2s' }}
                              onMouseEnter={(e) => e.target.style.transform = 'scale(1.03)'}
                              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                            >
                              🔄 Show Another
                            </button>
                         </div>
                         <div className="mt-4 pt-2">
                            <span className="text-muted fw-bold text-uppercase tracking-wide small" style={{ letterSpacing: '1px' }}>
                               {picksExplored} pick{picksExplored !== 1 ? 's' : ''} explored
                            </span>
                         </div>
                      </div>
                    </>
                 ) : (
                    <div className="d-flex align-items-center justify-content-center h-100 flex-grow-1 p-5">
                      <div className="spinner-border text-dark" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                 )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div 
        className="modal-backdrop fade show" 
        style={{ zIndex: 1050, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
        onClick={onClose}
      ></div>
    </>
  );
}

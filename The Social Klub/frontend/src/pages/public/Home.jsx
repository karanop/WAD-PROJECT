import React, { useState, useContext, useEffect, useRef } from 'react';
import HeroCarousel from '../../components/HeroCarousel';
import EventSection from '../../components/EventSection';
import QuizModal from '../../components/QuizModal';
import PickForMeModal from '../../components/PickForMeModal';
import { AuthContext } from '../../context/AuthContext';
import { eventsCatalog } from '../../data/content';

function Home() {
  const { user } = useContext(AuthContext);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isPickForMeOpen, setIsPickForMeOpen] = useState(false);
  const recommendedRef = useRef(null);

  // Default slices
  const trendingEvents = [...eventsCatalog].slice(0, 5); 
  const [recommendedEvents, setRecommendedEvents] = useState([...eventsCatalog].slice(5, 13));
  const [recommendedSubtitle, setRecommendedSubtitle] = useState("Based on your interests");
  const [aiExplanation, setAiExplanation] = useState(null);

  useEffect(() => {
    const prefsStr = localStorage.getItem('userPreferences');
    if (prefsStr) {
      try {
        const prefs = JSON.parse(prefsStr);
        if (prefs && prefs.interest && prefs.mood && prefs.group) {
          setAiExplanation(
            `We picked these events for you because you enjoy ${prefs.interest}, prefer ${prefs.mood} vibes, and usually go ${prefs.group}.`
          );
        }
        
        if (user) {
          const interestMap = {
            music: ['Entertainment', 'Creative'],
            tech: ['Networking', 'Workshop'],
            art: ['Creative', 'Workshop'],
            social: ['Social', 'Food & Drink']
          };
          
          const targetCategories = interestMap[prefs.interest] || [];
          
          const matchedEvents = eventsCatalog.filter(e => 
             targetCategories.includes(e.category) || 
             e.title.toLowerCase().includes(prefs.interest)
          );

          if (matchedEvents.length > 0) {
            const finalRecs = Array.from(new Set([...matchedEvents, ...eventsCatalog])).slice(0, 8);
            setRecommendedEvents(finalRecs);
            setRecommendedSubtitle("Here are your personalized events 🎯");
          }
          
          // Auto-scroll to recommendations after login bounce back
          if (recommendedRef.current) {
             setTimeout(() => {
               recommendedRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
             }, 400);
          }
        }
      } catch (e) {
        console.error('Error parsing preferences', e);
      }
    }
  }, [user]);

  return (
    <div className="home-container page-transition-wrap">
      <HeroCarousel />

      <QuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />

      {/* CTA Section for Quiz */}
      {!user && (
        <section className="py-3 bg-white border-bottom position-relative shadow-sm" style={{ zIndex: 10 }}>
          <div className="container">
            <div className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-3 gap-md-4 py-3 px-4 bg-light rounded-4 shadow-sm border border-light-subtle mx-auto" style={{ maxWidth: '800px' }}>
              <h5 className="fw-bolder mb-0 text-dark">Tired of endless scrolling?</h5>
              <button 
                onClick={() => setIsQuizOpen(true)} 
                className="btn btn-dark rounded-pill shadow-sm px-4 py-2 fw-bold hover-scale"
                style={{ fontSize: '1rem', transition: 'transform 0.2s, box-shadow 0.2s', whiteSpace: 'nowrap' }}
              >
                Find your perfect event in 10 seconds →
              </button>
            </div>
          </div>
        </section>
      )}

      <EventSection 
        title="🔥 Trending Now" 
        subtitle="Popular events people are joining this week" 
        events={trendingEvents} 
        layout="carousel" 
      />

      <div ref={recommendedRef}>
        <EventSection 
          title="🎯 Recommended For You" 
          subtitle={recommendedSubtitle} 
          events={recommendedEvents} 
          layout="grid" 
          extraHeaderChild={
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 animate-fade-in-up">
              {aiExplanation ? (
                <div className="p-3 bg-light rounded-4 shadow-sm border border-secondary border-opacity-10 d-flex align-items-center gap-3 flex-grow-1" style={{ maxWidth: '800px' }}>
                  <div className="d-flex align-items-center justify-content-center bg-white rounded-circle shadow-sm flex-shrink-0" style={{ width: '40px', height: '40px' }}>
                    <span className="fs-5 m-0" style={{ lineHeight: 1 }}>✨</span>
                  </div>
                  <p className="mb-0 fw-medium text-dark" style={{ fontStyle: 'italic', fontSize: '1.05rem', letterSpacing: '0.2px' }}>
                    {aiExplanation}
                  </p>
                </div>
              ) : (
                <div className="flex-grow-1"></div>
              )}
              <button 
                onClick={() => setIsPickForMeOpen(true)}
                className="btn btn-dark rounded-pill shadow-sm px-4 py-3 fw-bold flex-shrink-0 hover-scale text-nowrap"
                style={{ transition: 'transform 0.2s, box-shadow 0.2s', alignSelf: aiExplanation ? 'center' : 'flex-end' }}
              >
                🎲 Pick For Me
              </button>
            </div>
          }
        />
      </div>

      <PickForMeModal 
        isOpen={isPickForMeOpen} 
        onClose={() => setIsPickForMeOpen(false)} 
        events={recommendedEvents} 
        fallbackEvents={eventsCatalog} 
      />

      {/* Featured Statistics */}
      <section className="py-5 bg-white border-bottom position-relative" style={{transition: 'background-color 0.3s, border-color 0.3s'}}>
        <div className="container">
          <div className="row text-center g-4">
            <div className="col-md-4">
              <h2 className="display-4 fw-bold mb-0">50+</h2>
              <p className="text-secondary fw-semibold text-uppercase small tracking-wide">Curated Experiences</p>
            </div>
            <div className="col-md-4">
              <h2 className="display-4 fw-bold mb-0">10k</h2>
              <p className="text-secondary fw-semibold text-uppercase small tracking-wide">Active Members</p>
            </div>
            <div className="col-md-4">
              <h2 className="display-4 fw-bold mb-0">5</h2>
              <p className="text-secondary fw-semibold text-uppercase small tracking-wide">Cities Worldwide</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;

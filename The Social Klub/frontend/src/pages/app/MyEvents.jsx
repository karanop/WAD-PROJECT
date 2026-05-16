import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ToastContext } from '../../components/Toast';
import axios from '../../api/axiosConfig'; // Assuming a configured axios instance exists

const CATEGORY_COLORS = {
  'Social': '#2A2A2A',
  'Music & Live': '#A07840',
  'Art & Culture': '#8A8070',
  'Food & Drink': '#D4A96A',
  'Rooftop': '#E8C98A',
  'Networking': '#5A5040',
  'Other': '#1F1F1F'
};

function HostEventForm({ onClose, onEventCreated }) {
  const { show } = useContext(ToastContext) || { show: () => {} };
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'Social',
    max_guests: 50,
    price: ''
  });
  
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setPreviewImage(URL.createObjectURL(file));
        // In a real app we'd upload this to S3 and set an image_url
    }
  };

  const handleStepper = (amount) => {
    const newAmount = parseInt(formData.max_guests || 0) + amount;
    if (newAmount >= 1 && newAmount <= 500) {
      setFormData({ ...formData, max_guests: newAmount });
    }
  };

  const submitEvent = async (status) => {
    if (!formData.title || !formData.date || !formData.time) {
      show('Title, Date and Time are required.', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      // we attach pseudo image_url for UI purposes if they uploaded one
      const payload = { ...formData, status, image_url: previewImage };
      const res = await axios.post('/api/events', payload);
      onEventCreated(res.data.event, status);
      show(`Event successfully ${status === 'draft' ? 'saved as draft' : 'published'}!`, 'success');
    } catch (err) {
      console.error(err);
      show('Failed to save event.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-5 pt-4 pb-5">
      <div className="mx-auto" style={{ maxWidth: '600px' }}>
        <div className="p-4" style={{ backgroundColor: 'var(--eb-black2)', border: '0.5px solid rgba(212,169,106,0.2)', borderRadius: '18px' }}>
          
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0 text-white" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: 600 }}>Create a new event</h2>
            <button 
              className="btn btn-sm d-flex align-items-center justify-content-center rounded-circle border-0 text-white" 
              style={{ width: '28px', height: '28px', backgroundColor: 'var(--eb-black3)' }}
              onClick={onClose}
            >
              ✕
            </button>
          </div>

          <div className="mb-4 text-center position-relative dash-file-zone d-flex align-items-center justify-content-center" onClick={handleImageClick}>
            <input type="file" className="d-none" ref={fileInputRef} onChange={handleImageChange} accept="image/*" />
            {previewImage ? (
              <img src={previewImage} alt="Cover Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div className="text-muted small">
                <i className="bi bi-cloud-arrow-up fs-4 d-block mb-1 text-primary"></i>
                Click to upload a cover image
              </div>
            )}
          </div>

          <div className="mb-3">
            <input type="text" name="title" className="dash-input" placeholder="Event name" value={formData.title} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <textarea name="description" className="dash-input" placeholder="Description" style={{ minHeight: '80px', resize: 'vertical' }} value={formData.description} onChange={handleChange}></textarea>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-6">
              <input type="date" name="date" className="dash-input" value={formData.date} onChange={handleChange} />
            </div>
            <div className="col-6">
              <input type="time" name="time" className="dash-input" value={formData.time} onChange={handleChange} />
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-6">
              <input type="text" name="location" className="dash-input" placeholder="Venue / Place" value={formData.location} onChange={handleChange} />
            </div>
            <div className="col-6">
              <select name="category" className="dash-select" value={formData.category} onChange={handleChange}>
                <option value="Social">Social</option>
                <option value="Music & Live">Music & Live</option>
                <option value="Art & Culture">Art & Culture</option>
                <option value="Food & Drink">Food & Drink</option>
                <option value="Rooftop">Rooftop</option>
                <option value="Networking">Networking</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-6 d-flex align-items-center">
              <div className="d-flex align-items-center justify-content-between rounded-pill w-100" style={{ backgroundColor: 'var(--eb-black3)', border: '0.5px solid rgba(212,169,106,0.15)', overflow: 'hidden' }}>
                <button className="dash-stepper-btn py-1" onClick={() => handleStepper(-10)}>-</button>
                <span className="text-white" style={{ fontSize: '15px', fontWeight: 500 }}>{formData.max_guests}</span>
                <button className="dash-stepper-btn py-1" onClick={() => handleStepper(10)}>+</button>
              </div>
            </div>
            <div className="col-6">
              <input type="number" name="price" className="dash-input" placeholder="0 for free" value={formData.price} onChange={handleChange} min="0" step="0.01" />
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 border-top pt-3" style={{ borderColor: 'rgba(212,169,106,0.15)' }}>
            <button className="btn btn-link text-muted text-decoration-none rounded-pill px-4" onClick={onClose} disabled={isSubmitting}>Cancel</button>
            <button className="btn btn-outline-primary rounded-pill px-4" onClick={() => submitEvent('draft')} disabled={isSubmitting} style={{ color: 'var(--eb-gold-dim)' }}>Save as draft</button>
            <button className="btn btn-primary rounded-pill px-4 fw-semibold text-dark" onClick={() => submitEvent('upcoming')} disabled={isSubmitting}>Publish event</button>
          </div>

        </div>
      </div>
    </div>
  );
}

function MyEvents() {
  const [view, setView] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('hosting');
  
  const [hostingEvents, setHostingEvents] = useState([]);
  const [attendingEvents, setAttendingEvents] = useState([]);
  const [draftEvents, setDraftEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [hostedRes, draftRes, attendingRes] = await Promise.all([
        axios.get('/api/events/mine').catch(() => ({ data: [] })),
        axios.get('/api/events/drafts').catch(() => ({ data: [] })),
        axios.get('/api/events/attending').catch(() => ({ data: [] }))
      ]);
      setHostingEvents(hostedRes.data || []);
      setDraftEvents(draftRes.data || []);
      setAttendingEvents(attendingRes.data || []);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (view === 'dashboard') {
      fetchData();
    }
  }, [view]);

  // Handle Event Creation Success
  const handleEventCreated = (newEvent, status) => {
    if (status === 'draft') {
      setDraftEvents([newEvent, ...draftEvents]);
      setActiveTab('drafts');
    } else {
      setHostingEvents([newEvent, ...hostingEvents]);
      setActiveTab('hosting');
    }
    setView('dashboard');
  };

  // Safe delete handler
  const handleDelete = async (id, isDraft) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(`/api/events/${id}`);
        if(isDraft) {
          setDraftEvents(draftEvents.filter(e => e.id !== id));
        } else {
          setHostingEvents(hostingEvents.filter(e => e.id !== id));
        }
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  }

  // Derived Stats
  const totalGuests = hostingEvents.reduce((acc, ev) => acc + (ev.slots_available ? (ev.capacity - ev.slots_available) : ev.capacity || 0), 0);
  const upcomingCount = hostingEvents.filter(e => e.status === 'upcoming' || e.status === 'live').length;

  if (view === 'host-form') {
    return <HostEventForm onClose={() => setView('dashboard')} onEventCreated={handleEventCreated} />;
  }

  const renderEmptyState = (tab) => (
    <div className="text-center py-5 my-4">
      <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '64px', height: '64px', border: '1.5px solid rgba(212,169,106,0.2)' }}>
        <i className="bi bi-circle fs-3 text-muted"></i>
      </div>
      <h5 className="text-white fw-medium mb-1" style={{ fontSize: '15px' }}>No {tab} events</h5>
      <p className="text-muted" style={{ fontSize: '13px' }}>There's nothing here yet.</p>
    </div>
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'live': return <span className="dash-badge live position-absolute bottom-0 start-0 ms-3 mb-3">Live</span>;
      case 'upcoming': return <span className="dash-badge upcoming position-absolute bottom-0 start-0 ms-3 mb-3">Upcoming</span>;
      case 'past': return <span className="dash-badge past position-absolute bottom-0 start-0 ms-3 mb-3">Past</span>;
      case 'draft': return <span className="dash-badge draft position-absolute bottom-0 start-0 ms-3 mb-3">Draft</span>;
      default: return null;
    }
  };

  const renderGridCard = (ev, isDraft = false) => {
    const defaultBg = CATEGORY_COLORS[ev.category] || CATEGORY_COLORS['Other'];
    const coverStyle = ev.image_url ? { backgroundImage: `url(${ev.image_url})`, backgroundSize: 'cover' } : { backgroundColor: defaultBg };
    const registered = ev.capacity - (ev.slots_available || ev.capacity);
    const pct = ev.capacity ? Math.round((registered / ev.capacity) * 100) : 0;

    return (
      <div key={ev.id} className="dash-event-card position-relative">
        <div className="position-relative w-100" style={{ height: '120px', ...coverStyle }}>
          {getStatusBadge(ev.status)}
        </div>
        <div className="p-3 pb-0" style={{ padding: '16px 18px 18px' }}>
          <h5 className="text-white mb-2 text-truncate" style={{ fontSize: '15px', fontWeight: 500 }}>{ev.title}</h5>
          
          <div className="d-flex align-items-center mb-1 text-truncate">
            <span className="rounded-circle bg-primary me-2 flex-shrink-0" style={{ width: '4px', height: '4px' }}></span>
            <span className="text-muted" style={{ fontSize: '12px' }}>{new Date(ev.event_date).toLocaleDateString()} · {ev.event_time}</span>
          </div>
          <div className="d-flex align-items-center mb-1 text-truncate">
            <span className="rounded-circle bg-primary me-2 flex-shrink-0" style={{ width: '4px', height: '4px' }}></span>
            <span className="text-muted" style={{ fontSize: '12px' }}>{ev.location}</span>
          </div>
          <div className="d-flex align-items-center mb-3 text-truncate">
            <span className="rounded-circle bg-primary me-2 flex-shrink-0" style={{ width: '4px', height: '4px' }}></span>
            <span className="text-muted" style={{ fontSize: '12px' }}>{ev.category} · {ev.price == 0 ? 'Free' : `$${ev.price}`}</span>
          </div>

          <div className="mb-2">
            <div className="d-flex justify-content-between mb-1">
              <span className="text-muted" style={{ fontSize: '11px' }}>{registered} guests registered</span>
              <span className="text-muted" style={{ fontSize: '11px' }}>{pct}%</span>
            </div>
            <div className="dash-progress-track">
              <div className="dash-progress-fill" style={{ width: `${pct}%` }}></div>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-2 px-3 py-2" style={{ borderTop: '0.5px solid rgba(212,169,106,0.08)' }}>
          <span className="text-muted" style={{ fontSize: '11px' }}>{registered} / {ev.capacity || 0} capacity</span>
          <div className="d-flex gap-2">
            <button className="btn btn-sm rounded-pill text-primary" style={{ border: '0.5px solid var(--eb-gold)', fontSize: '11px', padding: '2px 10px' }}>Edit</button>
            <button className="btn btn-sm rounded-pill text-primary" style={{ border: '0.5px solid var(--eb-gold)', fontSize: '11px', padding: '2px 10px' }} onClick={() => handleDelete(ev.id, isDraft)}>Delete</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mt-5 pt-4 pb-5">
      
      {/* Header */}
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <div className="dash-eyebrow mb-1">Your event universe</div>
          <h1 className="dash-header-title mb-0">My Events</h1>
        </div>
        <button className="btn btn-primary rounded-pill text-dark fw-semibold" style={{ padding: '11px 22px' }} onClick={() => setView('host-form')}>
          + Host an event
        </button>
      </div>

      {/* Stats Strip */}
      <div className="row g-2 mb-4">
        <div className="col-6 col-md-3">
          <div className="p-3 text-center" style={{ backgroundColor: 'var(--eb-black2)', border: '0.5px solid rgba(212,169,106,0.1)', borderRadius: '12px' }}>
            <div className="dash-stat-number mb-1">{hostingEvents.length}</div>
            <div className="dash-stat-label">Events Hosted</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="p-3 text-center" style={{ backgroundColor: 'var(--eb-black2)', border: '0.5px solid rgba(212,169,106,0.1)', borderRadius: '12px' }}>
            <div className="dash-stat-number mb-1">{totalGuests}</div>
            <div className="dash-stat-label">Total Guests</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="p-3 text-center" style={{ backgroundColor: 'var(--eb-black2)', border: '0.5px solid rgba(212,169,106,0.1)', borderRadius: '12px' }}>
            <div className="dash-stat-number mb-1">{upcomingCount}</div>
            <div className="dash-stat-label">Upcoming</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="p-3 text-center" style={{ backgroundColor: 'var(--eb-black2)', border: '0.5px solid rgba(212,169,106,0.1)', borderRadius: '12px' }}>
            <div className="dash-stat-number mb-1">{attendingEvents.length}</div>
            <div className="dash-stat-label">Events Attended</div>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="dash-tab-container d-flex mb-4 overflow-auto">
        <button className={`dash-tab ${activeTab === 'hosting' ? 'active' : ''}`} onClick={() => setActiveTab('hosting')}>
          Hosting
        </button>
        <button className={`dash-tab ${activeTab === 'attending' ? 'active' : ''}`} onClick={() => setActiveTab('attending')}>
          Attending
        </button>
        <button className={`dash-tab ${activeTab === 'drafts' ? 'active' : ''}`} onClick={() => setActiveTab('drafts')}>
          Drafts
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-vh-50">
        {isLoading ? (
          <div className="text-center py-5"><span className="spinner-border text-primary" /></div>
        ) : (
          <>
            {activeTab === 'hosting' && (
              hostingEvents.length > 0 ? (
                <div className="dash-event-grid">
                  {hostingEvents.map(ev => renderGridCard(ev, false))}
                </div>
              ) : renderEmptyState('hosted')
            )}

            {activeTab === 'attending' && (
              attendingEvents.length > 0 ? (
                <div className="d-flex flex-column gap-2">
                  {attendingEvents.map(ev => (
                    <div key={ev.id} className="d-flex align-items-center justify-content-between p-3" style={{ backgroundColor: 'var(--eb-black2)', border: '0.5px solid rgba(212,169,106,0.1)', borderRadius: '12px' }}>
                      <div className="d-flex align-items-center">
                        <div className="rounded me-3 flex-shrink-0" style={{ width: '40px', height: '40px', backgroundColor: CATEGORY_COLORS[ev.category] || CATEGORY_COLORS['Other'] }}></div>
                        <div>
                          <div className="text-white" style={{ fontSize: '14px', fontWeight: 500 }}>{ev.title}</div>
                          <div className="text-muted" style={{ fontSize: '12px' }}>{new Date(ev.event_date).toLocaleDateString()} · {ev.location}</div>
                        </div>
                      </div>
                      <div>
                        {/* Simplistic mock badge for attending items logic based on date maybe, we'll just show 'Attending' for all since we fetch them by booking */}
                        <span className="dash-badge attended position-relative">Attending</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : renderEmptyState('attending')
            )}

            {activeTab === 'drafts' && (
              draftEvents.length > 0 ? (
                <div className="dash-event-grid">
                  {draftEvents.map(ev => renderGridCard(ev, true))}
                </div>
              ) : renderEmptyState('draft')
            )}
          </>
        )}
      </div>

    </div>
  );
}

export default MyEvents;

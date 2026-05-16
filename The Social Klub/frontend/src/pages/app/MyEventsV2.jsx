import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContext } from '../../components/Toast';
import {
  createEvent,
  deleteHostedEvent,
  fetchAttendingEvents,
  fetchDraftEvents,
  fetchHostedEvents,
  formatEventDate,
  formatEventTime,
  getEventSnippet,
} from '../../api/events';

const CATEGORY_OPTIONS = [
  'Social',
  'Music & Live',
  'Art & Culture',
  'Food & Drink',
  'Rooftop',
  'Networking',
  'Other',
];

function validateEventForm(formData) {
  const errors = {};
  const now = new Date();
  const scheduledAt = formData.date && formData.time ? new Date(`${formData.date}T${formData.time}`) : null;

  if (!formData.title.trim()) errors.title = 'Title is required.';
  if (!formData.description.trim()) errors.description = 'Description is required.';
  if (!formData.location.trim()) errors.location = 'Location is required.';
  if (!formData.date) errors.date = 'Pick an event date.';
  if (!formData.time) errors.time = 'Pick an event time.';
  if (!formData.max_guests || Number(formData.max_guests) < 1) errors.max_guests = 'Capacity must be at least 1.';
  if (formData.price !== '' && Number(formData.price) < 0) errors.price = 'Price cannot be negative.';
  if (formData.image_url && !/^https?:\/\//i.test(formData.image_url)) errors.image_url = 'Use a full image URL starting with http:// or https://';

  if (scheduledAt && !Number.isNaN(scheduledAt.getTime()) && scheduledAt < now) {
    errors.date = 'Choose a future date and time.';
  }

  return errors;
}

function getFirstErrorMessage(errors) {
  const firstError = Object.values(errors).find(Boolean);
  return firstError || 'Please fix the highlighted fields.';
}

function getErrorSummary(errors, fallbackMessage = 'Please fix the highlighted fields.') {
  const messages = Object.values(errors).filter(Boolean);

  if (messages.length === 0) {
    return fallbackMessage;
  }

  return messages.slice(0, 3);
}

function HostEventForm({ onCancel, onEventCreated }) {
  const navigate = useNavigate();
  const { show } = useContext(ToastContext);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'Social',
    max_guests: 50,
    price: '',
    image_url: '',
  });
  const [errors, setErrors] = useState({});
  const [submitSummary, setSubmitSummary] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setSubmitSummary((current) => current.filter(Boolean));
  };

  const submitEvent = async (status) => {
      const nextErrors = validateEventForm(formData);
      if (Object.keys(nextErrors).length > 0) {
        setErrors(nextErrors);
        setSubmitSummary(getErrorSummary(nextErrors));
        show(getFirstErrorMessage(nextErrors), 'error');
        return;
      }

      setIsSubmitting(true);
      setSubmitSummary([]);
      try {
      const payload = {
        ...formData,
        max_guests: Number(formData.max_guests),
        price: formData.price === '' ? 0 : Number(formData.price),
        status,
      };
      const response = await createEvent(payload);
      show(response.message, 'success');
      onEventCreated(response.event, status);

      if (status !== 'draft') {
        navigate(`/event/${response.event.id}`);
      }
    } catch (error) {
      const apiErrors = error.response?.data?.errors || {};
      setErrors(apiErrors);
      const fallbackMessage = error.response?.data?.message || 'Failed to save event.';
      setSubmitSummary(getErrorSummary(apiErrors, fallbackMessage));
      show(Object.keys(apiErrors).length > 0 ? getFirstErrorMessage(apiErrors) : fallbackMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewDate = formData.date ? formatEventDate(formData.date) : 'Select a date';
  const previewTime = formData.time ? formatEventTime(formData.time) : 'Select a time';

  return (
    <div className="my-events-shell">
      <div className="my-events-header">
        <div>
          <div className="my-events-kicker">Host dashboard</div>
          <h1>Create an event worth RSVPing to</h1>
          <p>Shape the details, preview the experience, and publish when it feels right.</p>
        </div>
        <button type="button" className="btn btn-outline-primary rounded-pill px-4 py-2" onClick={onCancel} disabled={isSubmitting}>
          Back to dashboard
        </button>
      </div>

      <div className="event-form-layout">
        <form className="event-form-card" onSubmit={(e) => e.preventDefault()}>
          {submitSummary.length > 0 && (
            <div className="event-form-alert" role="alert">
              <strong>Check these fields:</strong>
              <ul>
                {submitSummary.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="event-form-section">
            <div>
              <h3>Basics</h3>
              <p>Start with the headline details guests notice first.</p>
            </div>
            <div className="event-form-grid">
              <label className="event-field event-field-full">
                <span>Event title</span>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Rooftop jazz and cocktails"
                  className={errors.title ? 'event-field-input is-invalid-field' : 'event-field-input'}
                />
                {errors.title && <small>{errors.title}</small>}
              </label>

              <label className="event-field event-field-full">
                <span>Description</span>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell guests what the energy will feel like, what is included, and why they should come."
                  rows="5"
                  className={errors.description ? 'event-field-input is-invalid-field' : 'event-field-input'}
                />
                {errors.description && <small>{errors.description}</small>}
              </label>

              <label className="event-field">
                <span>Date</span>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={errors.date ? 'event-field-input is-invalid-field' : 'event-field-input'}
                />
                {errors.date && <small>{errors.date}</small>}
              </label>

              <label className="event-field">
                <span>Time</span>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className={errors.time ? 'event-field-input is-invalid-field' : 'event-field-input'}
                />
                {errors.time && <small>{errors.time}</small>}
              </label>
            </div>
          </div>

          <div className="event-form-section">
            <div>
              <h3>Venue and access</h3>
              <p>Add the practical details that help guests commit quickly.</p>
            </div>
            <div className="event-form-grid">
              <label className="event-field">
                <span>Location</span>
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Bangalore, MG Road rooftop"
                  className={errors.location ? 'event-field-input is-invalid-field' : 'event-field-input'}
                />
                {errors.location && <small>{errors.location}</small>}
              </label>

              <label className="event-field">
                <span>Category</span>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={errors.category ? 'event-field-input is-invalid-field' : 'event-field-input'}
                >
                  {CATEGORY_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {errors.category && <small>{errors.category}</small>}
              </label>

              <label className="event-field">
                <span>Guest capacity</span>
                <input
                  type="number"
                  min="1"
                  name="max_guests"
                  value={formData.max_guests}
                  onChange={handleChange}
                  className={errors.max_guests ? 'event-field-input is-invalid-field' : 'event-field-input'}
                />
                {errors.max_guests && <small>{errors.max_guests}</small>}
              </label>

              <label className="event-field">
                <span>Price</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className={errors.price ? 'event-field-input is-invalid-field' : 'event-field-input'}
                />
                {errors.price && <small>{errors.price}</small>}
              </label>

              <label className="event-field event-field-full">
                <span>Cover image URL</span>
                <input
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="https://images.example.com/event-cover.jpg"
                  className={errors.image_url ? 'event-field-input is-invalid-field' : 'event-field-input'}
                />
                {errors.image_url && <small>{errors.image_url}</small>}
              </label>
            </div>
          </div>

          <div className="event-form-actions">
            <button type="button" className="btn btn-outline-primary rounded-pill px-4 py-3" onClick={() => submitEvent('draft')} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Draft'}
            </button>
            <button type="button" className="btn btn-primary rounded-pill px-5 py-3 fw-semibold" onClick={() => submitEvent('upcoming')} disabled={isSubmitting}>
              {isSubmitting ? 'Publishing...' : 'Publish Event'}
            </button>
          </div>
        </form>

        <aside className="event-preview-card">
          <div className="event-preview-chip">Live preview</div>
          <div className="event-preview-media" style={formData.image_url ? { backgroundImage: `url(${formData.image_url})` } : undefined}>
            {!formData.image_url && <span>Add an image URL to preview your cover</span>}
          </div>
          <div className="event-preview-content">
            <h3>{formData.title || 'Your event title appears here'}</h3>
            <div className="event-preview-meta">
              <span><i className="bi bi-calendar-event me-2"></i>{previewDate}</span>
              <span><i className="bi bi-clock me-2"></i>{previewTime}</span>
              <span><i className="bi bi-geo-alt me-2"></i>{formData.location || 'Add a venue'}</span>
            </div>
            <p>{formData.description || 'Write a rich description so guests immediately understand the vibe, value, and plan.'}</p>
            <div className="event-preview-footer">
              <span>{formData.category}</span>
              <strong>{formData.price && Number(formData.price) > 0 ? `$${Number(formData.price).toFixed(2)}` : 'Free'}</strong>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function DashboardEventCard({ event, onDelete, label, actionLabel = 'Delete' }) {
  return (
    <article className="dashboard-event-card">
      <div className="dashboard-event-top">
        <div>
          <span className="dashboard-event-status">{label}</span>
          <h4>{event.title}</h4>
          <p>{getEventSnippet(event.description)}</p>
        </div>
        <button type="button" className="btn btn-sm btn-outline-primary rounded-pill" onClick={() => onDelete(event.id)}>
          {actionLabel}
        </button>
      </div>

      <div className="dashboard-event-meta">
        <span><i className="bi bi-calendar-event me-2"></i>{formatEventDate(event.date)}</span>
        <span><i className="bi bi-clock me-2"></i>{formatEventTime(event.time)}</span>
        <span><i className="bi bi-geo-alt me-2"></i>{event.location}</span>
      </div>

      <div className="dashboard-event-footer">
        <span>{event.category}</span>
        <strong>{event.price > 0 ? `$${event.price}` : 'Free'}</strong>
      </div>
    </article>
  );
}

function MyEventsV2() {
  const { show } = useContext(ToastContext);
  const navigate = useNavigate();
  const [mode, setMode] = useState('dashboard');
  const [tab, setTab] = useState('hosting');
  const [hostingEvents, setHostingEvents] = useState([]);
  const [draftEvents, setDraftEvents] = useState([]);
  const [attendingEvents, setAttendingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (mode !== 'dashboard') {
      return;
    }

    let isMounted = true;

    const loadDashboard = async () => {
      setLoading(true);
      try {
        const [hosting, drafts, attending] = await Promise.all([
          fetchHostedEvents().catch(() => []),
          fetchDraftEvents().catch(() => []),
          fetchAttendingEvents().catch(() => []),
        ]);

        if (isMounted) {
          setHostingEvents(hosting);
          setDraftEvents(drafts);
          setAttendingEvents(attending);
        }
      } catch (error) {
        console.error('Dashboard fetch error:', error);
        show('Unable to load your events right now.', 'error');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [mode, show]);

  const totalGuests = hostingEvents.reduce(
    (sum, event) => sum + Math.max((event.capacity || 0) - (event.slots_available || 0), 0),
    0
  );

  const handleEventCreated = (event, status) => {
    if (status === 'draft') {
      setDraftEvents((current) => [event, ...current]);
      setTab('drafts');
      setMode('dashboard');
      return;
    }

    setHostingEvents((current) => [event, ...current]);
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Delete this event permanently?')) {
      return;
    }

    try {
      await deleteHostedEvent(eventId);
      setHostingEvents((current) => current.filter((event) => event.id !== eventId));
      setDraftEvents((current) => current.filter((event) => event.id !== eventId));
      show('Event deleted.', 'success');
    } catch (error) {
      console.error('Delete event failed:', error);
      show(error.response?.data?.message || 'Failed to delete event.', 'error');
    }
  };

  if (mode === 'create') {
    return <HostEventForm onCancel={() => setMode('dashboard')} onEventCreated={handleEventCreated} />;
  }

  const currentEvents =
    tab === 'hosting' ? hostingEvents : tab === 'drafts' ? draftEvents : attendingEvents;

  return (
    <div className="my-events-shell">
      <div className="my-events-header">
        <div>
          <div className="my-events-kicker">Your event universe</div>
          <h1>My Events</h1>
          <p>Track what you are hosting, what is still in draft, and what you are attending.</p>
        </div>
        <button type="button" className="btn btn-primary rounded-pill px-4 py-3 fw-semibold" onClick={() => setMode('create')}>
          Create Event
        </button>
      </div>

      <div className="my-events-stats">
        <div>
          <span>Hosting</span>
          <strong>{hostingEvents.length}</strong>
        </div>
        <div>
          <span>Guests confirmed</span>
          <strong>{totalGuests}</strong>
        </div>
        <div>
          <span>Drafts</span>
          <strong>{draftEvents.length}</strong>
        </div>
        <div>
          <span>Attending</span>
          <strong>{attendingEvents.length}</strong>
        </div>
      </div>

      <div className="my-events-tabs">
        {['hosting', 'drafts', 'attending'].map((item) => (
          <button key={item} type="button" className={tab === item ? 'active' : ''} onClick={() => setTab(item)}>
            {item}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-5"><span className="spinner-border text-primary" /></div>
      ) : currentEvents.length === 0 ? (
        <div className="dashboard-empty-state">
          <h4>No {tab} events yet</h4>
          <p>{tab === 'hosting' ? 'Create your first event to kick off the hosting flow.' : 'Nothing to show here yet.'}</p>
          {tab === 'hosting' && (
            <button type="button" className="btn btn-outline-primary rounded-pill px-4 py-2" onClick={() => setMode('create')}>
              Start creating
            </button>
          )}
        </div>
      ) : (
        <div className="dashboard-event-grid-v2">
          {currentEvents.map((event) => (
            <DashboardEventCard
              key={event.id}
              event={event}
              label={tab === 'attending' ? 'Attending' : event.status || tab}
              actionLabel={tab === 'attending' ? 'View' : 'Delete'}
              onDelete={tab === 'attending' ? () => navigate(`/event/${event.id}`) : handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyEventsV2;

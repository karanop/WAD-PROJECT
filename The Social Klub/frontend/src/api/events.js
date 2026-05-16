import axios from './axiosConfig';
import { getCategoryImageUrl } from '../utils/eventImage';

export function normalizeEvent(event = {}) {
  const eventDate = event.event_date || event.date || '';
  const eventTime = event.event_time || event.time || '';
  const capacity = Number(event.capacity ?? event.max_guests ?? 0);
  const slotsAvailable = Number(event.slots_available ?? capacity);
  const price = event.price === '' || event.price == null ? 0 : Number(event.price);

  return {
    ...event,
    event_date: eventDate,
    event_time: eventTime,
    date: eventDate,
    time: eventTime,
    capacity,
    slots_available: slotsAvailable,
    price,
    description: event.description || 'More details coming soon.',
    location: event.location || 'Various locations',
    image: event.image_url || event.image || getCategoryImageUrl(event.category),
    image_url: event.image_url || event.image || getCategoryImageUrl(event.category),
  };
}

export function formatEventDate(dateValue) {
  if (!dateValue) {
    return 'Date TBD';
  }

  const date = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatEventTime(timeValue) {
  if (!timeValue) {
    return 'Time TBD';
  }

  const normalized = timeValue.length === 5 ? `${timeValue}:00` : timeValue;
  const date = new Date(`2000-01-01T${normalized}`);
  if (Number.isNaN(date.getTime())) {
    return timeValue;
  }

  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export function getEventSnippet(description = '') {
  if (!description) {
    return 'A curated social experience worth checking out.';
  }

  return description.length > 110 ? `${description.slice(0, 107)}...` : description;
}

export async function fetchPublicEvents() {
  const response = await axios.get('/api/events/public');
  const events = Array.isArray(response.data) ? response.data : [];
  console.debug('[events] public response count:', events.length);
  return events.map(normalizeEvent);
}

export async function fetchPublicEventById(eventId) {
  const response = await axios.get(`/api/events/public/${eventId}`);
  return normalizeEvent(response.data);
}

export async function createEvent(payload) {
  const response = await axios.post('/api/events', payload);
  return {
    ...response.data,
    event: normalizeEvent(response.data.event),
  };
}

export async function fetchHostedEvents() {
  const response = await axios.get('/api/events/mine');
  return response.data.map(normalizeEvent);
}

export async function fetchDraftEvents() {
  const response = await axios.get('/api/events/drafts');
  return response.data.map(normalizeEvent);
}

export async function fetchAttendingEvents() {
  const response = await axios.get('/api/events/attending');
  return response.data.map(normalizeEvent);
}

export async function deleteHostedEvent(eventId) {
  return axios.delete(`/api/events/${eventId}`);
}

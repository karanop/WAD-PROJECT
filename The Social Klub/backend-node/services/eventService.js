const db = require('../config/database');

const BASE_EVENT_SELECT = `
  SELECT
    e.*,
    CONCAT_WS(' ', u.first_name, u.last_name) AS host_name
  FROM events e
  LEFT JOIN users u ON u.id = e.created_by
`;

function normalizeEvent(event) {
  if (!event) {
    return null;
  }

  return {
    ...event,
    price: event.price == null ? 0 : Number(event.price),
    capacity: event.capacity == null ? 0 : Number(event.capacity),
    slots_available: event.slots_available == null ? 0 : Number(event.slots_available),
  };
}

async function createEvent(eventData) {
  const [result] = await db.query(
    `INSERT INTO events (
      title,
      description,
      event_date,
      event_time,
      location,
      category,
      capacity,
      slots_available,
      price,
      status,
      image_url,
      created_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      eventData.title,
      eventData.description,
      eventData.date,
      eventData.time,
      eventData.location,
      eventData.category,
      eventData.max_guests,
      eventData.max_guests,
      eventData.price,
      eventData.status,
      eventData.image_url,
      eventData.created_by,
    ]
  );

  return getEventById(result.insertId);
}

async function getEventById(eventId) {
  const [events] = await db.query(
    `${BASE_EVENT_SELECT} WHERE e.id = ? LIMIT 1`,
    [eventId]
  );

  return normalizeEvent(events[0]);
}

async function getPublicEvents() {
  const [events] = await db.query(
    `${BASE_EVENT_SELECT} WHERE e.status != 'draft' ORDER BY e.event_date ASC, e.event_time ASC`
  );

  return events.map(normalizeEvent);
}

async function getPublicEventById(eventId) {
  const [events] = await db.query(
    `${BASE_EVENT_SELECT} WHERE e.id = ? AND e.status != 'draft' LIMIT 1`,
    [eventId]
  );

  return normalizeEvent(events[0]);
}

async function getHostedEventsByUser(userId) {
  const [events] = await db.query(
    `${BASE_EVENT_SELECT} WHERE e.created_by = ? AND e.status != 'draft' ORDER BY e.event_date DESC, e.event_time DESC`,
    [userId]
  );

  return events.map(normalizeEvent);
}

async function getDraftEventsByUser(userId) {
  const [events] = await db.query(
    `${BASE_EVENT_SELECT} WHERE e.created_by = ? AND e.status = 'draft' ORDER BY e.created_at DESC`,
    [userId]
  );

  return events.map(normalizeEvent);
}

async function getAttendingEventsByUser(userId) {
  const [events] = await db.query(
    `
      SELECT
        e.*,
        CONCAT_WS(' ', u.first_name, u.last_name) AS host_name
      FROM events e
      INNER JOIN bookings b ON b.event_id = e.id
      LEFT JOIN users u ON u.id = e.created_by
      WHERE b.user_id = ?
      ORDER BY e.event_date ASC, e.event_time ASC
    `,
    [userId]
  );

  return events.map(normalizeEvent);
}

async function deleteEvent(eventId, userId) {
  const [result] = await db.query(
    'DELETE FROM events WHERE id = ? AND created_by = ?',
    [eventId, userId]
  );

  return result.affectedRows;
}

module.exports = {
  createEvent,
  getEventById,
  getPublicEvents,
  getPublicEventById,
  getHostedEventsByUser,
  getDraftEventsByUser,
  getAttendingEventsByUser,
  deleteEvent,
};

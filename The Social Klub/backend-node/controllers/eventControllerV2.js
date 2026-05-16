const eventService = require('../services/eventService');
const { sendDatabaseError } = require('../utils/dbError');

const EVENT_CATEGORIES = new Set([
  'Social',
  'Music & Live',
  'Art & Culture',
  'Food & Drink',
  'Rooftop',
  'Networking',
  'Other',
]);

const EVENT_STATUSES = new Set(['live', 'upcoming', 'past', 'draft']);

function cleanString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function validateEventPayload(body) {
  const errors = {};
  const title = cleanString(body.title);
  const description = cleanString(body.description);
  const date = cleanString(body.date);
  const time = cleanString(body.time);
  const location = cleanString(body.location);
  const category = cleanString(body.category) || 'Other';
  const image_url = cleanString(body.image_url) || null;
  const status = cleanString(body.status) || 'upcoming';
  const maxGuests = Number(body.max_guests);
  const price = body.price === '' || body.price == null ? 0 : Number(body.price);
  const isDraft = status === 'draft';

  if (!title) {
    errors.title = 'Title is required.';
  } else if (title.length < 3) {
    errors.title = 'Title must be at least 3 characters long.';
  }

  if (!isDraft && !description) {
    errors.description = 'Description is required.';
  }

  if (!isDraft && !date) {
    errors.date = 'Event date is required.';
  }

  if (!isDraft && !time) {
    errors.time = 'Event time is required.';
  }

  if (!isDraft && !location) {
    errors.location = 'Location is required.';
  }

  if (!EVENT_CATEGORIES.has(category)) {
    errors.category = 'Select a valid event category.';
  }

  if (!isDraft && (!Number.isInteger(maxGuests) || maxGuests < 1)) {
    errors.max_guests = 'Guest capacity must be a whole number greater than 0.';
  }

  if (Number.isNaN(price) || price < 0) {
    errors.price = 'Price must be 0 or more.';
  }

  if (!EVENT_STATUSES.has(status)) {
    errors.status = 'Status must be draft, upcoming, live, or past.';
  }

  const scheduledAt = date && time ? new Date(`${date}T${time}`) : null;
  if (date && time && scheduledAt && Number.isNaN(scheduledAt.getTime())) {
    errors.date = 'Enter a valid date and time.';
  } else if (!isDraft && scheduledAt) {
    const now = new Date();
    if (scheduledAt < now && status !== 'past') {
      errors.date = 'Choose a future date/time or mark the event as past.';
    }
  }

  return {
    errors,
    value: {
      title,
      description,
      date,
      time,
      location,
      category,
      image_url,
      status,
      max_guests: maxGuests,
      price,
    },
  };
}

function handleDatabaseError(res, error, fallbackMessage) {
  return sendDatabaseError(res, error, 'Something went wrong while processing the event request.');
}

exports.createEvent = async (req, res) => {
  const { errors, value } = validateEventPayload(req.body);
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: 'Please correct the highlighted event fields.',
      errors,
    });
  }

  try {
    console.log(`[events.create] user=${req.user.id} title="${value.title}" status=${value.status}`);
    const createdEvent = await eventService.createEvent({
      ...value,
      created_by: req.user.id,
    });

    return res.status(201).json({
      message: value.status === 'draft' ? 'Draft saved successfully.' : 'Event created successfully.',
      event: createdEvent,
    });
  } catch (error) {
    return handleDatabaseError(res, error, 'Create event error:');
  }
};

exports.getMyHostedEvents = async (req, res) => {
  try {
    const events = await eventService.getHostedEventsByUser(req.user.id);
    return res.json(events);
  } catch (error) {
    return handleDatabaseError(res, error, 'Get hosted events error:');
  }
};

exports.getMyDrafts = async (req, res) => {
  try {
    const events = await eventService.getDraftEventsByUser(req.user.id);
    return res.json(events);
  } catch (error) {
    return handleDatabaseError(res, error, 'Get draft events error:');
  }
};

exports.getMyAttendingEvents = async (req, res) => {
  try {
    const events = await eventService.getAttendingEventsByUser(req.user.id);
    return res.json(events);
  } catch (error) {
    return handleDatabaseError(res, error, 'Get attending events error:');
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const deletedCount = await eventService.deleteEvent(req.params.id, req.user.id);
    if (!deletedCount) {
      return res.status(404).json({ message: 'Event not found or you do not have permission to delete it.' });
    }

    return res.json({ message: 'Event permanently deleted.' });
  } catch (error) {
    return handleDatabaseError(res, error, 'Delete event error:');
  }
};

exports.getAllPublicEvents = async (req, res) => {
  try {
    const events = await eventService.getPublicEvents();
    return res.json(events);
  } catch (error) {
    return handleDatabaseError(res, error, 'Get all public events error:');
  }
};

exports.getPublicEventById = async (req, res) => {
  try {
    const event = await eventService.getPublicEventById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    return res.json(event);
  } catch (error) {
    return handleDatabaseError(res, error, 'Get public event by id error:');
  }
};

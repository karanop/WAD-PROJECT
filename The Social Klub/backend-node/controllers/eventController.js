const db = require('../config/db');

exports.createEvent = async (req, res) => {
  const { title, description, date, time, location, category, price, max_guests, status, image_url } = req.body;
  
  if (!title || !date || !time) {
    return res.status(400).json({ message: 'Title, Date, and Time are required' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO events (title, description, event_date, event_time, location, category, capacity, slots_available, price, status, image_url, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title, 
        description || null, 
        date, 
        time, 
        location || 'Various locations', 
        category || 'Other', 
        parseInt(max_guests) || 0, 
        parseInt(max_guests) || 0, 
        parseFloat(price) || 0.00, 
        status || 'upcoming', 
        image_url || null, 
        req.user.id
      ]
    );
    
    const [newEvent] = await db.query('SELECT * FROM events WHERE id = ?', [result.insertId]);

    res.status(201).json({ message: 'Event successfully created', event: newEvent[0] });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error parsing database insert' });
  }
};

exports.getMyHostedEvents = async (req, res) => {
  try {
    const [events] = await db.query("SELECT * FROM events WHERE created_by = ? AND status != 'draft' ORDER BY event_date DESC, event_time DESC", [req.user.id]);
    res.json(events);
  } catch (error) {
    console.error('Get hosted events error:', error);
    res.status(500).json({ message: 'Server error fetching hosted events' });
  }
};

exports.getMyDrafts = async (req, res) => {
  try {
    const [events] = await db.query("SELECT * FROM events WHERE created_by = ? AND status = 'draft' ORDER BY created_at DESC", [req.user.id]);
    res.json(events);
  } catch (error) {
    console.error('Get draft events error:', error);
    res.status(500).json({ message: 'Server error fetching drafts' });
  }
};

exports.getMyAttendingEvents = async (req, res) => {
  try {
    const [events] = await db.query(`
      SELECT e.* 
      FROM events e 
      JOIN bookings b ON e.id = b.event_id 
      WHERE b.user_id = ? 
      ORDER BY e.event_date ASC
    `, [req.user.id]);
    res.json(events);
  } catch (error) {
    console.error('Get attending events error:', error);
    res.status(500).json({ message: 'Server error fetching booked events' });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM events WHERE id = ? AND created_by = ?', [req.params.id, req.user.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Event not found or you are not fully authorized to perform this delete.' });
    }
    res.json({ message: 'Event permanently deleted' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Server error trying to delete target event' });
  }
};

exports.getAllPublicEvents = async (req, res) => {
  try {
    // Only fetch events that are not drafts
    const [events] = await db.query("SELECT * FROM events WHERE status != 'draft' ORDER BY event_date ASC, event_time ASC");
    res.json(events);
  } catch (error) {
    console.error('Get all public events error:', error);
    res.status(500).json({ message: 'Server error fetching public events' });
  }
};

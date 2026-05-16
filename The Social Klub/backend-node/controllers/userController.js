const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { sendDatabaseError } = require('../utils/dbError');

exports.registerUser = async (req, res) => {
  const { first_name, last_name, email, password, phone_number, date_of_birth, city, role } = req.body;
  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const defaultRole = role || 'student';
    // Check if user exists
    const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Insert user
    const [result] = await db.query(
      'INSERT INTO users (first_name, last_name, email, phone_number, date_of_birth, city, password_hash, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [first_name, last_name, email, phone_number || null, date_of_birth || null, city || null, password_hash, defaultRole]
    );

    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  } catch (error) {
    sendDatabaseError(res, error, 'Registration failed.');
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    const safeUser = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone_number: user.phone_number,
      date_of_birth: user.date_of_birth,
      city: user.city,
      role: user.role
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '10h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, role: user.role, userId: user.id, user: safeUser });
      }
    );
  } catch (error) {
    sendDatabaseError(res, error, 'Login failed.');
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, first_name, last_name, email, phone_number, date_of_birth, city, role, created_at FROM users WHERE id = ?', [req.params.id]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(users[0]);
  } catch (error) {
    sendDatabaseError(res, error, 'Failed to load profile.');
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, first_name, last_name, email, phone_number, date_of_birth, city, role, created_at FROM users');
    res.json(users);
  } catch (error) {
    sendDatabaseError(res, error, 'Failed to load users.');
  }
};

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { ensureEventSchema } = require('./services/schemaService');

const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

// Middleware
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));

// Basic health check
app.get('/', (req, res) => {
  res.send('The Social Klub Node/Express API is running!');
});

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((error, req, res, next) => {
  if (error.message && error.message.startsWith('CORS blocked')) {
    return res.status(403).json({ message: error.message });
  }

  console.error('Unhandled server error:', error);
  return res.status(500).json({ message: 'Unexpected server error.' });
});

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

async function startServer() {
  await ensureEventSchema();

  app.listen(PORT, HOST, () => {
    console.log(`Node server running on ${HOST}:${PORT}`);
    console.log(`CORS origins: ${allowedOrigins.join(', ') || '(any)'}`);
  });
}

startServer();


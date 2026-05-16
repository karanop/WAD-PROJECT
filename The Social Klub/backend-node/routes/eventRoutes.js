const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const eventController = require('../controllers/eventControllerV2');

// Public endpoints
router.get('/public', eventController.getAllPublicEvents);
router.get('/public/:id', eventController.getPublicEventById);

// All dashboard endpoints are authorized
router.use(auth);

// API/EVENTS endpoints
router.post('/create', eventController.createEvent);
router.post('/', eventController.createEvent);
router.get('/mine', eventController.getMyHostedEvents);
router.get('/drafts', eventController.getMyDrafts);
router.get('/attending', eventController.getMyAttendingEvents);
router.delete('/:id', eventController.deleteEvent);

module.exports = router;

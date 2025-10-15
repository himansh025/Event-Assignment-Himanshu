const express = require('express');
const router = express.Router();
const {
  createEvent,
  getEventDetails,
  listUpcomingEvents,
  getEventStatistics
} = require('../controllers/eventController');
const { validateEvent } = require('../middleware/validation');

router.post('/', validateEvent, createEvent);
router.get('/upcoming', listUpcomingEvents);
router.get('/:id', getEventDetails);
router.get('/:id/statistics', getEventStatistics);

module.exports = router;
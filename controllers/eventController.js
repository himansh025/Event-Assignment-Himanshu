const { Event } = require('../models');
const asyncHandler = require('../middleware/asyncHandler');

// Create a new event
const createEvent = asyncHandler(async (req, res) => {
  const { title, dateTime, location, capacity } = req.body;
  
  const event = await Event.create({
    title,
    dateTime,
    location,
    capacity
  });

  res.status(201).json({
    message: 'Event created successfully',
    eventId: event.id
  });
});

// Get event details with registered users
const getEventDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const result = await Event.getEventWithUsers(parseInt(id));
  
  if (!result.event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  res.json({
    event: {
      id: result.event.id,
      title: result.event.title,
      dateTime: result.event.date_time,
      location: result.event.location,
      capacity: result.event.capacity,
      currentRegistrations: parseInt(result.event.current_registrations)
    },
    registeredUsers: result.users
  });
});

// List upcoming events
const listUpcomingEvents = asyncHandler(async (req, res) => {
  const events = await Event.findAllUpcoming();
  
  const formattedEvents = events.map(event => ({
    id: event.id,
    title: event.title,
    dateTime: event.date_time,
    location: event.location,
    capacity: event.capacity,
    currentRegistrations: parseInt(event.current_registrations),
    remainingCapacity: event.capacity - parseInt(event.current_registrations)
  }));

  res.json({
    events: formattedEvents,
    total: formattedEvents.length
  });
});

// Get event statistics
const getEventStatistics = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const event = await Event.findById(parseInt(id));
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  const statistics = await Event.getEventStatistics(parseInt(id));
  
  res.json({
    eventId: parseInt(id),
    eventTitle: event.title,
    statistics: {
      totalRegistrations: parseInt(statistics.total_registrations),
      remainingCapacity: statistics.remaining_capacity,
      capacityPercentage: parseFloat(statistics.capacity_percentage)
    }
  });
});

module.exports = {
  createEvent,
  getEventDetails,
  listUpcomingEvents,
  getEventStatistics
};
 const { User, Registration } = require('../models');
const asyncHandler = require('../middleware/asyncHandler');

// Register user for event
const registerForEvent = asyncHandler(async (req, res) => {
  const { userId, eventId } = req.body;

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Create registration with transaction
  const registration = await Registration.create(userId, eventId);

  res.status(201).json({
    message: 'Successfully registered for event',
    registrationId: registration.id
  });
});

// Cancel registration
const cancelRegistration = asyncHandler(async (req, res) => {
  const { userId, eventId } = req.body;

  const registration = await Registration.delete(userId, eventId);
  
  if (!registration) {
    return res.status(404).json({ error: 'Registration not found' });
  }

  res.json({
    message: 'Registration cancelled successfully'
  });
});

// Create or find user
const createUser = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  const user = await User.findOrCreate({ name, email });

  res.status(201).json({
    message: 'User processed successfully',
    userId: user.id,
    isNew: user.created_at === user.updated_at
  });
});

module.exports = {
  registerForEvent,
  cancelRegistration,
  createUser
};
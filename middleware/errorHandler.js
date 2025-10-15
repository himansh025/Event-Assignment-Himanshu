const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Database errors
  if (err.code === '23505') { // Unique violation
    return res.status(409).json({ error: 'Resource already exists' });
  }

  if (err.code === '23503') { // Foreign key violation
    return res.status(404).json({ error: 'Referenced resource not found' });
  }

  // Custom business logic errors
  if (err.message.includes('not found')) {
    return res.status(404).json({ error: err.message });
  }

  if (err.message.includes('already registered') || 
      err.message.includes('reached capacity') ||
      err.message.includes('past events')) {
    return res.status(409).json({ error: err.message });
  }

  // Default error
  res.status(500).json({ error: 'Internal server error' });
};

module.exports = errorHandler;
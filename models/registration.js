const pool = require('../config/database');

class Registration {
  static async create(userId, eventId) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Check if event exists and get capacity
      const eventQuery = `
        SELECT capacity, date_time < NOW() as is_past
        FROM events 
        WHERE id = $1 FOR UPDATE
      `;
      const eventResult = await client.query(eventQuery, [eventId]);
      
      if (eventResult.rows.length === 0) {
        throw new Error('Event not found');
      }

      const event = eventResult.rows[0];
      
      if (event.is_past) {
        throw new Error('Cannot register for past events');
      }

      // Check current registrations
      const countQuery = 'SELECT COUNT(*) FROM registrations WHERE event_id = $1';
      const countResult = await client.query(countQuery, [eventId]);
      const currentRegistrations = parseInt(countResult.rows[0].count);

      if (currentRegistrations >= event.capacity) {
        throw new Error('Event has reached capacity');
      }

      // Check if user is already registered
      const existingQuery = 'SELECT id FROM registrations WHERE user_id = $1 AND event_id = $2';
      const existingResult = await client.query(existingQuery, [userId, eventId]);
      
      if (existingResult.rows.length > 0) {
        throw new Error('User is already registered for this event');
      }

      // Create registration
      const insertQuery = `
        INSERT INTO registrations (user_id, event_id)
        VALUES ($1, $2)
        RETURNING *
      `;
      const registrationResult = await client.query(insertQuery, [userId, eventId]);

      await client.query('COMMIT');
      return registrationResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async delete(userId, eventId) {
    const query = `
      DELETE FROM registrations 
      WHERE user_id = $1 AND event_id = $2 
      RETURNING *
    `;
    const result = await pool.query(query, [userId, eventId]);
    return result.rows[0];
  }

  static async exists(userId, eventId) {
    const query = 'SELECT id FROM registrations WHERE user_id = $1 AND event_id = $2';
    const result = await pool.query(query, [userId, eventId]);
    return result.rows.length > 0;
  }
}

module.exports = Registration;
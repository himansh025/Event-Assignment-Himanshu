const pool = require('../config/database');

class Event {
  static async create({ title, dateTime, location, capacity }) {
    const query = `
      INSERT INTO events (title, date_time, location, capacity)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [title, dateTime, location, capacity];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT 
        e.*,
        COUNT(r.id) as current_registrations
      FROM events e
      LEFT JOIN registrations r ON e.id = r.event_id
      WHERE e.id = $1
      GROUP BY e.id
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findAllUpcoming() {
    const query = `
      SELECT 
        e.*,
        COUNT(r.id) as current_registrations
      FROM events e
      LEFT JOIN registrations r ON e.id = r.event_id
      WHERE e.date_time > NOW()
      GROUP BY e.id
      ORDER BY e.date_time ASC, e.location ASC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async getEventWithUsers(id) {
    const eventQuery = `
      SELECT 
        e.*,
        COUNT(r.id) as current_registrations
      FROM events e
      LEFT JOIN registrations r ON e.id = r.event_id
      WHERE e.id = $1
      GROUP BY e.id
    `;
    
    const usersQuery = `
      SELECT u.id, u.name, u.email, r.registered_at
      FROM users u
      INNER JOIN registrations r ON u.id = r.user_id
      WHERE r.event_id = $1
      ORDER BY r.registered_at ASC
    `;

    const [eventResult, usersResult] = await Promise.all([
      pool.query(eventQuery, [id]),
      pool.query(usersQuery, [id])
    ]);

    return {
      event: eventResult.rows[0],
      users: usersResult.rows
    };
  }

  static async getEventStatistics(id) {
    const query = `
      SELECT 
        e.capacity,
        COUNT(r.id) as total_registrations,
        (e.capacity - COUNT(r.id)) as remaining_capacity,
        ROUND((COUNT(r.id)::DECIMAL / e.capacity) * 100, 2) as capacity_percentage
      FROM events e
      LEFT JOIN registrations r ON e.id = r.event_id
      WHERE e.id = $1
      GROUP BY e.id
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async isPastEvent(id) {
    const query = 'SELECT date_time < NOW() as is_past FROM events WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0]?.is_past || false;
  }
}

module.exports = Event;
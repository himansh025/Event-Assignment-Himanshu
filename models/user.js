const pool = require('../config/database');

class User {
  static async create({ name, email }) {
    const query = `
      INSERT INTO users (name, email)
      VALUES ($1, $2)
      RETURNING *
    `;
    const values = [name, email];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findOrCreate({ name, email }) {
    let user = await this.findByEmail(email);
    if (!user) {
      user = await this.create({ name, email });
    }
    return user;
  }
}

module.exports = User;
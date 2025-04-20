// controllers/authController.js
import pool from '../config/db.js';  // PostgreSQL pool
import bcrypt from 'bcrypt';         // For password hashing
import jwt from 'jsonwebtoken';      // For JWT generation

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!['buyer', 'seller'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  try {
    // Check for duplicate email
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, hashed, role]
    );

    res.status(201).json({ message: 'User registered', user: result.rows[0] });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// config/db.js

import dotenv from 'dotenv';
import pkg from 'pg';  // Default import of the 'pg' module
const { Pool } = pkg; // Destructure 'Pool' from the imported package

dotenv.config(); // Load environment variables from the .env file

const pool = new Pool({
  user: process.env.DB_USER,      // From .env file
  host: process.env.DB_HOST,      // From .env file
  database: process.env.DB_NAME,  // From .env file
  password: process.env.DB_PASSWORD, // From .env file
  port: process.env.DB_PORT,      // From .env file
});

// Test the connection to PostgreSQL
pool.connect()
  .then(() => {
    console.log('✅ Connected to PostgreSQL database');
    console.log('connected');
  })
  .catch((err) => {
    console.error('❌ Error connecting to the database', err);
  });

// Export the pool object for use in other parts of your application
export default pool;

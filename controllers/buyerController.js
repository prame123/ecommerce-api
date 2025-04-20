import pool from '../config/db.js';


export const getSellers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email FROM users WHERE role = 'seller'"
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error getting sellers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get catalog of a specific seller
export const getCatalog = async (req, res) => {
  const { seller_id } = req.params;

  // Validate seller_id to be a number
  if (isNaN(seller_id)) {
    return res.status(400).json({ error: 'Invalid seller_id' });
  }

  try {
    const catalog = await pool.query(
      `SELECT p.id, p.name, p.price
       FROM products p
       JOIN catalogs c ON c.id = p.catalog_id
       WHERE c.seller_id = $1`,
      [seller_id]
    );

    if (catalog.rows.length === 0) {
      return res.status(404).json({ error: 'No catalog found for this seller' });
    }

    res.json(catalog.rows);
  } catch (error) {
    console.error('Error getting catalog:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create an order for all products of a seller
export const createOrder = async (req, res) => {
  const { seller_id } = req.params;
  const buyer_id = req.user.id;

  // Validate seller_id to be a number
  if (isNaN(seller_id)) {
    return res.status(400).json({ error: 'Invalid seller_id' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Get products from seller's catalog
    const catalogRes = await client.query(
      `SELECT p.id
       FROM products p
       JOIN catalogs c ON c.id = p.catalog_id
       WHERE c.seller_id = $1`,
      [seller_id]
    );

    const products = catalogRes.rows;

    // If no products found, rollback transaction and return error
    if (!products.length) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'No products found for this seller' });
    }

    // Insert order
    const orderRes = await client.query(
      'INSERT INTO orders (buyer_id, seller_id) VALUES ($1, $2) RETURNING id',
      [buyer_id, seller_id]
    );
    const order_id = orderRes.rows[0].id;

    // Insert order items
    for (const product of products) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id) VALUES ($1, $2)',
        [order_id, product.id]
      );
    }

    await client.query('COMMIT');
    res.json({ message: 'Order placed successfully', order_id });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
};

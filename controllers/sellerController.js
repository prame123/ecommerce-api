
import pool from '../config/db.js';

export const createCatalog = async (req, res) => {
  const seller_id = req.user.id;
  const { products } = req.body;

  const existing = await pool.query('SELECT * FROM catalogs WHERE seller_id = $1', [seller_id]);
  if (existing.rows.length) return res.status(400).json({ error: 'Catalog already exists' });

  const catalog = await pool.query(
    'INSERT INTO catalogs (seller_id) VALUES ($1) RETURNING id',
    [seller_id]
  );
  const catalog_id = catalog.rows[0].id;

  for (const p of products) {
    await pool.query('INSERT INTO products (name, price, catalog_id) VALUES ($1, $2, $3)', [
      p.name,
      p.price,
      catalog_id,
    ]);
  }

  res.json({ message: 'Catalog created successfully' });
};

export const viewOrders = async (req, res) => {
  const seller_id = req.user.id;

  const orders = await pool.query(
    `SELECT o.id AS order_id, u.name AS buyer_name, u.email, 
            json_agg(json_build_object('name', p.name, 'price', p.price)) AS products
     FROM orders o
     JOIN users u ON o.buyer_id = u.id
     JOIN order_items oi ON oi.order_id = o.id
     JOIN products p ON oi.product_id = p.id
     WHERE o.seller_id = $1
     GROUP BY o.id, u.name, u.email`,
    [seller_id]
  );

  res.json(orders.rows);
};

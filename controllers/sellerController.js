
import pool from '../config/db.js';

export const createCatalog = async (req, res) => {
  console.log(' createCatalog controller');
  const seller_id = req.user?.id;
   console.log('seller Id from token:', seller_id);
  const { products } = req.body;
  console.log('products received:',products);
  if (!products || !Array.isArray(products) || products.length === 0) {
    console.log('❌ Invalid or empty products array');
    return res.status(400).json({ error: 'Invalid or empty products array' });
 
     }
        try{
  const existing = await pool.query('SELECT * FROM catalogs WHERE seller_id = $1', [seller_id]);
  console.log('🧾 Existing catalog check result:', existing.rows);
  if (existing.rows.length) {
    console.log('⚠️ Catalog already exists');
    return res.status(400).json({ error: 'Catalog already exists' });
  }
  const catalog = await pool.query(
    'INSERT INTO catalogs (seller_id) VALUES ($1) RETURNING id',
    [seller_id]
  );
  const catalog_id = catalog.rows[0].id;
  console.log('created catlog with Id:',catalog_id);

  for (const p of products) {
    console.log('Inserting Product:',p);
    await pool.query('INSERT INTO products (name, price, catalog_id) VALUES ($1, $2, $3)', [
      p.name,
      p.price,
      catalog_id,
    ]);
  }
  console.log('✅ Catalog created and inserted products');
  return res.status(201).json({ message: 'Catalog created successfully' });
}
catch(error){
  console.error('createCatlog error:',error.message);
 return  res.status(500).json({error:'Server error while creating catlog'});
}
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

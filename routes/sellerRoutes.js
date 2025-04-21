/* import express from 'express';
import { createCatalog, viewOrders } from '../controllers/sellerController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create-catalog', authMiddleware, createCatalog);
router.get('/orders', authMiddleware, viewOrders);

export default router;
 */
import express from 'express';
import { createCatalog, viewOrders } from '../controllers/sellerController.js';
import auth from '../middlewares/authMiddleware.js';

const router = express.Router();

// Only authenticated users with role 'seller' can access these
router.post('/create-catalog', auth('seller'), createCatalog);
router.get('/orders', auth('seller'), viewOrders);

export default router;

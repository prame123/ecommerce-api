import express from 'express';
import { createCatalog, viewOrders } from '../controllers/sellerController.js';
import auth from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create-catalog', auth('seller'), createCatalog);
router.get('/orders', auth('seller'), viewOrders);

export default router;

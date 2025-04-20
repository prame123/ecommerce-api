import express from 'express';
import { createCatalog, viewOrders } from '../controllers/sellerController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create-catalog', authMiddleware, createCatalog);
router.get('/orders', authMiddleware, viewOrders);

export default router;

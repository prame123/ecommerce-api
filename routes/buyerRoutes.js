// routes/buyerRoutes.js
import express from 'express';
import { getSellers, getCatalog, createOrder } from '../controllers/buyerController.js';
import auth from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes are protected by auth('buyer')
router.get('/list-of-sellers', auth('buyer'), getSellers);
router.get('/seller-catalog/:seller_id', auth('buyer'), getCatalog);
router.post('/create-order/:seller_id', auth('buyer'), createOrder);

export default router;

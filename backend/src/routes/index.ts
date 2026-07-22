import { Router } from 'express';
import authRoutes from './auth.routes';
import productRoutes from './product.routes';
import cartRoutes from './cart.routes';
import orderRoutes from './order.routes';

const router = Router();

/**
 * API Routes
 */
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);

/**
 * Health Check
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'VELBERS API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;

import { Router } from 'express';
import { CartController } from '../controllers/cart.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * Cart Routes
 */
router.get('/', CartController.getCart);
router.post('/add', CartController.addToCart);
router.patch('/items/:itemId', CartController.updateCartItem);
router.delete('/items/:itemId', CartController.removeFromCart);
router.delete('/', CartController.clearCart);

export default router;

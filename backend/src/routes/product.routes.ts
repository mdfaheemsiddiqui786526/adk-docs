import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';

const router = Router();

/**
 * Product Routes
 */
router.get('/', ProductController.getProducts);
router.get('/featured', ProductController.getFeaturedProducts);
router.get('/bestsellers', ProductController.getBestsellers);
router.get('/new-arrivals', ProductController.getNewArrivals);
router.get('/slug/:slug', ProductController.getProductBySlug);
router.get('/:id', ProductController.getProductById);

export default router;

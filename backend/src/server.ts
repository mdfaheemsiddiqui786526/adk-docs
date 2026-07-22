import 'dotenv/config';
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import apiRoutes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app: Express = express();
const PORT = process.env.PORT || 5000;

/**
 * Security Middleware
 */
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));

/**
 * Rate Limiting
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

/**
 * CORS Configuration
 */
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

/**
 * Body Parser
 */
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

/**
 * Augment Express Request with user property
 */
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

/**
 * API Routes
 */
app.use('/api/v1', apiRoutes);

/**
 * 404 Handler
 */
app.use(notFoundHandler);

/**
 * Error Handler
 */
app.use(errorHandler);

/**
 * Start Server
 */
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 API Documentation: http://localhost:${PORT}/api/v1/docs`);
});

export default app;

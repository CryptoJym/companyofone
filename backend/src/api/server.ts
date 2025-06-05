import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Import routes
import { healthRouter } from '@routes/health';
import { apiRouter } from '@routes/api';
import { contactRouter } from '@routes/contact';
import { blogRouter } from '@routes/blog';

// Import middleware
import { errorHandler } from '@middleware/errorHandler';
import { notFoundHandler } from '@middleware/notFoundHandler';
import { requestValidator } from '@middleware/requestValidator';

// Import config
import { config } from '@config/config';

// Load environment variables
dotenv.config();

// Create Express app
const app: Application = express();

// Trust proxy (important for Vercel)
app.set('trust proxy', 1);

// Basic middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(cors({
  origin: config.cors.origin,
  credentials: true,
  optionsSuccessStatus: 200,
}));

app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (config.env !== 'test') {
  app.use(morgan(config.env === 'production' ? 'combined' : 'dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Request validation middleware
app.use(requestValidator);

// API Routes
app.use('/health', healthRouter);
app.use('/api/v1', apiRouter);
app.use('/api/v1/contact', contactRouter);
app.use('/api/v1/blog', blogRouter);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Company of One API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api/v1',
      contact: '/api/v1/contact',
      blog: '/api/v1/blog',
    },
  });
});

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Start server only if not in serverless environment
if (process.env.VERCEL !== '1') {
  const PORT = config.port;
  app.listen(PORT, () => {
    console.log(`🚀 Company of One API running on port ${PORT}`);
    console.log(`📍 Environment: ${config.env}`);
  });
}

// Export for Vercel
export default app;
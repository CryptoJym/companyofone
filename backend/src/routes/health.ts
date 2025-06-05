import { Router, Request, Response } from 'express';

export const healthRouter = Router();

healthRouter.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    message: 'Company of One API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

healthRouter.get('/ready', (req: Request, res: Response) => {
  // Add additional readiness checks here (e.g., database connectivity)
  const isReady = true; // Placeholder for actual checks
  
  if (isReady) {
    res.status(200).json({
      status: 'ready',
      message: 'Service is ready to accept requests',
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(503).json({
      status: 'not ready',
      message: 'Service is not ready',
      timestamp: new Date().toISOString(),
    });
  }
});
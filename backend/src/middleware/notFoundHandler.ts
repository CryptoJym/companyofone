import { Request, Response } from 'express';

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Resource not found',
      path: req.originalUrl,
      method: req.method,
    },
    timestamp: new Date().toISOString(),
  });
};
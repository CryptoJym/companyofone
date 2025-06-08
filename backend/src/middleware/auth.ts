import { Request, Response, NextFunction } from 'express';

// Simple API key authentication for blog admin operations
export const blogAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // For write operations (POST, PUT, DELETE), require authentication
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');
    const adminApiKey = process.env.BLOG_ADMIN_API_KEY || 'your-secure-api-key-here';
    
    if (!apiKey || apiKey !== adminApiKey) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required for this operation',
      });
    }
  }
  
  next();
};

// Optional: More sophisticated JWT-based authentication
export const jwtAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Skip authentication for read operations
  if (['GET'].includes(req.method)) {
    return next();
  }

  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required',
    });
  }

  try {
    // In a real implementation, verify JWT token here
    // For now, just check if it's a valid format
    if (token.length < 10) {
      throw new Error('Invalid token');
    }
    
    // Add user info to request if needed
    (req as any).user = { id: 'admin', role: 'admin' };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};
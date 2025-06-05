import { Request, Response, NextFunction } from 'express';

export const requestValidator = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Sanitize request data
  if (req.body && typeof req.body === 'object') {
    sanitizeObject(req.body);
  }
  
  if (req.query && typeof req.query === 'object') {
    sanitizeObject(req.query);
  }
  
  if (req.params && typeof req.params === 'object') {
    sanitizeObject(req.params);
  }
  
  next();
};

function sanitizeObject(obj: any): void {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'string') {
        // Trim whitespace
        obj[key] = obj[key].trim();
        
        // Remove potential XSS attempts
        obj[key] = obj[key].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        
        // Remove SQL injection attempts (basic)
        if (obj[key].match(/(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)/i)) {
          obj[key] = obj[key].replace(/[;'"\\]/g, '');
        }
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitizeObject(obj[key]);
      }
    }
  }
}
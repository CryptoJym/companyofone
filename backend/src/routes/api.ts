import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

export const apiRouter = Router();

// Validation middleware
const handleValidationErrors = (req: Request, res: Response, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

// Consultation form validation rules
const consultationValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('businessType')
    .trim()
    .notEmpty().withMessage('Business type is required')
    .isIn(['solopreneur', 'freelancer', 'consultant', 'small-business', 'other'])
    .withMessage('Invalid business type'),
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 10, max: 2000 }).withMessage('Message must be between 10 and 2000 characters'),
];

// API info endpoint
apiRouter.get('/', (req: Request, res: Response) => {
  res.json({
    version: 'v1',
    message: 'Company of One API v1',
    documentation: 'https://api.companyofone.ai/docs',
    endpoints: {
      health: '/health',
      contact: '/api/v1/contact',
      consultation: '/api/v1/consultation',
      resources: '/api/v1/resources',
      tools: '/api/v1/tools',
      blog: '/api/v1/blog',
    },
  });
});

// Consultation booking endpoint
apiRouter.post('/consultation', consultationValidation, handleValidationErrors, async (req: Request, res: Response) => {
  const { name, email, businessType, message } = req.body;
  
  try {
    // TODO: Implement consultation booking logic
    // - Save to database
    // - Send confirmation email
    // - Create calendar event
    // - Add to CRM
    
    res.status(201).json({
      success: true,
      message: 'Thank you for your consultation request! We\'ll contact you within 24 hours to schedule your free session.',
      data: {
        confirmationId: `CONS-${Date.now()}`,
        name,
        email,
        businessType,
        status: 'pending',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Consultation form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process consultation request. Please try again later.',
    });
  }
});

// Resources endpoint placeholder
apiRouter.get('/resources', (req: Request, res: Response) => {
  // TODO: Implement resources fetching
  res.json({
    success: true,
    data: {
      resources: [
        {
          id: 1,
          title: 'The Solopreneur\'s Guide to Automation',
          type: 'guide',
          url: '/resources/automation-guide',
        },
        {
          id: 2,
          title: 'Building Your One-Person Business',
          type: 'ebook',
          url: '/resources/one-person-business',
        },
      ],
    },
  });
});

// Tools endpoint placeholder
apiRouter.get('/tools', (req: Request, res: Response) => {
  // TODO: Implement tools listing
  res.json({
    success: true,
    data: {
      tools: [
        {
          id: 1,
          name: 'AI Business Assistant',
          description: 'Your personal AI assistant for business tasks',
          category: 'productivity',
          status: 'available',
        },
        {
          id: 2,
          name: 'Growth Roadmap Generator',
          description: 'Create customized growth strategies',
          category: 'planning',
          status: 'available',
        },
      ],
    },
  });
});
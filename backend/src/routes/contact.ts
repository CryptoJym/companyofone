import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

export const contactRouter = Router();

// Contact form validation rules
const contactValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('subject')
    .trim()
    .notEmpty().withMessage('Subject is required')
    .isLength({ min: 5, max: 200 }).withMessage('Subject must be between 5 and 200 characters'),
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 10, max: 5000 }).withMessage('Message must be between 10 and 5000 characters'),
  body('businessType')
    .optional()
    .trim()
    .isIn(['solopreneur', 'freelancer', 'consultant', 'small-business', 'other'])
    .withMessage('Invalid business type'),
];

// Contact form submission endpoint
contactRouter.post('/', contactValidation, async (req: Request, res: Response) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const { name, email, subject, message, businessType } = req.body;

  try {
    // TODO: Implement actual contact form processing
    // - Save to database
    // - Send email notification
    // - Add to CRM
    // - Send auto-response

    // For now, just return success
    res.status(200).json({
      success: true,
      message: 'Thank you for contacting us. We\'ll get back to you within 24 hours.',
      data: {
        ticketId: `CONTACT-${Date.now()}`,
        name,
        email,
        subject,
        businessType: businessType || 'not-specified',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process contact form. Please try again later.',
    });
  }
});

// Get contact information
contactRouter.get('/info', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      email: 'support@companyofone.ai',
      phone: '+1 (555) 123-4567',
      hours: {
        weekdays: '9:00 AM - 6:00 PM EST',
        weekends: 'Closed',
      },
      responseTime: 'Within 24 hours',
      social: {
        twitter: '@companyofone',
        linkedin: 'company-of-one',
      },
    },
  });
});
import { Router, Request, Response } from 'express';

export const apiRouter = Router();

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
    },
  });
});

// Consultation booking endpoint placeholder
apiRouter.post('/consultation', (req: Request, res: Response) => {
  const { name, email, businessType, message } = req.body;
  
  // TODO: Implement consultation booking logic
  // - Validate input
  // - Save to database
  // - Send confirmation email
  // - Create calendar event
  
  res.status(201).json({
    success: true,
    message: 'Consultation request received',
    data: {
      confirmationId: `CONS-${Date.now()}`,
      name,
      email,
      businessType,
      status: 'pending',
    },
  });
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
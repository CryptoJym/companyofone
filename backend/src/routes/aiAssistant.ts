import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { aiAssistant, ChatMessage, ChatContext } from '../services/aiAssistant';

const router = Router();

// In-memory storage for chat sessions (in production, use Redis or database)
const chatSessions = new Map<string, ChatMessage[]>();

// Chat endpoint
router.post(
  '/chat',
  [
    body('message')
      .trim()
      .isLength({ min: 1, max: 1000 })
      .withMessage('Message must be between 1 and 1000 characters'),
    body('sessionId')
      .optional()
      .isUUID()
      .withMessage('Session ID must be a valid UUID'),
    body('userId')
      .optional()
      .isString()
      .withMessage('User ID must be a string')
  ],
  async (req: Request, res: Response) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { message, sessionId = uuidv4(), userId } = req.body;

      // Get or create chat session
      if (!chatSessions.has(sessionId)) {
        chatSessions.set(sessionId, []);
      }

      const messages = chatSessions.get(sessionId)!;

      // Add user message to session
      const userMessage: ChatMessage = {
        id: uuidv4(),
        role: 'user',
        content: message,
        timestamp: new Date()
      };

      messages.push(userMessage);

      // Create chat context
      const context: ChatContext = {
        messages,
        userId,
        sessionId
      };

      // Process the query with AI assistant
      const aiResponse = await aiAssistant.processQuery(message, context);

      // Add assistant message to session
      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: aiResponse.response,
        timestamp: new Date()
      };

      messages.push(assistantMessage);

      // Update session
      chatSessions.set(sessionId, messages);

      res.json({
        success: true,
        data: {
          response: aiResponse.response,
          category: aiResponse.category,
          confidence: aiResponse.confidence,
          suggestions: aiResponse.suggestions,
          sessionId,
          messageId: assistantMessage.id
        }
      });

    } catch (error) {
      console.error('AI Assistant error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to process your request. Please try again.'
      });
    }
  }
);

// Get chat history
router.get('/chat/:sessionId', (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Session ID is required'
      });
    }

    const messages = chatSessions.get(sessionId) || [];

    res.json({
      success: true,
      data: {
        messages,
        sessionId
      }
    });

  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve chat history'
    });
  }
});

// Get business tip
router.get('/tip', (req: Request, res: Response) => {
  try {
    const tip = aiAssistant.getBusinessTip();

    res.json({
      success: true,
      data: {
        tip,
        timestamp: new Date()
      }
    });

  } catch (error) {
    console.error('Get business tip error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get business tip'
    });
  }
});

// Clear chat session
router.delete('/chat/:sessionId', (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Session ID is required'
      });
    }

    const existed = chatSessions.delete(sessionId);

    res.json({
      success: true,
      data: {
        cleared: existed,
        sessionId
      }
    });

  } catch (error) {
    console.error('Clear chat session error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear chat session'
    });
  }
});

// Health check for AI assistant
router.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      service: 'AI Business Assistant',
      status: 'operational',
      timestamp: new Date(),
      activeSessions: chatSessions.size
    }
  });
});

export { router as aiAssistantRouter };
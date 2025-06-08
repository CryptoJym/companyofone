import { aiAssistant, ChatContext } from '../../src/services/aiAssistant';

describe('AI Business Assistant', () => {
  describe('processQuery', () => {
    it('should categorize marketing questions correctly', async () => {
      const context: ChatContext = {
        messages: [],
        sessionId: 'test-session'
      };

      const response = await aiAssistant.processQuery(
        'How do I build an email list for my business?',
        context
      );

      expect(response.category).toBe('marketing');
      expect(response.confidence).toBeGreaterThan(0.6);
      expect(response.response).toContain('marketing');
      expect(response.suggestions).toBeDefined();
      expect(response.suggestions!.length).toBeGreaterThan(0);
    });

    it('should categorize finance questions correctly', async () => {
      const context: ChatContext = {
        messages: [],
        sessionId: 'test-session'
      };

      const response = await aiAssistant.processQuery(
        'What pricing strategy should I use for my services?',
        context
      );

      expect(response.category).toBe('finance');
      expect(response.confidence).toBeGreaterThan(0.6);
      expect(response.response).toContain('pricing');
    });

    it('should categorize productivity questions correctly', async () => {
      const context: ChatContext = {
        messages: [],
        sessionId: 'test-session'
      };

      const response = await aiAssistant.processQuery(
        'How can I manage my time better as a solopreneur?',
        context
      );

      expect(response.category).toBe('productivity');
      expect(response.confidence).toBeGreaterThan(0.6);
      expect(response.response).toContain('time');
    });

    it('should handle general questions', async () => {
      const context: ChatContext = {
        messages: [],
        sessionId: 'test-session'
      };

      const response = await aiAssistant.processQuery(
        'Hello, how are you?',
        context
      );

      expect(response.category).toBe('general');
      expect(response.response).toBeDefined();
      expect(response.suggestions).toBeDefined();
    });

    it('should provide suggestions for all categories', async () => {
      const context: ChatContext = {
        messages: [],
        sessionId: 'test-session'
      };

      const response = await aiAssistant.processQuery(
        'Help me grow my business',
        context
      );

      expect(response.suggestions).toBeDefined();
      expect(response.suggestions!.length).toBe(4);
      expect(response.suggestions!.every(s => typeof s === 'string')).toBe(true);
    });
  });

  describe('getBusinessTip', () => {
    it('should return a business tip', () => {
      const tip = aiAssistant.getBusinessTip();
      
      expect(tip).toBeDefined();
      expect(typeof tip).toBe('string');
      expect(tip.length).toBeGreaterThan(0);
    });

    it('should return different tips on multiple calls', () => {
      const tips = new Set();
      
      // Generate 10 tips to check for variety
      for (let i = 0; i < 10; i++) {
        tips.add(aiAssistant.getBusinessTip());
      }
      
      // Should have some variety (though might occasionally repeat due to randomness)
      expect(tips.size).toBeGreaterThan(1);
    });
  });

  describe('confidence scoring', () => {
    it('should give higher confidence for specific business terms', async () => {
      const context: ChatContext = {
        messages: [],
        sessionId: 'test-session'
      };

      const specificResponse = await aiAssistant.processQuery(
        'What marketing strategies work best for content creators and how should I price my consulting services?',
        context
      );

      const generalResponse = await aiAssistant.processQuery(
        'Hi',
        context
      );

      expect(specificResponse.confidence).toBeGreaterThan(generalResponse.confidence);
    });
  });

  describe('response quality', () => {
    it('should include actionable insights in responses', async () => {
      const context: ChatContext = {
        messages: [],
        sessionId: 'test-session'
      };

      const response = await aiAssistant.processQuery(
        'How do I scale my business without hiring employees?',
        context
      );

      expect(response.response).toMatch(/💡.*Key Insight/);
      expect(response.response).toMatch(/🎯.*Actionable Tip/);
    });

    it('should provide category-appropriate suggestions', async () => {
      const context: ChatContext = {
        messages: [],
        sessionId: 'test-session'
      };

      const response = await aiAssistant.processQuery(
        'How do I automate my business processes?',
        context
      );

      expect(response.category).toBe('operations');
      expect(response.suggestions!.some(s => 
        s.toLowerCase().includes('automat') || 
        s.toLowerCase().includes('system') ||
        s.toLowerCase().includes('process')
      )).toBe(true);
    });
  });
});
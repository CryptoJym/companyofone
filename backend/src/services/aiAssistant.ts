export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  category?: BusinessCategory;
  confidence?: number;
}

export interface ChatContext {
  messages: ChatMessage[];
  userId?: string;
  sessionId: string;
}

export interface AIResponse {
  response: string;
  confidence: number;
  category: BusinessCategory;
  suggestions?: string[];
}

export type BusinessCategory = 
  | 'strategy'
  | 'marketing'
  | 'finance'
  | 'productivity'
  | 'growth'
  | 'operations'
  | 'general';

class AIBusinessAssistant {
  private knowledgeBase: Map<string, string[]> = new Map();
  private businessInsights: Map<BusinessCategory, string[]> = new Map();

  constructor() {
    this.initializeKnowledgeBase();
    this.initializeBusinessInsights();
  }

  private initializeKnowledgeBase(): void {
    this.knowledgeBase = new Map([
      ['pricing', [
        'Consider value-based pricing over cost-plus pricing',
        'Test different price points with A/B testing',
        'Premium pricing can increase perceived value',
        'Offer tiered pricing to capture different market segments'
      ]],
      ['marketing', [
        'Focus on content marketing to establish expertise',
        'Build an email list as your owned audience',
        'Leverage social proof and testimonials',
        'Create valuable lead magnets to attract prospects'
      ]],
      ['productivity', [
        'Use time-blocking to manage your schedule',
        'Automate repetitive tasks where possible',
        'Focus on high-impact activities (80/20 rule)',
        'Set boundaries to maintain work-life balance'
      ]],
      ['finance', [
        'Maintain 3-6 months of expenses as emergency fund',
        'Track all business expenses for tax deductions',
        'Separate personal and business finances',
        'Consider quarterly tax payments for better cash flow'
      ]],
      ['growth', [
        'Focus on customer retention over acquisition',
        'Develop multiple revenue streams',
        'Create systems and processes for scalability',
        'Build strategic partnerships'
      ]],
      ['mindset', [
        'Embrace continuous learning and adaptation',
        'Network with other entrepreneurs',
        'Celebrate small wins along the journey',
        'Learn from failures as growth opportunities'
      ]]
    ]);
  }

  private initializeBusinessInsights(): void {
    this.businessInsights = new Map([
      ['strategy', [
        'Define your unique value proposition clearly',
        'Identify your ideal customer avatar',
        'Develop a sustainable competitive advantage',
        'Create a lean business model canvas'
      ]],
      ['marketing', [
        'Build trust through consistent valuable content',
        'Leverage storytelling to connect with audience',
        'Use social media strategically, not everywhere',
        'Measure marketing ROI for all channels'
      ]],
      ['finance', [
        'Price based on value delivered, not time spent',
        'Diversify income sources for stability',
        'Invest in tools that save time and increase efficiency',
        'Track key financial metrics monthly'
      ]],
      ['productivity', [
        'Batch similar tasks to minimize context switching',
        'Delegate or eliminate low-value activities',
        'Use the two-minute rule for quick tasks',
        'Create templates and systems for recurring work'
      ]],
      ['growth', [
        'Focus on solving bigger problems for higher prices',
        'Build systems before scaling operations',
        'Develop passive income streams',
        'Create a referral system for organic growth'
      ]],
      ['operations', [
        'Document all processes for consistency',
        'Use project management tools effectively',
        'Automate customer onboarding and follow-up',
        'Regular review and optimization of workflows'
      ]]
    ]);
  }

  public async processQuery(
    message: string,
    _context: ChatContext
  ): Promise<AIResponse> {
    const category = this.categorizeQuery(message);
    const response = this.generateResponse(message, category);
    const suggestions = this.generateSuggestions(category);

    return {
      response,
      confidence: this.calculateConfidence(message, category),
      category,
      suggestions
    };
  }

  private categorizeQuery(message: string): BusinessCategory {
    const lowerMessage = message.toLowerCase();

    const keywords = {
      strategy: ['strategy', 'plan', 'vision', 'mission', 'goal', 'objective', 'competition', 'market'],
      marketing: ['marketing', 'promotion', 'advertising', 'content', 'social media', 'brand', 'customer', 'audience'],
      finance: ['money', 'pricing', 'revenue', 'profit', 'budget', 'investment', 'cash flow', 'financial'],
      productivity: ['time', 'efficiency', 'productive', 'organize', 'schedule', 'workflow', 'task', 'manage'],
      growth: ['scale', 'grow', 'expand', 'increase', 'revenue', 'customers', 'business development'],
      operations: ['process', 'system', 'automation', 'workflow', 'operations', 'management', 'tools']
    };

    let maxScore = 0;
    let bestCategory: BusinessCategory = 'general';

    for (const [category, words] of Object.entries(keywords)) {
      const score = words.reduce((acc, word) => {
        return acc + (lowerMessage.includes(word) ? 1 : 0);
      }, 0);

      if (score > maxScore) {
        maxScore = score;
        bestCategory = category as BusinessCategory;
      }
    }

    return bestCategory;
  }

  private generateResponse(
    _message: string,
    category: BusinessCategory
  ): string {
    const insights = this.businessInsights.get(category) || [];
    const knowledge = this.knowledgeBase.get(category) || [];

    // Create a contextual response based on the category and message
    let response = this.getBaseResponse(category);

    // Add specific insights
    if (insights.length > 0) {
      const randomInsight = insights[Math.floor(Math.random() * insights.length)];
      response += `\n\n💡 **Key Insight:** ${randomInsight}`;
    }

    // Add actionable advice
    if (knowledge.length > 0) {
      const randomAdvice = knowledge[Math.floor(Math.random() * knowledge.length)];
      response += `\n\n🎯 **Actionable Tip:** ${randomAdvice}`;
    }

    return response;
  }

  private getBaseResponse(category: BusinessCategory): string {
    const responses: Record<BusinessCategory, string> = {
      strategy: "Great question about business strategy! As a solopreneur, having a clear strategy is crucial for sustainable growth.",
      marketing: "Marketing is the lifeblood of any business! Let me share some solopreneur-focused marketing insights.",
      finance: "Financial management is key to business success. Here's what I recommend for solopreneurs:",
      productivity: "Productivity is essential when you're running everything yourself. Here's how to optimize your time:",
      growth: "Scaling as a solopreneur requires smart growth strategies. Here's my advice:",
      operations: "Efficient operations are crucial for solopreneur success. Let me help you streamline:",
      general: "Thanks for your question! As your AI business assistant, I'm here to help you succeed as a solopreneur."
    };

    return responses[category];
  }

  private generateSuggestions(category: BusinessCategory): string[] {
    const suggestions: Record<BusinessCategory, string[]> = {
      strategy: [
        "How do I define my target market?",
        "What's a good competitive analysis framework?",
        "How do I create a business plan?",
        "What are key performance indicators I should track?"
      ],
      marketing: [
        "How do I build an email list?",
        "What's the best social media strategy?",
        "How do I create valuable content?",
        "What are effective lead generation tactics?"
      ],
      finance: [
        "How should I price my services?",
        "What business expenses can I deduct?",
        "How do I manage cash flow?",
        "When should I invest in business tools?"
      ],
      productivity: [
        "What are the best productivity tools?",
        "How do I prioritize tasks effectively?",
        "What's a good daily routine for entrepreneurs?",
        "How do I avoid burnout?"
      ],
      growth: [
        "How do I scale without hiring employees?",
        "What are passive income opportunities?",
        "How do I automate my business?",
        "What partnerships should I consider?"
      ],
      operations: [
        "What systems should I implement first?",
        "How do I automate customer service?",
        "What project management tools work best?",
        "How do I create standard operating procedures?"
      ],
      general: [
        "Tell me about starting a business",
        "How do I validate my business idea?",
        "What are common entrepreneur mistakes?",
        "How do I stay motivated as a solopreneur?"
      ]
    };

    return suggestions[category];
  }

  private calculateConfidence(message: string, category: BusinessCategory): number {
    // Simple confidence calculation based on keyword matches and message length
    const wordCount = message.split(' ').length;
    const baseConfidence = category !== 'general' ? 0.8 : 0.6;
    const lengthBonus = Math.min(wordCount / 20, 0.2);
    
    return Math.min(baseConfidence + lengthBonus, 0.95);
  }

  public getBusinessTip(): string {
    const tips = [
      "Focus on solving one problem really well before expanding",
      "Your network is your net worth - invest in relationships",
      "Automate the repetitive, optimize the strategic",
      "Measure what matters, ignore vanity metrics",
      "Cash flow is more important than profit",
      "Systems create freedom, not restriction",
      "Your biggest competitor is yesterday's version of yourself",
      "Fail fast, learn faster, iterate continuously"
    ];

    const randomIndex = Math.floor(Math.random() * tips.length);
    return tips[randomIndex] as string;
  }
}

export const aiAssistant = new AIBusinessAssistant();
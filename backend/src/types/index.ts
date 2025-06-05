// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    message: string;
    code?: string;
    stack?: string;
  };
  timestamp: string;
}

// Contact form types
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  businessType?: 'solopreneur' | 'freelancer' | 'consultant' | 'small-business' | 'other';
}

// Consultation types
export interface ConsultationRequest {
  name: string;
  email: string;
  businessType: string;
  message: string;
}

export interface ConsultationResponse {
  confirmationId: string;
  name: string;
  email: string;
  businessType: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

// Resource types
export interface Resource {
  id: number;
  title: string;
  type: 'guide' | 'ebook' | 'template' | 'video' | 'article';
  url: string;
  description?: string;
  category?: string;
  isPremium?: boolean;
}

// Tool types
export interface Tool {
  id: number;
  name: string;
  description: string;
  category: 'productivity' | 'planning' | 'marketing' | 'finance' | 'analytics';
  status: 'available' | 'coming-soon' | 'beta';
  features?: string[];
  pricing?: {
    type: 'free' | 'freemium' | 'paid';
    price?: number;
    currency?: string;
  };
}

// User types (for future authentication)
export interface User {
  id: string;
  email: string;
  name: string;
  businessType?: string;
  createdAt: Date;
  updatedAt: Date;
}

// JWT Payload
export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}
// API client for backend communication

// Configuration for API URL
const API_URL = 'http://localhost:3001';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Array<{ msg: string; field?: string }>;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  businessType?: 'solopreneur' | 'freelancer' | 'consultant' | 'small-business' | 'other';
}

export interface ConsultationFormData {
  name: string;
  email: string;
  businessType: string;
  message: string;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Contact form submission
  async submitContactForm(data: ContactFormData): Promise<ApiResponse> {
    return this.request('/api/v1/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Consultation booking
  async submitConsultationForm(data: ConsultationFormData): Promise<ApiResponse> {
    return this.request('/api/v1/consultation', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Get contact information
  async getContactInfo(): Promise<ApiResponse> {
    return this.request('/api/v1/contact/info');
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    return this.request('/health');
  }
}

export const apiClient = new ApiClient();
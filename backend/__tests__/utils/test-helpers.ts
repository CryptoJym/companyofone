import request from 'supertest';
import { Express } from 'express';

// API test helper
export class ApiTestHelper {
  private app: Express;
  
  constructor(app: Express) {
    this.app = app;
  }
  
  // GET request helper
  async get(url: string, headers = {}) {
    return request(this.app)
      .get(url)
      .set(headers);
  }
  
  // POST request helper
  async post(url: string, data = {}, headers = {}) {
    return request(this.app)
      .post(url)
      .send(data)
      .set(headers);
  }
  
  // PUT request helper
  async put(url: string, data = {}, headers = {}) {
    return request(this.app)
      .put(url)
      .send(data)
      .set(headers);
  }
  
  // DELETE request helper
  async delete(url: string, headers = {}) {
    return request(this.app)
      .delete(url)
      .set(headers);
  }
  
  // Helper to get auth token
  async getAuthToken(credentials = { email: 'test@example.com', password: 'password123' }) {
    const response = await this.post('/api/v1/auth/login', credentials);
    return response.body.token;
  }
  
  // Helper to make authenticated request
  async authenticatedRequest(method: string, url: string, data = {}) {
    const token = await this.getAuthToken();
    const headers = { Authorization: `Bearer ${token}` };
    
    switch (method.toLowerCase()) {
      case 'get':
        return this.get(url, headers);
      case 'post':
        return this.post(url, data, headers);
      case 'put':
        return this.put(url, data, headers);
      case 'delete':
        return this.delete(url, headers);
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
  }
}

// Mock data factory
export const mockDataFactory = {
  // Create mock user
  createUser: (overrides = {}) => ({
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    role: 'user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }),
  
  // Create mock product
  createProduct: (overrides = {}) => ({
    id: 'product-123',
    name: 'Test Product',
    description: 'A test product description',
    price: 99.99,
    category: 'test',
    stock: 100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }),
  
  // Create mock order
  createOrder: (overrides = {}) => ({
    id: 'order-123',
    userId: 'user-123',
    items: [],
    total: 0,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }),
};

// Database test utilities
export const dbTestUtils = {
  // Clear all test data
  clearTestData: async () => {
    // Implementation depends on your database
    // This is a placeholder
    console.log('Clearing test data...');
  },
  
  // Seed test data
  seedTestData: async () => {
    // Implementation depends on your database
    // This is a placeholder
    console.log('Seeding test data...');
  },
};

// Custom matchers
export const customMatchers = {
  toBeValidId: (received: any) => {
    const pass = typeof received === 'string' && received.length > 0;
    return {
      pass,
      message: () => `expected ${received} to be a valid ID`,
    };
  },
  
  toBeWithinRange: (received: number, floor: number, ceiling: number) => {
    const pass = received >= floor && received <= ceiling;
    return {
      pass,
      message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
    };
  },
};

// Test timeout utilities
export const timeoutUtils = {
  wait: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),
  
  waitUntil: async (condition: () => boolean, timeout = 5000, interval = 100) => {
    const startTime = Date.now();
    while (!condition()) {
      if (Date.now() - startTime > timeout) {
        throw new Error('Timeout waiting for condition');
      }
      await timeoutUtils.wait(interval);
    }
  },
};
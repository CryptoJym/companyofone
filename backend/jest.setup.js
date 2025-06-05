// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.API_VERSION = 'v1';

// Mock console methods to reduce noise during tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

// Increase timeout for integration tests
jest.setTimeout(30000);

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Global test utilities
global.testUtils = {
  // Helper to create mock Express request
  mockRequest: (options = {}) => ({
    body: {},
    query: {},
    params: {},
    headers: {},
    ...options,
  }),
  
  // Helper to create mock Express response
  mockResponse: () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    res.header = jest.fn().mockReturnValue(res);
    res.setHeader = jest.fn().mockReturnValue(res);
    return res;
  },
  
  // Helper to create mock Express next function
  mockNext: () => jest.fn(),
};
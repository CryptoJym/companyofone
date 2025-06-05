import request from 'supertest';
import express from 'express';
import { ApiTestHelper } from '../utils/test-helpers';

// Mock Express app for testing
const app = express();
app.use(express.json());

// Example routes
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/v1/users', (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) {
    return res.status(400).json({ error: 'Email and name are required' });
  }
  res.status(201).json({ 
    id: 'user-123', 
    email, 
    name,
    createdAt: new Date().toISOString() 
  });
});

describe('API Integration Tests', () => {
  const apiHelper = new ApiTestHelper(app);

  describe('GET /api/v1/health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/v1/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
    });

    it('should return JSON content type', async () => {
      const response = await request(app)
        .get('/api/v1/health')
        .expect('Content-Type', /json/);
    });
  });

  describe('POST /api/v1/users', () => {
    it('should create a new user with valid data', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User'
      };

      const response = await request(app)
        .post('/api/v1/users')
        .send(userData)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(String),
        email: userData.email,
        name: userData.name,
        createdAt: expect.any(String)
      });
    });

    it('should return 400 when email is missing', async () => {
      const response = await request(app)
        .post('/api/v1/users')
        .send({ name: 'Test User' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 when name is missing', async () => {
      const response = await request(app)
        .post('/api/v1/users')
        .send({ email: 'test@example.com' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Using ApiTestHelper', () => {
    it('should make GET request using helper', async () => {
      const response = await apiHelper.get('/api/v1/health');
      expect(response.status).toBe(200);
    });

    it('should make POST request using helper', async () => {
      const userData = {
        email: 'helper@example.com',
        name: 'Helper User'
      };

      const response = await apiHelper.post('/api/v1/users', userData);
      expect(response.status).toBe(201);
      expect(response.body.email).toBe(userData.email);
    });
  });
});

describe('Error Handling', () => {
  it('should handle 404 for unknown routes', async () => {
    const response = await request(app)
      .get('/api/v1/unknown')
      .expect(404);
  });

  it('should handle malformed JSON', async () => {
    const response = await request(app)
      .post('/api/v1/users')
      .set('Content-Type', 'application/json')
      .send('{ invalid json')
      .expect(400);
  });
});
# Testing Infrastructure

## Overview

Company of One uses a comprehensive testing strategy with multiple layers:
- **Unit Tests**: Test individual components and functions in isolation
- **Integration Tests**: Test how different parts work together
- **End-to-End Tests**: Test complete user workflows

## Tech Stack

### Frontend Testing
- **Jest**: Test runner and assertion library
- **React Testing Library**: Component testing utilities
- **MSW**: Mock Service Worker for API mocking
- **Playwright**: E2E testing framework

### Backend Testing
- **Jest**: Test runner and assertion library
- **Supertest**: HTTP assertion library
- **MongoDB Memory Server**: In-memory database for testing
- **Nock**: HTTP mocking library

## Quick Start

### Install Dependencies
```bash
# Install all dependencies
npm run install:all
```

### Running Tests

#### All Tests
```bash
# Run all tests
npm run test:all

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

#### Frontend Tests
```bash
cd frontend
npm test                # Run all frontend tests
npm run test:watch      # Watch mode
npm run test:coverage   # With coverage
```

#### Backend Tests
```bash
cd backend
npm test                # Run all backend tests
npm run test:unit       # Unit tests only
npm run test:integration # Integration tests only
npm run test:coverage   # With coverage
```

#### E2E Tests
```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Debug E2E tests
npm run test:e2e:debug
```

## Writing Tests

### Frontend Component Tests

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button Component', () => {
  it('renders and handles click', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Backend API Tests

```typescript
import request from 'supertest';
import app from '@/api/app';

describe('GET /api/v1/users', () => {
  it('returns user list', async () => {
    const response = await request(app)
      .get('/api/v1/users')
      .expect(200);
    
    expect(response.body).toHaveProperty('users');
    expect(Array.isArray(response.body.users)).toBe(true);
  });
});
```

### E2E Tests

```typescript
import { test, expect } from '@playwright/test';

test('user can complete purchase', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Shop Now');
  await page.click('[data-testid="add-to-cart"]');
  await page.click('text=Checkout');
  
  await expect(page).toHaveURL('/checkout');
});
```

## Test Organization

### Directory Structure
```
frontend/
├── __tests__/
│   ├── components/     # Component tests
│   ├── utils/         # Test utilities
│   └── integration/   # Integration tests
├── jest.config.js
└── jest.setup.js

backend/
├── __tests__/
│   ├── unit/          # Unit tests
│   ├── integration/   # Integration tests
│   └── utils/         # Test helpers
├── jest.config.js
└── jest.setup.js

e2e/
├── tests/             # E2E test files
├── fixtures/          # Test data
└── utils/            # E2E utilities
```

### Naming Conventions
- Test files: `*.test.ts` or `*.spec.ts`
- Test suites: Use `describe()` blocks
- Test cases: Start with "should" or "it"
- Mock files: `__mocks__/` directory

## Best Practices

### 1. Test Structure
Follow the AAA pattern:
- **Arrange**: Set up test data and conditions
- **Act**: Execute the code being tested
- **Assert**: Verify the results

### 2. Test Isolation
- Each test should be independent
- Use `beforeEach` and `afterEach` for setup/cleanup
- Mock external dependencies

### 3. Descriptive Tests
```typescript
// Good
it('should display error message when email is invalid', () => {});

// Bad
it('test email', () => {});
```

### 4. Testing Priorities
1. Critical user paths (authentication, checkout)
2. Complex business logic
3. Edge cases and error handling
4. UI components with logic

### 5. Performance
- Keep tests fast (< 100ms for unit tests)
- Use test doubles for external services
- Run heavy tests in parallel

## Mocking

### Frontend Mocking
```typescript
// Mock API calls with MSW
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/users', (req, res, ctx) => {
    return res(ctx.json({ users: [] }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### Backend Mocking
```typescript
// Mock database calls
jest.mock('@/models/User');

import User from '@/models/User';

(User.findById as jest.Mock).mockResolvedValue({
  id: '123',
  name: 'Test User'
});
```

## Coverage

### Coverage Goals
- Overall: 80%
- Critical paths: 95%
- New code: 90%

### View Coverage Reports
```bash
# Generate coverage report
npm run test:coverage

# Open HTML report
open coverage/lcov-report/index.html
```

### Coverage Configuration
Coverage thresholds are configured in `jest.config.js`:
```javascript
coverageThreshold: {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80
  }
}
```

## CI/CD Integration

Tests run automatically on:
- Pull requests
- Pushes to main branch
- Pre-deployment

### GitHub Actions Example
```yaml
- name: Run Tests
  run: |
    npm ci
    npm run test:ci
    npm run test:e2e
```

## Debugging Tests

### Jest Debugging
```bash
# Run specific test file
npm test -- Button.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="should render"

# Debug in VS Code
# Add breakpoint and run "Debug Jest Tests"
```

### Playwright Debugging
```bash
# Debug mode with inspector
npm run test:e2e:debug

# Headed mode (see browser)
npx playwright test --headed

# Slow motion
npx playwright test --slow-mo=1000
```

## Troubleshooting

### Common Issues

1. **Module not found errors**
   - Check tsconfig paths
   - Verify jest moduleNameMapper

2. **Async test timeouts**
   - Increase timeout: `jest.setTimeout(10000)`
   - Check for missing `await`

3. **Flaky E2E tests**
   - Add explicit waits
   - Check for race conditions
   - Use data-testid attributes

4. **Coverage gaps**
   - Run coverage with `--collectCoverageFrom`
   - Check for untested edge cases

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
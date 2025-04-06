# Testing Documentation

This document outlines the testing strategy and procedures for the Fancrush Talkline application.

## Types of Tests

The application uses several types of tests:

1. **Unit Tests**: Testing individual components, functions, and API routes in isolation
2. **Integration Tests**: Testing interactions between components and services
3. **End-to-End Tests**: Testing complete user flows in a browser environment

## Testing Tools

- **Jest**: JavaScript testing framework for unit and integration tests
- **React Testing Library**: For testing React components
- **Cypress**: For end-to-end testing
- **MSW (Mock Service Worker)**: For mocking API requests in tests (if needed)

## Test Organization

Tests are organized in the following directories:

- `__tests__/`: Contains Jest unit and integration tests
  - `__tests__/components/`: Tests for React components
  - `__tests__/api/`: Tests for API routes
  - `__tests__/app/`: Tests for page components and server components
- `cypress/e2e/`: Contains Cypress end-to-end tests

## Running Tests

### Unit and Integration Tests

To run all Jest tests:

```bash
npm test
```

To run tests in watch mode (recommended during development):

```bash
npm run test:watch
```

To run tests with coverage report:

```bash
npm run test:coverage
```

### End-to-End Tests

To open the Cypress test runner:

```bash
npm run cy:open
```

To run Cypress tests headlessly:

```bash
npm run cy:run
```

To run E2E tests with the development server:

```bash
npm run test:e2e
```

## Test Coverage

The goal is to maintain high test coverage, especially for critical paths:

1. **Authentication Flows**: Login, registration, session management
2. **Payment Processing**: Stripe checkout, webhook handling
3. **Call Functionality**: Demo calls, PSTN call initiation
4. **Account Management**: Minute balance display and updates

## Writing Tests

### Unit Test Example

```typescript
import { render, screen } from '@testing-library/react';
import Component from './Component';

describe('Component', () => {
  test('renders correctly', () => {
    render(<Component />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### API Test Example

```typescript
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/route';

describe('API Route', () => {
  test('handles request correctly', async () => {
    const request = new NextRequest('http://localhost:3000/api/route', {
      method: 'POST',
      body: JSON.stringify({ key: 'value' }),
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toEqual(expect.objectContaining({ success: true }));
  });
});
```

### E2E Test Example

```typescript
describe('User Flow', () => {
  it('completes expected journey', () => {
    cy.visit('/');
    cy.contains('Sign Up').click();
    cy.url().should('include', '/register');
    // Further assertions...
  });
});
```

## Mocking Dependencies

The application uses Jest's mocking capabilities to isolate components from external dependencies. Key mocks include:

- **Supabase**: For database and authentication operations
- **Stripe**: For payment processing
- **Twilio**: For PSTN call handling
- **Next.js Navigation**: For navigation and routing functions

## Continuous Integration

Tests are automatically run in the CI pipeline on:
- Pull requests to the main branch
- Direct pushes to the main branch

A passing test suite is required before merging code to the main branch. 
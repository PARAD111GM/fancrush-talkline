// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock next/router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '',
  notFound: jest.fn(),
}));

// Mock Supabase
jest.mock('@/components/supabase-provider', () => ({
  useSupabase: () => ({
    supabase: {
      auth: {
        getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
        signOut: jest.fn().mockResolvedValue({}),
      },
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null }),
        order: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
      }),
    },
  }),
}));

// Mock environment variables
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
process.env.STRIPE_SECRET_KEY = 'sk_test_mock';
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_mock';
process.env.TWILIO_ACCOUNT_SID = 'AC_mock';
process.env.TWILIO_AUTH_TOKEN = 'auth_token_mock';
process.env.TWILIO_PHONE_NUMBER = '+15555555555';

// Mock Stripe
jest.mock('stripe', () => {
  const stripeMock = jest.fn().mockImplementation(() => ({
    customers: {
      create: jest.fn().mockResolvedValue({ id: 'cus_mock123' }),
    },
    checkout: {
      sessions: {
        create: jest.fn().mockResolvedValue({ url: 'https://checkout.stripe.com/mock-session' }),
      },
    },
    webhooks: {
      constructEvent: jest.fn().mockReturnValue({
        type: 'checkout.session.completed',
        data: { object: { metadata: { userId: 'user_mock123', minutes: '10' } } },
      }),
    },
  }));
  return stripeMock;
});

// Mock fetch
global.fetch = jest.fn();

// Mock Request, Response, and Headers for Next.js API tests
global.Request = jest.fn();
global.Response = jest.fn();
global.Headers = jest.fn();

// Mock next/server
jest.mock('next/server', () => {
  const originalModule = jest.requireActual('next/server');
  const cookies = {
    get: jest.fn().mockReturnValue({ value: 'test-cookie' }),
    set: jest.fn(),
    delete: jest.fn(),
  };
  
  class MockNextRequest {
    constructor(url, options = {}) {
      this.url = url;
      this.method = options.method || 'GET';
      this.body = options.body;
      this.headers = new Map();
      if (options.headers) {
        Object.entries(options.headers).forEach(([key, value]) => {
          this.headers.set(key, value);
        });
      }
      this.cookies = cookies;
    }
    
    json() {
      return Promise.resolve(JSON.parse(this.body));
    }
  }
  
  class MockNextResponse {
    static json(data, options = {}) {
      return {
        status: options.status || 200,
        json: async () => data,
      };
    }
  }
  
  return {
    ...originalModule,
    NextRequest: MockNextRequest,
    NextResponse: MockNextResponse,
  };
});

// Mock window.location
Object.defineProperty(window, 'location', {
  writable: true,
  value: { href: jest.fn() },
}); 
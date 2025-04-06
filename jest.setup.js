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

// We don't need to mock Request, Response, and Headers
// NextRequest and NextResponse from next/server will be used instead

// Mock headers for Next.js
jest.mock('next/headers', () => ({
  headers: jest.fn().mockReturnValue({
    get: jest.fn().mockReturnValue('test-header'),
  }),
}));

// Mock only NextRequest and NextResponse
jest.mock('next/server', () => {
  const origModule = jest.requireActual('next/server');
  
  class MockNextRequest {
    constructor(url, options = {}) {
      // Use a proper URL object
      this._url = new URL(url, 'http://localhost:3000');
      this.method = options.method || 'GET';
      this.body = options.body || '';
      this.headers = new Map();
      if (options.headers) {
        Object.entries(options.headers).forEach(([key, value]) => {
          this.headers.set(key, value);
        });
      }
      this.cookies = {
        get: jest.fn().mockReturnValue({ value: 'test-cookie' }),
        set: jest.fn(),
        delete: jest.fn(),
        getAll: jest.fn().mockReturnValue([]),
      };
    }

    // Property url is a getter
    get url() {
      return this._url.toString();
    }
    
    // Mock formData method
    formData() {
      const formData = new FormData();
      if (typeof this.body === 'string' && this.body.includes('CallSid')) {
        formData.append('CallSid', 'CALL123');
        formData.append('CallStatus', 'completed');
        formData.append('CallDuration', '120');
      }
      return Promise.resolve(formData);
    }
    
    // Mock json method
    json() {
      if (typeof this.body === 'string') {
        try {
          return Promise.resolve(JSON.parse(this.body));
        } catch (e) {
          return Promise.resolve({});
        }
      }
      return Promise.resolve({});
    }
  }
  
  const mockNextResponse = {
    json: (data, options = {}) => ({
      status: options.status || 200,
      json: async () => data,
      ...data,
    }),
  };
  
  return {
    ...origModule,
    NextRequest: MockNextRequest,
    NextResponse: mockNextResponse,
  };
});

// Mock window.location
Object.defineProperty(window, 'location', {
  writable: true,
  value: { href: jest.fn() },
}); 
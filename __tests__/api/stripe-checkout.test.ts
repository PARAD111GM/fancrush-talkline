import { NextRequest } from 'next/server';
import { POST } from '@/app/api/stripe/create-checkout/route';
import { createServerSupabaseClient } from '@/lib/auth';
import Stripe from 'stripe';

// Mock Supabase
jest.mock('@/lib/auth', () => ({
  createServerSupabaseClient: jest.fn(),
}));

// Mock Stripe
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    customers: {
      create: jest.fn().mockResolvedValue({
        id: 'cus_mock123',
      }),
    },
    checkout: {
      sessions: {
        create: jest.fn().mockResolvedValue({
          url: 'https://checkout.stripe.com/mock-session',
        }),
      },
    },
  }));
});

describe('Stripe Checkout API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns 401 when not authenticated', async () => {
    // Mock unauthenticated state
    (createServerSupabaseClient as jest.Mock).mockResolvedValue({
      auth: {
        getSession: jest.fn().mockResolvedValue({ 
          data: { session: null } 
        }),
      },
      from: jest.fn(),
    });

    const request = new NextRequest('http://localhost:3000/api/stripe/create-checkout', {
      method: 'POST',
      body: JSON.stringify({ minutes: 10, priceCents: 999 }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Authentication required');
  });

  test('returns 400 with invalid input', async () => {
    // Mock authenticated state
    (createServerSupabaseClient as jest.Mock).mockResolvedValue({
      auth: {
        getSession: jest.fn().mockResolvedValue({ 
          data: { 
            session: { 
              user: { id: 'test-user-id' } 
            } 
          } 
        }),
      },
      from: jest.fn(),
    });

    const request = new NextRequest('http://localhost:3000/api/stripe/create-checkout', {
      method: 'POST',
      body: JSON.stringify({ minutes: 'invalid', priceCents: 'invalid' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid minutes or price');
  });

  test('creates checkout session successfully', async () => {
    // Mock authenticated state and Supabase queries
    const mockSession = { user: { id: 'test-user-id', email: 'test@example.com' } };
    const mockProfile = { id: 'test-user-id', stripe_customer_id: null };
    
    (createServerSupabaseClient as jest.Mock).mockResolvedValue({
      auth: {
        getSession: jest.fn().mockResolvedValue({ 
          data: { session: mockSession } 
        }),
        getUser: jest.fn().mockResolvedValue({
          data: { user: mockSession.user }
        }),
      },
      from: jest.fn().mockImplementation((table) => ({
        select: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockProfile }),
      })),
    });

    const request = new NextRequest('http://localhost:3000/api/stripe/create-checkout', {
      method: 'POST',
      body: JSON.stringify({ minutes: 10, priceCents: 999 }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.url).toBe('https://checkout.stripe.com/mock-session');
    
    // Check if Stripe was initialized correctly
    expect(Stripe).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
      apiVersion: expect.any(String),
    }));

    // Check if checkout session was created correctly
    const stripeMock = (Stripe as jest.Mock).mock.results[0].value;
    expect(stripeMock.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        customer: expect.any(String),
        line_items: expect.arrayContaining([
          expect.objectContaining({
            price_data: expect.objectContaining({
              unit_amount: 999,
              product_data: expect.objectContaining({
                name: '10 Minutes Talk Time',
              }),
            }),
          }),
        ]),
      })
    );
  });
}); 
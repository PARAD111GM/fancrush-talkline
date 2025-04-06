import { NextRequest } from 'next/server';
import { POST } from '@/app/api/stripe/create-checkout/route';
import { createServerSupabaseClient } from '@/lib/auth';
import Stripe from 'stripe';

// Mock the createServerSupabaseClient function
jest.mock('@/lib/auth', () => ({
  createServerSupabaseClient: jest.fn(),
}));

// Mock Stripe
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    customers: {
      create: jest.fn().mockResolvedValue({ id: 'cus_mock123' }),
    },
    checkout: {
      sessions: {
        create: jest.fn().mockResolvedValue({ url: 'https://checkout.stripe.com/mock-session' }),
      },
    },
  }));
});

describe('Stripe Checkout API', () => {
  let stripeMock: any;
  
  beforeEach(() => {
    jest.clearAllMocks();
    stripeMock = jest.requireMock('stripe')();
  });
  
  test('returns 401 when not authenticated', async () => {
    // Mock unauthenticated session
    (createServerSupabaseClient as jest.Mock).mockResolvedValue({
      auth: {
        getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
      },
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
    // Mock authenticated session
    (createServerSupabaseClient as jest.Mock).mockResolvedValue({
      auth: {
        getSession: jest.fn().mockResolvedValue({ 
          data: { 
            session: { 
              user: { id: 'test-user-id', email: 'test@example.com' } 
            } 
          } 
        }),
      },
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null }),
      }),
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
    // Mock authenticated session and profile
    const mockProfile = {
      id: 'test-user-id',
      stripe_customer_id: 'cus_existing123',
    };
    
    (createServerSupabaseClient as jest.Mock).mockResolvedValue({
      auth: {
        getSession: jest.fn().mockResolvedValue({ 
          data: { 
            session: { 
              user: { id: 'test-user-id', email: 'test@example.com' } 
            } 
          } 
        }),
      },
      from: jest.fn().mockImplementation((table) => {
        if (table === 'profiles') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({ data: mockProfile }),
          };
        }
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: null }),
        };
      }),
    });
    
    const request = new NextRequest('http://localhost:3000/api/stripe/create-checkout', {
      method: 'POST',
      body: JSON.stringify({ minutes: 10, priceCents: 999 }),
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.url).toBe('https://checkout.stripe.com/mock-session');
    
    // Verify Stripe was called
    expect(Stripe).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
      apiVersion: expect.any(String),
    }));
    
    // Verify checkout session was created with correct params
    expect(stripeMock.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        customer: 'cus_existing123',
        line_items: expect.arrayContaining([
          expect.objectContaining({
            price_data: expect.objectContaining({
              currency: 'usd',
              product_data: expect.objectContaining({
                name: expect.stringContaining('10 minutes'),
              }),
            }),
          }),
        ]),
        mode: 'payment',
      })
    );
  });
}); 
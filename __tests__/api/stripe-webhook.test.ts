import { NextRequest } from 'next/server';
import { POST } from '@/app/api/webhooks/stripe/route';
import { createServerSupabaseClient } from '@/lib/auth';
import Stripe from 'stripe';
import { headers } from 'next/headers';

// Mock dependencies
jest.mock('@/lib/auth', () => ({
  createServerSupabaseClient: jest.fn(),
}));

jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    webhooks: {
      constructEvent: jest.fn(),
    },
  }));
});

jest.mock('next/headers', () => ({
  headers: jest.fn(),
}));

describe('Stripe Webhook API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('returns 400 if stripe signature is missing', async () => {
    // Mock missing signature
    (headers as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue(''),
    });
    
    const request = new NextRequest('http://localhost:3000/api/webhooks/stripe', {
      method: 'POST',
      body: JSON.stringify({ type: 'checkout.session.completed' }),
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(400);
    expect(data.error).toBe('Missing Stripe signature');
  });
  
  test('returns 400 if signature verification fails', async () => {
    // Mock signature but fail verification
    (headers as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue('sig_mock123'),
    });
    
    const stripeMock = (Stripe as unknown as jest.Mock).mock.results[0].value;
    stripeMock.webhooks.constructEvent.mockImplementation(() => {
      throw new Error('Invalid signature');
    });
    
    const request = new NextRequest('http://localhost:3000/api/webhooks/stripe', {
      method: 'POST',
      body: 'webhook_payload',
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid signature');
  });
  
  test('processes checkout.session.completed event correctly', async () => {
    // Mock valid signature and event
    (headers as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue('sig_mock123'),
    });
    
    const mockEvent = {
      type: 'checkout.session.completed',
      data: {
        object: {
          status: 'complete',
          payment_status: 'paid',
          metadata: {
            user_id: 'test-user-id',
            minutes: '10',
          },
          id: 'cs_mock123',
        },
      },
    };
    
    const stripeMock = (Stripe as unknown as jest.Mock).mock.results[0].value;
    stripeMock.webhooks.constructEvent.mockReturnValue(mockEvent);
    
    // Mock Supabase client
    const mockProfile = { available_minutes: 5 };
    
    (createServerSupabaseClient as jest.Mock).mockResolvedValue({
      from: jest.fn().mockImplementation((table) => {
        if (table === 'profiles') {
          return {
            select: jest.fn().mockReturnThis(),
            update: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({ data: mockProfile, error: null }),
          };
        } else if (table === 'transactions') {
          return {
            insert: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            update: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({ data: { id: 'tx_mock123' }, error: null }),
          };
        }
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: null }),
        };
      }),
    });
    
    const request = new NextRequest('http://localhost:3000/api/webhooks/stripe', {
      method: 'POST',
      body: 'webhook_payload',
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.received).toBe(true);
    
    // Verify Supabase interactions
    const supabaseMock = await createServerSupabaseClient();
    
    // Should select profile
    expect(supabaseMock.from).toHaveBeenCalledWith('profiles');
    
    // Should update profile with new minutes
    const fromProfileMock = supabaseMock.from('profiles');
    expect(fromProfileMock.update).toHaveBeenCalledWith({ available_minutes: 15 });
    
    // Should create transaction record
    expect(supabaseMock.from).toHaveBeenCalledWith('transactions');
    const fromTransactionsMock = supabaseMock.from('transactions');
    expect(fromTransactionsMock.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'test-user-id',
        amount: 10,
        type: 'purchase',
        description: expect.stringContaining('10 minutes'),
        stripe_payment_id: 'cs_mock123',
      })
    );
  });
  
  test('handles error in processing payment', async () => {
    // Mock valid signature and event
    (headers as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue('sig_mock123'),
    });
    
    const mockEvent = {
      type: 'checkout.session.completed',
      data: {
        object: {
          status: 'complete',
          payment_status: 'paid',
          metadata: {
            user_id: 'test-user-id',
            minutes: '10',
          },
          id: 'cs_mock123',
        },
      },
    };
    
    const stripeMock = (Stripe as unknown as jest.Mock).mock.results[0].value;
    stripeMock.webhooks.constructEvent.mockReturnValue(mockEvent);
    
    // Mock Supabase client with error
    (createServerSupabaseClient as jest.Mock).mockResolvedValue({
      from: jest.fn().mockImplementation((table) => {
        if (table === 'profiles') {
          return {
            select: jest.fn().mockReturnThis(),
            update: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Profile not found' } }),
          };
        }
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: null }),
        };
      }),
    });
    
    const request = new NextRequest('http://localhost:3000/api/webhooks/stripe', {
      method: 'POST',
      body: 'webhook_payload',
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(500);
    expect(data.error).toContain('User profile not found');
  });
}); 
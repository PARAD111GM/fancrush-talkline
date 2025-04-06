import { NextRequest } from 'next/server';
import { POST } from '@/app/api/calls/initiate-pstn/route';
import { createServerSupabaseClient } from '@/lib/auth';
import twilio from 'twilio';

// Mock the createServerSupabaseClient function
jest.mock('@/lib/auth', () => ({
  createServerSupabaseClient: jest.fn(),
}));

// Mock Twilio
jest.mock('twilio', () => {
  return jest.fn().mockImplementation(() => ({
    calls: {
      create: jest.fn().mockResolvedValue({ sid: 'CA_mock123' }),
    },
  }));
});

describe('PSTN Call Initiation API', () => {
  let twilioMock: any;
  
  beforeEach(() => {
    jest.clearAllMocks();
    twilioMock = jest.requireMock('twilio')();
  });
  
  test('returns 401 when not authenticated', async () => {
    // Mock unauthenticated session
    (createServerSupabaseClient as jest.Mock).mockResolvedValue({
      auth: {
        getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
      },
    });
    
    const request = new NextRequest('http://localhost:3000/api/calls/initiate-pstn', {
      method: 'POST',
      body: JSON.stringify({ influencerId: 'test-influencer-id' }),
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(401);
    expect(data.error).toBe('Authentication required');
  });
  
  test('returns 400 when influencer ID is missing', async () => {
    // Mock authenticated session
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
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null }),
      }),
    });
    
    const request = new NextRequest('http://localhost:3000/api/calls/initiate-pstn', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(400);
    expect(data.error).toBe('Influencer ID is required');
  });
  
  test('returns 400 when user has no verified phone', async () => {
    // Mock authenticated session but user has no verified phone
    const mockProfile = {
      id: 'test-user-id',
      phone_number: null,
      phone_verified: false,
      available_minutes: 10,
    };
    
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
    
    const request = new NextRequest('http://localhost:3000/api/calls/initiate-pstn', {
      method: 'POST',
      body: JSON.stringify({ influencerId: 'test-influencer-id' }),
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(400);
    expect(data.error).toBe('Verified phone number required');
  });
  
  test('returns 400 when user has no available minutes', async () => {
    // Mock authenticated session but user has no minutes
    const mockProfile = {
      id: 'test-user-id',
      phone_number: '+15551234567',
      phone_verified: true,
      available_minutes: 0,
    };
    
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
    
    const request = new NextRequest('http://localhost:3000/api/calls/initiate-pstn', {
      method: 'POST',
      body: JSON.stringify({ influencerId: 'test-influencer-id' }),
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(400);
    expect(data.error).toBe('No available minutes');
  });
  
  test('successfully initiates a call', async () => {
    // Mock all requirements for a successful call
    const mockProfile = {
      id: 'test-user-id',
      phone_number: '+15551234567',
      phone_verified: true,
      available_minutes: 10,
    };
    
    const mockInfluencer = {
      id: 'test-influencer-id',
      name: 'Test Influencer',
      vapi_assistant_id: 'vapi_123',
    };
    
    const mockCallRecord = {
      id: 'test-call-id',
      user_id: 'test-user-id',
      influencer_id: 'test-influencer-id',
    };
    
    // Create a more complex mock of Supabase that handles multiple tables
    const mockSupabase = {
      auth: {
        getSession: jest.fn().mockResolvedValue({ 
          data: { 
            session: { 
              user: { id: 'test-user-id' } 
            } 
          } 
        }),
      },
      from: jest.fn().mockImplementation((table) => {
        if (table === 'profiles') {
          return {
            select: jest.fn().mockReturnThis(),
            update: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({ data: mockProfile }),
          };
        } else if (table === 'influencers') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({ data: mockInfluencer }),
          };
        } else if (table === 'call_logs') {
          return {
            insert: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            update: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({ data: mockCallRecord, error: null }),
          };
        }
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: null }),
        };
      }),
    };
    
    (createServerSupabaseClient as jest.Mock).mockResolvedValue(mockSupabase);
    
    const request = new NextRequest('http://localhost:3000/api/calls/initiate-pstn', {
      method: 'POST',
      body: JSON.stringify({ influencerId: 'test-influencer-id' }),
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.call_id).toBe('test-call-id');
    
    // Verify Twilio was called with correct params
    expect(twilioMock.calls.create).toHaveBeenCalledWith(
      expect.objectContaining({
        to: '+15551234567',
        url: expect.stringContaining('vapi_123'),
      })
    );
  });
}); 
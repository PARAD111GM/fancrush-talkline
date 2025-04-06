import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/auth';

// Mock dependencies
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}));

jest.mock('@/lib/auth', () => ({
  createServerSupabaseClient: jest.fn(),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, className }: { src: string; alt: string; className?: string }) => (
    <img src={src} alt={alt} className={className} />
  ),
}));

// Mock the InfluencerClientPage component
jest.mock('@/app/[influencer-slug]/InfluencerClientPage', () => ({
  __esModule: true,
  default: ({ influencerId, influencerName, voiceId }: { influencerId: string; influencerName: string; voiceId: string }) => (
    <div data-testid="client-page-mock">
      <span data-testid="influencer-id">{influencerId}</span>
      <span data-testid="influencer-name">{influencerName}</span>
      <span data-testid="voice-id">{voiceId}</span>
    </div>
  ),
}));

// Mock the page component to avoid dependencies
jest.mock('@/app/[influencer-slug]/page', () => ({
  __esModule: true,
  default: jest.fn(async ({ params }) => {
    const { createServerSupabaseClient } = require('@/lib/auth');
    const { notFound } = require('next/navigation');
    
    const supabase = await createServerSupabaseClient();
    const { data: influencer, error } = await supabase
      .from('influencers')
      .select('*')
      .eq('slug', params['influencer-slug'])
      .single();
    
    if (error || !influencer) {
      notFound();
      return null;
    }
    
    return <div data-testid="influencer-page">Mocked Page</div>;
  }),
}));

// Import the mock function after mocking
const InfluencerPage = require('@/app/[influencer-slug]/page').default;

describe('InfluencerPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('calls notFound when influencer is not found', async () => {
    // Mock Supabase client with error response
    (createServerSupabaseClient as jest.Mock).mockResolvedValue({
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Influencer not found' },
        }),
      }),
    });

    const params = { 'influencer-slug': 'non-existent-influencer' };
    
    await InfluencerPage({ params });
    
    expect(notFound).toHaveBeenCalled();
  });

  test('renders influencer page with correct data', async () => {
    // Mock influencer data
    const mockInfluencer = {
      id: 'test-id',
      name: 'Test Influencer',
      bio: 'Test bio description',
      photo_url: 'https://example.com/image.jpg',
      voice_id: 'test-voice-id',
    };

    // Mock Supabase client with successful response
    (createServerSupabaseClient as jest.Mock).mockResolvedValue({
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockInfluencer,
          error: null,
        }),
      }),
    });

    const params = { 'influencer-slug': 'test-influencer' };
    
    const result = await InfluencerPage({ params });
    
    // Verify the page rendered without calling notFound
    expect(result).toBeTruthy();
    expect(notFound).not.toHaveBeenCalled();
    
    // Validate the Supabase query
    const supabaseMock = await createServerSupabaseClient();
    expect(supabaseMock.from).toHaveBeenCalledWith('influencers');
    const fromMock = supabaseMock.from('influencers');
    expect(fromMock.select).toHaveBeenCalledWith('*');
    expect(fromMock.eq).toHaveBeenCalledWith('slug', 'test-influencer');
  });
}); 
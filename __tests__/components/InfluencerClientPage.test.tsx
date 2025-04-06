import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import InfluencerClientPage from '@/app/[influencer-slug]/InfluencerClientPage';
import { useSupabase } from '@/components/supabase-provider';

// Create a manual mock for useSupabase
const mockUseSupabase = {
  supabase: {
    auth: {
      getSession: jest.fn(),
      signOut: jest.fn(),
    },
  },
};

// Mock the useSupabase hook
jest.mock('@/components/supabase-provider', () => ({
  useSupabase: jest.fn(),
}));

describe('InfluencerClientPage Component', () => {
  const mockProps = {
    influencerId: 'test-id',
    influencerName: 'Test Influencer',
    voiceId: 'test-voice-id',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the mock implementation for each test
    (useSupabase as jest.Mock).mockImplementation(() => mockUseSupabase);
  });

  test('renders the component with Talk Now button when not in a call', () => {
    // Mock unauthenticated state
    mockUseSupabase.supabase.auth.getSession.mockResolvedValue({ 
      data: { session: null } 
    });

    render(<InfluencerClientPage {...mockProps} />);
    
    // Check for the Talk Now button
    expect(screen.getByText(/Talk Now/i)).toBeInTheDocument();
    
    // Check for login and signup buttons
    expect(screen.getByText(/Log in/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign up/i)).toBeInTheDocument();
  });

  test('starts a demo call when Talk Now button is clicked', async () => {
    // Mock unauthenticated state
    mockUseSupabase.supabase.auth.getSession.mockResolvedValue({ 
      data: { session: null } 
    });

    render(<InfluencerClientPage {...mockProps} />);
    
    // Click the Talk Now button
    fireEvent.click(screen.getByText(/Talk Now/i));
    
    // Verify call state is active
    expect(screen.getByText(/On call with Test Influencer/i)).toBeInTheDocument();
    expect(screen.getByText(/Just say hello to start your conversation!/i)).toBeInTheDocument();
    expect(screen.getByText(/End Call/i)).toBeInTheDocument();
  });

  test('ends the call and shows signup modal when End Call is clicked', async () => {
    // Mock unauthenticated state
    mockUseSupabase.supabase.auth.getSession.mockResolvedValue({ 
      data: { session: null } 
    });

    render(<InfluencerClientPage {...mockProps} />);
    
    // Start the call
    fireEvent.click(screen.getByText(/Talk Now/i));
    
    // End the call
    fireEvent.click(screen.getByText(/End Call/i));
    
    // Verify signup modal is shown
    expect(screen.getByText(/Want to keep talking?/i)).toBeInTheDocument();
    expect(screen.getByText(/Your 2-minute demo call with Test Influencer has ended/i)).toBeInTheDocument();
  });

  test('does not show login/signup buttons when authenticated', async () => {
    // Mock authenticated state
    mockUseSupabase.supabase.auth.getSession.mockResolvedValue({ 
      data: { 
        session: { user: { id: 'test-user-id' } } 
      } 
    });

    // We need to wait for the useEffect to run
    await act(async () => {
      render(<InfluencerClientPage {...mockProps} />);
    });
    
    // Check for the Talk Now button
    expect(screen.getByText(/Talk Now/i)).toBeInTheDocument();
    
    // Check that login and signup buttons are NOT shown
    expect(screen.queryByText(/Log in/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Sign up/i)).not.toBeInTheDocument();
  });
}); 
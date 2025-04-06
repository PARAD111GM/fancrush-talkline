describe('Influencer Demo Call Flow', () => {
  beforeEach(() => {
    // Stub the Supabase response for influencers
    cy.intercept('GET', '**/rest/v1/influencers*', {
      statusCode: 200,
      body: [
        {
          id: 'test-id-1',
          name: 'Emma Johnson',
          slug: 'emma-johnson',
          bio: 'Travel and lifestyle influencer',
          photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
          voice_id: 'test-voice-id',
        },
      ],
    }).as('getInfluencers');
    
    // Stub the Supabase response for a specific influencer
    cy.intercept('GET', '**/rest/v1/influencers?slug=eq.emma-johnson*', {
      statusCode: 200,
      body: [
        {
          id: 'test-id-1',
          name: 'Emma Johnson',
          slug: 'emma-johnson',
          bio: 'Travel and lifestyle influencer',
          photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
          voice_id: 'test-voice-id',
        },
      ],
    }).as('getInfluencer');
    
    // Stub the auth session check (unauthenticated)
    cy.intercept('GET', '**/auth/v1/session', {
      statusCode: 200,
      body: { data: { session: null } },
    }).as('getSession');
  });

  it('should display the influencers list page', () => {
    cy.visit('/influencers');
    cy.wait('@getInfluencers');
    
    cy.contains('h1', 'Our Influencers').should('be.visible');
    cy.contains('Emma Johnson').should('be.visible');
    cy.contains('Visit Profile').should('be.visible');
  });

  it('should navigate to an influencer profile page', () => {
    cy.visit('/influencers');
    cy.wait('@getInfluencers');
    
    cy.contains('Emma Johnson').parent().parent().contains('Visit Profile').click();
    cy.url().should('include', '/emma-johnson');
    
    cy.wait('@getInfluencer');
    cy.contains('h1', 'Emma Johnson').should('be.visible');
    cy.contains('Talk Now').should('be.visible');
  });

  it('should start and end a demo call', () => {
    cy.visit('/emma-johnson');
    cy.wait('@getInfluencer');
    
    // Start demo call
    cy.contains('Talk Now').click();
    
    // Verify call is active
    cy.contains('On call with Emma Johnson').should('be.visible');
    cy.contains('End Call').should('be.visible');
    cy.contains('Just say hello to start your conversation!').should('be.visible');
    
    // End call
    cy.contains('End Call').click();
    
    // Verify signup modal appears
    cy.contains('Want to keep talking?').should('be.visible');
    cy.contains('Your 2-minute demo call with Emma Johnson has ended').should('be.visible');
    cy.contains('Sign up').should('be.visible');
    cy.contains('Log in').should('be.visible');
  });

  it('should redirect to login page when clicking login in the modal', () => {
    cy.visit('/emma-johnson');
    cy.wait('@getInfluencer');
    
    // Start and end call to trigger modal
    cy.contains('Talk Now').click();
    cy.contains('End Call').click();
    
    // Click login in modal
    cy.contains('Log in').click();
    
    // Verify URL changes to login page
    cy.url().should('include', '/login');
  });
  
  it('should redirect to signup page when clicking signup in the modal', () => {
    cy.visit('/emma-johnson');
    cy.wait('@getInfluencer');
    
    // Start and end call to trigger modal
    cy.contains('Talk Now').click();
    cy.contains('End Call').click();
    
    // Click signup in modal
    cy.contains('Sign up').click();
    
    // Verify URL changes to register page
    cy.url().should('include', '/register');
  });
});

describe('Authenticated User Flow', () => {
  beforeEach(() => {
    // Stub authenticated session
    cy.intercept('GET', '**/auth/v1/session', {
      statusCode: 200,
      body: { 
        data: { 
          session: { 
            user: { 
              id: 'test-user-id',
              email: 'test@example.com'
            } 
          } 
        } 
      },
    }).as('getAuthSession');
    
    // Stub profile data
    cy.intercept('GET', '**/rest/v1/profiles?id=eq.test-user-id*', {
      statusCode: 200,
      body: [
        {
          id: 'test-user-id',
          available_minutes: 15,
          phone_number: '+15551234567',
          phone_verified: true,
        },
      ],
    }).as('getUserProfile');
  });

  it('should show the account page with minutes balance', () => {
    cy.visit('/account');
    cy.wait('@getAuthSession');
    cy.wait('@getUserProfile');
    
    cy.contains('Your Account').should('be.visible');
    cy.contains('Available Minutes').should('be.visible');
    cy.contains('15').should('be.visible');
    cy.contains('Buy Minutes').should('be.visible');
  });

  it('should redirect to Stripe checkout when buying minutes', () => {
    // Stub fetch for Stripe checkout API
    cy.intercept('POST', '**/api/stripe/create-checkout', {
      statusCode: 200,
      body: {
        url: 'https://checkout.stripe.com/mock-session',
      },
    }).as('createCheckout');
    
    cy.visit('/account');
    cy.wait('@getAuthSession');
    cy.wait('@getUserProfile');
    
    // Click on a buy now button (10 Minutes package)
    cy.contains('10 Minutes').parent().parent().contains('Buy Now').click();
    
    // Wait for the API call
    cy.wait('@createCheckout');
    
    // Verify the checkout URL is loaded (in a real test, you'd need to handle the redirect)
    cy.window().then((win) => {
      expect(win.location.href).to.include('checkout.stripe.com');
    });
  });
}); 
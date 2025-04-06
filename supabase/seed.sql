-- Insert sample influencers
INSERT INTO public.influencers (name, slug, profile_image_url, landing_page_image_urls, greeting_copy, vapi_assistant_id)
VALUES 
  (
    'Emma Johnson',
    'emma-johnson',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    ARRAY['https://images.unsplash.com/photo-1543269865-cbf427effbad', 'https://images.unsplash.com/photo-1517462964-21fdcec3f25b'],
    'Hey there! I''m Emma, a travel and lifestyle content creator. Ask me about my latest adventures or travel tips!',
    'demo_assistant_id_1'
  ),
  (
    'Jake Smith',
    'jake-smith',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6',
    ARRAY['https://images.unsplash.com/photo-1560253023-3ec5d502959f', 'https://images.unsplash.com/photo-1593305841991-05c297ba4575'],
    'What''s up? I''m Jake, tech reviewer and gaming streamer. Let''s chat about the latest gadgets or your favorite games!',
    'demo_assistant_id_2'
  ),
  (
    'Sophia Chen',
    'sophia-chen',
    'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c',
    ARRAY['https://images.unsplash.com/photo-1518609878373-06d740f60d8b', 'https://images.unsplash.com/photo-1518310383802-640c2de311b6'],
    'Hi! I''m Sophia, fitness coach and nutritionist. I love helping people achieve their health goals. What can I help you with today?',
    'demo_assistant_id_3'
  );

-- Insert sample minute packs
INSERT INTO public.transactions (user_id, stripe_charge_id, amount_paid_cents, currency, minutes_purchased)
VALUES
  (
    '00000000-0000-0000-0000-000000000000', -- This is a placeholder, will need to be updated with a real user ID
    'demo_charge_1',
    1000,
    'USD',
    10
  ); 
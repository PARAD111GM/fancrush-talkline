-- Insert sample influencers
INSERT INTO influencers (id, name, slug, profile_image_url, landing_page_image_urls, greeting_copy, vapi_assistant_id)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Emma Johnson', 'emma-johnson', 
   'https://example.com/emma-profile.jpg',
   ARRAY['https://example.com/emma-1.jpg', 'https://example.com/emma-2.jpg'],
   'Hey there! I''m Emma, so excited to chat with you. Click the button below to start our conversation!',
   'vapi_assistant_123'),
  ('00000000-0000-0000-0000-000000000002', 'Jake Smith', 'jake-smith', 
   'https://example.com/jake-profile.jpg',
   ARRAY['https://example.com/jake-1.jpg', 'https://example.com/jake-2.jpg'],
   'What''s up? This is Jake! Can''t wait to talk with you. Hit the button and let''s chat!',
   'vapi_assistant_456'); 
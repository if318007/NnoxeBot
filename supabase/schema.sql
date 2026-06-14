-- Create tables
CREATE TABLE recaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  before_image_url TEXT NOT NULL,
  after_image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discord_username TEXT NOT NULL,
  image_url TEXT NOT NULL,
  discord_message_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: You also need to create two storage buckets in the Supabase Dashboard:
-- 1. "recaps"
-- 2. "testimonials"
-- Make sure to set them as PUBLIC buckets so images can be viewed without authentication.

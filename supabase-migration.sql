-- First, create the users table for authentication
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    google_id TEXT UNIQUE,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add new columns to the existing people table
ALTER TABLE people 
ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE CASCADE,
ADD COLUMN company TEXT,
ADD COLUMN email TEXT,
ADD COLUMN phone TEXT,
ADD COLUMN notes TEXT,
ADD COLUMN follow_up_date DATE,
ADD COLUMN last_contact_date DATE,
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- people table should already have RLS enabled, but let's make sure
ALTER TABLE people ENABLE ROW LEVEL SECURITY;

-- Drop the old policy
DROP POLICY IF EXISTS "Allow all operations on people" ON people;

-- Create policies for users table
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (true);

-- Create policies for people table (user-specific data)
CREATE POLICY "Users can view own people" ON people
    FOR SELECT USING (user_id IN (
        SELECT id FROM users WHERE email = auth.jwt() ->> 'email'
    ));

CREATE POLICY "Users can insert own people" ON people
    FOR INSERT WITH CHECK (user_id IN (
        SELECT id FROM users WHERE email = auth.jwt() ->> 'email'
    ));

CREATE POLICY "Users can update own people" ON people
    FOR UPDATE USING (user_id IN (
        SELECT id FROM users WHERE email = auth.jwt() ->> 'email'
    ));

CREATE POLICY "Users can delete own people" ON people
    FOR DELETE USING (user_id IN (
        SELECT id FROM users WHERE email = auth.jwt() ->> 'email'
    ));

-- Create an index for better performance
CREATE INDEX idx_people_user_id ON people(user_id);

-- Create a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_people_updated_at 
    BEFORE UPDATE ON people 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
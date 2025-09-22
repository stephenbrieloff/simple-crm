-- Drop existing tables if they exist (optional - use with caution)
-- DROP TABLE IF EXISTS people CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- Create the users table for authentication (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    google_id TEXT UNIQUE,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the people table with user relationship (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS people (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    company TEXT,
    email TEXT,
    phone TEXT,
    notes TEXT,
    follow_up_date DATE,
    last_contact_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE people ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (optional)
-- DROP POLICY IF EXISTS "Users can view own profile" ON users;
-- DROP POLICY IF EXISTS "Users can insert own profile" ON users;
-- DROP POLICY IF EXISTS "Users can view own people" ON people;
-- DROP POLICY IF EXISTS "Users can insert own people" ON people;
-- DROP POLICY IF EXISTS "Users can update own people" ON people;
-- DROP POLICY IF EXISTS "Users can delete own people" ON people;

-- Create policies for users table
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can view own profile') THEN
        CREATE POLICY "Users can view own profile" ON users
            FOR SELECT USING (true); -- We'll allow reading for now
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can insert own profile') THEN
        CREATE POLICY "Users can insert own profile" ON users
            FOR INSERT WITH CHECK (true); -- Allow inserts for sign up
    END IF;
END $$;

-- Create policies for people table (user-specific data)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'people' AND policyname = 'Users can view own people') THEN
        CREATE POLICY "Users can view own people" ON people
            FOR SELECT USING (user_id IN (
                SELECT id FROM users WHERE email = auth.jwt() ->> 'email'
            ));
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'people' AND policyname = 'Users can insert own people') THEN
        CREATE POLICY "Users can insert own people" ON people
            FOR INSERT WITH CHECK (user_id IN (
                SELECT id FROM users WHERE email = auth.jwt() ->> 'email'
            ));
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'people' AND policyname = 'Users can update own people') THEN
        CREATE POLICY "Users can update own people" ON people
            FOR UPDATE USING (user_id IN (
                SELECT id FROM users WHERE email = auth.jwt() ->> 'email'
            ));
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'people' AND policyname = 'Users can delete own people') THEN
        CREATE POLICY "Users can delete own people" ON people
            FOR DELETE USING (user_id IN (
                SELECT id FROM users WHERE email = auth.jwt() ->> 'email'
            ));
    END IF;
END $$;

-- Create an index for better performance (only if it doesn't exist)
CREATE INDEX IF NOT EXISTS idx_people_user_id ON people(user_id);

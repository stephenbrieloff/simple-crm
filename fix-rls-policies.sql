-- Fix RLS policies to work with service role or provide alternative policies
-- Run this in your Supabase SQL editor or via psql

-- Option 1: Temporarily disable RLS on people table (simplest fix)
-- IMPORTANT: Only use this for development/testing
-- ALTER TABLE people DISABLE ROW LEVEL SECURITY;

-- Option 2: Create more flexible policies that work with service role
-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view own people" ON people;
DROP POLICY IF EXISTS "Users can insert own people" ON people;
DROP POLICY IF EXISTS "Users can update own people" ON people;
DROP POLICY IF EXISTS "Users can delete own people" ON people;

-- Create new policies that allow service role operations
-- These policies will allow operations if there's no JWT (service role) or if the JWT matches
CREATE POLICY "Users can view own people" ON people
    FOR SELECT USING (
        -- Allow if no JWT (service role) OR if JWT matches user
        auth.jwt() IS NULL OR 
        user_id IN (
            SELECT id FROM users WHERE email = auth.jwt() ->> 'email'
        )
    );

CREATE POLICY "Users can insert own people" ON people
    FOR INSERT WITH CHECK (
        -- Allow if no JWT (service role) OR if JWT matches user
        auth.jwt() IS NULL OR 
        user_id IN (
            SELECT id FROM users WHERE email = auth.jwt() ->> 'email'
        )
    );

CREATE POLICY "Users can update own people" ON people
    FOR UPDATE USING (
        -- Allow if no JWT (service role) OR if JWT matches user
        auth.jwt() IS NULL OR 
        user_id IN (
            SELECT id FROM users WHERE email = auth.jwt() ->> 'email'
        )
    );

CREATE POLICY "Users can delete own people" ON people
    FOR DELETE USING (
        -- Allow if no JWT (service role) OR if JWT matches user
        auth.jwt() IS NULL OR 
        user_id IN (
            SELECT id FROM users WHERE email = auth.jwt() ->> 'email'
        )
    );

-- Alternative Option 3: Create a function to check if current role is service role
-- This is more secure than checking for null JWT
CREATE OR REPLACE FUNCTION is_service_role_or_owner(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    -- Allow if current role is service_role (bypasses RLS entirely)
    IF current_setting('role') = 'service_role' THEN
        RETURN TRUE;
    END IF;
    
    -- Otherwise check if user owns the record
    RETURN user_id IN (
        SELECT id FROM users WHERE email = auth.jwt() ->> 'email'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Alternative policies using the function (comment out the above policies and use these instead)
/*
CREATE POLICY "Users can view own people" ON people
    FOR SELECT USING (is_service_role_or_owner(user_id));

CREATE POLICY "Users can insert own people" ON people
    FOR INSERT WITH CHECK (is_service_role_or_owner(user_id));

CREATE POLICY "Users can update own people" ON people
    FOR UPDATE USING (is_service_role_or_owner(user_id));

CREATE POLICY "Users can delete own people" ON people
    FOR DELETE USING (is_service_role_or_owner(user_id));
*/
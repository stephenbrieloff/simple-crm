-- Create the people table
CREATE TABLE people (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE people ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for now (you can make this more restrictive later)
CREATE POLICY "Allow all operations on people" ON people
    FOR ALL USING (true) WITH CHECK (true);
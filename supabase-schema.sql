-- Create the user table in Supabase
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE "user" (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  age INTEGER CHECK (age > 0 AND age < 150),
  phone TEXT,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on email for faster queries
CREATE INDEX idx_user_email ON "user"(email);

-- Create an index on created_at for ordering
CREATE INDEX idx_user_created_at ON "user"(created_at);

-- Create a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_updated_at 
    BEFORE UPDATE ON "user" 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data
INSERT INTO "user" (name, email, age, phone, address, notes) VALUES
('John Doe', 'john.doe@example.com', 30, '+1-555-0123', '123 Main St, New York, NY 10001', 'Software developer'),
('Jane Smith', 'jane.smith@example.com', 28, '+1-555-0124', '456 Oak Ave, Los Angeles, CA 90210', 'Designer'),
('Bob Johnson', 'bob.johnson@example.com', 35, null, '789 Pine St, Chicago, IL 60601', null),
('Alice Brown', 'alice.brown@example.com', 25, '+1-555-0126', null, 'Marketing specialist'),
('Charlie Wilson', 'charlie.wilson@example.com', null, '+1-555-0127', '321 Elm St, Miami, FL 33101', 'Freelancer');

-- Enable Row Level Security (RLS) - optional but recommended
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for now (you can make this more restrictive later)
CREATE POLICY "Allow all operations on user" ON "user"
FOR ALL USING (true) WITH CHECK (true);

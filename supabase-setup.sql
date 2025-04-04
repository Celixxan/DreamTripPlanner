-- Supabase SQL setup for Dream Trip Planner
-- Run this in the Supabase SQL Editor to set up your database

-- Create trips table
CREATE TABLE IF NOT EXISTS trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  destination TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget NUMERIC(10, 2) DEFAULT 0,
  expenses JSONB DEFAULT '[]'::jsonb,
  itinerary JSONB DEFAULT '[]'::jsonb,
  photos JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create RLS (Row Level Security) policies
-- This ensures users can only access their own data
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

-- Policy for selecting trips (users can only see their own trips)
CREATE POLICY trips_select_policy ON trips
  FOR SELECT USING (auth.uid() = user_id);

-- Policy for inserting trips (users can only insert their own trips)
CREATE POLICY trips_insert_policy ON trips
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy for updating trips (users can only update their own trips)
CREATE POLICY trips_update_policy ON trips
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy for deleting trips (users can only delete their own trips)
CREATE POLICY trips_delete_policy ON trips
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER update_trips_updated_at
  BEFORE UPDATE ON trips
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS trips_user_id_idx ON trips (user_id);
CREATE INDEX IF NOT EXISTS trips_start_date_idx ON trips (start_date);

-- Grant necessary permissions to authenticated users
GRANT ALL ON trips TO authenticated;

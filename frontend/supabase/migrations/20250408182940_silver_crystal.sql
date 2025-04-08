/*
  # Initial Schema Setup for Pneumonia Detection App

  1. New Tables
    - `analyses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `image_path` (text)
      - `status` (text)
      - `result` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Storage
    - Create bucket for X-ray images

  3. Security
    - Enable RLS on analyses table
    - Add policies for user data access
    - Set up storage policies
*/

-- Create analyses table
CREATE TABLE analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  image_path text NOT NULL,
  status text NOT NULL,
  result jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own analyses"
  ON analyses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analyses"
  ON analyses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create storage bucket
INSERT INTO storage.buckets (id, name)
VALUES ('xray-images', 'xray-images')
ON CONFLICT DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload their own images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'xray-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can view their own images"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'xray-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
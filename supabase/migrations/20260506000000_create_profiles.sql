-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  full_name text,
  roll_number text unique,
  college_id_url text,
  is_verified boolean default false,

  constraint roll_number_format check (roll_number ~ '^[U]{2}[0-9]{11}$')
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- This trigger automatically creates a profile entry when a new user signs up via Next.js
-- We might handle this manually in the signup flow, but a trigger is safer.
-- However, since we need to insert the roll_number during signup, we'll likely handle it in the application code.

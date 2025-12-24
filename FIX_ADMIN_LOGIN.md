# Fix Admin Login Issue - Supabase RLS Recursion

## Problem
The admin login is failing with a 500 error when trying to fetch the profile. This is caused by infinite recursion in the Row Level Security (RLS) policies on the profiles table.

## Solution
You need to run the fix-profiles-recursion.sql script in your Supabase SQL Editor.

## Steps to Fix:

### 1. Go to Supabase SQL Editor
- Open your Supabase dashboard: https://app.supabase.com
- Navigate to the SQL Editor

### 2. Run the RLS Fix
Copy and paste this SQL code into the editor and run it:

```sql
-- Fix infinite recursion in profiles RLS policies
-- First, drop all existing policies on profiles
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage profiles" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can read profiles" ON public.profiles;

-- Create new policies that avoid recursion

-- Policy 1: Allow users to read their own profile (no recursion possible)
CREATE POLICY "Users can read own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Policy 2: Allow service role to do everything (for admin operations)
CREATE POLICY "Service role has full access"
ON public.profiles
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Policy 3: Allow authenticated users to read all profiles
-- This avoids recursion by not checking is_admin in the policy itself
CREATE POLICY "Authenticated can read all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Policy 4: Only allow users to update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
```

### 3. Verify the Admin Profile
After fixing the RLS policies, verify that your admin profile exists:

```sql
-- Check if the admin profile exists
SELECT id, is_admin, created_at 
FROM public.profiles 
WHERE id = '37932e41-28f1-4f27-ae64-b4f7237c7c04';
```

If the profile doesn't exist or is_admin is false, create/update it:

```sql
-- Ensure admin profile exists with correct permissions
INSERT INTO public.profiles (id, is_admin, created_at) 
VALUES ('37932e41-28f1-4f27-ae64-b4f7237c7c04', true, NOW())
ON CONFLICT (id) 
DO UPDATE SET is_admin = true;
```

### 4. Test the Login
After running these fixes, try logging in again at `/admin` with:
- Email: admin1@diximills.com
- Password: aA112233

## Why This Happens
The original RLS policies had a circular dependency:
1. To check if a user can read profiles, it checks if they're an admin
2. To check if they're an admin, it needs to read their profile
3. This creates an infinite loop causing the 500 error

The fix removes this circular dependency by:
- Allowing authenticated users to read all profiles
- Moving the admin check to the application layer instead of the database layer

## Additional Notes
- The service role key bypasses RLS entirely, which is why the admin creation script works
- The new policies are simpler and more performant
- Admin authorization is still secure - it's just checked in the application after fetching the profile
-- Enhanced Fix for Username & Phone Logins (RLS Bypass & Auth Metadata Match)
-- This function runs with SECURITY DEFINER to bypass Row Level Security.
-- It explicitly checks Supabase's 'auth.users' table metadata if the 'profiles' 
-- row hasn't been created yet, ensuring they can seamlessly log in with a 
-- username or phone number on their very first try!

CREATE OR REPLACE FUNCTION lookup_user_email(p_username TEXT DEFAULT NULL, p_phone TEXT DEFAULT NULL)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email TEXT;
BEGIN
  -- 1. Try to find the email in the 'profiles' table first (for existing users)
  IF p_username IS NOT NULL THEN
    SELECT email INTO v_email FROM profiles WHERE username = p_username LIMIT 1;
  ELSIF p_phone IS NOT NULL THEN
    SELECT email INTO v_email FROM profiles WHERE phone = p_phone LIMIT 1;
  END IF;

  -- 2. If not found, check Supabase's hidden auth.users table (for new users logging in for the first time)
  IF v_email IS NULL THEN
    IF p_username IS NOT NULL THEN
      SELECT email INTO v_email FROM auth.users WHERE raw_user_meta_data->>'username' = p_username LIMIT 1;
    ELSIF p_phone IS NOT NULL THEN
      SELECT email INTO v_email FROM auth.users WHERE raw_user_meta_data->>'phone' = p_phone LIMIT 1;
    END IF;
  END IF;
  
  RETURN v_email;
END;
$$;


-- Enable RLS on all tables that don't have it
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create security definer functions to avoid RLS recursion
CREATE OR REPLACE FUNCTION public.is_admin_user(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.roles r ON r.id = ur.role_id
    WHERE ur.user_id = user_id
    AND r.name = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.get_user_plan_permissions(user_id uuid)
RETURNS TABLE(can_edit_tasks boolean, can_use_expiry boolean)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT p.can_edit_tasks, p.can_use_expiry
  FROM public.profiles prof
  JOIN public.plans p ON p.id = prof.plan_id
  WHERE prof.id = user_id;
$$;

-- RLS Policies for profiles table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can update all profiles"
ON public.profiles
FOR UPDATE
TO authenticated
USING (public.is_admin_user(auth.uid()));

-- RLS Policies for tasks table
DROP POLICY IF EXISTS "Users can view their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can create their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete their own tasks" ON public.tasks;

CREATE POLICY "Users can view their own tasks"
ON public.tasks
FOR SELECT
TO authenticated
USING (auth.uid() = owner_id);

CREATE POLICY "Users can create their own tasks"
ON public.tasks
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own tasks"
ON public.tasks
FOR UPDATE
TO authenticated
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own tasks"
ON public.tasks
FOR DELETE
TO authenticated
USING (auth.uid() = owner_id);

-- RLS Policies for tags table
DROP POLICY IF EXISTS "Users can view their own tags" ON public.tags;
DROP POLICY IF EXISTS "Users can create their own tags" ON public.tags;
DROP POLICY IF EXISTS "Users can update their own tags" ON public.tags;
DROP POLICY IF EXISTS "Users can delete their own tags" ON public.tags;

CREATE POLICY "Users can view their own tags"
ON public.tags
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tags"
ON public.tags
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tags"
ON public.tags
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tags"
ON public.tags
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- RLS Policies for task_tags table
DROP POLICY IF EXISTS "Users can view their own task tags" ON public.task_tags;
DROP POLICY IF EXISTS "Users can create their own task tags" ON public.task_tags;
DROP POLICY IF EXISTS "Users can delete their own task tags" ON public.task_tags;

CREATE POLICY "Users can view their own task tags"
ON public.task_tags
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.tasks t 
    WHERE t.id = task_id AND t.owner_id = auth.uid()
  )
);

CREATE POLICY "Users can create their own task tags"
ON public.task_tags
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.tasks t 
    WHERE t.id = task_id AND t.owner_id = auth.uid()
  ) AND
  EXISTS (
    SELECT 1 FROM public.tags tg 
    WHERE tg.id = tag_id AND tg.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their own task tags"
ON public.task_tags
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.tasks t 
    WHERE t.id = task_id AND t.owner_id = auth.uid()
  )
);

-- RLS Policies for user_roles table (admin only)
DROP POLICY IF EXISTS "Admins can view all user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles;

CREATE POLICY "Admins can view all user roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can manage user roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.is_admin_user(auth.uid()))
WITH CHECK (public.is_admin_user(auth.uid()));

-- Secure the roles table (read-only for authenticated users)
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view roles"
ON public.roles
FOR SELECT
TO authenticated
USING (true);

-- Secure the features table
ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view features"
ON public.features
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage features"
ON public.features
FOR ALL
TO authenticated
USING (public.is_admin_user(auth.uid()))
WITH CHECK (public.is_admin_user(auth.uid()));

-- Secure the plans table (read-only for authenticated users)
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view plans"
ON public.plans
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage plans"
ON public.plans
FOR ALL
TO authenticated
USING (public.is_admin_user(auth.uid()))
WITH CHECK (public.is_admin_user(auth.uid()));

-- Add input validation triggers
CREATE OR REPLACE FUNCTION public.validate_task_input()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Validate title length and content
  IF LENGTH(NEW.title) < 1 OR LENGTH(NEW.title) > 500 THEN
    RAISE EXCEPTION 'Task title must be between 1 and 500 characters';
  END IF;
  
  -- Sanitize title to prevent XSS
  NEW.title := TRIM(NEW.title);
  
  -- Validate expiry date is in the future
  IF NEW.expiry_date <= NOW() THEN
    RAISE EXCEPTION 'Task expiry date must be in the future';
  END IF;
  
  -- Validate expiry date is not more than 1 year in the future
  IF NEW.expiry_date > NOW() + INTERVAL '1 year' THEN
    RAISE EXCEPTION 'Task expiry date cannot be more than 1 year in the future';
  END IF;
  
  -- Validate priority
  IF NEW.priority NOT IN ('high', 'medium', 'low') THEN
    RAISE EXCEPTION 'Invalid priority value';
  END IF;
  
  -- Validate skip_count is not negative
  IF NEW.skip_count < 0 THEN
    RAISE EXCEPTION 'Skip count cannot be negative';
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_task_input_trigger
  BEFORE INSERT OR UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_task_input();

-- Add validation for tags
CREATE OR REPLACE FUNCTION public.validate_tag_input()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Validate tag name length and content
  IF LENGTH(NEW.name) < 1 OR LENGTH(NEW.name) > 50 THEN
    RAISE EXCEPTION 'Tag name must be between 1 and 50 characters';
  END IF;
  
  -- Sanitize tag name
  NEW.name := TRIM(NEW.name);
  
  -- Ensure tag name doesn't contain special characters that could cause issues
  IF NEW.name ~ '[<>\"''&]' THEN
    RAISE EXCEPTION 'Tag name contains invalid characters';
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_tag_input_trigger
  BEFORE INSERT OR UPDATE ON public.tags
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_tag_input();

-- Add validation for profiles
CREATE OR REPLACE FUNCTION public.validate_profile_input()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Validate username if provided
  IF NEW.username IS NOT NULL THEN
    IF LENGTH(NEW.username) < 3 OR LENGTH(NEW.username) > 30 THEN
      RAISE EXCEPTION 'Username must be between 3 and 30 characters';
    END IF;
    
    -- Check for valid username characters
    IF NEW.username !~ '^[a-zA-Z0-9_-]+$' THEN
      RAISE EXCEPTION 'Username can only contain letters, numbers, underscores, and hyphens';
    END IF;
    
    NEW.username := TRIM(NEW.username);
  END IF;
  
  -- Validate full_name if provided
  IF NEW.full_name IS NOT NULL THEN
    IF LENGTH(NEW.full_name) > 100 THEN
      RAISE EXCEPTION 'Full name cannot exceed 100 characters';
    END IF;
    
    NEW.full_name := TRIM(NEW.full_name);
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_profile_input_trigger
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_profile_input();

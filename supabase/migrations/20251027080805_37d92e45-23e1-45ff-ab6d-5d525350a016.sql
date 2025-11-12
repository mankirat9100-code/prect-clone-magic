-- ============================================================================
-- PHASE 1: Fix Critical RLS Policies
-- ============================================================================

-- Fix refinement_questions table policies
DROP POLICY IF EXISTS "Users can view all refinement questions" ON public.refinement_questions;
DROP POLICY IF EXISTS "Users can insert refinement questions" ON public.refinement_questions;
DROP POLICY IF EXISTS "Users can update refinement questions" ON public.refinement_questions;

CREATE POLICY "Project members can view refinement questions"
ON public.refinement_questions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.team_members tm
    WHERE tm.user_id = auth.uid()
    AND tm.project_id = refinement_questions.project_id
  )
);

CREATE POLICY "Project admins can create refinement questions"
ON public.refinement_questions
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.team_members tm
    WHERE tm.user_id = auth.uid()
    AND tm.project_id = refinement_questions.project_id
    AND tm.permission_level = 'admin'
  )
);

CREATE POLICY "Project members can update assigned questions"
ON public.refinement_questions
FOR UPDATE
USING (
  auth.uid() = assigned_to
  OR EXISTS (
    SELECT 1 FROM public.team_members tm
    WHERE tm.user_id = auth.uid()
    AND tm.project_id = refinement_questions.project_id
    AND tm.permission_level = 'admin'
  )
);

-- Fix team_members view policy
DROP POLICY IF EXISTS "Users can view team members in their projects" ON public.team_members;

CREATE POLICY "Users can view team members in their projects"
ON public.team_members
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.team_members tm
    WHERE tm.user_id = auth.uid()
    AND tm.project_id = team_members.project_id
  )
);

-- Fix information_sharing view policy
DROP POLICY IF EXISTS "Users can view information sharing settings" ON public.information_sharing;

CREATE POLICY "Users can view their project's information sharing"
ON public.information_sharing
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.team_members tm
    WHERE tm.user_id = auth.uid()
    AND tm.project_id = information_sharing.project_id
  )
);

-- ============================================================================
-- PHASE 2: Set Up Authentication Infrastructure
-- ============================================================================

-- Create trigger function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$;

-- Create trigger to call function on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- PHASE 3: Create User Roles System (Avoid Recursive RLS)
-- ============================================================================

-- Create app_role enum
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'member', 'viewer');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Only admins can manage roles (will be enforced via security definer function)
CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role = 'admin'
  )
);

-- Create security definer function to check roles (avoids recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
    AND role = _role
  )
$$;

-- ============================================================================
-- PHASE 4: Create Rate Limiting Infrastructure for Transcription
-- ============================================================================

-- Create table to track transcription requests
CREATE TABLE IF NOT EXISTS public.transcription_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  audio_size BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.transcription_requests ENABLE ROW LEVEL SECURITY;

-- Users can view their own requests
CREATE POLICY "Users can view their own transcription requests"
ON public.transcription_requests
FOR SELECT
USING (auth.uid() = user_id);

-- System can insert requests (will be done via edge function)
CREATE POLICY "System can insert transcription requests"
ON public.transcription_requests
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create index for efficient rate limit queries
CREATE INDEX IF NOT EXISTS idx_transcription_requests_user_time 
ON public.transcription_requests(user_id, created_at DESC);

-- ============================================================================
-- PHASE 5: Add Audit Logging Infrastructure
-- ============================================================================

-- Create audit_logs table for security monitoring
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
ON public.audit_logs
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- System can insert audit logs
CREATE POLICY "System can insert audit logs"
ON public.audit_logs
FOR INSERT
WITH CHECK (true);

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_time 
ON public.audit_logs(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_action_time 
ON public.audit_logs(action, created_at DESC);
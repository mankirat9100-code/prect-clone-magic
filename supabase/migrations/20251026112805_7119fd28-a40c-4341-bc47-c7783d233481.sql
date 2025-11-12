-- Create enum for permission levels
CREATE TYPE public.permission_level AS ENUM ('viewer', 'editor', 'admin');

-- Create enum for member types
CREATE TYPE public.member_type AS ENUM ('internal', 'external');

-- Create enum for external roles
CREATE TYPE public.external_role AS ENUM ('client', 'builder', 'certifier', 'consultant', 'other');

-- Create team_members table
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID NOT NULL,
  member_type member_type NOT NULL DEFAULT 'external',
  external_role external_role,
  permission_level permission_level NOT NULL DEFAULT 'viewer',
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  added_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, project_id)
);

-- Enable RLS
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view team members in their projects"
  ON public.team_members
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert team members"
  ON public.team_members
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE user_id = auth.uid()
      AND permission_level = 'admin'
    ) OR auth.uid() = added_by
  );

CREATE POLICY "Admins can update team members"
  ON public.team_members
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE user_id = auth.uid()
      AND permission_level = 'admin'
    )
  );

CREATE POLICY "Admins can delete team members"
  ON public.team_members
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE user_id = auth.uid()
      AND permission_level = 'admin'
    )
  );

-- Create information_sharing table for security settings
CREATE TABLE public.information_sharing (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  shared_with_external BOOLEAN NOT NULL DEFAULT false,
  specific_roles external_role[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.information_sharing ENABLE ROW LEVEL SECURITY;

-- Create policies for information_sharing
CREATE POLICY "Users can view information sharing settings"
  ON public.information_sharing
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage information sharing"
  ON public.information_sharing
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE user_id = auth.uid()
      AND permission_level = 'admin'
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON public.team_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_information_sharing_updated_at
  BEFORE UPDATE ON public.information_sharing
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default information sharing categories
INSERT INTO public.information_sharing (project_id, category, description, shared_with_external, specific_roles) VALUES
  ('00000000-0000-0000-0000-000000000000', 'Financial Information', 'Project budgets, costs, and financial reports', false, NULL),
  ('00000000-0000-0000-0000-000000000000', 'Planning Documents', 'Project plans, schedules, and timelines', true, ARRAY['client', 'builder']::external_role[]),
  ('00000000-0000-0000-0000-000000000000', 'Council Documents', 'Council applications and compliance documents', true, ARRAY['client', 'certifier']::external_role[]),
  ('00000000-0000-0000-0000-000000000000', 'Team Information', 'Internal team structure and contact details', false, NULL),
  ('00000000-0000-0000-0000-000000000000', 'Technical Specifications', 'Detailed technical drawings and specifications', true, ARRAY['builder', 'certifier']::external_role[]);
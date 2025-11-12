-- Create council_projects table to store project information
CREATE TABLE public.council_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_type TEXT CHECK (project_type IN ('new-house', 'extension-renovation', 'shed-garage', 'granny-flat', 'swimming-pool', 'other')),
  has_da_approval BOOLEAN,
  certifier_choice TEXT,
  has_plans BOOLEAN,
  has_builder BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.council_projects ENABLE ROW LEVEL SECURITY;

-- Users can view their own projects
CREATE POLICY "Users can view their own council projects"
ON public.council_projects
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own projects
CREATE POLICY "Users can create their own council projects"
ON public.council_projects
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own projects
CREATE POLICY "Users can update their own council projects"
ON public.council_projects
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own projects
CREATE POLICY "Users can delete their own council projects"
ON public.council_projects
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_council_projects_updated_at
BEFORE UPDATE ON public.council_projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
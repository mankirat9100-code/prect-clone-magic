-- Create communications table to track emails and messages
CREATE TABLE public.communications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL,
  team_member_id UUID NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  sent_by UUID NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.communications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view communications in their projects"
ON public.communications
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM team_members tm
    WHERE tm.user_id = auth.uid() 
    AND tm.project_id = communications.project_id
  )
);

CREATE POLICY "Users can insert communications"
ON public.communications
FOR INSERT
WITH CHECK (auth.uid() = sent_by);

-- Create index for better performance
CREATE INDEX idx_communications_team_member ON public.communications(team_member_id);
CREATE INDEX idx_communications_project ON public.communications(project_id);
-- Create function to update timestamps (if not exists)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create refinement questions table
CREATE TABLE IF NOT EXISTS public.refinement_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL,
  category TEXT NOT NULL,
  question_key TEXT NOT NULL,
  question_label TEXT NOT NULL,
  answer TEXT,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(project_id, question_key)
);

-- Enable Row Level Security
ALTER TABLE public.refinement_questions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all refinement questions"
ON public.refinement_questions
FOR SELECT
USING (true);

CREATE POLICY "Users can insert refinement questions"
ON public.refinement_questions
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can update refinement questions"
ON public.refinement_questions
FOR UPDATE
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_refinement_questions_updated_at
BEFORE UPDATE ON public.refinement_questions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
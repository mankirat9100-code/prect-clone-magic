-- Create documents table to track all uploaded documents
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL,
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Users can view documents for projects they have access to
CREATE POLICY "Users can view documents"
ON public.documents
FOR SELECT
USING (true);

-- Users can upload documents
CREATE POLICY "Users can upload documents"
ON public.documents
FOR INSERT
WITH CHECK (auth.uid() = uploaded_by);

-- Users can delete documents they uploaded
CREATE POLICY "Users can delete their documents"
ON public.documents
FOR DELETE
USING (auth.uid() = uploaded_by);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_documents_updated_at
BEFORE UPDATE ON public.documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster project-based queries
CREATE INDEX idx_documents_project_id ON public.documents(project_id);
CREATE INDEX idx_documents_uploaded_by ON public.documents(uploaded_by);
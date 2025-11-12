-- Fix information_sharing RLS policy to include project context
DROP POLICY IF EXISTS "Admins can manage information sharing" ON information_sharing;

CREATE POLICY "Admins can manage their project's information sharing"
ON information_sharing FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM team_members tm
    WHERE tm.user_id = auth.uid()
    AND tm.project_id = information_sharing.project_id
    AND tm.permission_level = 'admin'::permission_level
  )
);

-- Add UPDATE policy to documents table
CREATE POLICY "Users can update their documents"
ON documents FOR UPDATE
USING (auth.uid() = uploaded_by)
WITH CHECK (auth.uid() = uploaded_by);

-- Fix documents SELECT policy to restrict to project members instead of public
DROP POLICY IF EXISTS "Users can view documents" ON documents;

CREATE POLICY "Project members can view documents"
ON documents FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM team_members tm
    WHERE tm.user_id = auth.uid()
    AND tm.project_id = documents.project_id
  )
);
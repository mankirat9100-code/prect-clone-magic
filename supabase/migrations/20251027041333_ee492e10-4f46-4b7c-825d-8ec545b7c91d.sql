-- Add status field to track question completion status if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'refinement_questions' AND column_name = 'status'
  ) THEN
    ALTER TABLE refinement_questions
    ADD COLUMN status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed'));
  END IF;
END $$;

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_refinement_questions_assigned_to ON refinement_questions(assigned_to);
CREATE INDEX IF NOT EXISTS idx_refinement_questions_status ON refinement_questions(status);
CREATE INDEX IF NOT EXISTS idx_refinement_questions_project_id ON refinement_questions(project_id);
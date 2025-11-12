-- Add assigned_to field to refinement_questions table to track who should answer each question
ALTER TABLE refinement_questions 
ADD COLUMN assigned_to uuid REFERENCES team_members(id) ON DELETE SET NULL;

-- Add status field to track question completion status
ALTER TABLE refinement_questions
ADD COLUMN status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed'));

-- Add index for faster queries
CREATE INDEX idx_refinement_questions_assigned_to ON refinement_questions(assigned_to);
CREATE INDEX idx_refinement_questions_status ON refinement_questions(status);
CREATE INDEX idx_refinement_questions_project_id ON refinement_questions(project_id);
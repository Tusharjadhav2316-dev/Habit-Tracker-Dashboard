-- Add custom duration fields to habits table
ALTER TABLE public.habits
ADD COLUMN start_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN end_date DATE,
ADD COLUMN duration_days INTEGER;

-- Update the goal_type constraint to include 'custom'
ALTER TABLE public.habits
DROP CONSTRAINT IF EXISTS habits_goal_type_check;

ALTER TABLE public.habits
ADD CONSTRAINT habits_goal_type_check CHECK (goal_type IN ('daily', 'weekly', 'custom'));

-- Add a comment to explain the fields
COMMENT ON COLUMN public.habits.start_date IS 'Start date for the habit';
COMMENT ON COLUMN public.habits.end_date IS 'End date for custom duration habits';
COMMENT ON COLUMN public.habits.duration_days IS 'Number of days for custom duration habits';

export interface Habit {
  id: string
  user_id: string
  name: string
  description: string | null
  color: string
  goal_type: "daily" | "weekly" | "custom" // Added 'custom' goal type
  goal_value: number
  start_date?: string // Added start_date field
  end_date?: string | null // Added end_date field for custom duration
  duration_days?: number | null // Added duration_days field
  created_at: string
}

export interface HabitLog {
  id: string
  habit_id: string
  user_id: string
  date: string
  status: "completed" | "missed" | "skipped"
  created_at: string
}

export interface Profile {
  id: string
  email: string
  display_name: string | null
  created_at: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  requirement: string
  unlocked: boolean
}

export interface Task {
  id: string
  user_id: string
  title: string
  completed: boolean
  date: string
  created_at: string
}

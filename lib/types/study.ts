export interface Task {
  id: string
  user_id: string
  title: string
  description?: string
  due_date?: string
  priority: "low" | "medium" | "high"
  subject?: string
  completed: boolean
  completed_at?: string
  created_at: string
  updated_at: string
}

export interface PomodoroSession {
  id: string
  user_id: string
  task_id?: string
  duration_minutes: number
  completed: boolean
  started_at: string
  completed_at?: string
}

export interface FlashcardDeck {
  id: string
  user_id: string
  name: string
  subject?: string
  created_at: string
  updated_at: string
  card_count?: number
}

export interface Flashcard {
  id: string
  deck_id: string
  question: string
  answer: string
  tags?: string[]
  image_url?: string
  difficulty: number
  next_review_date: string
  review_interval_days: number
  times_reviewed: number
  created_at: string
  updated_at: string
}

export interface Note {
  id: string
  user_id: string
  title: string
  content?: string
  subject?: string
  tags?: string[]
  created_at: string
  updated_at: string
}

export interface MoodLog {
  id: string
  user_id: string
  mood_score: number
  notes?: string
  logged_at: string
}

export interface StudyStats {
  streak_days: number
  total_tasks: number
  completed_tasks: number
  total_study_hours: number
  avg_mood: number
  burnout_risk: "low" | "medium" | "high"
}

export interface StudyPlan {
  id: string
  user_id: string
  title: string
  subject?: string
  start_date: string
  end_date: string
  duration: string
  goals_text?: string[]
  tips?: string[]
  created_at: string
  updated_at: string
  goals?: StudyPlanGoal[]
  progress?: number
}

export interface StudyPlanGoal {
  id: string
  plan_id: string
  title: string
  description?: string
  priority: "low" | "medium" | "high"
  due_date?: string
  estimated_hours?: number
  completed: boolean
  completed_at?: string
  created_at: string
  updated_at: string
}

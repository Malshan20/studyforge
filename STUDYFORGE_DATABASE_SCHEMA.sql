-- ============================================================================
-- STUDYFORGE COMPLETE DATABASE SCHEMA
-- ============================================================================
-- This file contains all tables, RLS policies, indexes, triggers, and functions
-- needed for the StudyForge application.
-- 
-- Execute this entire file in your Supabase SQL editor to set up the database.
-- ============================================================================

-- ============================================================================
-- 1. PROFILES TABLE
-- ============================================================================
-- Extends auth.users with additional profile information

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak_days INTEGER DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "profiles_select_all"
  ON public.profiles FOR SELECT
  USING (true); -- Allow everyone to view profiles (for leaderboards)

CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "profiles_delete_own"
  ON public.profiles FOR DELETE
  USING (auth.uid() = id);

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', NULL)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 2. QUESTS TABLE
-- ============================================================================
-- Stores learning quests/challenges

CREATE TABLE IF NOT EXISTS public.quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  subject TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  xp_reward INTEGER NOT NULL DEFAULT 10,
  questions JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for quests
CREATE POLICY "quests_select_authenticated"
  ON public.quests FOR SELECT
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- 3. USER QUESTS TABLE
-- ============================================================================
-- Tracks user progress on quests

CREATE TABLE IF NOT EXISTS public.user_quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_id UUID NOT NULL REFERENCES public.quests(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'failed')),
  score INTEGER DEFAULT 0,
  answers JSONB,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, quest_id)
);

-- Enable RLS
ALTER TABLE public.user_quests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_quests
CREATE POLICY "user_quests_select_own"
  ON public.user_quests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "user_quests_insert_own"
  ON public.user_quests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_quests_update_own"
  ON public.user_quests FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "user_quests_delete_own"
  ON public.user_quests FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 4. ACHIEVEMENTS TABLE
-- ============================================================================
-- Stores available achievements

CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for achievements
CREATE POLICY "achievements_select_authenticated"
  ON public.achievements FOR SELECT
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- 5. USER ACHIEVEMENTS TABLE
-- ============================================================================
-- Tracks unlocked achievements per user

CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Enable RLS
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_achievements
CREATE POLICY "user_achievements_select_own"
  ON public.user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "user_achievements_insert_own"
  ON public.user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- 6. AVATARS TABLE
-- ============================================================================
-- Stores available avatars

CREATE TABLE IF NOT EXISTS public.avatars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  unlock_requirement TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.avatars ENABLE ROW LEVEL SECURITY;

-- RLS Policies for avatars
CREATE POLICY "avatars_select_authenticated"
  ON public.avatars FOR SELECT
  USING (auth.role() = 'authenticated');

-- Insert default avatars
INSERT INTO public.avatars (name, image_url, unlock_requirement) VALUES
  ('Starter Scholar', '/avatars/scholar.png', 'default'),
  ('Math Wizard', '/avatars/wizard.png', 'level_5'),
  ('Science Ninja', '/avatars/ninja.png', 'level_10'),
  ('History Hero', '/avatars/hero.png', 'level_15')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 7. LEADERBOARD VIEW
-- ============================================================================
-- View for top users by XP

CREATE OR REPLACE VIEW public.leaderboard AS
SELECT 
  p.id,
  p.display_name,
  p.avatar_url,
  p.xp,
  p.level,
  p.streak_days,
  ROW_NUMBER() OVER (ORDER BY p.xp DESC) AS rank
FROM public.profiles p
ORDER BY p.xp DESC
LIMIT 100;

-- Grant access to authenticated users
GRANT SELECT ON public.leaderboard TO authenticated;

-- ============================================================================
-- 8. TASKS TABLE
-- ============================================================================
-- Study planner tasks

CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  subject TEXT,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tasks
CREATE POLICY "Users can view own tasks" ON public.tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tasks" ON public.tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tasks" ON public.tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tasks" ON public.tasks FOR DELETE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON public.tasks(completed);

-- ============================================================================
-- 9. POMODORO SESSIONS TABLE
-- ============================================================================
-- Tracks pomodoro timer sessions

CREATE TABLE IF NOT EXISTS public.pomodoro_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 25,
  completed BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.pomodoro_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pomodoro_sessions
CREATE POLICY "Users can view own sessions" ON public.pomodoro_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions" ON public.pomodoro_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sessions" ON public.pomodoro_sessions FOR UPDATE USING (auth.uid() = user_id);

-- Create index
CREATE INDEX IF NOT EXISTS idx_pomodoro_user_id ON public.pomodoro_sessions(user_id);

-- ============================================================================
-- 10. FLASHCARD DECKS TABLE
-- ============================================================================
-- Stores flashcard decks

CREATE TABLE IF NOT EXISTS public.flashcard_decks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  subject TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.flashcard_decks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for flashcard_decks
CREATE POLICY "Users can view own decks" ON public.flashcard_decks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own decks" ON public.flashcard_decks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own decks" ON public.flashcard_decks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own decks" ON public.flashcard_decks FOR DELETE USING (auth.uid() = user_id);

-- Create index
CREATE INDEX IF NOT EXISTS idx_flashcard_decks_user_id ON public.flashcard_decks(user_id);

-- ============================================================================
-- 11. FLASHCARDS TABLE
-- ============================================================================
-- Stores individual flashcards

CREATE TABLE IF NOT EXISTS public.flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deck_id UUID NOT NULL REFERENCES public.flashcard_decks(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  tags TEXT[],
  image_url TEXT,
  difficulty INTEGER DEFAULT 3,
  next_review_date TIMESTAMPTZ DEFAULT NOW(),
  review_interval_days INTEGER DEFAULT 1,
  times_reviewed INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;

-- RLS Policies for flashcards
CREATE POLICY "Users can view own flashcards" ON public.flashcards FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.flashcard_decks WHERE flashcard_decks.id = flashcards.deck_id AND flashcard_decks.user_id = auth.uid())
);
CREATE POLICY "Users can insert own flashcards" ON public.flashcards FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.flashcard_decks WHERE flashcard_decks.id = flashcards.deck_id AND flashcard_decks.user_id = auth.uid())
);
CREATE POLICY "Users can update own flashcards" ON public.flashcards FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.flashcard_decks WHERE flashcard_decks.id = flashcards.deck_id AND flashcard_decks.user_id = auth.uid())
);
CREATE POLICY "Users can delete own flashcards" ON public.flashcards FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.flashcard_decks WHERE flashcard_decks.id = flashcards.deck_id AND flashcard_decks.user_id = auth.uid())
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_flashcards_deck_id ON public.flashcards(deck_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_next_review ON public.flashcards(next_review_date);

-- ============================================================================
-- 12. NOTES TABLE
-- ============================================================================
-- Stores user notes

CREATE TABLE IF NOT EXISTS public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  subject TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notes
CREATE POLICY "Users can view own notes" ON public.notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notes" ON public.notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notes" ON public.notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notes" ON public.notes FOR DELETE USING (auth.uid() = user_id);

-- Create index
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON public.notes(user_id);

-- ============================================================================
-- 13. MOOD LOGS TABLE
-- ============================================================================
-- Tracks user mood for analytics

CREATE TABLE IF NOT EXISTS public.mood_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mood_score INTEGER CHECK (mood_score >= 1 AND mood_score <= 10),
  notes TEXT,
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.mood_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for mood_logs
CREATE POLICY "Users can view own mood logs" ON public.mood_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own mood logs" ON public.mood_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create index
CREATE INDEX IF NOT EXISTS idx_mood_logs_user_id ON public.mood_logs(user_id);

-- ============================================================================
-- 14. STUDY PLANS TABLE
-- ============================================================================
-- Stores AI-generated study plans

CREATE TABLE IF NOT EXISTS public.study_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subject TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  duration TEXT,
  goals_text TEXT[],
  tips TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies for study_plans
CREATE POLICY "Users can view own study plans" ON public.study_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own study plans" ON public.study_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own study plans" ON public.study_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own study plans" ON public.study_plans FOR DELETE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_study_plans_user_id ON public.study_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_study_plans_dates ON public.study_plans(start_date, end_date);

-- ============================================================================
-- 15. STUDY PLAN GOALS TABLE
-- ============================================================================
-- Individual goals within study plans

CREATE TABLE IF NOT EXISTS public.study_plan_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES public.study_plans(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  due_date DATE,
  estimated_hours INTEGER,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.study_plan_goals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for study_plan_goals
CREATE POLICY "Users can view own goals" ON public.study_plan_goals FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.study_plans WHERE study_plans.id = study_plan_goals.plan_id AND study_plans.user_id = auth.uid())
);
CREATE POLICY "Users can insert own goals" ON public.study_plan_goals FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.study_plans WHERE study_plans.id = study_plan_goals.plan_id AND study_plans.user_id = auth.uid())
);
CREATE POLICY "Users can update own goals" ON public.study_plan_goals FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.study_plans WHERE study_plans.id = study_plan_goals.plan_id AND study_plans.user_id = auth.uid())
);
CREATE POLICY "Users can delete own goals" ON public.study_plan_goals FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.study_plans WHERE study_plans.id = study_plan_goals.plan_id AND study_plans.user_id = auth.uid())
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_study_plan_goals_plan_id ON public.study_plan_goals(plan_id);
CREATE INDEX IF NOT EXISTS idx_study_plan_goals_completed ON public.study_plan_goals(completed);
CREATE INDEX IF NOT EXISTS idx_study_plan_goals_due_date ON public.study_plan_goals(due_date);

-- ============================================================================
-- 16. CONTACT MESSAGES TABLE
-- ============================================================================
-- Stores contact form submissions

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_contact_messages_ticket_number ON public.contact_messages(ticket_number);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON public.contact_messages(email);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);

-- Enable RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for contact_messages
CREATE POLICY "Allow contact form submissions"
  ON public.contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view own messages"
  ON public.contact_messages
  FOR SELECT
  TO authenticated
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Allow viewing recent submissions"
  ON public.contact_messages
  FOR SELECT
  TO anon
  USING (created_at > NOW() - INTERVAL '1 hour');

-- Function to generate ticket numbers
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TEXT AS $$
DECLARE
  date_part TEXT;
  sequence_part TEXT;
  ticket_count INTEGER;
BEGIN
  date_part := TO_CHAR(NOW(), 'YYYYMMDD');
  
  SELECT COUNT(*) INTO ticket_count
  FROM public.contact_messages
  WHERE ticket_number LIKE 'SF-' || date_part || '-%';
  
  sequence_part := LPAD((ticket_count + 1)::TEXT, 4, '0');
  
  RETURN 'SF-' || date_part || '-' || sequence_part;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 17. SUBSCRIPTIONS TABLE
-- ============================================================================
-- Manages user subscriptions and plans

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL DEFAULT 'scholar',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  stripe_price_id TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscriptions
CREATE POLICY "Users can view their own subscription"
  ON public.subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription"
  ON public.subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription"
  ON public.subscriptions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to create default subscription for new users
CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.subscriptions (user_id, plan_type, status)
  VALUES (NEW.id, 'scholar', 'active');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create subscription on user signup
DROP TRIGGER IF EXISTS on_auth_user_created_subscription ON auth.users;

CREATE TRIGGER on_auth_user_created_subscription
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_subscription();

-- ============================================================================
-- 18. USAGE TRACKING TABLE
-- ============================================================================
-- Tracks usage for subscription limits

CREATE TABLE IF NOT EXISTS public.usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month_year TEXT NOT NULL,
  tasks_created INTEGER DEFAULT 0,
  ai_generations_used INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, month_year)
);

-- Enable RLS
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies for usage_tracking
CREATE POLICY "Users can view their own usage"
  ON public.usage_tracking
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage"
  ON public.usage_tracking
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage"
  ON public.usage_tracking
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================================
-- 19. BLOG POSTS TABLE
-- ============================================================================
-- Stores blog posts

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  author_name TEXT DEFAULT 'StudyForge Team',
  author_avatar TEXT,
  cover_image TEXT,
  read_time TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published BOOLEAN DEFAULT true,
  views INTEGER DEFAULT 0
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policy for blog_posts
CREATE POLICY "Anyone can read published blog posts"
  ON public.blog_posts
  FOR SELECT
  USING (published = true);

-- ============================================================================
-- COMPLETE! 
-- ============================================================================
-- All tables, RLS policies, indexes, triggers, and functions have been created.
-- Your StudyForge database is now ready to use.
-- ============================================================================

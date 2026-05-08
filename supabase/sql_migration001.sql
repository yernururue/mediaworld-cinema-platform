-- ==========================================
-- MEDIAWORLD: SUPABASE DATABASE ARCHITECTURE
-- ==========================================

-- 1. PROFILES
-- Расширяет стандартную таблицу auth.users в Supabase
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  favorite_genres JSONB DEFAULT '[]'::jsonb,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. MOVIES (TMDB Cache)
-- Кэш фильмов для быстрых запросов без спама TMDB API
CREATE TABLE public.movies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tmdb_id INTEGER UNIQUE NOT NULL,
  title TEXT NOT NULL,
  overview TEXT,
  poster_url TEXT,
  backdrop_url TEXT,
  genres JSONB DEFAULT '[]'::jsonb,
  release_year INTEGER,
  rating NUMERIC(4,2),
  trailer_key TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. USER FAVORITES
-- Связь многие-ко-многим (Профили <-> Фильмы)
CREATE TABLE public.user_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  movie_id UUID REFERENCES public.movies(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, movie_id) -- Защита от дублей
);

-- 4. USER WATCH HISTORY
-- История и прогресс просмотра для ИИ-аналитики
CREATE TABLE public.user_watch_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  movie_id UUID REFERENCES public.movies(id) ON DELETE CASCADE NOT NULL,
  watched_at TIMESTAMPTZ DEFAULT now(),
  progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  completed BOOLEAN DEFAULT false
);

-- 5. MOVIE REVIEWS
-- Отзывы и рейтинги от юзеров
CREATE TABLE public.movie_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  movie_id UUID REFERENCES public.movies(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 10),
  review_text TEXT,
  spoiler BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. FRIENDSHIPS
-- Социальный граф
CREATE TABLE public.friendships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  addressee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT CHECK (status IN ('pending', 'accepted', 'blocked', 'declined')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(requester_id, addressee_id)
);

-- 7. CONVERSATIONS
-- Контейнеры для чатов (P2P, Групповые, AI)
CREATE TABLE public.conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. CONVERSATION PARTICIPANTS
CREATE TABLE public.conversation_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(conversation_id, user_id)
);

-- 9. MESSAGES
CREATE TABLE public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Может быть NULL, если это системное сообщение
  message_text TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'ai_response', 'system')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. AI RECOMMENDATIONS
-- История рекомендаций от Gemini/Groq
CREATE TABLE public.ai_recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  prompt TEXT NOT NULL,
  recommended_movies JSONB NOT NULL, -- Массив TMDB ID
  model_used TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- ИНДЕКСЫ ДЛЯ ПРОИЗВОДИТЕЛЬНОСТИ
-- ==========================================
CREATE INDEX idx_movies_tmdb_id ON public.movies(tmdb_id);
CREATE INDEX idx_user_favorites_user_id ON public.user_favorites(user_id);
CREATE INDEX idx_user_watch_history_user_id ON public.user_watch_history(user_id);
CREATE INDEX idx_movie_reviews_movie_id ON public.movie_reviews(movie_id);
CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);

-- ==========================================
-- АВТОМАТИЧЕСКОЕ СОЗДАНИЕ ПРОФИЛЯ ПРИ РЕГИСТРАЦИИ
-- ==========================================
-- Этот триггер автоматически создает запись в public.profiles, 
-- когда новый юзер регистрируется через Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'user_name', 
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==========================================
-- ROW LEVEL SECURITY (RLS) ПОЛИТИКИ
-- ==========================================
-- Включаем RLS для всех таблиц
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_watch_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movie_reviews ENABLE ROW LEVEL SECURITY;

-- Политики для Profiles
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Политики для Movies (Фронтенд может только читать, записывать будет сервер через service_role)
CREATE POLICY "Movies are viewable by everyone" ON public.movies FOR SELECT USING (true);

-- Политики для Favorites (Только владелец видит и меняет свои лайки)
CREATE POLICY "Users view own favorites" ON public.user_favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own favorites" ON public.user_favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own favorites" ON public.user_favorites FOR DELETE USING (auth.uid() = user_id);

-- Политики для Reviews
CREATE POLICY "Reviews are viewable by everyone" ON public.movie_reviews FOR SELECT USING (true);
CREATE POLICY "Users insert own reviews" ON public.movie_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own reviews" ON public.movie_reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own reviews" ON public.movie_reviews FOR DELETE USING (auth.uid() = user_id);
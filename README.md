# MediaWorld

**An editorial-style movie discovery site: trending films from TMDB, an AI "cinema concierge" chat, and user profiles with favourites, watch history and reviews.**

`Next.js 16` · `React 19` · `TypeScript` · `Tailwind CSS 4` · `Supabase` · `TMDB API` · `Gemini 2.5 Flash` · `Groq` · `framer-motion`

---

## Features

- **Live movie data.** A small TMDB client ([`lib/tmdb.ts`](lib/tmdb.ts)) authenticates with a bearer token and caches responses for an hour. The home page shows films trending **today**, **this week** or **this month**, and the selected range is kept in the URL (`?time=`).
- **Film catalog** at `/movies`, with an animated responsive grid.
- **AI cinema concierge.** A floating chat on every page calls [`/api/chat`](app/api/chat/route.ts), which asks Gemini 2.5 Flash for recommendations and falls back to Groq (Llama 3.1 70B) if Gemini fails. Answers follow a fixed format: title, why it fits, and similar titles.
- **Accounts and profiles.** Supabase email/password auth, with middleware that refreshes the session cookie. The `/profile` page loads the profile, favourites, watch history and reviews in parallel, and shows a loading skeleton so navigation feels instant.
- **Landing page.** Hero with parallax, vision and philosophy sections, an explainer for the recommendation flow, and a contact form. Sections below the fold are loaded lazily to cut the initial JavaScript.

## Database

The schema is in [`supabase/sql_migration001.sql`](supabase/sql_migration001.sql):

| Table | Purpose |
|---|---|
| `profiles` | extends `auth.users`: username, avatar, bio, favourite genres |
| `movies` | local cache of TMDB films |
| `user_favorites`, `user_watch_history`, `movie_reviews` | per-user activity |
| `friendships`, `conversations`, `conversation_participants`, `messages` | social features, schema only |
| `ai_recommendations` | stored recommendations, schema only |

Row Level Security is on for profiles, movies, favourites, history and reviews. Users can only change their own rows, while profiles, movies and reviews are public to read.

## Run locally

```bash
pnpm install
pnpm dev                 # http://localhost:3000
```

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
TMDB_TOKEN=...           # TMDB API read access token (v4)
GEMINI_API_KEY=...       # AI chat
GROQ_API_KEY=...         # AI chat fallback
```

Then run `supabase/sql_migration001.sql` in the Supabase SQL editor.

## Project structure

```text
app/
  page.tsx            home: hero, sections, trending films
  movies/             film catalog
  profile/            profile with favourites, history, reviews
  login/              sign in / sign up
  api/chat/           AI concierge (Gemini, Groq fallback)
components/
  sections/           landing page sections
  profile/            profile tabs
  ui/                 shadcn/Radix primitives, floating AI chat
lib/
  tmdb.ts             TMDB client with caching
  supabase/           browser and server Supabase clients
middleware.ts         Supabase session refresh
supabase/             SQL schema and RLS policies
```

## Status

Built in May 2026. The social tables (friends, messages) and stored AI recommendations exist in the schema but have no UI yet. There are no automated tests, and the site isn't deployed right now.

Movie data and images come from [TMDB](https://www.themoviedb.org/). This product uses the TMDB API but is not endorsed or certified by TMDB.

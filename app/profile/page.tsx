import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { ProfileTabs } from "@/components/profile/profile-tabs"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "My Profile — MediaWorld",
  description:
    "Your cinematic profile — collection, watch history, and reviews.",
}

export default async function ProfilePage() {
  const supabase = await createClient()

  // ── Auth guard ─────────────────────────────────────────────────────────
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  // ── Profile ────────────────────────────────────────────────────────────
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, bio, favorite_genres, created_at")
    .eq("id", user.id)
    .single()

  // ── Stats & Content (parallel) ─────────────────────────────────────────
  const [
    { data: favoritesRaw, count: favoritesCount },
    { data: watchHistoryRaw, count: watchedCount },
    { data: reviewsRaw, count: reviewsCount },
  ] = await Promise.all([
    supabase
      .from("user_favorites")
      .select(
        "id, movie_id, created_at, movies(id, title, poster_url, release_year, rating)",
        { count: "exact" }
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(12),
    supabase
      .from("user_watch_history")
      .select(
        "id, movie_id, watched_at, progress_percent, completed, movies(id, title, poster_url, release_year)",
        { count: "exact" }
      )
      .eq("user_id", user.id)
      .order("watched_at", { ascending: false })
      .limit(8),
    supabase
      .from("movie_reviews")
      .select("id, rating, review_text, created_at, movies(id, title, release_year)", { count: "exact" })
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(6),
  ])

  return (
    <>
      <Header user={user} />
      <ProfileTabs
        profile={profile}
        email={user.email ?? ""}
        stats={{
          watched: watchedCount ?? 0,
          favorites: favoritesCount ?? 0,
          reviews: reviewsCount ?? 0,
        }}
        // Supabase returns joined rows as arrays — cast safely for our typed props
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        favorites={(favoritesRaw ?? []) as any[]}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        watchHistory={(watchHistoryRaw ?? []) as any[]}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        reviews={(reviewsRaw ?? []) as any[]}
      />
    </>
  )
}

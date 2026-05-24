import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { ProfileTabs } from "@/components/profile/profile-tabs"
import type { Metadata } from "next"
import type { FavoriteMovie, WatchHistoryItem, ReviewItem, ProfileData } from "@/components/profile/profile-tabs"

export const metadata: Metadata = {
  title: "My Profile — MediaWorld",
  description: "View your personal MediaWorld cinematic profile. Manage your custom collections, track your watching history, write and edit film reviews, and refine your AI-curated recommendation preferences.",
  openGraph: {
    title: "My Profile — MediaWorld",
    description: "View your personal MediaWorld cinematic profile. Manage your custom collections, track your watching history, write and edit film reviews, and refine your AI-curated recommendation preferences.",
    type: "website",
  },
}

export default async function ProfilePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Fetch all profile data in parallel for optimal performance
  const [
    profileRes,
    favoritesRes,
    historyRes,
    reviewsRes,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, username, display_name, avatar_url, bio, favorite_genres, created_at")
      .eq("id", user.id)
      .single(),
    supabase
      .from("user_favorites")
      .select("id, movie_id, created_at, movies(id, title, poster_url, release_year, rating)", { count: "exact" })
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(12),
    supabase
      .from("user_watch_history")
      .select("id, movie_id, watched_at, progress_percent, completed, movies(id, title, poster_url, release_year)", { count: "exact" })
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
        profile={profileRes.data as ProfileData | null}
        email={user.email ?? ""}
        stats={{
          watched: historyRes.count ?? 0,
          favorites: favoritesRes.count ?? 0,
          reviews: reviewsRes.count ?? 0,
        }}
        favorites={(favoritesRes.data ?? []) as unknown as FavoriteMovie[]}
        watchHistory={(historyRes.data ?? []) as unknown as WatchHistoryItem[]}
        reviews={(reviewsRes.data ?? []) as unknown as ReviewItem[]}
      />
    </>
  )
}


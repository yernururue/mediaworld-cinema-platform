"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, Play, Clock, Heart, Edit3, Film, BookOpen } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// ─── Types ─────────────────────────────────────────────────────────────────
export interface ProfileData {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string | null
  bio: string | null
  favorite_genres: string[] | null
  created_at: string | null
}

export interface FavoriteMovie {
  id: string
  movie_id: string
  created_at: string
  movies: {
    id: string
    title: string
    poster_url: string | null
    release_year: number | null
    rating: number | null
  } | null
}

export interface WatchHistoryItem {
  id: string
  movie_id: string
  watched_at: string
  progress_percent: number
  completed: boolean
  movies: {
    id: string
    title: string
    poster_url: string | null
    release_year: number | null
  } | null
}

export interface ReviewItem {
  id: string
  rating: number | null
  review_text: string | null
  created_at: string
  movies: {
    id: string
    title: string
    release_year: number | null
  } | null
}

export interface ProfileStats {
  watched: number
  favorites: number
  reviews: number
}

interface ProfileTabsProps {
  profile: ProfileData | null
  email: string
  stats: ProfileStats
  favorites: FavoriteMovie[]
  watchHistory: WatchHistoryItem[]
  reviews: ReviewItem[]
}

// ─── Helper ─────────────────────────────────────────────────────────────────
function formatReviewDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  })
}

// ─── Fallback poster placeholder ─────────────────────────────────────────────
const COVER_FALLBACK =
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1920&h=600&fit=crop"

// ─── Component ───────────────────────────────────────────────────────────────
export function ProfileTabs({
  profile,
  email,
  stats,
  favorites,
  watchHistory,
  reviews,
}: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState("collection")

  const displayName = profile?.display_name || email.split("@")[0] || "Cinephile"
  const username = profile?.username || email.split("@")[0] || "user"
  const avatarUrl = profile?.avatar_url ?? undefined
  const bio = profile?.bio ?? null
  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero / Cover ──────────────────────────────────────────────── */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={COVER_FALLBACK}
            alt="Profile cover"
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
          <div className="absolute inset-0 backdrop-blur-[2px]" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 lg:px-24 pb-8">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-end gap-6">
            {/* Avatar */}
            <Avatar className="w-28 h-28 md:w-36 md:h-36 border-2 border-foreground/10 shadow-2xl shrink-0">
              <AvatarImage src={avatarUrl} alt={displayName} />
              <AvatarFallback className="bg-muted text-3xl font-serif">
                {initials}
              </AvatarFallback>
            </Avatar>

            {/* Name & Bio */}
            <div className="flex-1 min-w-0 space-y-3">
              <div className="space-y-1">
                <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-foreground tracking-tight">
                  {displayName}
                </h1>
                <p className="font-mono text-sm text-muted-foreground">
                  @{username}
                </p>
              </div>
              {bio ? (
                <p className="text-foreground/70 text-base md:text-lg max-w-xl leading-relaxed">
                  {bio}
                </p>
              ) : (
                <p className="text-muted-foreground/40 text-sm italic">
                  No bio yet — add one in Edit Profile
                </p>
              )}
            </div>

            {/* Edit Button */}
            <Button
              id="edit-profile-btn"
              variant="outline"
              className="border-foreground/20 bg-background/30 backdrop-blur-sm hover:bg-foreground/10 text-foreground gap-2 shrink-0"
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* ── Stats Row ─────────────────────────────────────────────────── */}
      <div className="border-y border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24 py-8">
          <div className="flex justify-start gap-16 md:gap-24">
            {[
              { value: stats.watched,   label: "Watched",   icon: Play,     id: "stat-watched" },
              { value: stats.favorites, label: "Favorites", icon: Heart,    id: "stat-favorites" },
              { value: stats.reviews,   label: "Reviews",   icon: BookOpen, id: "stat-reviews" },
            ].map((stat) => (
              <div key={stat.label} id={stat.id} className="flex flex-col items-start">
                <span className="text-4xl md:text-5xl lg:text-6xl font-extralight text-foreground tracking-tight">
                  {stat.value}
                </span>
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content Tabs ──────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24 py-12 md:py-16">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-transparent border-b border-border/50 rounded-none w-full justify-start gap-8 h-auto p-0 mb-12">
            {[
              { value: "collection", label: "Collection", icon: Heart },
              { value: "history",    label: "History",    icon: Clock },
              { value: "thoughts",   label: "Thoughts",   icon: Film },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-0 pb-4 text-muted-foreground data-[state=active]:text-foreground transition-colors"
              >
                <tab.icon className="w-4 h-4 mr-2" />
                <span className="text-sm tracking-wide uppercase">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Collection Tab ─────────────────────────────────────────── */}
          <TabsContent value="collection" className="mt-0">
            {favorites.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
                {favorites.map((item) => {
                  const movie = item.movies
                  return (
                    <div
                      key={item.id}
                      className="group relative aspect-[2/3] rounded-sm overflow-hidden cursor-pointer"
                    >
                      {movie?.poster_url ? (
                        <Image
                          src={movie.poster_url}
                          alt={movie.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center p-3 text-center">
                          <span className="text-xs text-muted-foreground font-serif leading-snug">
                            {movie?.title ?? "Unknown"}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <h3 className="text-sm font-medium text-white truncate">
                          {movie?.title ?? "Unknown"}
                        </h3>
                        <p className="text-xs text-white/60">{movie?.release_year}</p>
                        {movie?.rating && (
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-3 h-3 text-primary fill-primary" />
                            <span className="text-[10px] text-white/60">
                              {Number(movie.rating).toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="absolute inset-0 ring-1 ring-inset ring-white/0 group-hover:ring-primary/30 transition-all duration-300" />
                    </div>
                  )
                })}
              </div>
            ) : (
              <EmptyState icon={Heart} message="No favorites yet" sub="Films you love will appear here" />
            )}
          </TabsContent>

          {/* History Tab ─────────────────────────────────────────────── */}
          <TabsContent value="history" className="mt-0">
            {watchHistory.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {watchHistory.map((item) => {
                  const movie = item.movies
                  return (
                    <div
                      key={item.id}
                      className="group relative aspect-[2/3] rounded-sm overflow-hidden cursor-pointer"
                    >
                      {movie?.poster_url ? (
                        <Image
                          src={movie.poster_url}
                          alt={movie.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full bg-muted" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-sm font-medium text-white truncate">
                          {movie?.title ?? "Unknown"}
                        </h3>
                        <p className="text-xs text-white/60 mb-3">{movie?.release_year}</p>
                        <div className="h-0.5 bg-white/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${item.progress_percent}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-white/40 mt-1">
                          {item.completed ? "Completed" : `${item.progress_percent}% watched`}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <EmptyState icon={Clock} message="No watch history" sub="Films you've watched will appear here" />
            )}
          </TabsContent>

          {/* Thoughts/Reviews Tab ────────────────────────────────────── */}
          <TabsContent value="thoughts" className="mt-0">
            {reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((review) => {
                  const starCount = Math.round(((review.rating ?? 0) / 10) * 5)
                  return (
                    <div
                      key={review.id}
                      className="group relative p-6 rounded-lg bg-card/40 backdrop-blur-sm border border-border/30 hover:border-border/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="font-serif text-lg text-foreground">
                          {review.movies?.title ?? "Unknown Film"}
                        </h3>
                        {review.rating && (
                          <div className="flex items-center gap-0.5 shrink-0 ml-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < starCount
                                    ? "text-primary fill-primary"
                                    : "text-muted-foreground/30"
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      {review.review_text && (
                        <p className="text-foreground/70 text-sm leading-relaxed mb-4">
                          {review.review_text}
                        </p>
                      )}
                      <span className="text-xs text-muted-foreground font-mono">
                        {formatReviewDate(review.created_at)}
                      </span>
                      <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )
                })}
              </div>
            ) : (
              <EmptyState icon={Film} message="No reviews yet" sub="Your cinematic thoughts will appear here" />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// ─── Empty State ─────────────────────────────────────────────────────────────
function EmptyState({
  icon: Icon,
  message,
  sub,
}: {
  icon: React.ElementType
  message: string
  sub: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-4 border border-dashed border-border/40 rounded-lg">
      <Icon className="w-8 h-8 text-muted-foreground/20" />
      <p className="text-sm text-muted-foreground/50 tracking-wide">{message}</p>
      <p className="text-xs text-muted-foreground/30">{sub}</p>
    </div>
  )
}

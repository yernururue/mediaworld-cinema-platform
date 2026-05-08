'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// ─── Types ────────────────────────────────────────────────────────────────────

/** Partial TMDB movie shape — only the fields we need to cache locally. */
export interface TmdbMovie {
  id: number            // TMDB numeric ID
  title: string
  overview?: string | null
  poster_path?: string | null    // e.g. "/abc123.jpg"
  backdrop_path?: string | null
  release_date?: string | null   // "YYYY-MM-DD"
  vote_average?: number | null
  genre_ids?: number[]
}

type ActionResult = { success: true; localId: string } | { error: string }
type ToggleResult =
  | { success: true; isFavorited: boolean }
  | { error: string }

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'

function buildPosterUrl(path?: string | null): string | null {
  return path ? `${TMDB_IMAGE_BASE}${path}` : null
}

function buildBackdropUrl(path?: string | null): string | null {
  return path ? `${TMDB_IMAGE_BASE}${path}` : null
}

function extractReleaseYear(releaseDate?: string | null): number | null {
  if (!releaseDate) return null
  const year = parseInt(releaseDate.substring(0, 4), 10)
  return isNaN(year) ? null : year
}

// ─── Actions ──────────────────────────────────────────────────────────────────

/**
 * Ensures a TMDB movie exists in our local `movies` cache table.
 * Uses the admin client (service role) to bypass RLS on the `movies` table.
 * Returns the local UUID of the movie record.
 */
export async function ensureMovieCached(
  tmdbMovie: TmdbMovie
): Promise<ActionResult> {
  try {
    const admin = createAdminClient()

    // 1. Check if the movie already exists by its TMDB ID
    const { data: existing, error: selectError } = await admin
      .from('movies')
      .select('id')
      .eq('tmdb_id', tmdbMovie.id)
      .maybeSingle()

    if (selectError) {
      return { error: `Failed to query movies cache: ${selectError.message}` }
    }

    if (existing) {
      // Already cached — return the existing UUID
      return { success: true, localId: existing.id }
    }

    // 2. Insert the new movie into the cache
    const { data: inserted, error: insertError } = await admin
      .from('movies')
      .insert({
        tmdb_id: tmdbMovie.id,
        title: tmdbMovie.title,
        overview: tmdbMovie.overview ?? null,
        poster_url: buildPosterUrl(tmdbMovie.poster_path),
        backdrop_url: buildBackdropUrl(tmdbMovie.backdrop_path),
        genres: tmdbMovie.genre_ids ?? [],
        release_year: extractReleaseYear(tmdbMovie.release_date),
        rating: tmdbMovie.vote_average != null
          ? parseFloat(tmdbMovie.vote_average.toFixed(2))
          : null,
      })
      .select('id')
      .single()

    if (insertError) {
      return { error: `Failed to cache movie: ${insertError.message}` }
    }

    return { success: true, localId: inserted.id }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return { error: `ensureMovieCached: ${message}` }
  }
}

/**
 * Toggles a movie in/out of the current user's favorites.
 * - If already favorited → removes it (unfavorite).
 * - If not favorited → adds it (favorite).
 * Revalidates /profile and / so the UI reflects the change immediately.
 */
export async function toggleFavorite(tmdbMovie: TmdbMovie): Promise<ToggleResult> {
  try {
    const supabase = await createClient()

    // 1. Verify the user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { error: 'You must be signed in to favorite a movie.' }
    }

    // 2. Ensure the movie exists in our local cache
    const cacheResult = await ensureMovieCached(tmdbMovie)
    if ('error' in cacheResult) {
      return { error: cacheResult.error }
    }
    const { localId: movieId } = cacheResult

    // 3. Check if already favorited
    const { data: existing, error: checkError } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('movie_id', movieId)
      .maybeSingle()

    if (checkError) {
      return { error: `Failed to check favorites: ${checkError.message}` }
    }

    if (existing) {
      // 4a. Already favorited → DELETE (unfavorite)
      const { error: deleteError } = await supabase
        .from('user_favorites')
        .delete()
        .eq('id', existing.id)

      if (deleteError) {
        return { error: `Failed to remove favorite: ${deleteError.message}` }
      }

      revalidatePath('/profile')
      revalidatePath('/')
      return { success: true, isFavorited: false }
    } else {
      // 4b. Not favorited → INSERT (favorite)
      const { error: insertError } = await supabase
        .from('user_favorites')
        .insert({ user_id: user.id, movie_id: movieId })

      if (insertError) {
        return { error: `Failed to add favorite: ${insertError.message}` }
      }

      revalidatePath('/profile')
      revalidatePath('/')
      return { success: true, isFavorited: true }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return { error: `toggleFavorite: ${message}` }
  }
}

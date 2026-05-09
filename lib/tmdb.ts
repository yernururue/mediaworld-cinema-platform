// lib/tmdb.ts
import { cache } from 'react';
import { format, subDays } from 'date-fns';

// --- Constants & Config ---
const TMDB_CONFIG = {
  BASE_URL: 'https://api.themoviedb.org/3',
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p/original',
  DEFAULT_LANGUAGE: 'en-US',
  REVALIDATE_TIME: 3600, // 1 hour
} as const;

const TMDB_TOKEN = process.env.TMDB_TOKEN || process.env.TMDB_READ_ACCESS_TOKEN;

// --- Interfaces ---
export interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

export interface TmdbMovieDetails extends TmdbMovie {
  runtime: number;
  genres: { id: number; name: string }[];
  tagline: string;
}

/** Custom error class for TMDB specific errors */
export class TmdbError extends Error {
  constructor(public status: number, message: string) {
    super(`TMDB API Error (${status}): ${message}`);
    this.name = 'TmdbError';
  }
}

// --- Utilities ---

/** Formats a TMDB image path into a full URL */
export function getTmdbImageUrl(path: string | null) {
  return path ? `${TMDB_CONFIG.IMAGE_BASE_URL}/${path}` : '/placeholder.svg';
}

/** Centralized fetcher with revalidation and bearer auth */
async function tmdbFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  if (!TMDB_TOKEN || TMDB_TOKEN === 'your_tmdb_token_here') {
    console.error('TMDB_TOKEN is missing or invalid in .env.local');
    throw new Error('TMDB configuration error');
  }

  const url = new URL(`${TMDB_CONFIG.BASE_URL}/${endpoint}`);
  url.searchParams.set('language', TMDB_CONFIG.DEFAULT_LANGUAGE);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${TMDB_TOKEN.trim()}`,
      'Content-Type': 'application/json',
    },
    next: { revalidate: TMDB_CONFIG.REVALIDATE_TIME },
  });

  if (!res.ok) {
    throw new TmdbError(res.status, res.statusText);
  }

  const data = (await res.json()) as T;
  return data;
}

// --- Data Fetchers ---

export const getTrendingMovies = cache(async (timeWindow: 'day' | 'week' = 'day') => {
  const data = await tmdbFetch<{ results: TmdbMovie[] }>(`trending/movie/${timeWindow}`);
  return data.results;
});

export const getMonthlyTop = cache(async () => {
  const today = new Date();
  const thirtyDaysAgo = subDays(today, 30);
  
  const data = await tmdbFetch<{ results: TmdbMovie[] }>('discover/movie', {
    sort_by: 'popularity.desc',
    'primary_release_date.gte': format(thirtyDaysAgo, 'yyyy-MM-dd'),
    'primary_release_date.lte': format(today, 'yyyy-MM-dd'),
    page: '1'
  });
  
  return data.results;
});

/** Helper to resolve movies based on a time parameter */
export const getMoviesByTime = cache(async (time: string = 'day') => {
  if (time === 'month') return getMonthlyTop();
  const window = (time === 'week' || time === 'day') ? time : 'day';
  return getTrendingMovies(window);
});

export const getTopRated = cache(async () => {
  const data = await tmdbFetch<{ results: TmdbMovie[] }>('movie/top_rated', { page: '1' });
  return data.results;
});

export const getMovieDetails = cache(async (id: number) => {
  return tmdbFetch<TmdbMovieDetails>(`movie/${id}`);
});



// lib/tmdb.ts
import { cache } from 'react';
import { format, subDays } from 'date-fns';

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

const TMDB_TOKEN = process.env.TMDB_TOKEN || process.env.TMDB_READ_ACCESS_TOKEN;
const BASE_URL = 'https://api.themoviedb.org/3';

function buildUrl(path: string, params: Record<string, string> = {}) {
  const url = new URL(`${BASE_URL}/${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return url.toString();
}

/** Fetch helper using Next.js cache and revalidation */
async function fetchTmdb<T>(url: string) {
  if (!TMDB_TOKEN || TMDB_TOKEN === 'your_tmdb_token_here') {
    console.error('TMDB_TOKEN is missing or invalid in .env.local');
    throw new Error('TMDB_TOKEN is missing or invalid');
  }

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${TMDB_TOKEN.trim()}`,
      'Content-Type': 'application/json',
    },
    next: { revalidate: 3600 }, // cache for 1 hour
  });

  if (!res.ok) {
    throw new Error(`TMDB fetch error: ${res.status}`);
  }
  const data = (await res.json()) as T;
  return data;
}

export const getTrendingMovies = cache(async (timeWindow: 'day' | 'week' = 'day') => {
  const url = buildUrl(`trending/movie/${timeWindow}`, { language: 'en-US' });
  const data = await fetchTmdb<{ results: TmdbMovie[] }>(url);
  return data.results;
});

export const getMonthlyTop = cache(async () => {
  const today = new Date();
  const thirtyDaysAgo = subDays(today, 30);
  
  const url = buildUrl('discover/movie', {
    language: 'en-US',
    sort_by: 'popularity.desc',
    'primary_release_date.gte': format(thirtyDaysAgo, 'yyyy-MM-dd'),
    'primary_release_date.lte': format(today, 'yyyy-MM-dd'),
    page: '1'
  });
  
  const data = await fetchTmdb<{ results: TmdbMovie[] }>(url);
  return data.results;
});

export const getTopRated = cache(async () => {
  const url = buildUrl('movie/top_rated', { language: 'en-US', page: '1' });
  const data = await fetchTmdb<{ results: TmdbMovie[] }>(url);
  return data.results;
});

export const getMovieDetails = cache(async (id: number) => {
  const url = buildUrl(`movie/${id}`, { language: 'en-US' });
  const data = await fetchTmdb<TmdbMovieDetails>(url);
  return data;
});


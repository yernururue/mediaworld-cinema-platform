// lib/tmdb.ts
import { cache } from 'react';

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
  // add other fields as needed
}

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

function buildUrl(path: string, params: Record<string, string> = {}) {
  const url = new URL(`${BASE_URL}/${path}`);
  url.searchParams.set('api_key', TMDB_API_KEY ?? '');
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return url.toString();
}

/** Fetch helper using Next.js cache and revalidation */
async function fetchTmdb<T>(url: string) {
  if (!TMDB_API_KEY || TMDB_API_KEY === 'your_tmdb_api_key_here') {
    console.error('TMDB_API_KEY is missing or invalid in .env.local');
    // Return a mock or empty results to prevent total page crash if desired, 
    // but throwing is clearer for debugging 401s.
    throw new Error('TMDB_API_KEY is missing or invalid');
  }

  const res = await fetch(url, {
    next: { revalidate: 3600 }, // cache for 1 hour
  });
  if (!res.ok) {
    throw new Error(`TMDB fetch error: ${res.status}`);
  }
  const data = (await res.json()) as T;
  return data;
}

export const getTrending = cache(async (timeWindow: 'day' | 'week' = 'day') => {
  const url = buildUrl(`trending/movie/${timeWindow}`, { language: 'en-US' });
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

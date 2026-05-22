import dynamic from 'next/dynamic'
import { Header } from "@/components/header"
import { HeroSection } from "@/components/sections/hero"
import { createClient } from "@/lib/supabase/server"
import { getMoviesByTime } from "@/lib/tmdb"

// --- Lazy Load Below-the-Fold Sections ---
const VisionSection = dynamic(() => import("@/components/sections/vision").then(mod => mod.VisionSection))
const PhilosophySection = dynamic(() => import("@/components/sections/philosophy").then(mod => mod.PhilosophySection))
const ExperienceSection = dynamic(() => import("@/components/sections/experience").then(mod => mod.ExperienceSection))
const DishesSection = dynamic(() => import("@/components/sections/dishes").then(mod => mod.DishesSection))
const ContactSection = dynamic(() => import("@/components/sections/contact").then(mod => mod.ContactSection))
const Footer = dynamic(() => import("@/components/footer").then(mod => mod.Footer))

interface PageProps {
  searchParams: Promise<{ time?: string }>
}

export default async function Home({ searchParams }: PageProps) {
  // 1. Resolve search params first as it's required for movie fetching
  const params = await searchParams;
  const supabase = await createClient();

  // 2. Parallelize data fetching to reduce TTFB
  const [{ data: { user } }, movies] = await Promise.all([
    supabase.auth.getUser(),
    getMoviesByTime(params.time)
  ]);

  return (
    <main className="min-h-screen bg-background">
      <Header user={user} />
      <HeroSection />
      
      {/* Sections below the fold are loaded dynamically to reduce initial JS payload */}
      <VisionSection />
      <PhilosophySection />
      <ExperienceSection />
      <DishesSection movies={movies} />
      <ContactSection />
      <Footer />
    </main>
  )
}


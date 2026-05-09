import { Header } from "@/components/header"
import { HeroSection } from "@/components/sections/hero"
import { createClient } from "@/lib/supabase/server"
import { VisionSection } from "@/components/sections/vision"
import { PhilosophySection } from "@/components/sections/philosophy"
import { ExperienceSection } from "@/components/sections/experience"
import { DishesSection } from "@/components/sections/dishes"
import { ContactSection } from "@/components/sections/contact"
import { Footer } from "@/components/footer"
import { getMoviesByTime } from "@/lib/tmdb"

interface PageProps {
  searchParams: Promise<{ time?: string }>
}

export default async function Home({ searchParams }: PageProps) {
  const supabase = await createClient();
  const [{ data: { user } }, params] = await Promise.all([
    supabase.auth.getUser(),
    searchParams
  ]);

  const movies = await getMoviesByTime(params.time);

  return (
    <main className="min-h-screen bg-background">
      <Header user={user} />
      <HeroSection />
      <VisionSection />
      <PhilosophySection />
      <ExperienceSection />
      <DishesSection movies={movies} />
      <ContactSection />
      <Footer />
    </main>
  )
}


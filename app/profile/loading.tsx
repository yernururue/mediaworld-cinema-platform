import { Spinner } from "@/components/ui/spinner"

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Subtle cinematic gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/50 z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background z-0" />
      
      {/* Loading content */}
      <div className="relative z-10 flex flex-col items-center gap-6 animate-pulse">
        <Spinner className="w-12 h-12 text-primary/80" />
        <div className="flex flex-col items-center gap-2">
          <h2 className="font-serif text-2xl tracking-[0.1em] text-foreground/80">
            LOADING PROFILE
          </h2>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        </div>
      </div>
    </div>
  )
}

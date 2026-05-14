'use client'

import React from 'react'
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'
import { useAudio } from '@/components/providers/audio-context'

export function CinematicPlayer() {
  const {
    isPlaying,
    togglePlay,
    currentTrack,
    nextTrack,
    prevTrack,
  } = useAudio()

  return (
    <div className="flex items-center gap-6 px-5 h-10 bg-white/5 backdrop-blur-xl border border-white/5 rounded-full shadow-2xl">
      {/* Track Title */}
      <div className="group relative flex items-center min-w-[120px]">
        <div className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground/80 truncate w-full select-none transition-all duration-500 group-hover:opacity-0 group-hover:translate-y-[-4px]">
          {currentTrack.name}
        </div>
        {(currentTrack.movie || currentTrack.artist) && (
          <div className="absolute inset-0 flex items-center text-[8px] font-mono tracking-[0.2em] uppercase text-accent opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-[4px] group-hover:translate-y-0 truncate w-full select-none pointer-events-none">
            {currentTrack.movie}{currentTrack.artist ? ` — ${currentTrack.artist}` : ''}
          </div>
        )}
      </div>

      {/* Icon Cluster */}
      <div className="flex items-center gap-4">
        <button 
          onClick={prevTrack}
          className="text-muted-foreground/50 hover:text-foreground transition-all duration-300 hover:scale-110 active:scale-95 outline-none cursor-pointer"
          aria-label="Previous track"
        >
          <SkipBack className="w-3 h-3" />
        </button>
        
        <button 
          onClick={togglePlay}
          className="text-muted-foreground/80 hover:text-foreground transition-all duration-300 hover:scale-110 active:scale-95 outline-none cursor-pointer flex items-center justify-center"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 fill-current" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
          )}
        </button>

        <button 
          onClick={nextTrack}
          className="text-muted-foreground/50 hover:text-foreground transition-all duration-300 hover:scale-110 active:scale-95 outline-none cursor-pointer"
          aria-label="Next track"
        >
          <SkipForward className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}

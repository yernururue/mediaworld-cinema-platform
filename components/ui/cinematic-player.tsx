'use client'

import React, { useState } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music } from 'lucide-react'
import { useAudio } from '@/components/providers/audio-context'
import { cn } from '@/lib/utils'
import { Slider } from '@/components/ui/slider'

export function CinematicPlayer() {
  const {
    isPlaying,
    togglePlay,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    currentTrack,
    nextTrack,
    prevTrack,
    progress,
    duration,
    seek,
  } = useAudio()

  const [isExpanded, setIsExpanded] = useState(false)

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <>
      {/* Background Overlay */}
      <div 
        onClick={() => setIsExpanded(false)}
        className={cn(
          "fixed inset-0 z-[55] bg-background/60 backdrop-blur-md transition-all duration-500",
          isExpanded ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )} 
      />

      <div 
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        className={cn(
          "relative z-[60] transition-all duration-500 ease-in-out",
          isExpanded ? "w-80" : "w-10 h-10"
        )}
      >
        <div className={cn(
          "relative overflow-hidden rounded-xl transition-all duration-500",
          isExpanded 
            ? "p-6 h-auto bg-card/40 backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_rgba(34,211,238,0.1)]" 
            : "p-0 h-10 w-10 flex items-center justify-center hover:bg-white/5 cursor-pointer"
        )}>
          {/* Ambient Glow */}
          {isPlaying && (
            <div className="absolute inset-0 bg-cyan-500/5 animate-pulse-slow pointer-events-none" />
          )}

          {!isExpanded ? (
            <button 
              onClick={() => setIsExpanded(true)}
              className="w-full h-full flex items-center justify-center text-cyan-400/80 hover:text-cyan-400 transition-colors"
            >
              <div className="relative">
                <Music className={cn("w-5 h-5", isPlaying && "animate-float")} />
                {isPlaying && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                )}
              </div>
            </button>
          ) : (
            <div className="space-y-6">
              {/* Header / Collapse */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                    <Music className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <div className="text-xs font-bold text-foreground truncate">
                      {currentTrack.name}
                    </div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest">
                      Now Playing
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsExpanded(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-white/5 rounded-full"
                >
                  <div className="w-4 h-0.5 bg-current rounded-full" />
                </button>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-6">
                <button 
                  onClick={prevTrack}
                  className="text-muted-foreground hover:text-cyan-400 transition-all hover:scale-110 active:scale-95"
                >
                  <SkipBack className="w-5 h-5" />
                </button>
                
                <button 
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full bg-cyan-500 text-background flex items-center justify-center hover:bg-cyan-400 transition-all hover:scale-110 active:scale-90 shadow-lg shadow-cyan-500/20"
                >
                  {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 ml-1 fill-current" />}
                </button>

                <button 
                  onClick={nextTrack}
                  className="text-muted-foreground hover:text-cyan-400 transition-all hover:scale-110 active:scale-95"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <Slider
                  value={[progress]}
                  max={duration || 100}
                  step={0.1}
                  onValueChange={(val) => seek(val[0])}
                  className="h-1 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-muted-foreground/60 tabular-nums tracking-tighter">
                  <span>{formatTime(progress)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-muted-foreground hover:text-cyan-400 transition-colors"
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <Slider
                  value={[isMuted ? 0 : volume * 100]}
                  max={100}
                  step={1}
                  onValueChange={(val) => {
                    setVolume(val[0] / 100)
                    if (val[0] > 0) setIsMuted(false)
                  }}
                  className="flex-1 h-1"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

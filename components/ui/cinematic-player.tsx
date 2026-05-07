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
    <div 
      className={cn(
        "fixed top-24 right-6 z-[60] transition-all duration-500 ease-in-out",
        isExpanded ? "w-72" : "w-12 h-12"
      )}
    >
      <div className={cn(
        "relative overflow-hidden rounded-2xl glass-card border border-white/10 shadow-2xl shadow-cyan-500/10 transition-all duration-500",
        isExpanded ? "p-4 h-auto" : "p-0 h-12 flex items-center justify-center hover:scale-105 cursor-pointer"
      )}>
        {/* Ambient Glow */}
        {isPlaying && (
          <div className="absolute inset-0 bg-cyan-500/5 animate-pulse-slow pointer-events-none" />
        )}

        {!isExpanded ? (
          <button 
            onClick={() => setIsExpanded(true)}
            className="w-full h-full flex items-center justify-center text-cyan-400"
          >
            {isPlaying ? (
              <div className="relative">
                <Music className="w-5 h-5 animate-float" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              </div>
            ) : (
              <Music className="w-5 h-5 opacity-60" />
            )}
          </button>
        ) : (
          <div className="space-y-4">
            {/* Header / Collapse */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 overflow-hidden">
                <Music className="w-4 h-4 text-cyan-400 shrink-0" />
                <div className="text-xs font-bold text-foreground truncate animate-pulse-slow">
                  {currentTrack.name}
                </div>
              </div>
              <button 
                onClick={() => setIsExpanded(false)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                <div className="w-4 h-1 bg-white/20 rounded-full" />
              </button>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <button 
                onClick={prevTrack}
                className="text-muted-foreground hover:text-foreground transition-all hover:scale-110 active:scale-95"
              >
                <SkipBack className="w-5 h-5" />
              </button>
              
              <button 
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:bg-cyan-500/40 transition-all hover:scale-110 active:scale-90 shadow-lg shadow-cyan-500/20"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>

              <button 
                onClick={nextTrack}
                className="text-muted-foreground hover:text-foreground transition-all hover:scale-110 active:scale-95"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <Slider
                value={[progress]}
                max={duration || 100}
                step={1}
                onValueChange={(val) => seek(val[0])}
                className="h-1 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-muted-foreground tabular-nums">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-3 pt-1">
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
  )
}

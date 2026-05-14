'use client'

import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import { Howl } from 'howler'

type Track = {
  id: string
  name: string
  url: string
  artist?: string
  movie?: string
}

const TRACKS: Track[] = [
  { 
    id: 'titanic', 
    name: 'titanic.mp3', 
    artist: 'Celine Dion', 
    movie: 'Titanic',
    url: '/audio/titanic.mp3' 
  },
  { 
    id: 'bodyguard', 
    name: 'bodyguard.mp3', 
    artist: 'Whitney Houston', 
    movie: 'The Bodyguard',
    url: '/audio/bodyguard.mp3' 
  },
  { 
    id: '8mile', 
    name: '8mile.mp3', 
    artist: 'Eminem', 
    movie: '8 Mile',
    url: '/audio/8mile.mp3' 
  },
  { 
    id: 'saturday', 
    name: 'saturday.mp3', 
    artist: 'Bee Gees', 
    movie: 'Saturday Night Fever',
    url: '/audio/saturday.mp3' 
  },
  { 
    id: 'rocky', 
    name: 'rocky.mp3', 
    artist: 'Survivor', 
    movie: 'Rocky III',
    url: '/audio/rocky.mp3' 
  },
  { id: 'ambient', name: 'cinematic-ambient.mp3', url: '/audio/cinematic-ambient.mp3' },
]

type AudioContextType = {
  isPlaying: boolean
  togglePlay: () => void
  volume: number
  setVolume: (v: number) => void
  isMuted: boolean
  setIsMuted: (m: boolean) => void
  currentTrack: Track
  nextTrack: () => void
  prevTrack: () => void
  progress: number
  duration: number
  seek: (pos: number) => void
  changeMood: (mood: 'sci-fi' | 'thriller' | 'romance' | 'action' | 'default') => void
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [isMuted, setIsMuted] = useState(false)
  const [trackIndex, setTrackIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  
  const howlRef = useRef<Howl | null>(null)
  const progressInterval = useRef<NodeJS.Timeout | null>(null)

  const currentTrack = TRACKS[trackIndex]

  // Initialize Howl
  useEffect(() => {
    if (howlRef.current) {
      howlRef.current.unload()
    }

    howlRef.current = new Howl({
      src: [currentTrack.url],
      html5: true,
      loop: true,
      volume: isMuted ? 0 : volume,
      onplay: () => setIsPlaying(true),
      onpause: () => setIsPlaying(false),
      onstop: () => setIsPlaying(false),
      onload: () => setDuration(howlRef.current?.duration() || 0),
    })

    if (isPlaying) {
      howlRef.current.play()
    }

    return () => {
      howlRef.current?.unload()
    }
  }, [trackIndex])

  // Sync volume and mute
  useEffect(() => {
    if (howlRef.current) {
      howlRef.current.volume(isMuted ? 0 : volume)
    }
  }, [volume, isMuted])

  // Progress tracking
  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        if (howlRef.current) {
          const seek = howlRef.current.seek() as number
          setProgress(seek)
        }
      }, 1000)
    } else {
      if (progressInterval.current) clearInterval(progressInterval.current)
    }

    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current)
    }
  }, [isPlaying])

  const togglePlay = () => {
    if (!howlRef.current) return
    if (isPlaying) {
      howlRef.current.pause()
    } else {
      howlRef.current.play()
    }
  }

  const nextTrack = () => {
    setTrackIndex((prev) => (prev + 1) % TRACKS.length)
  }

  const prevTrack = () => {
    setTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length)
  }

  const seek = (pos: number) => {
    if (howlRef.current) {
      howlRef.current.seek(pos)
      setProgress(pos)
    }
  }

  const changeMood = (mood: string) => {
    // Mapping moods to existing tracks for simulation
    switch (mood) {
      case 'sci-fi':
        setTrackIndex(1) // Future Cinema
        break
      case 'thriller':
        setTrackIndex(2) // Neon Dreams
        break
      case 'action':
        setTrackIndex(1)
        break
      default:
        setTrackIndex(0) // Cinematic Ambient
    }
  }

  return (
    <AudioContext.Provider
      value={{
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
        changeMood,
      }}
    >
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const context = useContext(AudioContext)
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider')
  }
  return context
}

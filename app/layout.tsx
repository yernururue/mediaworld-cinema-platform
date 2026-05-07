import React from "react"
import type { Metadata } from 'next'
import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { FloatingAIChat } from '@/components/ui/floating-ai-chat'
import { AudioProvider } from '@/components/providers/audio-context'
import { CinematicPlayer } from '@/components/ui/cinematic-player'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700']
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700']
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: '--font-jetbrains',
  weight: ['400', '500']
});

export const metadata: Metadata = {
  title: 'Media World — Cinematic Experience',
  description: 'Discover the magic of cinema with our curated collection of films, top-rated classics, and AI-powered recommendations for unforgettable movie nights.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background`}>
        <AudioProvider>
          {children}
          <CinematicPlayer />
          <FloatingAIChat />
          <Analytics />
        </AudioProvider>
      </body>
    </html>
  )
}

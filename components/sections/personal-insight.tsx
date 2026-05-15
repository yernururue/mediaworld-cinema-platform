"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, Video, X, CheckCircle2, Play, Info } from "lucide-react"

export function PersonalInsightSection() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  
  const sectionRef = useRef<HTMLElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const handleFile = (selectedFile: File) => {
    if (!selectedFile.type.startsWith("video/")) {
      alert("Please select a valid video file.")
      return
    }

    setFile(selectedFile)
    setPreviewUrl(URL.createObjectURL(selectedFile))
    
    // Simulate upload progress
    setIsUploading(true)
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + 5
      })
    }, 100)
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const onDragLeave = () => {
    setIsDragging(false)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) handleFile(droppedFile)
  }

  const clearFile = () => {
    setFile(null)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setUploadProgress(0)
  }

  return (
    <section 
      ref={sectionRef}
      id="personal-insight"
      className="relative py-32 md:py-48 overflow-hidden bg-background"
    >
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Content Area */}
          <div className="space-y-8">
            <div 
              className="flex items-center gap-4"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateX(0)" : "translateX(-20px)",
                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground">(05)</span>
              <div className="w-8 h-px bg-primary" />
              <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground">Studio Vault</span>
            </div>

            <h2 
              className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] text-foreground text-pretty"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(40px)",
                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s"
              }}
            >
              Your Personal Cinematic Insight
            </h2>

            <p 
              className="text-lg text-muted-foreground leading-relaxed max-w-xl"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(30px)",
                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s"
              }}
            >
              The Studio Vault allows you to upload and preview your own film experiments. 
              Review your footage through our high-fidelity lens before sharing it with the world.
            </p>

            <div 
              className="flex flex-col sm:flex-row gap-6 pt-4"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s"
              }}
            >
              <div className="flex items-center gap-3 px-4 py-2 bg-secondary/50 border border-border/50 rounded-full">
                <Video className="w-4 h-4 text-accent" />
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Supported: MP4, MOV, WebM</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 bg-secondary/50 border border-border/50 rounded-full">
                <Info className="w-4 h-4 text-accent" />
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Local Preview Mode</span>
              </div>
            </div>
          </div>

          {/* Upload / Preview Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.95 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="relative"
          >
            <div className="aspect-video relative rounded-2xl overflow-hidden bg-secondary/30 border border-white/5 backdrop-blur-sm shadow-2xl group">
              
              <AnimatePresence mode="wait">
                {!previewUrl ? (
                  <motion.div
                    key="upload-zone"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`absolute inset-0 flex flex-col items-center justify-center p-8 transition-colors duration-300 ${
                      isDragging ? "bg-accent/10" : "hover:bg-white/5"
                    }`}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      className="hidden" 
                      accept="video/*"
                      onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                    />
                    
                    <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform duration-500">
                      <Upload className="w-6 h-6 text-accent" />
                    </div>
                    
                    <div className="text-center space-y-2">
                      <p className="font-serif text-xl font-light text-foreground">
                        Drop your film here
                      </p>
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        or click to browse library
                      </p>
                    </div>

                    {/* Corner Ornaments */}
                    <div className="absolute top-6 left-6 w-4 h-4 border-t border-l border-white/20" />
                    <div className="absolute top-6 right-6 w-4 h-4 border-t border-r border-white/20" />
                    <div className="absolute bottom-6 left-6 w-4 h-4 border-b border-l border-white/20" />
                    <div className="absolute bottom-6 right-6 w-4 h-4 border-b border-r border-white/20" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="preview-zone"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 group"
                  >
                    <video 
                      src={previewUrl} 
                      className="w-full h-full object-cover"
                      controls={!isUploading}
                      autoPlay
                      muted
                      loop
                    />
                    
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center p-12">
                        <div className="w-full max-w-xs space-y-4">
                          <div className="flex justify-between text-[10px] uppercase tracking-widest">
                            <span className="text-muted-foreground">Analyzing Footage...</span>
                            <span className="text-accent">{uploadProgress}%</span>
                          </div>
                          <div className="h-0.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-accent"
                              initial={{ width: 0 }}
                              animate={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {!isUploading && (
                      <button 
                        onClick={clearFile}
                        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-accent transition-colors duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}

                    {uploadProgress === 100 && !isUploading && (
                      <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 bg-green-500/20 backdrop-blur-md border border-green-500/30 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                        <span className="text-[8px] uppercase tracking-widest text-green-500 font-bold">Insight Ready</span>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Reflection Effect */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-4/5 h-20 bg-accent/20 blur-[60px] opacity-20 pointer-events-none" />
          </motion.div>

        </div>
      </div>
    </section>
  )
}

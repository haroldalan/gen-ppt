'use client'

import { usePreview }   from '@/hooks/usePreview'
import { useParams, useRouter }    from 'next/navigation'
import { Button }       from '@/components/ui/button'
import { motion }       from 'framer-motion'
import { AlertCircle, Download }     from 'lucide-react'
import Image from 'next/image'

export default function PreviewPage() {
  const params = useParams()
  const router = useRouter()
  const run = Array.isArray(params.run) ? params.run[0] : params.run
  const { data, isLoading, error } = usePreview(run || '')

  if (!run) {
    return null
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[calc(100vh-8rem)] flex items-center justify-center"
      >
        <div className="flex flex-col items-center gap-4">
          <AlertCircle className="w-8 h-8 text-destructive" />
          <p className="text-destructive">Error: {(error as Error).message}</p>
          <Button variant="outline" onClick={() => router.push('/')}>
            Return Home
          </Button>
        </div>
      </motion.div>
    )
  }

  if (isLoading || !data) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center gap-4"
      >
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground animate-pulse">Loading presentation...</p>
      </motion.div>
    )
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
      {/* Header section */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/')}
            className="self-start hidden md:block" // Hide on mobile
          >
            ← Back
          </Button>
          
          <a 
            href={data.pptUrl} 
            target="_blank" 
            rel="noreferrer"
            className="hidden md:block"
          >
            <Button variant="ghost" className="gap-2">
              <Download size={16} />
              Download
            </Button>
          </a>
        </div>

        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Slide Previews</h1>
          <p className="text-sm text-muted-foreground">
            Use this as a jumping off point — content is AI generated
          </p>
        </div>
      </div>

      {/* Slides grid with staggered animation */}
      <div className="grid gap-4 md:gap-6 mb-16">
        {data.slideUrls.map((url, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: i * 0.1,
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            <div className="relative group">
              <Image
                src={url}
                alt={`Slide ${i + 1}`}
                width={800}
                height={450}
                className="w-full rounded-lg shadow-sm transition-all duration-200
                         group-hover:shadow-md border border-border/100"
                loading={i > 2 ? 'lazy' : 'eager'}
              />
              <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm 
                            px-2 py-1 rounded text-sm text-muted-foreground">
                Slide {i + 1}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Centered floating download button for mobile */}
      <div className="fixed left-0 right-0 bottom-20 md:hidden z-50 px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex justify-center"
        >
          <a href={data.pptUrl} target="_blank" rel="noreferrer">
            <Button 
              className="shadow-lg hover:shadow-xl transition-shadow px-6 py-2 gap-2"
            >
              <Download size={18} />
              Download Presentation
            </Button>
          </a>
        </motion.div>
      </div>
    </div>
  )  
}

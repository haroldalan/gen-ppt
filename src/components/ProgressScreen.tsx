'use client'

import { useStatusPoll } from '@/hooks/useStatusPoll'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function ProgressScreen({ run, template }: { run: string; template: string }) {
  const router = useRouter()
  const { data, isLoading, error } = useStatusPoll(run)

  // redirect when finished
  useEffect(() => {
    if (data?.state === 'done') {
      router.replace(`/preview/${run}`)
    }
  }, [data?.state, run, router])

  const getEmoji = (state?: string) => {
    switch (state) {
      case 'planning': return '🤔'
      case 'generating': return '✨'
      case 'done': return '🎉'
      default: return '💭'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm z-[150]">
      <motion.div 
        className="bg-background p-8 rounded-xl shadow-lg max-w-[calc(100%-2rem)] w-[28rem]"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="text-center space-y-6">
          {/* Emoji with bounce animation */}
          <motion.div 
            className="text-4xl"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {getEmoji(data?.state)}
          </motion.div>

          {/* Message */}
          <div className="space-y-2">
            <motion.h2 
              className="text-xl font-semibold"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {data?.state === 'planning' ? 'Planning your presentation...' :
               data?.state === 'generating' ? 'Creating your slides...' :
               'Getting things ready...'}
            </motion.h2>
            
            {/* Status message */}
            <motion.p 
              className="text-muted-foreground"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              key={data?.message || 'loading'}
              transition={{ delay: 0.2 }}
            >
              {data?.message || 'Initializing...'}
            </motion.p>
          </div>

          {/* Abstract loading animation */}
          <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary/80 rounded-full"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut"
              }}
            />
          </div>

          {error && (
            <motion.p 
              className="text-sm text-destructive"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Having trouble connecting - retrying...
            </motion.p>
          )}
        </div>
      </motion.div>
    </div>
  )
}

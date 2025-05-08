'use client';
import { PromptBox } from './PromptBox';
import { useGenerate } from '@/hooks/useGenerate';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const loadingMessages = [
  "Preparing resources...",
  "Initializing pipeline...",
  "Starting generation..."
];

export default function PromptBoxWrapper() {
  const router = useRouter();
  const { start, isGenerating, error } = useGenerate();
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 2000);
      return () => clearInterval(interval);
    } else {
      setMessageIndex(0);
    }
  }, [isGenerating]);

  const handleGenerate = async (prompt: string, template: string) => {
    try {
      await start(prompt, template);
    } catch (err) {
      console.error('Generation failed:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full min-h-[calc(100vh-8rem)] grid place-items-center"
    >
      <div className="w-full">
        <PromptBox onGenerate={handleGenerate} isGenerating={isGenerating} />
        
        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-center"
          >
            <p className="text-sm text-destructive">
              {error.message || 'Something went wrong. Please try again.'}
            </p>
          </motion.div>
        )}
      </div>

      {isGenerating && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-background/50 backdrop-blur-sm flex items-center justify-center"
        >
          <motion.div 
            className="flex flex-col items-center gap-6 bg-background p-8 rounded-xl shadow-lg"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 border-4 border-primary/30 rounded-full" />
                <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
              <motion.span 
                key={messageIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-lg text-muted-foreground"
              >
                {loadingMessages[messageIndex]}
              </motion.span>
            </div>
            <div className="w-64 h-1.5 bg-secondary/30 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 8, ease: "linear" }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}

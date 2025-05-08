'use client';
import { useState } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

const TEMPLATES = [
  { id: 'simple',  label: 'Simple',  thumb: '/templates/simple.png'  },
  { id: 'blocky', label: 'Blocky', thumb: '/templates/blocky.png' },
  { id: 'galaxy',  label: 'Galaxy',  thumb: '/templates/galaxy.png'  },
  { id: 'organic',  label: 'Organic',  thumb: '/templates/organic.png'  },
];

export function PromptBox({
  onGenerate,
  isGenerating,
}: {
  onGenerate: (prompt: string, template: string) => void;
  isGenerating: boolean;
}) {
  const [prompt, setPrompt] = useState('');
  const [template, setTemplate] = useState('Simple');
  const [tempTemplate, setTempTemplate] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleGenerate = async () => {
    await onGenerate(prompt.trim(), template);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-6 md:px-8 space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">
          A presentation in maggi mins
        </h1>
        <div className="space-y-1.5">
          <p className="text-lg text-muted-foreground">
            Describe your presentation idea, and get a full deck
          </p>
          <p className="text-xs text-muted-foreground/80">
            (or a nearly full one)
          </p>
        </div>
      </div>

      <div className="relative">
        <textarea
          className="w-full h-36 rounded-xl border px-4 py-3 text-lg resize-none outline-none shadow-sm
                    transition-all duration-200
                    focus:border-primary focus:ring-2 focus:ring-primary/20
                    hover:border-primary/50"
          placeholder="Describe the presentation you'd like…"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div className="absolute right-4 bottom-4 text-sm text-muted-foreground">
          {prompt.length} characters
        </div>
      </div>

      <div className="flex justify-between items-center">
        {/* template picker */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline"
              className="transition-colors hover:bg-secondary/80"
              onClick={() => setTempTemplate(template)}
            >
              Template: {template}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogTitle className="text-xl font-semibold mb-4">
              Choose template
            </DialogTitle>

            <div className="grid grid-cols-2 gap-4">
              {TEMPLATES.map((t) => (
                <Card
                  key={t.id}
                  onClick={() => setTempTemplate(t.id)}
                  className={`cursor-pointer p-2 border transition-all duration-200 
                    hover:border-primary/50 hover:shadow-md
                    ${t.id === tempTemplate ? 'ring-2 ring-primary shadow-sm' : ''}`}
                >
                  <Image
                    src={t.thumb}
                    alt={`${t.label} template preview`}
                    width={400}
                    height={225}
                    className="w-full aspect-video object-cover rounded-md border border-border/50"
                  />
                  <p className="text-center mt-1 font-medium">{t.label}</p>
                </Card>
              ))}
            </div>

            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button 
                  onClick={() => {
                    setTemplate(tempTemplate);
                  }}
                >
                  Confirm Selection
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* generate CTA */}
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            disabled={!prompt.trim() || isGenerating}
            onClick={handleGenerate}
            className="px-6 font-medium transition-all duration-200 hover:shadow-md"
          >
            {isGenerating ? (
              <>Generating...</>
            ) : (
              <>Generate →</>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

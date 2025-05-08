'use client';

export function Footer() {
  return (
    <footer className="w-full h-16 border-t bg-background/80 backdrop-blur-sm">
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-center">
        <p className="text-sm text-muted-foreground inline-flex items-center gap-1.5">
          Whipped up by
          <a
            href="https://www.linkedin.com/in/tharoldalan/"
            target="_blank"
            rel="noreferrer"
            className="text-primary font-medium hover:underline"
          >
            Alan
          </a>
          with <span className="text-base">😠</span>
        </p>
      </div>
    </footer>
  );
}
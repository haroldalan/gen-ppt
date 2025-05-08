'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

function useScrollDirection() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY <= 0 || currentScrollY < lastScrollY);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return isVisible;
}

export function Header() {
  const isVisible = useScrollDirection();

  return (
    <header className={`fixed top-0 left-0 right-0 h-16 border-b bg-background/80 backdrop-blur-sm transition-transform duration-200 z-[100] ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold transition-opacity hover:opacity-80">
          <span className="text-2xl">א</span>
          <span>ALEPH</span>
        </Link>
      </div>
    </header>
  );
}
"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useCallback, useRef } from "react";

const lightModeImages = [
  '/Light Mode/Overview-Light.png',
  '/Light Mode/Budget-Light.png',
  '/Light Mode/Category-Breakdown-Light.png',
  '/Light Mode/Savings-Goals-Light.png',
];

const darkModeImages = [
  '/Dark Mode/Overview-Dark.png',
  '/Dark Mode/Budget-Dark.png',
  '/Dark Mode/Category-Breakdown-Dark.png',
  '/Dark Mode/Savings-Goals-Dark.png',
];

function Carousel({ images, idPrefix, mode }: { images: string[]; idPrefix: string; mode: 'light' | 'dark' }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const xUp = e.changedTouches[0].clientX;
    const xDiff = touchStartX.current - xUp;
    if (Math.abs(xDiff) > 50) {
      if (xDiff > 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
  }, [goNext, goPrev]);

  return (
    <div
      className={`relative mt-8 ${mode === 'light' ? 'block dark:hidden' : 'hidden dark:block'}`}
      id={idPrefix}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative w-full flex justify-center items-center" style={{ minHeight: 320 }}>
        {images.map((src, idx) => (
          <Image
            key={src}
            src={src}
            alt={`StudentPenny ${mode === 'light' ? 'Light' : 'Dark'} Mode Screenshot ${idx + 1}`}
            width={900}
            height={500}
            className={`rounded-xl shadow-xl object-contain absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ${idx === currentIndex ? 'opacity-100' : 'opacity-0'}`}
            style={{ pointerEvents: 'none' }}
          />
        ))}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
          className={`absolute left-2 top-1/2 -translate-y-1/2 ${mode === 'light' ? 'bg-white/80 hover:bg-white' : 'bg-gray-800/80 hover:bg-gray-800 text-white'} rounded-full p-2 shadow`}
          aria-label="Previous"
          style={{ zIndex: 20 }}
        >&#8592;</button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); goNext(); }}
          className={`absolute right-2 top-1/2 -translate-y-1/2 ${mode === 'light' ? 'bg-white/80 hover:bg-white' : 'bg-gray-800/80 hover:bg-gray-800 text-white'} rounded-full p-2 shadow`}
          aria-label="Next"
          style={{ zIndex: 20 }}
        >&#8594;</button>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-28 lg:py-32">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] translate-x-1/2 translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-primary">
            Free for students — Smart for sponsors
          </p>
          <div className="flex items-center gap-x-3 border rounded-lg p-2" style={{ borderColor: '#1C8F99' }}>
            <Image
              src="/smartpennies.png"
              alt="StudentPenny"
              width={256}
              height={256}
              className="h-48 w-48 object-contain"
            />
            <span className="text-balance text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              StudentPenny
            </span>
          </div>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Plan your money around semesters, tuition, and part-time income — not generic monthly budgets.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="w-full sm:w-auto" asChild>
              <Link href="/dashboard">
                Try StudentPenny
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent" asChild>
              <Link href="#how-it-works">See How It Works</Link>
            </Button>
          </div>
        </div>
        {/* Light Mode Carousel */}
        <Carousel images={lightModeImages} idPrefix="light-mode-carousel" mode="light" />
        {/* Dark Mode Carousel */}
        <Carousel images={darkModeImages} idPrefix="dark-mode-carousel" mode="dark" />
      </div>
    </section>
  );
}

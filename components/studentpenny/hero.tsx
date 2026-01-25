import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
        <div className="relative mt-8 block dark:hidden" id="light-mode-carousel">
          {/* Carousel Images */}
          <div className="relative w-full flex justify-center items-center" style={{ minHeight: 320 }}>
            {[
              '/Light Mode/Overview-Light.png',
              '/Light Mode/Budget-Light.png',
              '/Light Mode/Category-Breakdown-Light.png',
              '/Light Mode/Savings-Goals-Light.png',
            ].map((src, idx) => (
              <Image
                key={src}
                src={src}
                alt={`StudentPenny Light Mode Screenshot ${idx + 1}`}
                width={900}
                height={500}
                className={`rounded-xl shadow-xl object-contain absolute left-1/2 top-0 -translate-x-1/2 transition-opacity duration-300 ${idx === 0 ? 'opacity-100' : 'opacity-0'}`}
                data-carousel-img={idx}
                style={{ pointerEvents: 'none' }} // Prevents images from blocking button clicks
              />
            ))}
            {/* Arrow buttons for desktop */}
            <button
              type="button"
              id="carousel-left"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white"
              aria-label="Previous"
              style={{ zIndex: 20 }}
            >&#8592;</button>
            <button
              type="button"
              id="carousel-right"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white"
              aria-label="Next"
              style={{ zIndex: 20 }}
            >&#8594;</button>
          </div>
        </div>
        {/* Dark Mode Carousel */}
        <div className="relative mt-8 hidden dark:block" id="dark-mode-carousel">
          {/* Carousel Images */}
          <div className="relative w-full flex justify-center items-center" style={{ minHeight: 320 }}>
            {[
              '/Dark Mode/Overview-Dark.png',
              '/Dark Mode/Budget-Dark.png',
              '/Dark Mode/Category-Breakdown-Dark.png',
              '/Dark Mode/Savings-Goals-Dark.png',
            ].map((src, idx) => (
              <Image
                key={src}
                src={src}
                alt={`StudentPenny Dark Mode Screenshot ${idx + 1}`}
                width={900}
                height={500}
                className={`rounded-xl shadow-xl object-contain absolute left-1/2 top-0 -translate-x-1/2 transition-opacity duration-300 ${idx === 0 ? 'opacity-100' : 'opacity-0'}`}
                data-carousel-img={idx}
                style={{ pointerEvents: 'none' }}
              />
            ))}
            {/* Arrow buttons for desktop */}
            <button
              type="button"
              id="carousel-left-dark"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white"
              aria-label="Previous"
              style={{ zIndex: 20 }}
            >&#8592;</button>
            <button
              type="button"
              id="carousel-right-dark"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white"
              aria-label="Next"
              style={{ zIndex: 20 }}
            >&#8594;</button>
          </div>
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                if (typeof window === 'undefined') return;
                // Light mode carousel
                (function() {
                  let current = 0;
                  const imgs = Array.from(document.querySelectorAll('#light-mode-carousel [data-carousel-img]'));
                  let xDown = null;
                  function show(idx) {
                    imgs.forEach((img, i) => {
                      img.style.opacity = i === idx ? '1' : '0';
                    });
                  }
                  function handleTouchStart(evt) {
                    xDown = evt.touches[0].clientX;
                  }
                  function handleTouchEnd(evt) {
                    if (!xDown) return;
                    let xUp = evt.changedTouches[0].clientX;
                    let xDiff = xDown - xUp;
                    if (Math.abs(xDiff) > 50) {
                      if (xDiff > 0) current = (current + 1) % imgs.length;
                      else current = (current - 1 + imgs.length) % imgs.length;
                      show(current);
                    }
                    xDown = null;
                  }
                  const carousel = document.getElementById('light-mode-carousel');
                  if (carousel) {
                    carousel.addEventListener('touchstart', handleTouchStart, false);
                    carousel.addEventListener('touchend', handleTouchEnd, false);
                    show(current);
                    // Arrow button support
                    const left = document.getElementById('carousel-left');
                    const right = document.getElementById('carousel-right');
                    if (left && right) {
                      left.onclick = function(e) {
                        e.stopPropagation();
                        current = (current - 1 + imgs.length) % imgs.length;
                        show(current);
                      };
                      right.onclick = function(e) {
                        e.stopPropagation();
                        current = (current + 1) % imgs.length;
                        show(current);
                      };
                    }
                  }
                })();
                // Dark mode carousel
                (function() {
                  let current = 0;
                  const imgs = Array.from(document.querySelectorAll('#dark-mode-carousel [data-carousel-img]'));
                  let xDown = null;
                  function show(idx) {
                    imgs.forEach((img, i) => {
                      img.style.opacity = i === idx ? '1' : '0';
                    });
                  }
                  function handleTouchStart(evt) {
                    xDown = evt.touches[0].clientX;
                  }
                  function handleTouchEnd(evt) {
                    if (!xDown) return;
                    let xUp = evt.changedTouches[0].clientX;
                    let xDiff = xDown - xUp;
                    if (Math.abs(xDiff) > 50) {
                      if (xDiff > 0) current = (current + 1) % imgs.length;
                      else current = (current - 1 + imgs.length) % imgs.length;
                      show(current);
                    }
                    xDown = null;
                  }
                  const carousel = document.getElementById('dark-mode-carousel');
                  if (carousel) {
                    carousel.addEventListener('touchstart', handleTouchStart, false);
                    carousel.addEventListener('touchend', handleTouchEnd, false);
                    show(current);
                    // Arrow button support
                    const left = document.getElementById('carousel-left-dark');
                    const right = document.getElementById('carousel-right-dark');
                    if (left && right) {
                      left.onclick = function(e) {
                        e.stopPropagation();
                        current = (current - 1 + imgs.length) % imgs.length;
                        show(current);
                      };
                      right.onclick = function(e) {
                        e.stopPropagation();
                        current = (current + 1) % imgs.length;
                        show(current);
                      };
                    }
                  }
                })();
              })();
            `,
          }}
        ></script>
      </div>
    </section>
  );
}

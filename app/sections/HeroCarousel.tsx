"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent, TouchEvent } from "react";
import Image from "next/image";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

type Slide = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  alt: string;
};

const SLIDES: Slide[] = [
  {
    id: "fabrication",
    title: "Precision Fabrication Works",
    description:
      "Custom structural fabrication tailored for residential, commercial, and industrial projects.",
    imageUrl: "/carousel/hero_image_1.webp",
    alt: "Precision fabrication work",
  },
  {
    id: "truss",
    title: "Truss Setup Manufacturing",
    description:
      "High-strength truss systems engineered for durability and safety in any environment.",
    imageUrl: "/carousel/hero_image_2.webp",
    alt: "Truss setup manufacturing",
  },
  {
    id: "interior",
    title: "Kitchen & Interior Makeovers",
    description:
      "Modern kitchen cabinetry and interior detailing crafted with premium materials.",
    imageUrl: "/carousel/hero_image_3.webp",
    alt: "Kitchen and interior makeovers",
  },
  {
    id: "gate",
    title: "Designer Grill & Gates",
    description: "Custom ornamental grills and heavy-duty security gates.",
    imageUrl: "/carousel/hero_image_4.webp",
    alt: "Designer grill and gate",
  },
  {
    id: "stair",
    title: "Spiral Staircases",
    description: "Space-saving steel spiral stair solutions.",
    imageUrl: "/carousel/hero_image_5.webp",
    alt: "Spiral staircase",
  },
  {
    id: "roof",
    title: "Industrial Roofing",
    description: "Long-span roofing with clean drainage and finishes.",
    imageUrl: "/carousel/hero_image_6.webp",
    alt: "Industrial roofing",
  },
  {
    id: "steel-solutions",
    title: "Comprehensive Steel Solutions",
    description: "Your one-stop solution for all steel-related needs.",
    imageUrl: "/carousel/hero_image_7.webp",
    alt: "Comprehensive steel solutions",
  },
];

const AUTO_SCROLL_INTERVAL = 3000;
const TOUCH_THRESHOLD = 50;

export default function HeroCarousel() {
  // positionIndex includes cloned slides; 0 is last-clone, 1..slideCount real, slideCount+1 first-clone
  const [positionIndex, setPositionIndex] = useState(1);
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartX = useRef<number | null>(null);
  const slideCount = SLIDES.length;
  const trackRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const snapFallbackRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const extendedSlides = useMemo(() => {
    const first = SLIDES[0];
    const last = SLIDES[slideCount - 1];
    return [last, ...SLIDES, first];
  }, [slideCount]);

  const goToSlide = useCallback(
    (index: number) => {
      // map dot index to positionIndex within real range
      setPositionIndex(((index % slideCount) + slideCount) % slideCount + 1);
    },
    [slideCount]
  );

  const goToNextSlide = useCallback(() => {
    setPositionIndex((prev) => {
      const next = prev + 1;
      return next > slideCount + 1 ? slideCount + 1 : next;
    });
  }, [slideCount]);

  const goToPrevSlide = useCallback(() => {
    setPositionIndex((prev) => {
      const next = prev - 1;
      return next < 0 ? 0 : next;
    });
  }, []);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (!isPaused) {
      timerRef.current = setTimeout(goToNextSlide, AUTO_SCROLL_INTERVAL);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [positionIndex, isPaused, goToNextSlide]);

  // Seamless loop: after animating into a clone, jump to the corresponding real slide without transition
  useEffect(() => {
    const handleTransitionEnd = () => {
      if (positionIndex === 0) {
        if (snapFallbackRef.current) {
          clearTimeout(snapFallbackRef.current);
          snapFallbackRef.current = null;
        }
        setIsTransitionEnabled(false);
        setPositionIndex(slideCount);
      } else if (positionIndex === slideCount + 1) {
        if (snapFallbackRef.current) {
          clearTimeout(snapFallbackRef.current);
          snapFallbackRef.current = null;
        }
        setIsTransitionEnabled(false);
        setPositionIndex(1);
      }
    };

    const current = trackRef.current;
    if (current) current.addEventListener("transitionend", handleTransitionEnd);
    return () => current?.removeEventListener("transitionend", handleTransitionEnd);
  }, [positionIndex, slideCount]);

  // Fallback snap in case transitionend is missed (e.g., rapid clicks or browser quirk)
  useEffect(() => {
    if (snapFallbackRef.current) {
      clearTimeout(snapFallbackRef.current);
      snapFallbackRef.current = null;
    }
    if (positionIndex === 0 || positionIndex === slideCount + 1) {
      snapFallbackRef.current = setTimeout(() => {
        // Still at boundary? Force snap to the corresponding real slide
        setIsTransitionEnabled(false);
        setPositionIndex(positionIndex === 0 ? slideCount : 1);
      }, 800);
    }

    return () => {
      if (snapFallbackRef.current) {
        clearTimeout(snapFallbackRef.current);
        snapFallbackRef.current = null;
      }
    };
  }, [positionIndex, slideCount]);

  // Re-enable transition on the next frame after an instant jump
  useEffect(() => {
    if (!isTransitionEnabled) {
      const id = requestAnimationFrame(() => setIsTransitionEnabled(true));
      return () => cancelAnimationFrame(id);
    }
  }, [isTransitionEnabled]);


  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
    setIsPaused(true);
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current !== null) {
      const delta = event.changedTouches[0]?.clientX - touchStartX.current;
      if (typeof delta === "number" && Math.abs(delta) > TOUCH_THRESHOLD) {
        if (delta > 0) {
          goToPrevSlide();
        } else {
          goToNextSlide();
        }
      }
    }

    touchStartX.current = null;
    setIsPaused(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goToNextSlide();
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToPrevSlide();
    }
  };

  const activeIndex = (positionIndex - 1 + slideCount) % slideCount;
  const currentTranslatePx = (() => {
    const track = trackRef.current;
    const containerW = containerRef.current?.clientWidth ?? 0;
    if (!track || !containerW) return 0;
    const childIndex = Math.max(0, Math.min(positionIndex, track.children.length - 1));
    const child = track.children[childIndex] as HTMLElement | undefined;
    if (!child) return 0;
    const childCenter = child.offsetLeft + child.offsetWidth / 2;
    return Math.max(0, childCenter - containerW / 2);
  })();

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured services"
      className="relative mt-4 w-full"
    >
      <div
        ref={containerRef}
        className="relative overflow-hidden bg-neutral-100 shadow-lg"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-live="polite"
        aria-atomic="true"
        style={{ touchAction: "pan-y" }}
      >
        <div
          ref={trackRef}
          className={`flex gap-4 px-4 transition-transform duration-700 ease-out md:gap-6 md:px-8`}
          style={{
            transform: `translateX(-${currentTranslatePx}px)`,
            transitionProperty: isTransitionEnabled ? "transform" : "none",
          }}
        >
          {extendedSlides.map((slide, index) => (
            <div
              key={`${slide.id}-${index}`}
              className="relative aspect-[16/9] min-w-[85%] md:min-w-[70%] lg:min-w-[60%]"
              role="group"
              aria-roledescription="slide"
            >
              <Image
                src={slide.imageUrl}
                alt={slide.alt}
                fill
                className="object-cover"
                priority={index === 1}
                sizes="100vw"
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          className="absolute left-6 top-1/2 -translate-y-1/2 transform rounded-full bg-white/90 p-4 text-neutral-700 shadow-xl ring-1 ring-black/10 backdrop-blur transition hover:bg-white md:left-8 md:p-5"
          onClick={goToPrevSlide}
          aria-label="Previous slide"
        >
          <CaretLeft size={22} weight="bold" />
        </button>

        <button
          type="button"
          className="absolute right-6 top-1/2 -translate-y-1/2 transform rounded-full bg-white/90 p-4 text-neutral-700 shadow-xl ring-1 ring-black/10 backdrop-blur transition hover:bg-white md:right-8 md:p-5"
          onClick={goToNextSlide}
          aria-label="Next slide"
        >
          <CaretRight size={22} weight="bold" />
        </button>
      </div>

      <div className="mt-3 flex items-center justify-center gap-3 pb-4">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            className={`h-2 w-2 rounded-full transition-transform duration-300 ${
              index === activeIndex
                ? "scale-150 bg-primary"
                : "bg-neutral-300 hover:bg-neutral-400"
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === activeIndex}
          />
        ))}
      </div>
    </section>
  );
}


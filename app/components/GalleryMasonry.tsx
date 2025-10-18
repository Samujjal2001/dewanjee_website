"use client";

import { useCallback, useEffect, useState } from "react";
import DirectionAwareImage from "@/app/components/DirectionAwareImage";
import { X, CaretLeft, CaretRight } from "@phosphor-icons/react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import Image from "next/image";
import { Lens } from "@/app/components/Lens";

const computeOffset = (index: number, active: number, total: number) => {
  let diff = index - active;
  if (diff > total / 2) diff -= total;
  if (diff < -total / 2) diff += total;
  return diff;
};

// Responsive carousel settings based on viewport
const getCarouselSettings = (viewportWidth: number) => {
  if (viewportWidth < 640) {
    // Mobile
    return {
      centerMaxWidth: Math.min(viewportWidth - 80, 320),
      centerMaxHeight: 400,
      sideMaxWidth: 0, // No side cards on mobile
      sideMaxHeight: 0,
      farMaxWidth: 0,
      farMaxHeight: 0,
      baseGap: 20,
      containerHeight: 400,
    };
  } else if (viewportWidth < 1024) {
    // Tablet
    return {
      centerMaxWidth: Math.min(viewportWidth * 0.6, 500),
      centerMaxHeight: 400,
      sideMaxWidth: Math.min(viewportWidth * 0.35, 280),
      sideMaxHeight: 280,
      farMaxWidth: 0,
      farMaxHeight: 0,
      baseGap: 40,
      containerHeight: 450,
    };
  } else {
    // Desktop
    return {
      centerMaxWidth: 680,
      centerMaxHeight: 480,
      sideMaxWidth: 460,
      sideMaxHeight: 360,
      farMaxWidth: 340,
      farMaxHeight: 280,
      baseGap: 80,
      containerHeight: 560,
    };
  }
};

type Item = { src: string; alt: string };

type Props = {
  items: Item[];
};

export default function GalleryMasonry({ items }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [imageRatios, setImageRatios] = useState<Map<number, number>>(new Map());
  const [isZoomed, setIsZoomed] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(1024); // Default to desktop

  const total = items.length;
  const isCarouselOpen = activeIndex !== null;
  const CAROUSEL_SETTINGS = getCarouselSettings(viewportWidth);

  const openCarousel = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const closeCarousel = useCallback(() => {
    setActiveIndex(null);
    setIsZoomed(false);
  }, []);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => {
      if (prev === null) return prev;
      return (prev - 1 + total) % total;
    });
    setIsZoomed(false);
  }, [total]);

  const goNext = useCallback(() => {
    setActiveIndex((prev) => {
      if (prev === null) return prev;
      return (prev + 1) % total;
    });
    setIsZoomed(false);
  }, [total]);

  const toggleZoom = useCallback(() => {
    setIsZoomed((prev) => !prev);
  }, []);

  // Track viewport width for responsive carousel
  useEffect(() => {
    const updateViewportWidth = () => {
      setViewportWidth(window.innerWidth);
    };
    
    // Set initial width
    updateViewportWidth();
    
    // Update on resize with debouncing
    let timeoutId: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateViewportWidth, 150);
    };
    
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Load image aspect ratios
  useEffect(() => {
    const loadRatios = async () => {
      const ratios = new Map<number, number>();
      const promises = items.map((item, index) => {
        return new Promise<void>((resolve) => {
          const img = new window.Image();
          img.onload = () => {
            const ratio = img.naturalWidth / img.naturalHeight;
            ratios.set(index, ratio);
            resolve();
          };
          img.onerror = () => {
            ratios.set(index, 4 / 3); // fallback
            resolve();
          };
          img.src = item.src;
        });
      });
      await Promise.all(promises);
      setImageRatios(ratios);
    };
    loadRatios();
  }, [items]);

  useEffect(() => {
    if (activeIndex === null) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeCarousel();
      }
      if (event.key === "ArrowLeft") {
        goPrev();
      }
      if (event.key === "ArrowRight") {
        goNext();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = originalOverflow;
    };
  }, [activeIndex, closeCarousel, goPrev, goNext]);

  return (
    <LayoutGroup id="service-gallery">
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4" style={{ columnGap: 0 }}>
        {items.map((item, index) => {
          const layoutId = `gallery-item-${index}`;
          if (isCarouselOpen && activeIndex === index) {
            return (
              <motion.div
                key={`${item.src}-${index}`}
                layoutId={layoutId}
                style={{ breakInside: "avoid", visibility: "hidden", height: 0 }}
              />
            );
          }

          return (
            <motion.div
              key={`${item.src}-${index}`}
              layoutId={layoutId}
              layout="position"
              style={{ breakInside: "avoid" }}
              className="cursor-zoom-in"
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 32,
                layout: { duration: 0.4 }
              }}
              onClick={() => openCarousel(index)}
            >
              <DirectionAwareImage src={item.src} alt={item.alt} priority={index < 2} />
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence initial={false}>
        {isCarouselOpen && activeIndex !== null && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-950/80 backdrop-blur-md px-2 sm:px-4"
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCarousel}
          >
            <motion.div
              aria-hidden
              className="absolute inset-x-0 top-[12%] mx-auto h-[300px] sm:h-[420px] max-w-5xl rounded-full bg-gradient-to-r from-primary/20 via-white/5 to-primary/20 blur-3xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.65 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            />

            <motion.div
              className="relative w-full max-w-5xl"
              onClick={(event) => event.stopPropagation()}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 160, damping: 22 }}
            >
              <button
                type="button"
                aria-label="Close gallery"
                className="absolute -top-8 sm:-top-10 right-0 sm:right-0 rounded-full bg-white p-2 text-black transition hover:bg-gray-200 z-[120]"
                onClick={closeCarousel}
              >
                <X size={20} weight="bold" className="sm:w-[22px] sm:h-[22px]" />
              </button>

              <button
                type="button"
                aria-label="Show previous image"
                className="absolute left-0 top-1/2 z-[110] hidden -translate-y-1/2 rounded-full bg-white p-3 text-black transition hover:bg-gray-200 md:inline-flex"
                onClick={goPrev}
              >
                <CaretLeft size={28} weight="bold" />
              </button>

              <div 
                className="relative flex w-full items-center justify-center overflow-visible"
                style={{ height: `${CAROUSEL_SETTINGS.containerHeight}px` }}
              >
                {items.map((item, index) => {
                  const offset = computeOffset(index, activeIndex, total);
                  const absOffset = Math.abs(offset);
                  
                  // On mobile, only show center card
                  const isMobile = viewportWidth < 640;
                  if (isMobile && absOffset > 0) return null;
                  
                  // On larger screens, hide far cards if there are many items
                  if (absOffset > 2 && total > 5) return null;

                  const ratio = imageRatios.get(index) || 4 / 3;
                  
                  // Calculate dimensions maintaining aspect ratio
                  const maxSizes = 
                    absOffset === 0
                      ? { maxWidth: CAROUSEL_SETTINGS.centerMaxWidth, maxHeight: CAROUSEL_SETTINGS.centerMaxHeight }
                      : absOffset === 1
                      ? { maxWidth: CAROUSEL_SETTINGS.sideMaxWidth, maxHeight: CAROUSEL_SETTINGS.sideMaxHeight }
                      : { maxWidth: CAROUSEL_SETTINGS.farMaxWidth, maxHeight: CAROUSEL_SETTINGS.farMaxHeight };

                  // Fit within max bounds while preserving ratio
                  let width = maxSizes.maxWidth;
                  let height = width / ratio;
                  if (height > maxSizes.maxHeight) {
                    height = maxSizes.maxHeight;
                    width = height * ratio;
                  }

                  // Calculate translateX based on card positions
                  let translateX = 0;
                  
                  // On mobile, cards are always centered (no side cards)
                  if (!isMobile && offset !== 0) {
                    // Dynamic gap calculation based on actual card widths
                    const centerWidth = imageRatios.get(activeIndex)
                      ? (() => {
                          const r = imageRatios.get(activeIndex)!;
                          let w = CAROUSEL_SETTINGS.centerMaxWidth;
                          let h = w / r;
                          if (h > CAROUSEL_SETTINGS.centerMaxHeight) {
                            h = CAROUSEL_SETTINGS.centerMaxHeight;
                            w = h * r;
                          }
                          return w;
                        })()
                      : CAROUSEL_SETTINGS.centerMaxWidth;

                    const direction = offset > 0 ? 1 : -1;
                    const absOff = Math.abs(offset);
                    
                    // Distance from center edge to this card's center
                    const centerHalfWidth = centerWidth / 2;
                    const cardHalfWidth = width / 2;
                    const gap = CAROUSEL_SETTINGS.baseGap;
                    
                    if (absOff === 1) {
                      // First side card: center edge + gap + half of this card
                      translateX = direction * (centerHalfWidth + gap + cardHalfWidth);
                    } else {
                      // Far cards: accumulate widths of previous cards
                      const sideRatio = imageRatios.get(activeIndex + direction) || imageRatios.get((activeIndex + direction + total) % total) || 4/3;
                      let sideW = CAROUSEL_SETTINGS.sideMaxWidth;
                      let sideH = sideW / sideRatio;
                      if (sideH > CAROUSEL_SETTINGS.sideMaxHeight) {
                        sideH = CAROUSEL_SETTINGS.sideMaxHeight;
                        sideW = sideH * sideRatio;
                      }
                      translateX = direction * (centerHalfWidth + gap + sideW + gap + cardHalfWidth);
                    }
                  }

                  const opacity = absOffset > 2 ? 0 : 1 - absOffset * 0.12;
                  const baseScale = absOffset === 0 ? 1 : absOffset === 1 ? 0.94 : 0.86;
                  // Disable zoom on mobile to prevent touch interaction issues
                  const scale = absOffset === 0 && isZoomed && !isMobile ? 1.5 : baseScale;
                  const zIndex = 100 - absOffset;

                  const isCenterImage = absOffset === 0;

                  return (
                    <motion.button
                      key={`${item.src}-${index}`}
                      layoutId={`gallery-item-${index}`}
                      type="button"
                      onClick={isCenterImage && !isMobile ? toggleZoom : () => openCarousel(index)}
                      className={`absolute overflow-hidden shadow-2xl ${isCenterImage && !isMobile && !isZoomed ? 'cursor-zoom-in' : ''}`}
                      layout
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{
                        x: translateX,
                        opacity,
                        scale,
                        zIndex,
                      }}
                      exit={{ opacity: 0, scale: 0.92 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 280, 
                        damping: 32,
                        layout: { duration: 0.35 }
                      }}
                      style={{ width, height }}
                    >
                      {isCenterImage && isZoomed && !isMobile ? (
                        <Lens
                          zoomFactor={2.5}
                          lensSize={viewportWidth < 768 ? 150 : 200}
                          duration={0.15}
                          lensColor="rgba(255, 255, 255, 0.15)"
                          ariaLabel="Magnifying lens for image zoom"
                        >
                          <Image
                            src={item.src}
                            alt={item.alt}
                            fill
                            className="object-cover"
                            sizes="(min-width: 1280px) 40vw, 95vw"
                            priority={absOffset <= 1}
                          />
                        </Lens>
                      ) : (
                        <Image
                          src={item.src}
                          alt={item.alt}
                          fill
                          className="object-cover"
                          sizes="(min-width: 1280px) 40vw, 95vw"
                          priority={absOffset <= 1}
                        />
                      )}
                      {isCenterImage && !isMobile && !isZoomed && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                          <div className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-neutral-800 shadow-lg pointer-events-none">
                            Click to Zoom
                          </div>
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              <button
                type="button"
                aria-label="Show next image"
                className="absolute right-0 top-1/2 z-[110] hidden -translate-y-1/2 rounded-full bg-white p-3 text-black transition hover:bg-gray-200 md:inline-flex"
                onClick={goNext}
              >
                <CaretRight size={28} weight="bold" />
              </button>

              <div className="mt-8 flex items-center justify-center gap-3">
                {items.map((item, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <motion.button
                      key={`${item.src}-${index}`}
                      type="button"
                      onClick={() => openCarousel(index)}
                      className={`h-2 w-2 rounded-full transition-transform duration-300 ${
                        isActive ? "scale-150 bg-white" : "bg-white/50 hover:bg-white/70"
                      }`}
                      initial={{ opacity: 0.5, scale: 1 }}
                      animate={{ opacity: isActive ? 1 : 0.6, scale: isActive ? 1.5 : 1 }}
                      transition={{ duration: 0.25 }}
                    />
                  );
                })}
              </div>
            </motion.div>

            <button
              type="button"
              aria-label="Show previous image"
              className="absolute left-2 sm:left-4 top-1/2 z-[110] inline-flex -translate-y-1/2 rounded-full bg-white p-2.5 sm:p-3 text-black transition hover:bg-gray-200 active:scale-95 md:hidden touch-manipulation"
              onClick={(event) => {
                event.stopPropagation();
                goPrev();
              }}
            >
              <CaretLeft size={24} weight="bold" className="sm:w-[28px] sm:h-[28px]" />
            </button>

            <button
              type="button"
              aria-label="Show next image"
              className="absolute right-2 sm:right-4 top-1/2 z-[110] inline-flex -translate-y-1/2 rounded-full bg-white p-2.5 sm:p-3 text-black transition hover:bg-gray-200 active:scale-95 md:hidden touch-manipulation"
              onClick={(event) => {
                event.stopPropagation();
                goNext();
              }}
            >
              <CaretRight size={24} weight="bold" className="sm:w-[28px] sm:h-[28px]" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}



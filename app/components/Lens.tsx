"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Position {
  x: number;
  y: number;
}

interface LensProps {
  children: React.ReactNode;
  zoomFactor?: number;
  lensSize?: number;
  position?: Position;
  defaultPosition?: Position;
  isStatic?: boolean;
  duration?: number;
  lensColor?: string;
  ariaLabel?: string;
}

export function Lens({
  children,
  zoomFactor = 2,
  lensSize = 200,
  position: controlledPosition,
  defaultPosition,
  isStatic = false,
  duration = 0.1,
  lensColor = "rgba(255, 255, 255, 0.1)",
  ariaLabel = "Magnifying lens",
}: LensProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<Position>(
    defaultPosition || { x: 0, y: 0 }
  );
  const [isHovering, setIsHovering] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const { width, height } = containerRef.current.getBoundingClientRect();
    setContainerSize({ width, height });

    const handleResize = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      setContainerSize({ width, height });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isStatic || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPosition({ x, y });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isStatic || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    setPosition({ x, y });
  };

  const currentPosition = controlledPosition || position;

  // Allow lens to move partially outside the frame
  // Keep at least 25% of the lens visible within the container
  const halfLens = lensSize / 2;
  const minVisible = lensSize * 0.25; // At least 25% of lens stays visible
  const clampedLensPosition = {
    x: Math.max(minVisible - halfLens, Math.min(currentPosition.x, containerSize.width - minVisible + halfLens)),
    y: Math.max(minVisible - halfLens, Math.min(currentPosition.y, containerSize.height - minVisible + halfLens)),
  };

  // Use actual cursor position for zoom calculation (not clamped)
  const backgroundPosition = {
    x: -currentPosition.x * (zoomFactor - 1),
    y: -currentPosition.y * (zoomFactor - 1),
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchMove={handleTouchMove}
      onTouchStart={() => setIsHovering(true)}
      onTouchEnd={() => setIsHovering(false)}
      style={{ touchAction: "none" }}
    >
      {children}

      <AnimatePresence>
        {(isHovering || isStatic) && containerSize.width > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration }}
            className="pointer-events-none absolute rounded-full border-2 border-white/50 shadow-2xl"
            style={{
              width: lensSize,
              height: lensSize,
              left: clampedLensPosition.x - lensSize / 2,
              top: clampedLensPosition.y - lensSize / 2,
              backgroundColor: lensColor,
              backdropFilter: "blur(4px)",
              overflow: "hidden",
            }}
            aria-label={ariaLabel}
          >
            <div
              className="absolute inset-0"
              style={{
                transform: `scale(${zoomFactor})`,
                transformOrigin: "top left",
                width: containerSize.width,
                height: containerSize.height,
                left: backgroundPosition.x,
                top: backgroundPosition.y,
              }}
            >
              {children}
            </div>
            {/* Subtle center dot to indicate cursor position */}
            <div className="absolute left-1/2 top-1/2 -ml-1 -mt-1 h-2 w-2 rounded-full bg-white/40 ring-1 ring-black/20" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


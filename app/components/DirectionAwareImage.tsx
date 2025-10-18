"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type Props = {
  src: string;
  alt: string;
  priority?: boolean;
  onClick?: () => void;
};

function getMouseDirection(
  event: React.MouseEvent<HTMLElement>,
  element: HTMLElement,
): "top" | "right" | "bottom" | "left" {
  const rect = element.getBoundingClientRect();
  const x = event.clientX - rect.left - rect.width / 2;
  const y = event.clientY - rect.top - rect.height / 2;
  const angle = (Math.atan2(y, x) * 180) / Math.PI;
  if (angle >= -45 && angle < 45) return "right";
  if (angle >= 45 && angle < 135) return "bottom";
  if (angle >= -135 && angle < -45) return "top";
  return "left";
}

export default function DirectionAwareImage({ src, alt, priority, onClick }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [overlayTransform, setOverlayTransform] = useState<string>(
    "translateX(-100%)",
  );

  const enter = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const dir = getMouseDirection(e, el);
    switch (dir) {
      case "top":
        setOverlayTransform("translateY(-100%)");
        break;
      case "right":
        setOverlayTransform("translateX(100%)");
        break;
      case "bottom":
        setOverlayTransform("translateY(100%)");
        break;
      case "left":
      default:
        setOverlayTransform("translateX(-100%)");
        break;
    }
    // allow browser to apply initial position, then slide in
    requestAnimationFrame(() => setOverlayTransform("translate(0, 0)"));
  };

  const leave = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const dir = getMouseDirection(e, el);
    switch (dir) {
      case "top":
        setOverlayTransform("translateY(-100%)");
        break;
      case "right":
        setOverlayTransform("translateX(100%)");
        break;
      case "bottom":
        setOverlayTransform("translateY(100%)");
        break;
      case "left":
      default:
        setOverlayTransform("translateX(-100%)");
        break;
    }
  };

  return (
    <div
      ref={containerRef}
      className="group relative w-full overflow-hidden cursor-zoom-in"
      onMouseEnter={enter}
      onMouseLeave={leave}
      onClick={onClick}
    >
      <Image
        src={src}
        alt={alt}
        width={1600}
        height={1200}
        className="h-auto w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.08]"
        sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
        priority={priority}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-yellow-500/70 via-yellow-400/30 to-transparent transition-transform duration-300 ease-out"
        style={{ transform: overlayTransform }}
      />
    </div>
  );
}



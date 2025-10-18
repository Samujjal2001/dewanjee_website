"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  const frameRef = useRef<number | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      frameRef.current = requestAnimationFrame(raf);
    };

    frameRef.current = requestAnimationFrame(raf);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const handleHashLinkScroll = (event: Event) => {
      const target = event.currentTarget as HTMLAnchorElement | null;
      if (!target) return;

      const hash = target.hash.substring(1);
      if (!hash) return;

      const section = document.getElementById(hash);
      const lenis = lenisRef.current;
      if (section && lenis) {
        event.preventDefault();
        lenis.scrollTo(section);
      }
    };

    const navLinks = document.querySelectorAll<HTMLAnchorElement>(
      'a[href^="#"], a[href^="/#"]',
    );

    navLinks.forEach((link) => link.addEventListener("click", handleHashLinkScroll));

    return () => {
      navLinks.forEach((link) =>
        link.removeEventListener("click", handleHashLinkScroll),
      );
    };
  }, []);

  return null;
}



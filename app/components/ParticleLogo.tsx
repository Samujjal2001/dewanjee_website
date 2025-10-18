"use client";

import { useEffect, useRef } from "react";

type ParticleLogoProps = {
  className?: string;
};

export default function ParticleLogo({ className }: ParticleLogoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const isTouchingRef = useRef(false);
  const isMobileRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
    let isResizing = false;

    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      isMobileRef.current = window.innerWidth < 768;
    };

    const handleResize = () => {
      isResizing = true;
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      resizeTimeout = setTimeout(() => {
        updateCanvasSize();
        isResizing = false;
      }, 150);
    };

    updateCanvasSize();

    const particles: {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      size: number;
      color: string;
      scatteredColor: string;
      life: number;
      isDSLogo: boolean;
      vx: number;
      vy: number;
    }[] = [];

    let textImageData: ImageData | null = null;
    let logoImage: HTMLImageElement | null = null;

    function loadLogoImage(): Promise<HTMLImageElement> {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = "/dewanjee_logo.png"; // in public/
      });
    }

    async function createTextImage() {
      if (!ctx || !canvas) return 0;

      try {
        logoImage = await loadLogoImage();
      } catch (error) {
        console.error("Failed to load logo image:", error);
        return 0;
      }

      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Fit logo nicely within the canvas (about 85% height)
      const availableHeightCss = (canvas.height / dpr) * 0.85;
      const logoHeightCss = Math.max(80, Math.min(availableHeightCss, isMobileRef.current ? 100 : 180));
      const aspectRatio = (logoImage.width || 1) / (logoImage.height || 1);
      const logoWidthCss = logoHeightCss * aspectRatio;
      const logoWidth = Math.floor(logoWidthCss * dpr);
      const logoHeight = Math.floor(logoHeightCss * dpr);

      const centerX = Math.floor(canvas.width / 2 - logoWidth / 2);
      const centerY = Math.floor(canvas.height / 2 - logoHeight / 2);

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(logoImage, centerX, centerY, logoWidth, logoHeight);
      ctx.restore();

      textImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      return logoHeight / (logoImage.height || 1);
    }

    function createParticle(scale: number) {
      if (!ctx || !canvas || !textImageData || !logoImage) return null;

      const data = textImageData.data;

      for (let attempt = 0; attempt < 80; attempt++) {
        const x = Math.floor(Math.random() * canvas.width);
        const y = Math.floor(Math.random() * canvas.height);

        if (data[(y * canvas.width + x) * 4 + 3] > 128) {
          const logoHeight = Math.floor(((canvas.height / dpr) * 0.8) * dpr);
          const aspectRatio = (logoImage.width || 1) / (logoImage.height || 1);
          const logoWidth = logoHeight * aspectRatio;
          const centerY = (canvas.height - logoHeight) / 2;

          const isDSLogo = y < centerY + logoHeight * 0.4;

          return {
            x: x,
            y: y,
            baseX: x,
            baseY: y,
            size: Math.random() * 1.5 + 0.6,
            color: "white",
            scatteredColor: isDSLogo
              ? x < canvas.width / 2
                ? "#FF0000"
                : "#0066FF"
              : "#FFD700",
            isDSLogo: isDSLogo,
            life: Math.random() * 100 + 50,
            vx: 0,
            vy: 0,
          };
        }
      }

      return null;
    }

    function createInitialParticles(scale: number) {
      if (!canvas) return;
      const cssArea = (canvas.width / dpr) * (canvas.height / dpr);
      const baseParticleCount = 3200; // tuned for larger canvas
      const particleCount = Math.min(
        5000, // Maximum particle cap to prevent freezing
        Math.floor(baseParticleCount * Math.sqrt(cssArea / (640 * 320)))
      );
      for (let i = 0; i < particleCount; i++) {
        const particle = createParticle(scale);
        if (particle) particles.push(particle);
      }
    }

    let animationFrameId: number;
    let lastTime = performance.now();

    const SPRING_K = isMobileRef.current ? 40 : 55;
    const DAMPING = isMobileRef.current ? 6 : 7;
    const REPEL_RADIUS = 35 * dpr; // interaction radius
    const REPEL_IMPULSE = 700 * dpr;
    const MAX_SPEED = 600 * dpr;
    const STICKY_FRICTION = isMobileRef.current ? 4 : 5;

    function animate(scale: number, now: number) {
      if (!ctx || !canvas) return;
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      // Clear for next frame (transparent background for footer blending)
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const { x: mouseX, y: mouseY } = mousePositionRef.current;
      const maxDistance = REPEL_RADIUS;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const distance = Math.hypot(dx, dy);

        const nearPointer = distance < maxDistance && isTouchingRef.current;
        if (nearPointer && distance > 0.001) {
          const nx = (p.x - mouseX) / distance;
          const ny = (p.y - mouseY) / distance;
          const strength = (1 - distance / maxDistance) * REPEL_IMPULSE;
          p.vx += nx * strength;
          p.vy += ny * strength;
          ctx.fillStyle = p.scatteredColor;
        } else {
          ctx.fillStyle = "white";
        }

        const sx = p.baseX - p.x;
        const sy = p.baseY - p.y;
        const ax = SPRING_K * sx - DAMPING * p.vx;
        const ay = SPRING_K * sy - DAMPING * p.vy;

        p.vx += ax * dt;
        p.vy += ay * dt;

        const decay = Math.exp(-STICKY_FRICTION * dt);
        p.vx *= decay;
        p.vy *= decay;

        const speed = Math.hypot(p.vx, p.vy);
        if (speed > MAX_SPEED) {
          const s = MAX_SPEED / (speed + 1e-6);
          p.vx *= s;
          p.vy *= s;
        }

        p.x += p.vx * dt;
        p.y += p.vy * dt;

        ctx.fillRect(p.x, p.y, p.size, p.size);

        p.life--;
        if (p.life <= 0 && !isResizing) {
          const newParticle = createParticle(scale);
          if (newParticle) {
            particles[i] = newParticle;
          } else {
            particles.splice(i, 1);
            i--;
          }
        }
      }

      // Only add new particles if not resizing and under the cap
      if (!isResizing && particles.length < 5000) {
        const baseParticleCount = 3200;
        const cssArea = (canvas.width / dpr) * (canvas.height / dpr);
        const targetParticleCount = Math.min(
          5000, // Maximum particle cap
          Math.floor(baseParticleCount * Math.sqrt(cssArea / (640 * 320)))
        );
        
        // Add particles gradually, not all at once
        if (particles.length < targetParticleCount) {
          const newParticle = createParticle(scale);
          if (newParticle) particles.push(newParticle);
        }
      }

      animationFrameId = requestAnimationFrame((t) => animate(scale, t));
    }

    async function initialize() {
      const scale = await createTextImage();
      createInitialParticles(scale);
      lastTime = performance.now();
      animate(scale, lastTime);
    }

    initialize();

    const handleMove = (x: number, y: number) => {
      mousePositionRef.current = { x: x * dpr, y: y * dpr };
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      handleMove(e.clientX - rect.left, e.clientY - rect.top);
    };

    const handlePointerEnter = () => {
      isTouchingRef.current = true;
    };

    const handlePointerLeave = () => {
      isTouchingRef.current = false;
      mousePositionRef.current = { x: 0, y: 0 };
    };

    window.addEventListener("resize", handleResize);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerenter", handlePointerEnter);
    canvas.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerenter", handlePointerEnter);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={className} style={{ position: "relative" }}>
      <canvas
        ref={canvasRef}
        className="block h-full w-full touch-none"
        aria-label="Interactive particle effect with Dewanjee logo"
      />
    </div>
  );
}



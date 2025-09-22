'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const Player = dynamic(
  async () => (await import('@lottiefiles/react-lottie-player')).Player,
  { ssr: false }
);

type LottieAnimationProps = {
  src: string;
  className?: string;
  fallbackEmoji?: string;
  size?: number;
};

export default function LottieAnimation({
  src,
  className,
  fallbackEmoji = '⚠️',
  size = 120,
}: LottieAnimationProps) {
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsReady(false);
    setHasError(false);
  }, [src]);

  if (hasError) {
    return (
      <span style={{ fontSize: size * 0.6 }} className={className} aria-hidden>
        {fallbackEmoji}
      </span>
    );
  }

  return (
    <>
      {!isReady && (
        <span style={{ fontSize: size * 0.6 }} className={className} aria-hidden>
          {fallbackEmoji}
        </span>
      )}
      <Player
        autoplay
        loop
        src={src}
        className={className}
        style={{ height: `${size}px`, width: `${size}px`, display: isReady ? 'block' : 'none' }}
        onEvent={(event: unknown) => {
          if (typeof event === 'string' && event === 'load') setIsReady(true);
          if (typeof event === 'string' && event === 'error') setHasError(true);
        }}
      />
    </>
  );
}

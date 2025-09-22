import Image from "next/image";
import LottieAnimation from "./components/LottieAnimation";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-8">
      {/* Logo Section */}
      <div className="mb-12">
        <Image
          src="/dewanjee_steel_logo.webp"
          alt="Dewanjee Steel Logo"
          width={240}
          height={120}
          priority
          className="mx-auto"
        />
      </div>

      {/* Coming Soon Section */}
      <div className="text-center max-w-2xl mx-auto">
        {/* Emojis and Heading */}
        <div className="mb-6">
          <div className="flex justify-center items-center gap-4">
            <LottieAnimation
              src="https://fonts.gstatic.com/s/e/notoemoji/latest/26a0_fe0f/lottie.json"
              fallbackEmoji="⚠️"
              size={100}
            />
            <LottieAnimation
              src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f6a7/lottie.json"
              fallbackEmoji="🚧"
              size={100}
            />
          </div>
          <h1 className="font-sans text-6xl sm:text-7xl font-extrabold text-foreground mb-6">
            Coming Soon!
          </h1>
        </div>

        {/* Subtext */}
        <p className="font-mono text-lg sm:text-xl text-foreground/80 leading-relaxed">
          Our Website is under construction. Stay tuned.
        </p>
      </div>
    </div>
  );
}

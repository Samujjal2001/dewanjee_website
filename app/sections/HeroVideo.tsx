"use client";

import HeroVideoDialog from "../components/HeroVideoDialog";

// Using the provided YouTube video and its original thumbnail from i.ytimg.com
const YT_EMBED_URL = "https://www.youtube.com/embed/s49F2_C4vd0?autoplay=1";
const YT_THUMB = "https://i.ytimg.com/vi/s49F2_C4vd0/maxresdefault.jpg";

export default function HeroVideo() {
  return (
    <section className="mx-auto mt-16 w-full max-w-7xl px-4 py-8">
      <div className="flex items-center justify-center">
        <HeroVideoDialog
          animationStyle="from-center"
          videoSrc={YT_EMBED_URL}
          thumbnailSrc={YT_THUMB}
          thumbnailAlt="Dewanjee Steel highlight video"
        />
      </div>
    </section>
  );
}



import Image from "next/image";
import Link from "next/link";
import { SERVICES } from "@/app/data/services";


export default function ServicesSection() {
  return (
    <section id="services" className="mx-auto mt-16 w-full max-w-6xl px-4">
      <div className="flex flex-col gap-4 text-left">
        <h2
          className="text-left text-2xl font-black tracking-tight sm:text-3xl"
          style={{ fontFamily: "Inter, sans-serif", color: "#0057A2" }}
        >
          Our Services
        </h2>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((service) => (
          <Link key={service.id} href={`/services/${service.id}`} className="group block">
            <article className="relative overflow-hidden bg-black">
              <div className="relative h-60 w-full transition-transform duration-300 ease-out group-hover:scale-105">
                <Image
                  src={service.thumbnail}
                  alt={service.alt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1280px) 260px, (min-width: 768px) 40vw, 90vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />
                {/* Yellow gradient overlay on hover */}
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-yellow-500/70 via-yellow-400/30 to-transparent opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end gap-4 p-6 pb-8 text-white">
                  <h3
                    className="w-full text-center text-xl font-black uppercase tracking-wide drop-shadow-[0_6px_18px_rgba(0,0,0,0.65)]"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {service.title}
                  </h3>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}


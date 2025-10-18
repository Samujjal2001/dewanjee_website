"use client";

import Image from "next/image";

const BRANDS = [
  { id: "tata", name: "Tata Steel", image: "/brands/tata_steel_logo.webp" },
  { id: "jindal", name: "Jindal Steel", image: "/brands/jindal_steel_logo.webp" },
  { id: "jsw", name: "JSW Steel", image: "/brands/jsw_steel_logo.webp" },
  { id: "shyam", name: "Shyam Steel", image: "/brands/shaym_steel_logo.webp" },
  { id: "srmb", name: "SRMB", image: "/brands/srmb_logo.webp" },
  { id: "cello", name: "Cello", image: "/brands/cello_logo.webp" },
  { id: "hettich", name: "Hettich", image: "/brands/hettich_logo.webp" },
  { id: "kurlon", name: "Kurlon", image: "/brands/kurlon_logo.webp" },
  { id: "godrej", name: "Godrej", image: "/brands/godrej_logo.webp" },
  { id: "ebco", name: "Ebco", image: "/brands/ebco_logo.webp" },
  { id: "supreme", name: "Supreme", image: "/brands/supreme_logo.webp" },
  { id: "realplast", name: "Realplast", image: "/brands/realplast_logo.webp" },
  { id: "grillguard", name: "Grill Guard", image: "/brands/grill_guard_logo.webp" },
  { id: "pratap", name: "Pratap Bond", image: "/brands/pratap_bond_logo.webp" },
];

export default function BrandsCarousel() {
  return (
    <section className="bg-white py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4">
        <div className="flex items-center justify-between">
          <h3
            className="text-left text-2xl font-black tracking-tight sm:text-3xl"
            style={{ fontFamily: "Inter, sans-serif", color: "#0057A2" }}
          >
            Featured Brands
          </h3>
        </div>
        <div className="relative overflow-hidden">
          <div className="marquee" role="list" aria-label="Partner brands">
            <div className="marquee-group flex select-none gap-12">
              {BRANDS.map((brand) => (
                <div
                  key={brand.id}
                  className="flex h-20 min-w-[120px] shrink-0 items-center justify-center"
                  role="listitem"
                >
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    width={140}
                    height={60}
                    className="h-16 w-auto max-w-full object-contain"
                    priority
                  />
                </div>
              ))}
            </div>
            <div
              className="marquee-group flex select-none gap-12"
              aria-hidden="true"
            >
              {BRANDS.map((brand) => (
                <div
                  key={`duplicate-${brand.id}`}
                  className="flex h-20 min-w-[120px] shrink-0 items-center justify-center"
                >
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    width={140}
                    height={60}
                    className="h-16 w-auto max-w-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent"
          />
        </div>
      </div>
    </section>
  );
}


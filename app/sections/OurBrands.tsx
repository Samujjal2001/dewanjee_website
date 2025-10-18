import Image from "next/image";

const OUR_BRANDS = [
  { id: "steel", name: "Dewanjee Steel", image: "/our_brands/dewanjee_steel.webp" },
  { id: "interior", name: "Dewanjee Interior", image: "/our_brands/dewanjee_interior.webp" },
  { id: "truss", name: "Dewanjee Truss", image: "/our_brands/dewanjee_truss.webp" },
];

export default function OurBrands() {
  return (
    <section className="bg-white py-12">
      <div className="mx-auto w-full max-w-6xl px-4">
        <h3
          className="text-left text-2xl font-black tracking-tight sm:text-3xl"
          style={{ fontFamily: "Inter, sans-serif", color: "#0057A2" }}
        >
          Our Brands
        </h3>
        <div className="mt-8">
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-14">
            {OUR_BRANDS.map((brand) => (
              <div
                key={brand.id}
                className="flex h-28 min-w-[180px] items-center justify-center"
                role="img"
                aria-label={brand.name}
              >
                <Image
                  src={brand.image}
                  alt={brand.name}
                  width={240}
                  height={120}
                  className="h-24 w-auto max-w-full object-contain"
                  priority
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}



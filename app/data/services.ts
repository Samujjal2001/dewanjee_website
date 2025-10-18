import { getServiceGalleryImages } from "@/app/utils/gallery-loader";

export type Service = {
  id: string;
  title: string;
  shortDescription: string;
  thumbnail: string;
  alt: string;
  body: string[];
  gallery: { src: string; alt: string }[];
};

export const SERVICES: Service[] = [
  {
    id: "truss",
    title: "Truss Setup Manufacturing",
    shortDescription: "Industrial and event truss solutions end‑to‑end",
    thumbnail: "/services/service_truss_setup_manufacturing.webp",
    alt: "Steel truss setup inside factory",
    body: [
      "Dewanjee Steel Truss– Your Trusted Partner for Event Truss Solutions!",
      "",
      "Looking for a strong, reliable, and custom truss setup for your event? Dewanjee Steel specializes in high-quality truss structures designed to support lighting, sound, and stage setups for concerts, weddings, exhibitions, and more. Our durable and stylish trusses ensure safety, flexibility, and a stunning visual impact.",
      "",
      "From design to installation, we provide hassle-free solutions tailored to your needs. Choose Dewanjee Steel Truss for superior craftsmanship and seamless event execution.",
      "",
      "Let's build your perfect event setup – Contact us today!",
    ],
    gallery: getServiceGalleryImages("truss"),
  },
  {
    id: "fabrication",
    title: "Fabrication Works",
    shortDescription: "Custom steel fabrication services for industry and homes",
    thumbnail: "/services/service_fabrication_works.webp",
    alt: "Welder working with sparks flying",
    body: [
      "Dewanjee Steel – 40 Years of Excellence in Fabrication!",
      "",
      "With over four decades of expertise, Dewanjee Steel is your trusted partner for high-quality fabrication solutions. Whether it's small-scale structures or large industrial projects, our skilled team of experienced fabricators ensures precision, durability, and top-notch craftsmanship.",
      "",
      "From custom designs to complex structural fabrications, we deliver strength and reliability in every project. No matter the scale, we bring your vision to life with expert engineering and unmatched quality.",
      "",
      "Need a fabrication expert? Let's build something great together! Contact us today!",
    ],
    gallery: getServiceGalleryImages("fabrication"),
  },
  {
    id: "grill",
    title: "Grill and Shutter",
    shortDescription: "Custom security solutions",
    thumbnail: "/services/service_grill_and_shutter.webp",
    alt: "Metal grill gate design",
    body: [
      "Dewanjee Steel – Precision, Strength & Modern Design!",
      "",
      "With over 40 years of expertise, Dewanjee Steel specializes in crafting high-quality grills, gates, rolling shutters, balcony railings, and staircases using premium stainless steel and MS steel. Our experienced team delivers modern, durable, and customized solutions that enhance security and aesthetics for homes, businesses, and industrial spaces.",
      "",
      "From sleek balcony railings to sturdy rolling shutters, we ensure top-notch craftsmanship, innovative designs, and long-lasting durability in every project.",
      "",
      "Looking for the perfect steelwork? Let's build something exceptional! Contact us today!",
    ],
    gallery: getServiceGalleryImages("grill"),
  },
  {
    id: "pravesh-dwar",
    title: "Dewanjee Pravesh Dwar",
    shortDescription: "Traditional and modern gate designs",
    thumbnail: "/services/service_dewanjee_pravesh_dwar.webp",
    alt: "Decorative entrance gate",
    body: [
      "Dewanjee Pravesh Dwar – The Ultimate Security Door!",
      "",
      "Upgrade your home's security with Dewanjee Pravesh Dwar, a premium metal door built for strength, durability, and elegance. Crafted from high-strength galvanized steel, it is soundproof, weatherproof, burglar-proof, termite-proof, and tough enough to withstand any condition.",
      "",
      "Designed for both style and safety, our customizable doors offer a sleek look with unmatched protection, ensuring peace of mind for your family.",
      "",
      "Strong. Secure. Stylish. Choose Dewanjee Pravesh Dwar for ultimate home security! Contact us today!",
    ],
    gallery: getServiceGalleryImages("pravesh-dwar"),
  },
  {
    id: "roofing",
    title: "Dewanjee Steel Roofing Solutions",
    shortDescription: "Durable roofing solutions",
    thumbnail: "/services/service_dewanjee_steel_shedding_solutions.webp",
    alt: "Large steel roofing structure",
    body: [
      "Dewanjee Steel – Durable & Stylish Roof Shedding Solutions!",
      "",
      "Protect your space with high-quality roofing solutions from Dewanjee Steel! Our expert team specializes in steel, acrylic, and polycarbonate roof sheds, customized to meet your needs. Whether for homes, commercial spaces, or industrial projects, we ensure durability, weather resistance, and modern aesthetics in every installation.",
      "",
      "Experience strong, stylish, and long-lasting roofing with professional craftsmanship and top-grade materials.",
      "",
      "Looking for the perfect roof solution? We've got you covered! Contact us today!",
    ],
    gallery: getServiceGalleryImages("roofing"),
  },
  {
    id: "furniture",
    title: "Dewanjee Furniture",
    shortDescription: "Modern steel furniture designs",
    thumbnail: "/services/service_dewanjee_furniture.webp",
    alt: "Stylish steel furniture",
    body: [
      "Dewanjee FURNITURE – Crafting Furniture with Excellence for 40 Years!",
      "",
      "Enhance your home and office with premium-quality furniture from Dewanjee Steel! With 40 years of expertise, we specialize in wooden, steel, and UPVC furniture, offering a wide range of stylish and durable designs to suit every space. Our customizable furniture solutions are crafted by skilled professionals, ensuring the perfect blend of quality, comfort, and aesthetics. Whether you need modern, classic, or space-saving designs, we create furniture that meets your needs.",
      "",
      "Visit our furniture store & factory today and bring home the best!",
    ],
    gallery: getServiceGalleryImages("furniture"),
  },
  {
    id: "kitchen",
    title: "Kitchen and Interior Makeover",
    shortDescription: "Complete interior solutions",
    thumbnail: "/services/service_kitchen_and_interior_makeover.webp",
    alt: "Modern kitchen makeover",
    body: [
      "Dewanjee Interior– Your Trusted Partner for Interior Makeovers!",
      "",
      "Give your home and office a stylish, functional, and modern upgrade with Dewanjee Interior! We specialize in modular kitchens and complete interior transformations, tailored to your taste and needs.",
      "",
      "Our expert team crafts interiors using UPVC modular furniture and a wide range of materials as per your preferences. Whether it's wood, steel, UPVC, or any other material, we ensure premium quality, durability, and innovative designs.",
      "",
      "Let's create your perfect space! Contact us today!",
    ],
    gallery: getServiceGalleryImages("kitchen"),
  },
  {
    id: "shedding",
    title: "Shedding Works",
    shortDescription: "Commercial and industrial shedding",
    thumbnail: "/services/service_shedding_works.webp",
    alt: "Industrial shed exterior",
    body: ["Long‑span shedding projects with efficient timelines."],
    gallery: getServiceGalleryImages("shedding"),
  },
];

export function getServiceById(id: string): Service | undefined {
  return SERVICES.find((s) => s.id === id);
}

export function getAllServiceIds(): string[] {
  return SERVICES.map((s) => s.id);
}



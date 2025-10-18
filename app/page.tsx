import Header from "./sections/Header";
import HeroCarousel from "./sections/HeroCarousel";
import BrandsCarousel from "./sections/BrandsCarousel";
import ServicesSection from "./sections/ServicesSection";
import HeroVideo from "./sections/HeroVideo";
import Footer from "./sections/Footer";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col bg-background text-foreground">
      <Header />
      <HeroCarousel />
      <BrandsCarousel />
      <HeroVideo />
      <ServicesSection />
      <Footer />
    </main>
  );
}

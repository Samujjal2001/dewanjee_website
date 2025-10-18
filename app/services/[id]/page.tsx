import Image from "next/image";
import Link from "next/link";
import Header from "@/app/sections/Header";
import Footer from "@/app/sections/Footer";
import { getAllServiceIds, getServiceById } from "@/app/data/services";
import GalleryMasonry from "@/app/components/GalleryMasonry";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const ids = getAllServiceIds();
  return ids.map((id) => ({ id }));
}

export default async function ServiceDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const service = getServiceById(id);

  if (!service) {
    return (
      <main className="flex min-h-screen flex-col bg-background text-foreground">
        <Header />
        <section className="mx-auto flex w-full max-w-4xl flex-1 items-center justify-center px-4 py-24 text-center">
          <div>
            <h1 className="text-3xl font-black text-neutral-800 md:text-4xl">
              Service not found
            </h1>
            <p className="mt-3 text-sm font-semibold text-neutral-500 md:text-base">
              The service you are looking for does not exist.
            </p>
            <Link href="/" className="mt-6 inline-block rounded-md bg-primary px-6 py-3 font-semibold text-white">
              Back to Home
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-white text-foreground">
      <Header />

      {/* Top Image - centered */}
      <section className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="relative mx-auto h-[400px] w-full max-w-4xl overflow-hidden">
          <Image
            src={service.thumbnail}
            alt={service.alt}
            fill
            priority
            className="object-cover"
            sizes="(min-width: 1024px) 896px, 100vw"
          />
        </div>
      </section>

      {/* Service Title - centered, Inter Black */}
      <section className="mx-auto w-full max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <h1 className="text-center text-4xl font-black leading-tight text-neutral-900 md:text-5xl" style={{ fontFamily: 'Inter, sans-serif' }}>
          {service.title}
        </h1>
      </section>

      {/* Description - center-aligned, Inter Bold, #909090 */}
      <section className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          {service.body.map((paragraph, idx) => (
            <p key={idx} className="text-base font-bold" style={{ color: '#909090', fontFamily: 'Inter, sans-serif' }}>
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* Collage masonry with lightbox */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2
            className="text-left text-2xl font-black tracking-tight sm:text-3xl"
            style={{ fontFamily: 'Inter, sans-serif', color: '#0057A2' }}
          >
            Gallery
          </h2>
        </div>
        <GalleryMasonry items={service.gallery} />

        {/* Contact Us button at the bottom */}
        <div className="mt-10 flex justify-center pb-10">
            <Link
              href="https://wa.me/qr/2ACIFFYP76OJM1"
              className="group relative overflow-visible rounded-md bg-primary px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              target="_blank"
              rel="noreferrer"
            >
              <span
                aria-hidden
                className="absolute inset-0 -z-10 rounded-md bg-primary/60 blur-lg opacity-70 transition duration-300 group-hover:opacity-90"
              />
              <span className="relative">Contact Us</span>
            </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}



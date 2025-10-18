"use client";

import {
  EnvelopeSimple,
  FacebookLogo,
  InstagramLogo,
  MapPin,
  Phone,
  WhatsappLogo,
  YoutubeLogo,
} from "@phosphor-icons/react";
import dynamic from "next/dynamic";

const ParticleLogo = dynamic(() => import("../components/ParticleLogo"), {
  ssr: false,
});

export default function Footer() {
  return (
    <footer id="footer" className="mt-20 bg-black text-white">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 md:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] lg:items-start">
        <div className="space-y-4">
          <div>
            <h4 className="text-2xl font-semibold">Dewanjee Steel</h4>
            <p className="mt-3 text-sm text-neutral-100/80">
              From soaring event trusses and industrial sheds to bespoke kitchens,
              interiors, and furniture, we bring bold steel craftsmanship to every
              project since 1984. Crafted in-house, delivered with pride.
            </p>
          </div>
          <div className="flex items-center gap-4 text-neutral-100">
            <a
              href="https://www.facebook.com/people/Dewanjee-Steel-Furniture-%E0%A6%A6%E0%A7%87%E0%A6%93%E0%A6%AF%E0%A6%BC%E0%A6%BE%E0%A6%A8%E0%A6%9C%E0%A7%80-%E0%A6%B8%E0%A7%8D%E0%A6%9F%E0%A7%80%E0%A6%B2-%E0%A6%AB%E0%A6%BE%E0%A6%B0%E0%A7%8D%E0%A6%A8%E0%A6%BF%E0%A6%9A%E0%A6%BE%E0%A6%B0/100086611905067/"
              aria-label="Facebook"
              className="transition hover:text-white"
              target="_blank"
              rel="noreferrer"
            >
              <FacebookLogo size={24} weight="fill" />
            </a>
            <a
              href="https://www.instagram.com/dewanjeesteel"
              aria-label="Instagram"
              className="transition hover:text-white"
              target="_blank"
              rel="noreferrer"
            >
              <InstagramLogo size={24} weight="fill" />
            </a>
            <a
              href="https://wa.me/qr/2ACIFFYP76OJM1"
              aria-label="WhatsApp"
              className="transition hover:text-white"
              target="_blank"
              rel="noreferrer"
            >
              <WhatsappLogo size={24} weight="fill" />
            </a>
            <a
              href="https://www.youtube.com/@dewanjeesteel7612"
              aria-label="YouTube"
              className="transition hover:text-white"
              target="_blank"
              rel="noreferrer"
            >
              <YoutubeLogo size={24} weight="fill" />
            </a>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-xl font-semibold">Contact Us</h4>
          <div className="space-y-3 text-sm text-neutral-100/80">
            <div className="flex flex-col gap-2">
              <a
                href="tel:+919434393026"
                className="flex items-center gap-3 transition hover:text-white"
              >
                <Phone size={20} />
                <span>+91-9434393026</span>
              </a>
              <a
                href="tel:+919382695132"
                className="flex items-center gap-3 transition hover:text-white"
              >
                <Phone size={20} />
                <span>+91-9382695132</span>
              </a>
            </div>
            <a
              href="mailto:dewanjeesteel1984@gmail.com"
              className="flex items-center gap-3 transition hover:text-white"
            >
              <EnvelopeSimple size={20} />
              <span>dewanjeesteel1984@gmail.com</span>
            </a>
            <a
              href="https://www.google.com/maps/search/?api=1&query=DEWANJEETALA%2C+Patrasayer%2C+West+Bengal+722206"
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-3 text-pretty transition hover:text-white"
            >
              <MapPin size={28} />
              <address className="not-italic">
                DEWANJEETALA, Patrasayer, West Bengal 722206
              </address>
            </a>
            <p className="flex items-center gap-3">
              <span className="font-medium">Hours:</span>
              Monday - Sunday • 8:00 AM - 8:30 PM
            </p>
          </div>
        </div>

        <div className="hidden xl:block">
          <ParticleLogo className="h-48 w-96" />
        </div>
      </div>
      <div className="border-t border-white/20 py-4">
        <p className="text-center text-xs text-neutral-100">
          © {new Date().getFullYear()} Dewanjee Steel. All rights reserved.
        </p>
      </div>
    </footer>
  );
}


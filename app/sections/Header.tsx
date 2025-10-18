"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  EnvelopeSimple,
  FacebookLogo,
  InstagramLogo,
  List,
  Phone,
  WhatsappLogo,
  YoutubeLogo,
  X,
} from "@phosphor-icons/react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const NAV_LINKS = [
  { label: "Home", href: "/#home", targetId: "home" },
  { label: "Services", href: "/#services", targetId: "services" },
  { label: "About Us", href: "/#footer", targetId: "footer" },
];

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/people/Dewanjee-Steel-Furniture-%E0%A6%A6%E0%A7%87%E0%A6%93%E0%A6%AF%E0%A6%BC%E0%A6%BE%E0%A6%A8%E0%A6%9C%E0%A7%80-%E0%A6%B8%E0%A7%8D%E0%A6%9F%E0%A7%80%E0%A6%B2-%E0%A6%AB%E0%A6%BE%E0%A6%B0%E0%A7%8D%E0%A6%A8%E0%A6%BF%E0%A6%9A%E0%A6%BE%E0%A6%B0/100086611905067/",
    icon: FacebookLogo,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/dewanjeesteel",
    icon: InstagramLogo,
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/qr/2ACIFFYP76OJM1",
    icon: WhatsappLogo,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@dewanjeesteel7612",
    icon: YoutubeLogo,
  },
];

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");

  // Check if we're on a service detail page
  const isServicePage = pathname.startsWith("/services/");

  useEffect(() => {
    // If on a service detail page, set active to Services
    if (isServicePage) {
      setActiveLink("Services");
      return;
    }

    const handleScroll = () => {
      const sections = NAV_LINKS.map((link) => ({
        element: document.getElementById(link.targetId),
        label: link.label,
        targetId: link.targetId,
      })).filter(s => s.element !== null);

      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollY = window.scrollY;

      // Check if we're near the bottom of the page (within 200px)
      const isAtBottom = windowHeight + scrollY >= documentHeight - 200;

      // If at bottom, set active to the last nav item (About Us/Footer)
      if (isAtBottom) {
        const lastLink = NAV_LINKS[NAV_LINKS.length - 1];
        if (lastLink) {
          setActiveLink(lastLink.label);
          return;
        }
      }

      // Find which section is currently most visible in the viewport
      // We check from bottom to top of NAV_LINKS to prioritize later sections
      let currentSection = NAV_LINKS[0]?.label || "Home";
      
      for (const section of sections) {
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          const elementTop = rect.top;
          const elementBottom = rect.bottom;
          
          // Consider a section "active" if its top is within the upper 40% of viewport
          // or if it occupies a significant portion of the viewport
          if (elementTop <= windowHeight * 0.4 && elementBottom > 0) {
            currentSection = section.label;
          }
        }
      }

      setActiveLink(currentSection);
    };

    // Run on mount to set initial state
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isServicePage]);

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header id="home" className="sticky top-0 z-50 w-full bg-white shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="hidden items-center justify-between py-2 md:flex">
          <div className="flex items-center gap-4 text-sm font-normal" style={{ color: '#909090' }}>
            <div className="flex items-center gap-2">
              <Phone size={18} />
              <div className="flex items-center gap-2">
                <a
                  className="hover:text-primary"
                  href="tel:+919434393026"
                  style={{ color: '#909090' }}
                >
                  +91-9434393026
                </a>
                <span aria-hidden="true">•</span>
                <a
                  className="hover:text-primary"
                  href="tel:+919382695132"
                  style={{ color: '#909090' }}
                >
                  +91-9382695132
                </a>
              </div>
            </div>
            <a
              className="flex items-center gap-2 hover:text-primary"
              href="mailto:dewanjeesteel1984@gmail.com"
              style={{ color: '#909090' }}
            >
              <EnvelopeSimple size={18} />
              <span>dewanjeesteel1984@gmail.com</span>
            </a>
          </div>
          <div className="flex items-center gap-2">
            {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white transition-colors hover:bg-primary/90"
                target="_blank"
                rel="noreferrer"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="/dewanjee_logo.png"
                alt="Dewanjee Steel logo"
                width={300}
                height={75}
                priority
                className="h-20 w-auto"
              />
            </Link>
          </div>

          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-2 text-sm font-semibold md:flex"
          >
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setActiveLink(label)}
                className={twMerge(
                  clsx(
                    "relative px-3 py-2 text-neutral-700 transition-colors hover:text-primary",
                    {
                      "font-black text-primary": activeLink === label,
                    },
                  ),
                )}
              >
                {label}
                {activeLink === label && (
                  <span className="absolute bottom-1 left-1/2 h-1 w-4/5 -translate-x-1/2 rounded-full bg-primary" />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="https://wa.me/qr/2ACIFFYP76OJM1"
              className="group relative inline-flex overflow-visible rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              target="_blank"
              rel="noreferrer"
            >
              <span
                aria-hidden
                className="absolute inset-0 -z-10 rounded-md bg-primary/60 blur-lg opacity-70 transition duration-300 group-hover:opacity-90"
              />
              <span className="relative">Contact Us</span>
            </Link>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full border border-neutral-200 p-2 text-neutral-700 transition hover:bg-neutral-100 md:hidden"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav"
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? (
                <X size={22} weight="bold" />
              ) : (
                <List size={22} weight="bold" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={`md:hidden ${
          isMenuOpen ? "max-h-96 border-t border-neutral-200" : "max-h-0"
        } overflow-hidden bg-white transition-[max-height] duration-300`}
      >
        <nav
          aria-label="Mobile navigation"
          className="flex flex-col gap-2 px-4 py-4 text-sm"
        >
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="rounded-lg px-3 py-2 text-neutral-700 transition hover:bg-primary/10"
              onClick={handleNavClick}
            >
              {label}
            </Link>
          ))}
          <Link
            href="https://wa.me/qr/2ACIFFYP76OJM1"
            className="rounded-lg bg-primary px-3 py-2 text-center font-semibold text-white"
            target="_blank"
            rel="noreferrer"
            onClick={handleNavClick}
          >
            Contact Us
          </Link>
        </nav>
      </div>
    </header>
  );
}


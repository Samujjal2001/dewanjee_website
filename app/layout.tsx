import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Dewanjee Steel | Fabrication & Steel Works",
  description:
    "Dewanjee delivers premium fabrication, truss manufacturing, roofing, and interior steel solutions across West Bengal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased bg-background text-foreground`}>
        <div className="flex min-h-screen flex-col bg-background text-foreground">
          <SmoothScroll />
          {children}
        </div>
      </body>
    </html>
  );
}

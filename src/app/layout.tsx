import type { Metadata, Viewport } from "next";
import { Cursor } from "@/components/providers/cursor";
import { QueryProvider } from "@/components/providers/query-provider";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { mono, sans, sansExt, serif } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "SARASMER — Skills Meet Opportunity", template: "%s · SARASMER" },
  description:
    "SARASMER is where verified student skills meet real company work. Build a profile, prove your skills, share your availability, and get matched to paid projects.",
  openGraph: {
    title: "SARASMER — Skills Meet Opportunity",
    description: "Verified student skills, matched to real company projects.",
    images: ["/brand/sarasmer-logo.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0B172A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn(serif.variable, sans.variable, sansExt.variable, mono.variable)}>
      <body>
        <QueryProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </QueryProvider>
        <Cursor />
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}

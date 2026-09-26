"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SMark } from "@/components/brand/s-mark";
import { Wordmark } from "@/components/brand/wordmark";
import { Magnetic } from "@/components/motion/magnetic";
import { getLenis, scrollToTarget } from "@/components/providers/smooth-scroll";
import { Arrow, Button } from "@/components/ui/button";
import { EASE_QUINT } from "@/lib/motion";
import { useUI } from "@/lib/store";
import { cn } from "@/lib/utils";

export const NAV_LINKS = [
  { label: "Discover", href: "/opportunities" },
  { label: "For Students", href: "/#students" },
  { label: "For Companies", href: "/#companies" },
  { label: "How It Works", href: "/#how" },
  { label: "About", href: "/#story" },
];

type NavUser = { name: string; role: "STUDENT" | "COMPANY" } | null;

export function Navbar({ user = null, tone = "dark" }: { user?: NavUser; tone?: "dark" | "light" }) {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const { menuOpen, setMenuOpen } = useUI();
  const pathname = usePathname();
  const router = useRouter();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));

  useEffect(() => {
    const lenis = getLenis();
    if (menuOpen) lenis?.stop();
    else lenis?.start();
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  useEffect(() => setMenuOpen(false), [pathname, setMenuOpen]);

  const go = (href: string) => (e: React.MouseEvent) => {
    if (href.startsWith("/#")) {
      if (pathname === "/") {
        e.preventDefault();
        setMenuOpen(false);
        setTimeout(() => scrollToTarget(href.slice(1)), menuOpen ? 450 : 0);
      }
    }
  };

  const dash = user ? (user.role === "COMPANY" ? "/dashboard/company" : "/dashboard/student") : null;
  const dark = tone === "dark" || scrolled || menuOpen;

  return (
    <>
      <motion.header
        data-surface={dark ? "dark" : "light"}
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE_QUINT }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter,height] duration-500 ease-quint",
          scrolled ? "h-16 border-b border-white/[0.06] bg-navy-900/[0.94] backdrop-blur-xl backdrop-saturate-150" : "h-[var(--nav-h)] border-b border-transparent",
          !dark && "bg-transparent",
        )}
      >
        <nav className="container-x flex h-full items-center justify-between gap-6" aria-label="Primary">
          <Link href="/" className="group flex items-center gap-3" aria-label="SARASMER home">
            <SMark className="h-8 w-6 transition-transform duration-700 ease-quint group-hover:rotate-[-8deg]" sparkle={false} strokeScale={1.25} />
            <Wordmark className="text-[21px]" tone={dark ? "dark" : "light"} />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((l) => {
              const active = l.href === pathname;
              return (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    onClick={go(l.href)}
                    className={cn(
                      "group relative rounded-[8px] px-3.5 py-2 text-[14px] transition-colors duration-300",
                      dark ? "text-mist/80 hover:text-ivory" : "text-ink-muted hover:text-navy-900",
                      active && (dark ? "text-ivory" : "text-navy-900"),
                    )}
                  >
                    {l.label}
                    <span
                      className={cn(
                        "absolute inset-x-3.5 -bottom-0.5 h-px origin-left scale-x-0 bg-gold transition-transform duration-500 ease-quint group-hover:scale-x-100",
                        active && "scale-x-100",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            {user ? (
              <Magnetic className="hidden sm:inline-flex">
                <Button asChild variant="signature" size="sm" className="h-10 px-4">
                  <Link href={dash!}>
                    Dashboard <Arrow />
                  </Link>
                </Button>
              </Magnetic>
            ) : (
              <>
                <Link
                  href="/login"
                  className={cn(
                    "hidden h-10 items-center rounded-[10px] px-4 text-[14px] transition-colors sm:inline-flex",
                    dark ? "text-mist hover:text-ivory" : "text-ink-muted hover:text-navy-900",
                  )}
                >
                  Log In
                </Link>
                <Magnetic className="hidden sm:inline-flex">
                  <Button asChild variant="signature" size="sm" className="h-10 px-4">
                    <Link href="/signup">
                      Get Started <Arrow />
                    </Link>
                  </Button>
                </Magnetic>
              </>
            )}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className={cn("relative grid h-11 w-11 place-items-center rounded-[10px] border lg:hidden", dark ? "border-white/10" : "border-navy-900/15")}
            >
              <span className="relative block h-3 w-5">
                <motion.span
                  className={cn("absolute left-0 top-0 h-px w-5", dark ? "bg-ivory" : "bg-navy-900")}
                  animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE_QUINT }}
                />
                <motion.span
                  className="absolute bottom-0 right-0 h-px bg-gold"
                  animate={menuOpen ? { rotate: -45, y: -5.5, width: 20 } : { rotate: 0, y: 0, width: 13 }}
                  transition={{ duration: 0.5, ease: EASE_QUINT }}
                />
              </span>
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            data-surface="dark"
            className="fixed inset-0 z-40 flex flex-col bg-navy-900 pt-24 lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
          >
            <SMark className="pointer-events-none absolute -right-16 bottom-24 h-[420px] w-[315px] opacity-[0.08]" sparkle={false} />
            <motion.ul
              className="container-x flex flex-col"
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } } }}
            >
              {NAV_LINKS.map((l, i) => (
                <motion.li
                  key={l.label}
                  className="overflow-hidden border-b border-white/[0.06]"
                  variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
                >
                  <motion.span
                    className="block"
                    variants={{ hidden: { y: "100%" }, show: { y: "0%", transition: { duration: 0.8, ease: EASE_QUINT } } }}
                  >
                    <Link
                      href={l.href}
                      onClick={(e) => {
                        go(l.href)(e);
                        if (!l.href.startsWith("/#") || pathname !== "/") router.push(l.href);
                      }}
                      className="flex items-baseline justify-between py-5"
                    >
                      <span className="font-serif text-[2.6rem] leading-none tracking-[-0.02em] text-ivory">{l.label}</span>
                      <span className="font-mono text-[11px] text-gold/70">0{i + 1}</span>
                    </Link>
                  </motion.span>
                </motion.li>
              ))}
            </motion.ul>
            <motion.div
              className="container-x mt-auto grid grid-cols-2 gap-3 pb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.7, ease: EASE_QUINT } }}
              exit={{ opacity: 0 }}
            >
              {user ? (
                <Button asChild variant="gold" size="lg" className="col-span-2">
                  <Link href={dash!}>Go to dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button asChild variant="ghost-dark" size="lg">
                    <Link href="/login">Log In</Link>
                  </Button>
                  <Button asChild variant="gold" size="lg">
                    <Link href="/signup">Get Started</Link>
                  </Button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

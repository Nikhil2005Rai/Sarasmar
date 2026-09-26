import Link from "next/link";
import { AuthAside } from "@/components/auth/auth-aside";
import { SMark } from "@/components/brand/s-mark";
import { Wordmark } from "@/components/brand/wordmark";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-[100svh] grid-cols-1 bg-ivory lg:grid-cols-[1.05fr_1fr]">
      <AuthAside />
      <main data-surface="light" className="relative flex flex-col">
        <div className="flex items-center justify-between px-5 py-5 sm:px-10 lg:hidden">
          <Link href="/" className="flex items-center gap-2.5">
            <SMark className="h-7 w-5" sparkle={false} tone="light" />
            <Wordmark className="text-[19px]" tone="light" />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center px-5 pb-16 pt-6 sm:px-10 lg:py-16">
          <div className="w-full max-w-[440px]">{children}</div>
        </div>
      </main>
    </div>
  );
}

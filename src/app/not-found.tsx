import Link from "next/link";
import { SMark } from "@/components/brand/s-mark";

export default function NotFound() {
  return (
    <main data-surface="dark" className="grid min-h-[100svh] place-items-center bg-navy-900 px-6 text-center text-ivory">
      <div className="flex flex-col items-center">
        <SMark className="h-28 w-20" drawOnMount />
        <p className="eyebrow mt-10 text-gold">404</p>
        <h1 className="display-l mt-4">This path doesn’t connect.</h1>
        <Link href="/" className="mt-8 inline-flex h-11 items-center rounded-[11px] bg-gold px-5 text-[14px] font-medium text-navy-900">
          Back to SARASMER
        </Link>
      </div>
    </main>
  );
}

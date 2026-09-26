import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "group/btn relative inline-flex select-none items-center justify-center gap-2.5 whitespace-nowrap font-sans font-medium tracking-[-0.005em] transition-[background-color,color,box-shadow,border-color,transform] duration-300 ease-quint disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        /** navy fill, gold→royal gradient hairline — the signature CTA */
        signature: "btn-gradient-border text-ivory hover:shadow-gold",
        gold: "bg-gold text-navy-900 shadow-[0_10px_30px_-12px_rgba(217,164,65,0.7)] hover:bg-gold-soft",
        royal: "bg-royal text-white shadow-[0_10px_30px_-14px_rgba(53,104,184,0.8)] hover:bg-[#2d5aa0]",
        navy: "bg-navy-900 text-ivory hover:bg-navy-800",
        "ghost-dark": "border border-white/15 text-ivory hover:border-gold/50 hover:bg-white/[0.04]",
        "ghost-light": "border border-line-light bg-warm-white text-navy-900 hover:border-navy-900/30 hover:bg-white",
        link: "px-0 text-royal underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 rounded-[9px] px-3.5 text-[13px]",
        md: "h-11 rounded-[11px] px-5 text-[14.5px]",
        lg: "h-[52px] rounded-[12px] px-6 text-[15.5px]",
      },
    },
    defaultVariants: { variant: "royal", size: "md" },
  },
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
});
Button.displayName = "Button";

/** Hand-drawn arrow that slides forward on parent hover (no icon library). */
export function Arrow({ className }: { className?: string }) {
  return (
    <span className={cn("relative inline-flex h-3 w-4 overflow-hidden", className)} aria-hidden>
      <svg viewBox="0 0 16 12" className="absolute inset-0 h-full w-full transition-transform duration-500 ease-quint group-hover/btn:translate-x-[120%] group-hover:translate-x-[120%]">
        <path d="M1 6h13M9.5 1.5 14 6l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <svg viewBox="0 0 16 12" className="absolute inset-0 h-full w-full -translate-x-[120%] transition-transform duration-500 ease-quint group-hover/btn:translate-x-0 group-hover:translate-x-0">
        <path d="M1 6h13M9.5 1.5 14 6l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

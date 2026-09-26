import { forwardRef, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Field({ label, error, children, hint, htmlFor }: { label: string; error?: string; hint?: string; children: ReactNode; htmlFor?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <label htmlFor={htmlFor} className="text-[13px] font-medium text-navy-900">
          {label}
        </label>
        {hint && !error && <span className="text-[12px] text-ink-faint">{hint}</span>}
        {error && (
          <span role="alert" className="text-[12px] text-[#b4452f]">
            {error}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

const inputBase =
  "w-full rounded-[11px] border bg-warm-white px-4 text-[15px] text-navy-900 placeholder:text-ink-faint/80 transition-[border-color,box-shadow] duration-300 ease-quint focus:outline-none focus:ring-4";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }>(
  ({ className, invalid, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        inputBase,
        "h-12",
        invalid ? "border-[#d9826e] focus:ring-[#d9826e]/15" : "border-line-light focus:border-royal/60 focus:ring-royal/10",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }>(
  ({ className, invalid, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        inputBase,
        "min-h-[96px] resize-y py-3",
        invalid ? "border-[#d9826e] focus:ring-[#d9826e]/15" : "border-line-light focus:border-royal/60 focus:ring-royal/10",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

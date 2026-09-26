"use client";

import * as RSwitch from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

export function Switch({ checked, onCheckedChange, disabled, className, label }: {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  disabled?: boolean;
  className?: string;
  label: string;
}) {
  return (
    <RSwitch.Root
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "relative h-7 w-12 shrink-0 rounded-full border transition-colors duration-300 ease-quint disabled:opacity-60",
        checked ? "border-verified/40 bg-verified" : "border-line-light bg-[#e9e4da]",
        className,
      )}
    >
      <RSwitch.Thumb className="block h-5 w-5 translate-x-[3px] rounded-full bg-white shadow-[0_2px_6px_rgba(11,23,42,0.25)] transition-transform duration-300 ease-quint data-[state=checked]:translate-x-[23px]" />
    </RSwitch.Root>
  );
}

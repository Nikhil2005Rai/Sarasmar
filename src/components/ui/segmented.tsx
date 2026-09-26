"use client";

import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { motion } from "framer-motion";
import { useId } from "react";
import { cn } from "@/lib/utils";

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  className,
  size = "md",
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string; hint?: string }[];
  className?: string;
  size?: "sm" | "md";
}) {
  const id = useId();
  return (
    <ToggleGroup.Root
      type="single"
      value={value}
      onValueChange={(v) => v && onChange(v as T)}
      className={cn("relative grid rounded-[12px] border border-line-light bg-ivory p-1", className)}
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <ToggleGroup.Item
            key={o.value}
            value={o.value}
            className={cn(
              "relative z-10 flex flex-col items-center justify-center rounded-[9px] px-3 text-center transition-colors duration-300",
              size === "md" ? "h-14" : "h-10",
              active ? "text-ivory" : "text-ink-muted hover:text-navy-900",
            )}
          >
            {active && (
              <motion.span
                layoutId={`seg-${id}`}
                className="absolute inset-0 -z-10 rounded-[9px] bg-navy-900 shadow-[0_8px_20px_-10px_rgba(11,23,42,0.6)]"
                transition={{ type: "spring", stiffness: 420, damping: 36 }}
              />
            )}
            <span className="text-[14px] font-semibold">{o.label}</span>
            {o.hint && size === "md" && (
              <span className={cn("text-[11.5px]", active ? "text-gold-soft/80" : "text-ink-faint")}>{o.hint}</span>
            )}
          </ToggleGroup.Item>
        );
      })}
    </ToggleGroup.Root>
  );
}

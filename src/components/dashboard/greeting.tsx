"use client";

import { useEffect, useState } from "react";
import { SplitReveal } from "@/components/motion/reveal";
import { greeting } from "@/lib/utils";

export function Greeting({ name }: { name: string }) {
  const [g, setG] = useState<string | null>(null);
  useEffect(() => setG(greeting(new Date())), []);
  const first = name.split(" ")[0];
  return (
    <h1 className="min-h-[1.1em] font-serif text-[clamp(2.4rem,4.4vw,3.6rem)] font-medium leading-[1] tracking-[-0.025em] text-navy-900">
      {g && <SplitReveal immediate text={`${g}, _${first}_`} stagger={0.07} />}
    </h1>
  );
}

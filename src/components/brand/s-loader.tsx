import { SMark } from "./s-mark";

export function SLoader({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-4" role="status" aria-live="polite">
      <SMark className="h-16 w-12" drawOnMount loop tone="light" sparkle={false} duration={1.2} />
      <span className="eyebrow text-ink-faint">{label}</span>
    </div>
  );
}

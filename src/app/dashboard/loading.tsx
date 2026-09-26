import { SLoader } from "@/components/brand/s-loader";

export default function Loading() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <SLoader label="Loading your workspace" />
    </div>
  );
}

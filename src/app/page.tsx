import { HowItWorks } from "@/components/home/how-it-works";
import { Hero } from "@/components/home/hero";
import { MarketplacePreview } from "@/components/home/marketplace-preview";
import { Split } from "@/components/home/split";
import { Story } from "@/components/home/story";
import { Verification } from "@/components/home/verification";
import { Why } from "@/components/home/why";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { getNavUser } from "@/lib/session";

export default async function HomePage() {
  const user = await getNavUser();
  return (
    <>
      <Navbar user={user} />
      <main>
        <Hero />
        <HowItWorks />
        <Why />
        <Split />
        <Verification />
        <MarketplacePreview />
        <Story />
      </main>
      <Footer />
    </>
  );
}

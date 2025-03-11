import { BenefitsGrid } from "@/components/benefits-grid/BenefitsGrid";
import { FeatureToggles } from "@/components/feature-toggles/FeatureToggles";
import { FinalCTA } from "@/components/final-cta/FinalCTA";
import { Footer } from "@/components/footer/Footer";
import { Hero } from "@/components/hero/Hero";
import { Logos } from "@/components/logos/Logos";
import { NAV_LINKS } from "@/components/navigation/constants";
import { ExpandableNavBar } from "@/components/navigation/ExpandableNavBar";
import { Pricing } from "@/components/pricing/Pricing";
import { Stats } from "@/components/stats/Stats";
import { Supports } from "@/components/supports/Supports";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();

  return (
    <>
      <ExpandableNavBar links={NAV_LINKS} login={user ? true : false}>
        <Hero />
      </ExpandableNavBar>
      <Logos />
      <div className="space-y-36 bg-zinc-50 pb-24 pt-24 md:pt-32">
        <FeatureToggles />
        <Stats />
        <Supports />
        <BenefitsGrid />
        <Pricing />
        {/* <BlogCarousel /> */}
      </div>
      {/* <EmailCapture /> */}
      <FinalCTA />
      <Footer />
    </>
  );
}

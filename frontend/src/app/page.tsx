import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustedBy from "@/components/TrustedBy";
import CoreCapabilities from "@/components/CoreCapabilities";
import ThreeStages from "@/components/ThreeStages";
import SocialProof from "@/components/SocialProof";
import CTABanner from "@/components/CTABanner";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <TrustedBy />
      <CoreCapabilities />
      <ThreeStages />
      <SocialProof />
      <CTABanner />
      <Footer />
    </main>
  );
}

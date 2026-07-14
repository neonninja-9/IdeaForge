import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import TrustedBy from "./components/TrustedBy";
import CoreCapabilities from "./components/CoreCapabilities";
import ThreeStages from "./components/ThreeStages";
import SocialProof from "./components/SocialProof";
import CTABanner from "./components/CTABanner";

function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <TrustedBy />
      <CoreCapabilities />
      <ThreeStages />
      <SocialProof />
      <CTABanner />
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="font-sans antialiased bg-surface flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 mt-16 sm:mt-18">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;

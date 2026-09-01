import { ArrowRight, Bot, GitBranch, Lightbulb, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef } from "react";
import LaserFlow from "../../components/LaserFlow";
import GhostFibers from "../../components/GhostFibers";
import ScrambledText from "../../components/ScrambledText";
import SpecularButton from "./effects/specularButton";
import VariableProximity from "../../components/VariableProximity";

function ProductFrame() {
  return (
    <div className="relative z-20 mx-auto w-full max-w-5xl rounded-[28px] border-2 border-[#9bb4ff]/50 bg-[#0c0d12] shadow-[0_-15px_60px_-10px_rgba(155,180,255,0.35),0_30px_90px_-15px_rgba(0,0,0,0.9)] overflow-hidden transition-all duration-300">
      {/* Top contact laser flare */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 sm:w-96 h-2.5 bg-gradient-to-r from-transparent via-white to-transparent blur-[1px] rounded-full z-30" />
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 h-6 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,1)_0%,rgba(155,180,255,0.7)_45%,transparent_80%)] blur-sm z-30" />
      <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 w-[380px] h-20 bg-[radial-gradient(ellipse_at_center,rgba(155,180,255,0.35)_0%,rgba(86,131,218,0.12)_50%,transparent_75%)] blur-2xl z-20" />

      {/* Window Title Bar */}
      <div className="flex items-center justify-between border-b border-white/10 bg-[#0c0d12]/90 px-5 py-3.5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-[#ff5f56]/90 inline-block shadow-[0_0_8px_rgba(255,95,86,0.5)]" />
          <span className="size-3 rounded-full bg-[#ffbd2e]/90 inline-block shadow-[0_0_8px_rgba(255,189,46,0.5)]" />
          <span className="size-3 rounded-full bg-[#27c93f]/90 inline-block shadow-[0_0_8px_rgba(39,201,63,0.5)]" />
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-[#95979e]">
          <span className="size-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
          <span className="text-white/80 font-semibold tracking-wide">app.ideaforge.dev / dashboard</span>
        </div>
        <div className="w-12 text-right">
          <span className="text-[10px] uppercase font-bold text-[#9bb4ff] bg-[#9bb4ff]/10 px-2 py-0.5 rounded-full border border-[#9bb4ff]/20">Live</span>
        </div>
      </div>

      {/* Real Dashboard Screenshot */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#1C1917]">
        <img
          src="/images/screenshots/dashboard.jpg"
          alt="IdeaForge Real Project Dashboard"
          className="h-full w-full object-cover object-top transition-transform duration-700 hover:scale-[1.01]"
          loading="eager"
        />
        {/* Subtle gradient overlay at the bottom */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0c0d12] to-transparent opacity-60" />
      </div>
    </div>
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[960px] overflow-hidden bg-[#0C0A09] px-5 pb-20 pt-28 text-white sm:px-6 lg:px-10"
    >
      {/* GhostFibers Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <GhostFibers
          lineColor="#2d3748"
          glowColor="#1a202c"
          speed={0.2}
          scale={2}
          rotation={0}
          rotationSpeed={0.25}
          layers={4}
          waveAmplitude={0.015}
          waveFrequency={3}
          waveSpeed={0.15}
          layerSpeed={0.08}
          twist={0.1}
          twistFrequency={5}
          twistSpeed={1.2}
          lineFrequency={5}
          lineSpacing={2}
          lineSharpness={16}
          glowFalloff={10}
          glowIntensity={1.6}
          brightness={2}
          blueBoost={1.25}
          vignette={0.8}
          grain={0.05}
          dpr={1}
          lightMode={false}
          fps={60}
          paused={false}
        />
      </div>

      <div className="relative mx-auto max-w-[1200px]">
        {/* ── Top Centered Hero Header ── */}
        <div className="relative z-30 max-w-3xl mx-auto text-center pt-6 sm:pt-12 pb-6 sm:pb-8">


          {/* VariableProximity animated headline */}
          <div className="flex justify-center w-full mb-6">
            <VariableProximity
              label="Forge Raw Problems into Polished Projects"
              className="text-5xl font-black tracking-tight leading-[1.08] text-white sm:text-6xl lg:text-7xl cursor-default"
              fromFontVariationSettings="'wght' 400"
              toFontVariationSettings="'wght' 900"
              containerRef={containerRef}
              radius={120}
              falloff="linear"
            />
          </div>

          {/* ScrambledText animated subtitle */}
          <div className="mt-5 max-w-xl mx-auto">
            <ScrambledText
              className="text-base sm:text-lg leading-relaxed text-[#a5a7b0] text-center"
              radius={100}
              duration={1.2}
              speed={0.5}
              scrambleChars=".:*^#"
            >
              Submit real-world problems, get AI-generated roadmaps and tech stack suggestions, and discover similar projects — all in one platform built for builders.
            </ScrambledText>
          </div>

          {/* SpecularButton CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <SpecularButton
                size="lg"
                radius={28}
                tint="#5683da"
                tintOpacity={0.15}
                blur={12}
                textColor="#ffffff"
                lineColor="#9bb4ff"
                baseColor="#4a5568"
                intensity={1.2}
                shineSize={12}
                shineFade={45}
                thickness={1.2}
                speed={0.3}
                followMouse
                autoAnimate
                className="font-bold"
              >
                <span className="flex items-center gap-2">
                  Submit an Idea
                  <ArrowRight className="size-4" />
                </span>
              </SpecularButton>
            </Link>
            <Link to="/explore">
              <SpecularButton
                size="lg"
                radius={28}
                tint="#ffffff"
                tintOpacity={0.04}
                blur={8}
                textColor="#ffffff"
                lineColor="#ffffff"
                baseColor="#525252"
                intensity={0.7}
                shineSize={10}
                shineFade={35}
                thickness={0.8}
                speed={0.25}
                followMouse
                className="font-semibold"
              >
                Explore Projects
              </SpecularButton>
            </Link>
          </div>
        </div>

        {/* ── Product Showcase with Laser Flow Effect ── */}
        <div className="relative z-20 mt-28 sm:mt-36 max-w-5xl mx-auto">
          {/* LaserFlow Canvas */}
          <div className="pointer-events-none absolute bottom-[calc(100%-1px)] left-1/2 -translate-x-1/2 w-full max-w-5xl h-[280px] sm:h-[340px] z-10 overflow-visible opacity-100 mix-blend-screen brightness-125">
            <LaserFlow
              color="#9bb4ff"
              horizontalBeamOffset={0.0}
              verticalBeamOffset={-0.498}
              verticalSizing={2.8}
              horizontalSizing={1.15}
              fogIntensity={0.65}
              fogScale={0.28}
              wispDensity={1.2}
              wispIntensity={5.5}
              flowSpeed={0.32}
              mouseTiltStrength={0.02}
            />
          </div>

          {/* Ambient soft glow */}
          <div className="pointer-events-none absolute left-1/2 -top-12 -translate-x-1/2 z-10 h-28 w-[420px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(155,180,255,0.3)_0%,rgba(86,131,218,0.1)_40%,transparent_70%)] blur-2xl mix-blend-screen" />

          {/* Product Card */}
          <ProductFrame />

          {/* Bottom Feature Tags */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-[#d1d1d1]">
            {[
              ["AI Roadmaps", GitBranch],
              ["Tech Stack Suggestions", Bot],
              ["Idea Matching", Lightbulb],
              ["Community Voting", MessageSquare],
            ].map(([label, Icon]) => (
              <span key={label as string} className="inline-flex items-center gap-2 font-medium text-slate-300">
                <Icon className="size-4 text-[#9bb4ff]" />
                {label as string}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

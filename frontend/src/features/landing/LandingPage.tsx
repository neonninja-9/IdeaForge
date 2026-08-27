/**
 * LandingPage
 * -----------
 * Immersive, animated, scroll-driven landing page for IdeaForge.
 * Leverages 15 effect components for a premium interactive experience.
 */

import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import {
  Zap, Brain, Users, Lightbulb,
  TrendingUp, ArrowRight, Star, Shield, Clock
} from "lucide-react";

/* ── Effect Components ── */
import BlurText from "./effects/blurText";
import SpecularButton from "./effects/specularButton";
import ScrollFloat from "./effects/scrollFloat";
import CountUp from "./effects/countUp";
import AnimatedList from "./effects/animatedList";
import GradualBlur from "./effects/gradualBlur";
import FlowingMenu from "./effects/flowingMenu";
import AccordionGallery from "./effects/accordilonGalllary";
import ScrollExpand from "./effects/scrollExpand";
import TiltedCard from "./effects/titledCard";
import ScrollVelocity from "./effects/scrollVelocity";

const DepthCarousel = lazy(() => import("./effects/depthCarousel"));
const DriftWall = lazy(() => import("./effects/driftWall"));

/* ── Lazy Hero with LaserFlow (heavy WebGL) ── */
const Hero = lazy(() => import("./Hero"));

/* ═══════════════════════════════════════════════════════════════════════════
   Section 1: Hero
   ═══════════════════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════════════════
   Section 2: ScrollVelocity Marquee
   ═══════════════════════════════════════════════════════════════════════════ */
function VelocityBand() {
  return (
    <section className="relative bg-[#090a0c] py-8 overflow-hidden border-t border-white/5">
      <ScrollVelocity
        texts={[
          "Capture Ideas",
          "AI Forge",
          "Projects",
          "Knowledge Base",
          "Collaborate",
          "Ship Faster",
        ]}
        velocity={60}
        className="text-white/10 font-black uppercase"
        numCopies={8}
      />
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Section 3: ScrollExpand Cinematic Reveal
   ═══════════════════════════════════════════════════════════════════════════ */
function CinematicReveal() {
  return (
    <section className="relative bg-[#090a0c] w-full">
      <ScrollExpand
        src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1920&q=80"
        mediaType="image"
        alt="IdeaForge workspace"
        title="Where Ideas Become Reality"
        scrollHint="Scroll to explore"
        startWidth={42}
        startHeight={58}
        startRadius={28}
        endRadius={0}
        mediaZoom={1.35}
        scrollDistance={1.2}
        holdDistance={0.35}
        smoothing={0.1}
        overlayScrim={0.5}
        useWindowScroll={true}
      >
        <div className="flex flex-col items-center gap-6">
          <p className="text-white/80 text-lg sm:text-xl max-w-lg font-medium">
            A unified workspace that transforms scattered thoughts into structured, actionable projects.
          </p>
          <Link to="/register">
            <SpecularButton
              size="lg"
              radius={28}
              tint="#5683da"
              tintOpacity={0.2}
              blur={12}
              textColor="#ffffff"
              lineColor="#9bb4ff"
              baseColor="#4a5568"
              intensity={1}
              autoAnimate
            >
              <span className="flex items-center gap-2">
                Get Started Free
                <ArrowRight className="size-4" />
              </span>
            </SpecularButton>
          </Link>
        </div>
      </ScrollExpand>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Section 4: FlowingMenu Feature Explorer
   ═══════════════════════════════════════════════════════════════════════════ */
function FeatureExplorer() {
  const menuItems = [
    { link: "#capture", text: "Capture", image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&q=80" },
    { link: "#forge", text: "AI Forge", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80" },
    { link: "#projects", text: "Projects", image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&q=80" },
    { link: "#knowledge", text: "Knowledge", image: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=600&q=80" },
    { link: "#collaborate", text: "Collaborate", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80" },
  ];

  return (
    <section className="relative bg-[#0a0b0e]">
      <div className="mx-auto max-w-[1200px] px-5 pt-20 pb-4 sm:px-6 lg:px-10">
        <ScrollFloat
          containerClassName="!my-0"
          textClassName="!text-white font-black tracking-tight"
        >
          Explore every feature
        </ScrollFloat>
      </div>
      <div className="h-[500px] sm:h-[600px]">
        <FlowingMenu
          items={menuItems}
          speed={12}
          textColor="#fff"
          bgColor="#0a0b0e"
          marqueeBgColor="#9bb4ff"
          marqueeTextColor="#090a0c"
          borderColor="rgba(255,255,255,0.08)"
        />
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Section 5: AccordionGallery Features Showcase
   ═══════════════════════════════════════════════════════════════════════════ */
function FeaturesShowcase() {
  const galleryItems = [
    {
      image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=900&q=80",
      label: "Quick Capture",
    },
    {
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=900&q=80",
      label: "AI Forge",
    },
    {
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=900&q=80",
      label: "Projects",
    },
    {
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&q=80",
      label: "Collaborate",
    },
    {
      image: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=900&q=80",
      label: "Knowledge Base",
    },
  ];

  return (
    <section className="relative bg-[#090a0c] py-20 sm:py-28">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6 lg:px-10">
        <ScrollFloat
          containerClassName="!my-0 !mb-10"
          textClassName="!text-white font-black tracking-tight"
        >
          Built for every stage of thinking
        </ScrollFloat>

        <AccordionGallery
          items={galleryItems}
          defaultIndex={2}
          accentColor="#9bb4ff"
          overlayColor="#090a0c"
          textColor="#ffffff"
          height={480}
          gap={12}
          radius={20}
          expandRatio={0.48}
          duration={0.6}
          ease="power3.out"
          parallax={0.5}
          tilt={8}
          trigger="hover"
          showLabels
          grayscale
        />
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Section 6: DepthCarousel Product Screenshots
   ═══════════════════════════════════════════════════════════════════════════ */
function ProductCarousel() {
  const carouselItems = [
    { image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80", alt: "Dashboard" },
    { image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80", alt: "Analytics" },
    { image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&q=80", alt: "Kanban Board" },
    { image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80", alt: "Team View" },
    { image: "https://images.unsplash.com/photo-1600267175161-cfaa711b4a81?w=800&q=80", alt: "AI Studio" },
    { image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80", alt: "Workspace" },
  ];

  return (
    <section className="relative bg-[#0a0b0e] py-20 sm:py-28 overflow-hidden">
      <GradualBlur position="top" height="8rem" strength={3} />

      <div className="mx-auto max-w-[1200px] px-5 sm:px-6 lg:px-10 mb-12">
        <ScrollFloat
          containerClassName="!my-0"
          textClassName="!text-white font-black tracking-tight"
        >
          See it in action
        </ScrollFloat>
      </div>

      <div className="h-[420px] sm:h-[500px] max-w-[1200px] mx-auto px-5">
        <Suspense fallback={<div className="h-full bg-[#0a0b0e]" />}>
          <DepthCarousel
            items={carouselItems}
            cardWidth={320}
            cardHeight={400}
            radius={20}
            tint="#090a0c"
            depth={200}
            spread={90}
            tilt={22}
            visibleCards={4}
            falloff={0.2}
            blur={6}
            duration={700}
            autoplay
            autoplayDelay={3500}
            loop
            showControls
            showIndicators
          />
        </Suspense>
      </div>

      <GradualBlur position="bottom" height="8rem" strength={3} />
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Section 7: Stats with CountUp
   ═══════════════════════════════════════════════════════════════════════════ */
function StatsSection() {
  const stats = [
    { value: 50000, suffix: "+", label: "Ideas Captured", icon: Lightbulb },
    { value: 12000, suffix: "+", label: "Projects Shipped", icon: TrendingUp },
    { value: 8500, suffix: "+", label: "Teams Active", icon: Users },
    { value: 99.9, suffix: "%", label: "Uptime", icon: Shield },
  ];

  return (
    <section className="relative bg-[#090a0c] py-20 sm:py-28 border-t border-white/5">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6 lg:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center group">
              <div className="inline-flex items-center justify-center size-12 rounded-2xl bg-white/[0.04] border border-white/10 mb-4 group-hover:border-[#9bb4ff]/40 transition-colors">
                <stat.icon className="size-5 text-[#9bb4ff]" />
              </div>
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                <CountUp to={stat.value} duration={2.5} separator="," />
                <span className="text-[#9bb4ff]">{stat.suffix}</span>
              </div>
              <p className="mt-2 text-sm text-[#95979e] font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Section 8: Activity Feed with AnimatedList
   ═══════════════════════════════════════════════════════════════════════════ */
function ActivityFeed() {
  const feedItems = [
    "🧠 Maya refined \"Growth Flywheel\" with AI Forge",
    "📌 Ravi pinned \"Q3 OKR Draft\" to Projects board",
    "✅ Alex approved \"Launch Copy v2\" in review",
    "💡 Sarah captured 3 new ideas from brainstorm",
    "🔗 Dev linked research notes to investor deck",
    "📊 Team velocity increased 34% this sprint",
    "🎯 \"Product Hunt Launch\" moved to In Progress",
    "🤖 AI generated 5 action items from meeting notes",
    "⭐ \"Customer Interview Insights\" favorited by 4 members",
    "📝 Knowledge base updated with 12 new entries",
    "🚀 Sprint 14 completed — 23/25 items shipped",
    "💬 3 new comments on \"Pricing Strategy\" idea",
  ];

  return (
    <section className="relative bg-[#0a0b0e] py-20 sm:py-28">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Description */}
          <div>
            <ScrollFloat
              containerClassName="!my-0 !mb-6"
              textClassName="!text-white font-black tracking-tight !text-left"
            >
              Your ideas, always in motion
            </ScrollFloat>
            <p className="text-[#a5a7b0] text-base sm:text-lg leading-relaxed max-w-lg">
              A living activity feed keeps your entire team in sync. Every capture, refinement, approval, and milestone flows through one calm, intelligent stream.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { icon: Zap, label: "Real-time sync", desc: "Instant updates across all devices" },
                { icon: Brain, label: "AI-powered", desc: "Smart summaries and insights" },
                { icon: Clock, label: "Timeline view", desc: "Full history at a glance" },
                { icon: Star, label: "Smart alerts", desc: "Only what matters to you" },
              ].map((feature) => (
                <div key={feature.label} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <feature.icon className="size-5 text-[#9bb4ff] mb-2" />
                  <h4 className="text-sm font-bold text-white">{feature.label}</h4>
                  <p className="text-xs text-[#95979e] mt-1">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: AnimatedList */}
          <div className="relative flex justify-center">
            <div className="relative">
              <AnimatedList
                items={feedItems}
                showGradients
                enableArrowNavigation={false}
                className="!w-full sm:!w-[440px]"
                itemClassName="!bg-[#111216] !rounded-xl border border-white/10 hover:border-[#9bb4ff]/30 transition-colors"
                displayScrollbar={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Section 9: DriftWall Showcase
   ═══════════════════════════════════════════════════════════════════════════ */
function ShowcaseWall() {
  const wallItems = [
    { image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80", title: "Dashboard" },
    { image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400&q=80", title: "Workflow" },
    { image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80", title: "Team Space" },
    { image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80", title: "Analytics" },
    { image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&q=80", title: "Notes" },
    { image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&q=80", title: "Workspace" },
    { image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80", title: "Collaborate" },
    { image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&q=80", title: "Planning" },
    { image: "https://images.unsplash.com/photo-1600267175161-cfaa711b4a81?w=400&q=80", title: "AI Studio" },
    { image: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=400&q=80", title: "Research" },
    { image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&q=80", title: "Tech" },
    { image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=400&q=80", title: "Ideas" },
    { image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&q=80", title: "Boards" },
    { image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&q=80", title: "AI" },
    { image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&q=80", title: "Creative" },
  ];

  return (
    <section className="relative bg-[#090a0c] overflow-hidden">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6 lg:px-10 pt-20 sm:pt-28 pb-6">
        <ScrollFloat
          containerClassName="!my-0"
          textClassName="!text-white font-black tracking-tight"
        >
          Trusted by thinkers worldwide
        </ScrollFloat>
      </div>

      <div className="h-[500px] sm:h-[600px] relative">
        <Suspense fallback={<div className="h-full bg-[#090a0c]" />}>
          <DriftWall
            items={wallItems}
            columns={5}
            tileWidth={200}
            tileHeight={140}
            gap={16}
            radius={16}
            tilt={16}
            turn={-14}
            perspective={1200}
            depth={120}
            speed={40}
            direction="up"
            variance={0.45}
            parallax={0.6}
            pauseOnHover={false}
            lift={64}
            fade={0.6}
            dim={0.55}
            grayscale
            overlayColor="#090a0c"
          />
        </Suspense>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Section 10: CTA Banner with TiltedCard + SpecularButton + BlurText
   ═══════════════════════════════════════════════════════════════════════════ */
function CTASection() {
  return (
    <section className="relative bg-[#090a0c] py-24 sm:py-32 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(155,180,255,0.06)_0%,transparent_60%)]" />

      <div className="relative mx-auto max-w-[1200px] px-5 sm:px-6 lg:px-10">
        <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-8 items-center">
          {/* Left TiltedCard */}
          <div className="hidden lg:flex justify-center">
            <TiltedCard
              imageSrc="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80"
              altText="IdeaForge Dashboard"
              captionText="Dashboard"
              containerHeight="320px"
              containerWidth="280px"
              imageHeight="280px"
              imageWidth="240px"
              rotateAmplitude={12}
              scaleOnHover={1.08}
              showMobileWarning={false}
              showTooltip
            />
          </div>

          {/* Center CTA */}
          <div className="text-center max-w-lg mx-auto">
            <BlurText
              text="Start forging your ideas today"
              delay={60}
              animateBy="words"
              direction="top"
              className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.1] text-white justify-center"
            />

            <p className="mt-5 text-[#a5a7b0] text-base sm:text-lg leading-relaxed">
              Join thousands of teams turning scattered thoughts into shipped products.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <SpecularButton
                  size="lg"
                  radius={28}
                  tint="#5683da"
                  tintOpacity={0.2}
                  blur={12}
                  textColor="#ffffff"
                  lineColor="#9bb4ff"
                  baseColor="#4a5568"
                  intensity={1.2}
                  autoAnimate
                  className="font-bold"
                >
                  <span className="flex items-center gap-2">
                    Get Started Free
                    <ArrowRight className="size-4" />
                  </span>
                </SpecularButton>
              </Link>
              <Link to="/explore">
                <SpecularButton
                  size="md"
                  radius={28}
                  tint="#ffffff"
                  tintOpacity={0.04}
                  blur={8}
                  textColor="#ffffff"
                  lineColor="#ffffff"
                  baseColor="#525252"
                  intensity={0.6}
                  followMouse
                  className="font-semibold"
                >
                  See a demo
                </SpecularButton>
              </Link>
            </div>
          </div>

          {/* Right TiltedCard */}
          <div className="hidden lg:flex justify-center">
            <TiltedCard
              imageSrc="https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400&q=80"
              altText="IdeaForge Kanban"
              captionText="Project Board"
              containerHeight="320px"
              containerWidth="280px"
              imageHeight="280px"
              imageWidth="240px"
              rotateAmplitude={12}
              scaleOnHover={1.08}
              showMobileWarning={false}
              showTooltip
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Main Landing Page Assembly
   ═══════════════════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <main className="bg-[#090a0c] text-white">
      {/* Section 1: Hero with LaserFlow + BlurText + Shuffle + SpecularButton */}
      <Suspense fallback={<div className="min-h-screen bg-[#090a0c]" />}>
        <Hero />
      </Suspense>

      {/* Section 2: ScrollVelocity Marquee */}
      <VelocityBand />

      {/* Section 3: ScrollExpand Cinematic Reveal */}
      <CinematicReveal />

      {/* Section 4: FlowingMenu Feature Explorer */}
      <FeatureExplorer />

      {/* Section 5: AccordionGallery Features */}
      <FeaturesShowcase />

      {/* Section 6: DepthCarousel Product Screenshots */}
      <ProductCarousel />

      {/* Section 7: Stats CountUp */}
      <StatsSection />

      {/* Section 8: AnimatedList Activity Feed */}
      <ActivityFeed />

      {/* Section 9: DriftWall Showcase */}
      <ShowcaseWall />

      {/* Section 10: CTA with TiltedCard + SpecularButton + BlurText */}
      <CTASection />
    </main>
  );
}

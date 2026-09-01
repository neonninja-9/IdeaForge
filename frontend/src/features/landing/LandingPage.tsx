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
          "Submit Ideas",
          "AI Roadmaps",
          "Tech Stacks",
          "Idea Matching",
          "Community Voting",
          "Ship Projects",
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
        src="/images/screenshots/explore.jpg"
        mediaType="image"
        alt="IdeaForge workspace"
        title="From Problem to Project in Minutes"
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
            A platform that transforms scattered real-world problems into structured, AI-enriched project ideas with roadmaps and tech stack recommendations.
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
                Start Building
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
    { link: "#explore", text: "Explore Ideas", image: "/images/screenshots/explore.jpg" },
    { link: "#ai-studio", text: "AI Studio", image: "/images/screenshots/ai-studio.jpg" },
    { link: "#roadmaps", text: "Roadmap Generator", image: "/images/screenshots/submit.jpg" },
    { link: "#matching", text: "Idea Matching", image: "/images/screenshots/landing.jpg" },
    { link: "#community", text: "Community", image: "/images/screenshots/login.jpg" },
  ];

  return (
    <section className="relative bg-[#0a0b0e]">
      <div className="mx-auto max-w-[1200px] px-5 pt-20 pb-4 sm:px-6 lg:px-10">
        <ScrollFloat
          containerClassName="!my-0"
          textClassName="!text-white font-black tracking-tight"
        >
          Explore the platform
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
      image: "/images/screenshots/dashboard.jpg",
      label: "Workspace Dashboard",
    },
    {
      image: "/images/screenshots/explore.jpg",
      label: "Community Ideas Feed",
    },
    {
      image: "/images/screenshots/ai-studio.jpg",
      label: "AI Studio & Roadmap",
    },
    {
      image: "/images/screenshots/submit.jpg",
      label: "Submit & Enforce Ideas",
    },
    {
      image: "/images/screenshots/landing.jpg",
      label: "Projects & Templates",
    },
  ];

  return (
    <section className="relative bg-[#090a0c] py-20 sm:py-28">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6 lg:px-10">
        <ScrollFloat
          containerClassName="!my-0 !mb-10"
          textClassName="!text-white font-black tracking-tight"
        >
          From problem to project, every step covered
        </ScrollFloat>

        <AccordionGallery
          items={galleryItems}
          defaultIndex={0}
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
    { image: "/images/screenshots/dashboard.jpg", alt: "IdeaForge Dashboard" },
    { image: "/images/screenshots/explore.jpg", alt: "Idea Feed" },
    { image: "/images/screenshots/ai-studio.jpg", alt: "AI Roadmap Studio" },
    { image: "/images/screenshots/submit.jpg", alt: "Submit Project Idea" },
    { image: "/images/screenshots/landing.jpg", alt: "Project Board" },
    { image: "/images/screenshots/login.jpg", alt: "Authentication" },
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
    { value: 25000, suffix: "+", label: "Ideas Submitted", icon: Lightbulb },
    { value: 8500, suffix: "+", label: "Roadmaps Generated", icon: TrendingUp },
    { value: 4200, suffix: "+", label: "Active Contributors", icon: Users },
    { value: 10, suffix: "+", label: "Real-World Domains", icon: Shield },
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
    "🧠 AI Engine generated a 9-phase roadmap for \"Smart Irrigation\"",
    "📌 Gourav submitted \"AI Crop Disease Detection\" in Agriculture",
    "✅ Community upvoted \"Traffic Prediction System\" to trending",
    "💡 3 new ideas submitted in Healthcare this hour",
    "🔗 System matched \"Smart Farming\" with 4 similar projects",
    "📊 AI suggested React, TensorFlow, MongoDB for new idea",
    "🎯 \"Student Mental Health Chatbot\" received full roadmap",
    "🤖 Auto-categorized 12 ideas into correct domains",
    "⭐ \"Open-Source Package Manager\" favorited by 28 builders",
    "📝 New tags created: Edge Computing, Federated Learning",
    "🚀 \"Smart City Parking\" moved from draft to published",
    "💬 5 new comments on \"Blockchain Voting System\" idea",
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
              The forge never stops
            </ScrollFloat>
            <p className="text-[#a5a7b0] text-base sm:text-lg leading-relaxed max-w-lg">
              A living activity feed tracks every submission, AI enrichment, community vote, and milestone across the entire platform — keeping builders informed and inspired.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { icon: Zap, label: "Real-time feed", desc: "Instant updates on new ideas" },
                { icon: Brain, label: "AI enrichment", desc: "Auto roadmaps & tech stacks" },
                { icon: Clock, label: "Idea timeline", desc: "Full history at a glance" },
                { icon: Star, label: "Smart matching", desc: "Find similar projects" },
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
    { image: "/images/screenshots/explore.jpg", title: "Idea Feed" },
    { image: "/images/screenshots/submit.jpg", title: "Project Board" },
    { image: "/images/screenshots/login.jpg", title: "Community" },
    { image: "/images/screenshots/ai-studio.jpg", title: "AI Roadmap" },
    { image: "/images/screenshots/explore.jpg", title: "Idea Detail" },
    { image: "/images/screenshots/submit.jpg", title: "Submit Flow" },
    { image: "/images/screenshots/login.jpg", title: "Contributors" },
    { image: "/images/screenshots/landing.jpg", title: "Domain Categories" },
    { image: "/images/screenshots/ai-studio.jpg", title: "AI Studio" },
    { image: "/images/screenshots/explore.jpg", title: "Idea Matching" },
    { image: "/images/screenshots/submit.jpg", title: "Tech Stacks" },
    { image: "/images/screenshots/ai-studio.jpg", title: "Brainstorm" },
    { image: "/images/screenshots/explore.jpg", title: "Roadmaps" },
    { image: "/images/screenshots/ai-studio.jpg", title: "AI Engine" },
    { image: "/images/screenshots/landing.jpg", title: "Innovation" },
  ];

  return (
    <section className="relative bg-[#090a0c] overflow-hidden">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6 lg:px-10 pt-20 sm:pt-28 pb-6">
        <ScrollFloat
          containerClassName="!my-0"
          textClassName="!text-white font-black tracking-tight"
        >
          Built by innovators, for innovators
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
              imageSrc="/images/screenshots/explore.jpg"
              altText="IdeaForge Idea Feed"
              captionText="Idea Feed"
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
              text="Start forging your next big idea"
              delay={60}
              animateBy="words"
              direction="top"
              className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.1] text-white justify-center"
            />

            <p className="mt-5 text-[#a5a7b0] text-base sm:text-lg leading-relaxed">
              Join thousands of developers, students, and researchers turning real-world problems into actionable projects with AI-powered roadmaps.
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
                    Submit an Idea
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
                  Explore Projects
                </SpecularButton>
              </Link>
            </div>
          </div>

          {/* Right TiltedCard */}
          <div className="hidden lg:flex justify-center">
            <TiltedCard
              imageSrc="/images/screenshots/ai-studio.jpg"
              altText="IdeaForge AI Roadmap"
              captionText="AI Roadmap"
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

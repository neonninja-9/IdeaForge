"use client";

import { ArrowRight, Bot, CircleDot, GitBranch, Lightbulb, MessageSquare, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import LaserFlow from "../../../@/components/LaserFlow";
import BlurText from "./effects/blurText";
import Shuffle from "./effects/suffle-text";
import SpecularButton from "./effects/specularButton";

const issues = [
  { title: "Cluster onboarding notes", tag: "Research", tone: "iris", progress: "72%" },
  { title: "Draft investor narrative", tag: "Pitch", tone: "ember", progress: "58%" },
  { title: "Map competitor signals", tag: "Strategy", tone: "ash", progress: "34%" },
];

function ProductFrame() {
  return (
    <div className="relative z-20 mx-auto w-full max-w-5xl rounded-[28px] border-2 border-[#9bb4ff]/50 bg-[#0c0d12] shadow-[0_-15px_60px_-10px_rgba(155,180,255,0.35),0_30px_90px_-15px_rgba(0,0,0,0.9)] overflow-hidden transition-all duration-300">
      {/* Top contact laser flare */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 sm:w-96 h-2.5 bg-gradient-to-r from-transparent via-white to-transparent blur-[1px] rounded-full z-30" />
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 h-6 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,1)_0%,rgba(155,180,255,0.7)_45%,transparent_80%)] blur-sm z-30" />
      <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 w-[380px] h-20 bg-[radial-gradient(ellipse_at_center,rgba(155,180,255,0.35)_0%,rgba(86,131,218,0.12)_50%,transparent_75%)] blur-2xl z-20" />

      {/* Subtle card dot grid */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none opacity-60" />

      {/* Product Content */}
      <div className="relative z-10 flex h-[440px] text-white">
        {/* Left Sidebar */}
        <aside className="hidden w-48 shrink-0 border-r border-white/10 bg-[#08090c]/90 p-4 md:flex md:flex-col justify-between backdrop-blur-sm">
          <div>
            <div className="mb-6 flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-[#5683da] to-[#7b5fea] shadow-sm">
                <Sparkles className="size-4 text-white" />
              </span>
              <span className="text-sm font-bold tracking-tight">IdeaForge</span>
            </div>
            {["Capture", "Forge", "Projects", "Knowledge"].map((item, index) => (
              <div
                key={item}
                className={`mb-1.5 flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                  index === 1
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-[#95979e] hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <CircleDot className={`size-3 ${index === 1 ? "text-[#9bb4ff]" : "text-[#95979e]"}`} />
                {item}
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111216]/90 p-3.5">
            <p className="text-[10px] uppercase font-semibold tracking-wider text-[#95979e]">Forge score</p>
            <p className="mt-1 text-3xl font-black tracking-tight text-white">86</p>
            <div className="mt-2.5 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-[#ff8964] to-[#ffa585]" />
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="min-w-0 flex-1 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-[#95979e] font-medium">Workspace / Launch narrative</p>
                <h3 className="mt-0.5 text-xl font-bold tracking-tight text-white">Issues</h3>
              </div>
              <div className="flex -space-x-2">
                {["AN", "GK", "PR"].map((avatar) => (
                  <span
                    key={avatar}
                    className="grid size-8 place-items-center rounded-full border-2 border-[#0c0d12] bg-[#2a2c33] text-[10px] font-bold text-slate-200 shadow-sm"
                  >
                    {avatar}
                  </span>
                ))}
              </div>
            </div>

            {/* Kanban Columns */}
            <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_220px]">
              {["Backlog", "To do", "In progress"].map((column, columnIndex) => (
                <section key={column} className="rounded-xl border border-white/10 bg-black/40 p-3 backdrop-blur-xs">
                  <div className="mb-3 flex items-center justify-between text-[11px] font-semibold text-[#95979e]">
                    <span>{column}</span>
                    <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] text-slate-300">
                      {columnIndex + 2}
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {issues.map((issue, index) => (
                      <article
                        key={`${column}-${issue.title}`}
                        className={`rounded-xl border border-white/10 bg-[#14151a] p-3 transition-all ${
                          index === columnIndex
                            ? "opacity-100 ring-1 ring-[#9bb4ff]/30 shadow-md"
                            : "opacity-60"
                        }`}
                      >
                        <p className="text-xs font-semibold leading-snug text-slate-100">{issue.title}</p>
                        <div className="mt-2.5 flex items-center justify-between gap-2">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                              issue.tone === "iris"
                                ? "bg-[#5683da]/20 text-[#9bb4ff]"
                                : issue.tone === "ember"
                                ? "bg-[#ff8964]/20 text-[#ffb197]"
                                : "bg-white/10 text-[#a9a9aa]"
                            }`}
                          >
                            {issue.tag}
                          </span>
                          <span className="text-[10px] font-medium text-[#95979e]">{issue.progress}</span>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              ))}

              {/* Inbox Panel */}
              <aside className="hidden rounded-xl border border-white/10 bg-[#08090c]/80 p-3 lg:block backdrop-blur-xs">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Inbox</h4>
                  <MessageSquare className="size-3.5 text-[#95979e]" />
                </div>
                {[
                  ["Maya", "mentioned you in launch notes"],
                  ["Ravi", "approved the story arc"],
                  ["Alex", "added a new insight tag"],
                ].map(([name, text]) => (
                  <div key={name} className="mb-2.5 rounded-xl bg-white/[0.04] p-2.5 border border-white/5">
                    <p className="text-xs font-semibold text-slate-200">{name}</p>
                    <p className="mt-0.5 text-[11px] leading-snug text-[#a9a9aa]">{text}</p>
                  </div>
                ))}
              </aside>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-[960px] overflow-hidden bg-[#090a0c] px-5 pb-20 pt-28 text-white sm:px-6 lg:px-10">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(155,180,255,0.08),transparent_50%),radial-gradient(circle_at_50%_50%,rgba(86,131,218,0.12),transparent_40%)]" />

      <div className="relative mx-auto max-w-[1200px]">
        {/* ── Top Centered Hero Header ── */}
        <div className="relative z-30 max-w-3xl mx-auto text-center pt-6 sm:pt-12 pb-6 sm:pb-8">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-[#d1d1d1] backdrop-blur-md">
            <span className="size-2 rounded-full bg-[#ff8964] shadow-[0_0_18px_rgba(255,137,100,0.9)] animate-pulse" />
            Idea workspace for fast-moving teams
          </p>

          {/* BlurText animated headline */}
          <BlurText
            text="Everything App for your ideas"
            delay={80}
            animateBy="words"
            direction="top"
            className="text-5xl font-black tracking-tight leading-[1.08] text-white sm:text-6xl lg:text-7xl justify-center"
          />

          {/* Shuffle animated subtitle */}
          <div className="mt-5 max-w-xl mx-auto">
            <Shuffle
              text="Capture notes, shape them with AI, and move every promising thought through a calm, intelligent project workspace."
              className="!text-base !sm:text-lg !leading-relaxed !text-[#a5a7b0] !normal-case !tracking-normal"
              tag="p"
              textAlign="center"
              shuffleDirection="up"
              duration={0.5}
              stagger={0.02}
              triggerOnHover={false}
            />
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
                  See in action
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
                Explore ideas
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
              ["Team planner", GitBranch],
              ["AI forge", Bot],
              ["Idea graph", Lightbulb],
              ["Documents", MessageSquare],
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

"use client";

import { ArrowRight, Bot, CircleDot, GitBranch, Lightbulb, MessageSquare, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import LaserFlow from "../../../@/components/LaserFlow";

const issues = [
  { title: "Cluster onboarding notes", tag: "Research", tone: "iris", progress: "72%" },
  { title: "Draft investor narrative", tag: "Pitch", tone: "ember", progress: "58%" },
  { title: "Map competitor signals", tag: "Strategy", tone: "ash", progress: "34%" },
];

function ProductFrame() {
  return (
    <div className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-xl border border-[#4a4b50]/70 bg-[#0d0e11] shadow-[rgba(0,0,0,0.5)_0_6px_25px_0]">
      <div className="flex h-[430px] text-white">
        <aside className="hidden w-48 shrink-0 border-r border-white/10 bg-[#090a0c] p-4 md:block">
          <div className="mb-8 flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-[#5683da]">
              <Sparkles className="size-4" />
            </span>
            <span className="text-sm font-semibold">IdeaForge</span>
          </div>
          {["Capture", "Forge", "Projects", "Knowledge"].map((item, index) => (
            <div
              key={item}
              className={`mb-2 flex items-center gap-3 rounded-full px-3 py-2 text-xs ${index === 1 ? "bg-white/10 text-white" : "text-[#95979e]"
                }`}
            >
              <CircleDot className="size-3" />
              {item}
            </div>
          ))}
          <div className="mt-10 rounded-[30px] border border-[#4a4b50] bg-[#111111] p-4">
            <p className="text-[11px] text-[#95979e]">Forge score</p>
            <p className="mt-2 text-4xl font-black">86</p>
            <div className="mt-3 h-1.5 rounded-full bg-white/10">
              <div className="h-full w-4/5 rounded-full bg-[#ff8964]" />
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 p-4 sm:p-5">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-[#95979e]">Workspace / Launch narrative</p>
              <h3 className="mt-1 text-xl font-semibold">Issues</h3>
            </div>
            <div className="flex -space-x-2">
              {["AN", "GK", "PR"].map((avatar) => (
                <span key={avatar} className="grid size-8 place-items-center rounded-full border border-[#111111] bg-[#303236] text-[10px] font-semibold">
                  {avatar}
                </span>
              ))}
            </div>
          </div>

          <div className="grid h-[335px] gap-3 md:grid-cols-[1fr_1fr_1fr_240px]">
            {["Backlog", "To do", "In progress"].map((column, columnIndex) => (
              <section key={column} className="rounded-xl border border-white/10 bg-black/20 p-3">
                <div className="mb-4 flex items-center justify-between text-[11px] text-[#95979e]">
                  <span>{column}</span>
                  <span>{columnIndex + 2}</span>
                </div>
                <div className="space-y-3">
                  {issues.map((issue, index) => (
                    <article
                      key={`${column}-${issue.title}`}
                      className={`rounded-xl border border-white/10 bg-[#111111] p-3 ${index === columnIndex ? "opacity-100" : "opacity-55"
                        }`}
                    >
                      <p className="text-sm font-medium leading-snug">{issue.title}</p>
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <span
                          className={`rounded-full px-2 py-1 text-[11px] ${issue.tone === "iris"
                            ? "bg-[#5683da]/15 text-[#8fb0ef]"
                            : issue.tone === "ember"
                              ? "bg-[#ff8964]/15 text-[#ffb197]"
                              : "bg-white/10 text-[#a9a9aa]"
                            }`}
                        >
                          {issue.tag}
                        </span>
                        <span className="text-[11px] text-[#95979e]">{issue.progress}</span>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}

            <aside className="hidden rounded-xl border border-white/10 bg-[#090a0c]/80 p-3 lg:block">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-sm font-semibold">Inbox</h4>
                <MessageSquare className="size-4 text-[#95979e]" />
              </div>
              {[
                ["Maya", "mentioned you in launch notes"],
                ["Ravi", "approved the story arc"],
                ["Alex", "added a new insight tag"],
              ].map(([name, text]) => (
                <div key={name} className="mb-3 rounded-xl bg-white/[0.04] p-3">
                  <p className="text-xs font-medium">{name}</p>
                  <p className="mt-1 text-[11px] leading-snug text-[#a9a9aa]">{text}</p>
                </div>
              ))}
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-[900px] overflow-hidden bg-[#090a0c] px-5 pb-10 pt-28 text-white sm:px-6 lg:px-10">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_68%_82%,rgba(255,137,100,0.24),transparent_23%),radial-gradient(circle_at_66%_50%,rgba(86,131,218,0.34),transparent_32%)]" />
      <div className="pointer-events-none absolute right-[-8%] top-0 z-0 h-[980px] w-[82%] opacity-100 mix-blend-screen brightness-150 lg:h-[1040px]">
        <LaserFlow
          color="#9bb4ff"
          horizontalBeamOffset={-0.06}
          verticalBeamOffset={0.00}
          verticalSizing={3.35}
          horizontalSizing={2}
          fogIntensity={0.72}
          fogScale={0.25}
          wispDensity={1.25}
          wispIntensity={6}
          flowSpeed={0.32}
          mouseTiltStrength={0.02}
        />
      </div>
      <div className="absolute inset-0 z-10 bg-[linear-gradient(90deg,#090a0c_0%,rgba(9,10,12,0.88)_36%,rgba(9,10,12,0.2)_76%),linear-gradient(180deg,rgba(9,10,12,0)_58%,#090a0c_93%)]" />
      <div className="pointer-events-none absolute left-[52%] top-[240px] z-20 h-[470px] w-[680px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(214,225,255,0.42)_0%,rgba(119,151,255,0.28)_24%,rgba(86,131,218,0.14)_48%,transparent_74%)] opacity-90 blur-3xl mix-blend-screen" />

      <div className="relative mx-auto max-w-[1200px]">
        <div className="relative z-30 max-w-[720px] pt-12 sm:pt-20">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-[#d1d1d1]">
            <span className="size-2 rounded-full bg-[#ff8964] shadow-[0_0_18px_rgba(255,137,100,0.9)]" />
            Idea workspace for fast-moving teams
          </p>

          <h1 className="text-6xl font-black leading-none text-white sm:text-7xl lg:text-[80px]">
            Everything App
            <br />
            for your ideas
          </h1>

          <p className="mt-6 max-w-md text-base leading-6 text-[#d1d1d1]">
            Capture notes, shape them with AI, and move every promising thought
            through a calm project workspace.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-[#090a0c] transition hover:shadow-[0_0_28px_rgba(255,137,100,0.65)]"
            >
              See in action
              <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/explore"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 px-6 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Explore ideas
            </Link>
          </div>
        </div>

        <div className="relative z-10 mt-20 lg:mt-24">
          <ProductFrame />

          <div className="pointer-events-none absolute -inset-x-14 -top-24 z-20 h-56 rounded-[999px] bg-[radial-gradient(ellipse_at_center,rgba(232,238,255,0.48)_0%,rgba(143,172,255,0.26)_34%,rgba(86,131,218,0.16)_56%,transparent_76%)] blur-2xl mix-blend-screen" />
          <div className="pointer-events-none absolute -left-12 top-0 z-20 h-[430px] w-36 bg-[linear-gradient(90deg,rgba(117,151,255,0.22),transparent)] blur-2xl mix-blend-screen" />
          <div className="pointer-events-none absolute -right-12 top-0 z-20 h-[430px] w-36 bg-[linear-gradient(270deg,rgba(117,151,255,0.22),transparent)] blur-2xl mix-blend-screen" />
          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-sm text-[#d1d1d1]">
            {[
              ["Team planner", GitBranch],
              ["AI forge", Bot],
              ["Idea graph", Lightbulb],
              ["Documents", MessageSquare],
            ].map(([label, Icon]) => (
              <span key={label as string} className="inline-flex items-center gap-2">
                <Icon className="size-4 text-[#5683da]" />
                {label as string}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

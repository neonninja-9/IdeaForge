"use client";

import { ArrowRight, CheckCircle2, GitBranch, Search, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const rows = [
  ["IF-128", "Refine launch thesis", "In progress", "Strategy"],
  ["IF-141", "Pull customer quotes", "Review", "Research"],
  ["IF-156", "Create pitch outline", "Done", "Pitch"],
];

export default function SocialProof() {
  return (
    <section className="overflow-hidden bg-[#111111] px-5 py-24 text-white sm:px-6 sm:py-32 lg:px-10">
      <div className="mx-auto max-w-[1200px]">
        <div className="max-w-xl">
          <h2 className="text-5xl font-black leading-none sm:text-6xl">
            Sync with GitHub.
            <br />
            Both ways.
          </h2>
          <p className="mt-5 text-sm leading-6 text-[#a9a9aa]">
            Manage build work from IdeaForge while preserving the shape of your
            product backlog. Issues, decisions, and research stay connected.
          </p>
        </div>

        <div className="relative mt-16">
          <div className="absolute -left-12 -top-10 size-64 rounded-full bg-[#ff8964]/25 blur-3xl" />
          <div className="absolute right-0 top-12 size-72 rounded-full bg-[#5683da]/20 blur-3xl" />

          <div className="relative overflow-hidden rounded-xl border border-[#4a4b50] bg-[#090a0c] shadow-[rgba(0,0,0,0.5)_0_6px_25px_0]">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-lg bg-white text-[#090a0c]">
                  <GitBranch className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">acme-project / idea-api</p>
                  <p className="text-xs text-[#95979e]">Connected 2 minutes ago</p>
                </div>
              </div>
              <div className="hidden items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs text-[#a9a9aa] sm:flex">
                <Search className="size-3.5" />
                Type / to search
              </div>
            </div>

            <div className="grid lg:grid-cols-[1fr_320px]">
              <div className="p-4 sm:p-6">
                <div className="mb-4 grid grid-cols-[80px_1fr_110px_100px] gap-4 text-xs text-[#95979e]">
                  <span>ID</span>
                  <span>Issue</span>
                  <span>Status</span>
                  <span>Label</span>
                </div>
                {rows.map((row) => (
                  <div
                    key={row[0]}
                    className="mb-3 grid grid-cols-[80px_1fr] gap-4 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm md:grid-cols-[80px_1fr_110px_100px]"
                  >
                    <span className="text-[#95979e]">{row[0]}</span>
                    <span className="font-medium">{row[1]}</span>
                    <span className="hidden text-[#d1d1d1] md:block">{row[2]}</span>
                    <span className="hidden rounded-full bg-[#5683da]/15 px-2 py-1 text-center text-xs text-[#8fb0ef] md:block">
                      {row[3]}
                    </span>
                  </div>
                ))}
              </div>

              <aside className="border-t border-white/10 bg-[#111111] p-5 lg:border-l lg:border-t-0">
                <div className="mb-5 flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-full bg-[#5683da]/20 text-[#8fb0ef]">
                    <GitBranch className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">Sync health</p>
                    <p className="text-xs text-[#95979e]">All systems current</p>
                  </div>
                </div>
                {["GitHub issue created", "Idea brief linked", "Owner assigned"].map((item) => (
                  <div key={item} className="mb-3 flex items-center gap-3 rounded-xl bg-white/[0.04] p-3 text-sm">
                    <CheckCircle2 className="size-4 text-[#ff8964]" />
                    {item}
                  </div>
                ))}
                <Link
                  to="/register"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#5683da] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6f98ee]"
                >
                  Connect workflow
                  <ArrowRight className="size-4" />
                </Link>
              </aside>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-3 text-sm text-[#a9a9aa]">
            <Sparkles className="size-4 text-[#ff8964]" />
            Bi-directional updates keep ideas and implementation in lockstep.
          </div>
        </div>
      </div>
    </section>
  );
}

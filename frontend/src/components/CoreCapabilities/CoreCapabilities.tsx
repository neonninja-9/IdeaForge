"use client";

import { CalendarDays, Command, FileText, PanelTop, Search, Users } from "lucide-react";

const productCards = [
  {
    title: "Command center.",
    body: "Find, sort, and turn raw notes into next actions.",
    large: false,
    accent: "iris",
  },
  {
    title: "Daily plan.",
    body: "Keep promising ideas attached to time blocks and owners.",
    large: true,
    accent: "ember",
  },
  {
    title: "Knowledge base.",
    body: "Documents stay connected to projects, tasks, and decisions.",
    large: false,
    accent: "iris",
  },
  {
    title: "Live inbox.",
    body: "Mentions, approvals, and idea updates arrive in one calm feed.",
    large: false,
    accent: "ember",
  },
];

const features = [
  {
    icon: PanelTop,
    title: "Customize workspace",
    description: "Shape projects, lists, and idea rooms around each team.",
  },
  {
    icon: Users,
    title: "Collaborate live",
    description: "Work with founders, designers, and operators in one flow.",
  },
  {
    icon: FileText,
    title: "Publish assets",
    description: "Turn structured thinking into docs, decks, and briefs.",
  },
];

function MiniProductCard({ card }: { card: (typeof productCards)[number] }) {
  return (
    <article
      className={`relative overflow-hidden rounded-xl border border-[#4a4b50] bg-[#111111] p-5 text-white ${
        card.large ? "md:col-span-2" : ""
      }`}
    >
      <div
        className={`absolute -right-16 -top-16 size-48 rounded-full blur-3xl ${
          card.accent === "iris" ? "bg-[#5683da]/25" : "bg-[#ff8964]/25"
        }`}
      />
      <div className="relative min-h-52">
        <p className="text-sm leading-6 text-[#a9a9aa]">
          <span className="font-semibold text-white">{card.title}</span>{" "}
          {card.body}
        </p>
        <div className="mt-8 rounded-xl border border-white/10 bg-[#090a0c]/80 p-4">
          {card.large ? (
            <div className="grid gap-3 sm:grid-cols-3">
              {["Today", "Review", "Ship"].map((column, index) => (
                <div key={column} className="rounded-lg bg-white/[0.04] p-3">
                  <div className="mb-3 flex items-center justify-between text-[11px] text-[#95979e]">
                    <span>{column}</span>
                    <span>{index + 2}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-16 rounded-lg bg-white/[0.07]" />
                    <div className="h-10 rounded-lg bg-white/[0.04]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {[0, 1, 2].map((row) => (
                <div key={row} className="flex items-center gap-3 rounded-lg bg-white/[0.05] p-3">
                  <span className={`size-2 rounded-full ${row === 1 ? "bg-[#ff8964]" : "bg-[#5683da]"}`} />
                  <span className="h-2 flex-1 rounded-full bg-white/15" />
                  <span className="h-2 w-10 rounded-full bg-white/10" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default function CoreCapabilities() {
  return (
    <section id="product" className="bg-white px-5 py-24 text-[#050506] sm:px-6 sm:py-32 lg:px-10">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-12 max-w-5xl">
          <h2 className="text-5xl font-black leading-none sm:text-6xl lg:text-[64px]">
            Unmatched productivity
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-6 text-[#303236]">
            IdeaForge is a process, project, and knowledge workspace that gives
            teams one place to capture signals, structure thinking, and ship the
            next version.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {productCards.map((card) => (
            <MiniProductCard key={card.title} card={card} />
          ))}
        </div>

        <div className="mt-24 grid gap-10 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title}>
              <feature.icon className="mb-5 size-8 text-[#5683da]" />
              <h3 className="text-2xl font-semibold leading-7">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#303236]">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 grid overflow-hidden rounded-xl border border-[#d1d1d1] bg-[#f6f6f6] md:grid-cols-[0.85fr_1.15fr]">
          <div className="p-6 sm:p-8">
            <Command className="mb-8 size-8 text-[#ff8964]" />
            <h3 className="text-4xl font-black leading-none">Run command.</h3>
            <p className="mt-4 text-sm leading-6 text-[#303236]">
              Search every idea, generate a next step, assign the owner, and
              keep the full context attached.
            </p>
          </div>
          <div className="border-t border-[#d1d1d1] bg-[#111111] p-4 md:border-l md:border-t-0">
            <div className="rounded-xl border border-white/10 bg-[#090a0c] p-4 text-white">
              <div className="mb-4 flex items-center gap-3 rounded-lg bg-white/[0.06] px-4 py-3 text-sm text-[#a9a9aa]">
                <Search className="size-4" />
                Run command...
              </div>
              {["Mark task as done", "Open AI forge", "Switch to timeline view", "Create launch brief"].map((item) => (
                <div key={item} className="flex items-center justify-between border-t border-white/10 py-3 text-sm">
                  <span>{item}</span>
                  <CalendarDays className="size-4 text-[#95979e]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

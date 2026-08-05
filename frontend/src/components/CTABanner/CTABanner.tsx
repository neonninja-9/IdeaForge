"use client";

import { ArrowRight, Mic, Plus, Send, Workflow } from "lucide-react";
import { Link } from "react-router-dom";

const metabrainCards = [
  {
    title: "Create tasks.",
    body: "Schedule personal events and todos.",
    className: "md:col-span-2",
  },
  {
    title: "Plan your work.",
    body: "Visualize your day in your planner.",
    className: "",
  },
  {
    title: "Chat with team.",
    body: "Send DM and create group chats.",
    className: "",
  },
  {
    title: "Take notes.",
    body: "Create documents to keep team resources.",
    className: "",
  },
  {
    title: "Sync in real time.",
    body: "Monitor progress and track updates.",
    className: "md:col-span-2",
  },
  {
    title: "Manage projects.",
    body: "Customize your workspace around goals.",
    className: "md:col-span-2",
  },
];

function MetaTile({ card, index }: { card: (typeof metabrainCards)[number]; index: number }) {
  return (
    <article className={`relative min-h-44 overflow-hidden rounded-xl bg-[#111111] p-5 text-white ${card.className}`}>
      <div
        className={`absolute -bottom-12 size-48 rounded-full blur-3xl ${
          index % 2 === 0 ? "left-0 bg-[#5683da]/30" : "right-0 bg-[#ff8964]/25"
        }`}
      />
      <div className="relative">
        <p className="text-sm leading-6 text-[#a9a9aa]">
          <span className="font-semibold text-white">{card.title}</span>{" "}
          {card.body}
        </p>
        <div className="mt-8 rounded-xl border border-white/10 bg-[#090a0c]/70 p-4">
          {index === 4 ? (
            <div className="flex items-center justify-center gap-5">
              {["AN", "MG", "RT"].map((avatar) => (
                <span key={avatar} className="grid size-11 place-items-center rounded-full bg-white/10 text-xs font-semibold">
                  {avatar}
                </span>
              ))}
              <span className="grid size-16 place-items-center rounded-full bg-[#5683da]/25 text-[#dbe6ff]">
                <Mic className="size-7" />
              </span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="h-3 w-2/3 rounded-full bg-white/15" />
              <div className="h-3 w-1/2 rounded-full bg-white/10" />
              <div className="h-9 rounded-lg bg-white/[0.06]" />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default function CTABanner() {
  return (
    <section id="metabrain" className="bg-[#f6f6f6] px-5 py-24 text-[#050506] sm:px-6 sm:py-32 lg:px-10">
      <div className="mx-auto max-w-[1200px]">
        <div className="mx-auto mb-12 max-w-2xl text-center md:text-left">
          <h2 className="text-5xl font-black leading-none sm:text-6xl">
            IdeaForge MetaBrain
          </h2>
          <p className="mt-5 text-base leading-6 text-[#303236]">
            Connect every element of your workflow to build a dynamic knowledge
            base. Soon, IdeaForge AI turns it into a second brain for your team.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {metabrainCards.map((card, index) => (
            <MetaTile key={card.title} card={card} index={index} />
          ))}
          <div className="grid min-h-44 place-items-center rounded-full bg-[#111111] text-white">
            <div className="text-center">
              <p className="text-7xl font-black leading-none">08</p>
              <p className="mt-1 text-[#d1d1d1]">March</p>
              <button className="mt-4 inline-grid size-12 place-items-center rounded-full border border-white/25 text-white">
                <Plus className="size-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 rounded-[30px] bg-[#090a0c] p-6 text-white sm:p-8 md:flex md:items-center md:justify-between">
          <div className="max-w-xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm text-[#d1d1d1]">
              <Workflow className="size-4 text-[#ff8964]" />
              Start with one idea
            </div>
            <h3 className="text-4xl font-black leading-none">Build the workspace your thoughts deserve.</h3>
          </div>
          <Link
            to="/register"
            className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#5683da] px-6 text-sm font-semibold text-white transition hover:bg-[#6f98ee] md:mt-0"
          >
            Start building
            <Send className="size-4" />
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

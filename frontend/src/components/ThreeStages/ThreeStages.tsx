"use client";

import { Blocks, MonitorPlay, UserPlus } from "lucide-react";

const officeFeatures = [
  {
    icon: Blocks,
    title: "Capture workspace",
    description: "Create rooms for strategy, research, pitch prep, and product discovery.",
  },
  {
    icon: MonitorPlay,
    title: "Async reviews",
    description: "Discuss every draft and decision without losing the original context.",
  },
  {
    icon: UserPlus,
    title: "Invite guests",
    description: "Bring collaborators into a specific project without exposing the rest.",
  },
];

export default function ThreeStages() {
  return (
    <section id="workflow" className="bg-white px-5 pb-28 pt-8 text-[#050506] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1200px]">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-5xl font-black leading-none sm:text-6xl">
            Work together.
            <br />
            Like in the office.
          </h2>
          <p className="mt-5 text-base leading-6 text-[#303236]">
            Create customized idea spaces for any department, launch, or client
            sprint with shared context and high-signal collaboration.
          </p>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-3">
          {officeFeatures.map((feature) => (
            <article key={feature.title} className="mx-auto max-w-[260px] text-center md:text-left">
              <feature.icon className="mx-auto mb-5 size-9 text-[#5683da] md:mx-0" />
              <h3 className="text-2xl font-semibold leading-7">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#303236]">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

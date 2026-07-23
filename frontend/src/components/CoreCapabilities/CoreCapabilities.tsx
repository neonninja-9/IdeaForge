"use client";

import { useEffect, useRef, useState } from "react";

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "Idea Capture Canvas",
    description: "A distraction-free zone where multi-modal inputs converge into a single source of truth.",
    accent: "group-hover:bg-vivid",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "AI Story Scaffold",
    description: "Automatically generate narrative structures that connect abstract concepts into compelling arcs.",
    accent: "group-hover:bg-orange-500",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    title: "Versioned Prototypes",
    description: "Track every iteration of your thought process with granular snapshots and side-by-side diffs.",
    accent: "group-hover:bg-teal-500",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
    title: "Exportable Pitch Decks",
    description: "Convert your forge projects into production-ready presentations with a single click.",
    accent: "group-hover:bg-blue-500",
  },
];

export default function CoreCapabilities() {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.05, rootMargin: "50px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} id="capabilities" className="py-20 sm:py-28 lg:py-36 px-5 sm:px-6 lg:px-10 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className={`mb-12 sm:mb-20 transition-all duration-700 ${inView ? "translate-y-0" : "translate-y-6"}`}>
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-vivid mb-4">
            Core Capabilities
          </p>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-normal leading-[1.05] text-fg">
            The architecture
            <br />
            of insight.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {features.map((feature, i) => (
            <div
              key={i}
              className={`group relative bg-surface-alt rounded-2xl p-6 sm:p-7 border border-transparent hover:border-edge hover:shadow-xl transition-all duration-500 cursor-default ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: inView ? `${200 + i * 120}ms` : "0ms" }}
            >
              <div className={`w-12 h-12 rounded-xl bg-edge flex items-center justify-center text-fg-mid mb-6 transition-all duration-500 ${feature.accent} group-hover:text-white group-hover:scale-110`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold mb-2 text-fg">{feature.title}</h3>
              <p className="text-sm text-fg-mid leading-relaxed">{feature.description}</p>
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-vivid/5 to-transparent rounded-br-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

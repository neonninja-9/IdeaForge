"use client";

import { useEffect, useRef, useState } from "react";

const stages = [
  { number: "01", title: "Capture", description: "Dump raw notes, links, and voice memos. No organization required initially." },
  { number: "02", title: "Forge", description: "Our engine identifies connections, suggests structures, and polishes the narrative." },
  { number: "03", title: "Ship", description: "Deploy your ideas as decks, whitepapers, or interactive prototypes instantly." },
];

export default function ThreeStages() {
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
    <section ref={ref} id="workflow" className="py-20 sm:py-28 lg:py-36 px-5 sm:px-6 lg:px-10 bg-surface-dark text-white">
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-12 sm:mb-24 transition-all duration-700 ${inView ? "translate-y-0" : "translate-y-6"}`}>
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-vivid-light mb-4">
            The Workflow
          </p>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-normal leading-[1.05] text-white">
            Three stages
            <br />
            to impact.
          </h2>
        </div>

        <div className="grid gap-2 md:grid-cols-3 md:gap-0">
          {stages.map((stage, i) => (
            <div
              key={i}
              className={`relative flex flex-col items-center text-center px-5 py-8 sm:px-8 sm:py-10 transition-all duration-700 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-14"
              } ${i < stages.length - 1 ? "border-b border-white/10 md:border-b-0 md:border-r" : ""}`}
              style={{ transitionDelay: inView ? `${200 + i * 200}ms` : "0ms" }}
            >
              <div className="relative mb-8">
                <div className="w-20 h-20 rounded-full border border-white/20 flex items-center justify-center text-2xl font-black text-vivid-light bg-surface-dark-card transition-all duration-500 hover:bg-vivid hover:text-white hover:border-vivid hover:scale-110 cursor-default">
                  {stage.number}
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">{stage.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed max-w-xs">{stage.description}</p>
            </div>
          ))}
        </div>

        <div className={`mt-16 max-w-xl mx-auto transition-all duration-1000 ${inView ? "opacity-100" : "opacity-0"}`} style={{ transitionDelay: "800ms" }}>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-vivid via-vivid-light to-purple-300 rounded-full transition-all duration-[2000ms] ease-out"
              style={{ width: inView ? "100%" : "0%", transitionDelay: "1000ms" }}
            />
          </div>
          <div className="flex justify-between mt-3 text-[10px] font-mono uppercase tracking-[0.2em] text-white/30">
            <span>Input</span>
            <span>Output</span>
          </div>
        </div>
      </div>
    </section>
  );
}

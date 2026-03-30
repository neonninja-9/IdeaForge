"use client";

import { useEffect, useRef, useState } from "react";

export default function CTABanner() {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.1, rootMargin: "50px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-20 px-6 lg:px-10 bg-white">
      <div
        className={`max-w-6xl mx-auto relative overflow-hidden rounded-3xl bg-surface-dark text-white p-14 md:p-20 text-center transition-all duration-1000 ${
          inView ? "opacity-100 scale-100" : "opacity-90 scale-[0.97]"
        }`}
      >
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-vivid/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-vivid-light/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

        <h2 className="relative text-3xl md:text-5xl lg:text-6xl font-black tracking-[-0.02em] leading-[1.1] mb-5 text-white">
          Your next big idea
          <br />
          deserves a proper{" "}
          <span className="bg-gradient-to-r from-vivid-light via-purple-300 to-pink-300 bg-clip-text text-transparent">
            forge.
          </span>
        </h2>
        <p className="relative text-white/50 text-base md:text-lg max-w-xl mx-auto mb-12 leading-relaxed">
          Stop letting your thoughts evaporate. Give them the structure they
          need to survive the market.
        </p>
        <div className="relative flex flex-wrap justify-center gap-4">
          <button className="px-8 py-4 text-sm font-semibold uppercase tracking-[0.12em] rounded-full bg-white text-fg hover:bg-vivid hover:text-white transition-all duration-300 cursor-pointer hover:shadow-[0_0_40px_rgba(108,60,224,0.3)]">
            Start Building Free
          </button>
          <button className="px-8 py-4 text-sm font-semibold uppercase tracking-[0.12em] rounded-full border border-white/20 text-white/60 hover:border-vivid-light hover:text-vivid-light transition-all duration-300 cursor-pointer">
            Talk to Strategy
          </button>
        </div>
      </div>
    </section>
  );
}

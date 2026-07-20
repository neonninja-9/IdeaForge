"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

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
    <section ref={ref} className="py-16 sm:py-20 px-5 sm:px-6 lg:px-10 bg-white">
      <div
        className={`max-w-6xl mx-auto relative overflow-hidden rounded-2xl sm:rounded-3xl bg-surface-dark text-white px-5 py-12 sm:p-14 md:p-20 text-center transition-all duration-1000 ${
          inView ? "opacity-100 scale-100" : "opacity-90 scale-[0.97]"
        }`}
      >
        <div className="absolute -top-24 -left-24 h-52 w-52 rounded-full bg-vivid/20 blur-[90px] pointer-events-none sm:h-72 sm:w-72" />
        <div className="absolute -bottom-24 -right-24 h-52 w-52 rounded-full bg-vivid-light/15 blur-[90px] pointer-events-none sm:h-72 sm:w-72" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

        <h2 className="relative text-3xl md:text-5xl lg:text-6xl font-black tracking-normal leading-[1.12] mb-5 text-white">
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
        <div className="relative mx-auto flex w-full max-w-sm flex-col justify-center gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:gap-4">
          <Link to="/register" className="w-full rounded-full bg-white px-6 py-4 text-sm font-semibold uppercase tracking-[0.1em] text-fg transition-all duration-300 hover:bg-vivid hover:text-white cursor-pointer hover:shadow-[0_0_40px_rgba(108,60,224,0.3)] sm:w-auto sm:px-8 sm:tracking-[0.12em] text-center">
            Start Building Free
          </Link>
          <Link to="/explore" className="w-full rounded-full border border-white/20 px-6 py-4 text-sm font-semibold uppercase tracking-[0.1em] text-white/60 transition-all duration-300 hover:border-vivid-light hover:text-vivid-light cursor-pointer sm:w-auto sm:px-8 sm:tracking-[0.12em] text-center">
            Explore Ideas
          </Link>
        </div>
      </div>
    </section>
  );
}

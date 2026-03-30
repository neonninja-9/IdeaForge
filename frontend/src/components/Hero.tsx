"use client";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-surface-alt dot-grid">
      {/* Floating accent orbs */}
      <div className="absolute top-32 right-20 w-64 h-64 rounded-full bg-vivid/8 blur-[100px] pointer-events-none animate-float" />
      <div className="absolute bottom-32 left-16 w-48 h-48 rounded-full bg-vivid-light/10 blur-[80px] pointer-events-none animate-float" style={{ animationDelay: "1.5s" }} />

      <div className="relative max-w-6xl mx-auto px-6 lg:px-10 text-center">
        {/* Tag */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-edge text-[11px] font-mono uppercase tracking-[0.2em] text-fg-mid mb-10 animate-reveal-up"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="w-2 h-2 rounded-full bg-vivid animate-pulse" />
          IdeaForge Protocol v2.4
        </div>

        {/* Main Heading */}
        <h1
          className="text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] font-black leading-[0.95] tracking-[-0.03em] text-fg mb-8 animate-reveal-up"
          style={{ animationDelay: "0.2s" }}
        >
          Where Raw Ideas
          <br />
          Become{" "}
          <span className="bg-gradient-to-r from-vivid via-vivid-light to-purple-400 bg-clip-text text-transparent">
            Legends.
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-lg md:text-xl text-fg-mid max-w-2xl mx-auto leading-relaxed mb-12 animate-reveal-up"
          style={{ animationDelay: "0.4s" }}
        >
          A digital foundry that transforms scattered thoughts into structured
          narratives. For visionaries who refuse to let brilliance fade into the
          noise.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-wrap justify-center gap-5 animate-reveal-up"
          style={{ animationDelay: "0.6s" }}
        >
          <button className="group relative px-8 py-4 text-sm font-semibold uppercase tracking-[0.15em] rounded-full bg-fg text-fg-on-dark overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(108,60,224,0.3)] cursor-pointer">
            <span className="relative z-10">Start Building Free</span>
            <span className="absolute inset-0 bg-vivid translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </button>
          <button className="flex items-center gap-3 px-8 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-fg-mid hover:text-fg transition-all duration-300 cursor-pointer group">
            <span className="relative w-10 h-10 rounded-full border-2 border-fg-mid group-hover:border-vivid flex items-center justify-center transition-colors duration-300">
              <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
              <span className="absolute inset-0 rounded-full border-2 border-vivid opacity-0 group-hover:opacity-100" style={{ animation: "pulse-ring 1.5s ease-out infinite" }} />
            </span>
            Watch the Story
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="mt-20 flex flex-col items-center gap-2 text-fg-light animate-reveal-up" style={{ animationDelay: "0.9s" }}>
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-fg-light to-transparent" />
        </div>
      </div>
    </section>
  );
}

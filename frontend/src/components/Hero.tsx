"use client";

export default function Hero() {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-surface-alt dot-grid px-5 pt-28 pb-16 sm:px-6 lg:px-10">
      <div className="absolute top-28 right-4 h-40 w-40 rounded-full bg-vivid/8 blur-[80px] pointer-events-none animate-float sm:right-20 sm:h-64 sm:w-64" />
      <div className="absolute bottom-24 left-2 h-36 w-36 rounded-full bg-vivid-light/10 blur-[70px] pointer-events-none animate-float sm:left-16 sm:h-48 sm:w-48" style={{ animationDelay: "1.5s" }} />

      <div className="relative mx-auto w-full max-w-6xl text-center">
        <div
          className="inline-flex max-w-full items-center gap-2 rounded-full border border-edge bg-white px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.14em] text-fg-mid mb-8 animate-reveal-up sm:px-4 sm:text-[11px] sm:tracking-[0.2em] sm:mb-10"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="h-2 w-2 shrink-0 rounded-full bg-vivid animate-pulse" />
          <span className="truncate">IdeaForge Protocol v2.4</span>
        </div>

        <h1
          className="text-[clamp(2.75rem,16vw,5rem)] sm:text-7xl md:text-8xl lg:text-[7rem] font-black leading-[0.98] tracking-normal text-fg mb-7 animate-reveal-up sm:mb-8"
          style={{ animationDelay: "0.2s" }}
        >
          Where Raw Ideas
          <br />
          Become{" "}
          <span className="bg-gradient-to-r from-vivid via-vivid-light to-purple-400 bg-clip-text text-transparent">
            Legends.
          </span>
        </h1>

        <p
          className="mx-auto mb-9 max-w-2xl text-base leading-relaxed text-fg-mid animate-reveal-up sm:mb-12 md:text-xl"
          style={{ animationDelay: "0.4s" }}
        >
          A digital foundry that transforms scattered thoughts into structured
          narratives. For visionaries who refuse to let brilliance fade into the
          noise.
        </p>

        <div
          className="mx-auto flex w-full max-w-sm flex-col justify-center gap-3 animate-reveal-up sm:max-w-none sm:flex-row sm:flex-wrap sm:gap-5"
          style={{ animationDelay: "0.6s" }}
        >
          <button className="group relative w-full overflow-hidden rounded-full bg-fg px-6 py-4 text-sm font-semibold uppercase tracking-[0.1em] text-fg-on-dark transition-all duration-300 hover:shadow-[0_0_40px_rgba(108,60,224,0.3)] cursor-pointer sm:w-auto sm:px-8 sm:tracking-[0.15em]">
            <span className="relative z-10">Start Building Free</span>
            <span className="absolute inset-0 bg-vivid translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </button>
          <button className="group flex w-full items-center justify-center gap-3 px-6 py-4 text-sm font-semibold uppercase tracking-[0.1em] text-fg-mid transition-all duration-300 hover:text-fg cursor-pointer sm:w-auto sm:px-8 sm:tracking-[0.15em]">
            <span className="relative w-10 h-10 rounded-full border-2 border-fg-mid group-hover:border-vivid flex items-center justify-center transition-colors duration-300">
              <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
              <span className="absolute inset-0 rounded-full border-2 border-vivid opacity-0 group-hover:opacity-100" style={{ animation: "pulse-ring 1.5s ease-out infinite" }} />
            </span>
            Watch the Story
          </button>
        </div>

        <div className="mt-14 flex flex-col items-center gap-2 text-fg-light animate-reveal-up sm:mt-20" style={{ animationDelay: "0.9s" }}>
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-fg-light to-transparent" />
        </div>
      </div>
    </section>
  );
}

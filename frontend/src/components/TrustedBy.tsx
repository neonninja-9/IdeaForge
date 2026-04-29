"use client";

const logos = [
  "METASPACE",
  "VOID_LABS",
  "NEURAL_SYNC",
  "GHOST_GRID",
  "PRISM_UX",
  "AXIOM_AI",
  "METASPACE",
  "VOID_LABS",
  "NEURAL_SYNC",
  "GHOST_GRID",
  "PRISM_UX",
  "AXIOM_AI",
];

export default function TrustedBy() {
  return (
    <section className="py-10 sm:py-14 bg-white border-y border-edge overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
        <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-fg-light text-center mb-8">
          Trusted by teams at
        </p>
      </div>

      <div className="relative overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {logos.map((name, i) => (
            <span
              key={i}
              className="mx-5 sm:mx-10 text-sm sm:text-base font-bold tracking-[0.16em] sm:tracking-[0.2em] text-fg-light/50 hover:text-fg transition-colors duration-500 cursor-default select-none"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

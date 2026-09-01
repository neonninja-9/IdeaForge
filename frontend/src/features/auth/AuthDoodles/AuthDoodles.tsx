/**
 * AuthDoodles
 * -----------
 * A collection of hand-drawn-style SVG doodle illustrations
 * that float, spin, bob, and pulse across the auth pages.
 */

export default function AuthDoodles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">

      {/* ── Lightbulb — top left, floating ── */}
      <svg
        className="absolute top-[8%] left-[8%] w-14 h-14 text-vivid/20 dark:text-[#A16207]/25 animate-doodle-float"
        viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      >
        <path d="M32 6C22 6 14 14 14 24c0 7 4 13 10 16v6h16v-6c6-3 10-9 10-16 0-10-8-18-18-18z" />
        <path d="M24 50h16M26 56h12" />
        <path d="M32 6v-3M50 24h3M14 24h-3M45.5 10.5l2 -2M18.5 10.5l-2 -2" strokeDasharray="3 3" />
      </svg>

      {/* ── Rocket — top right, drifting diagonally ── */}
      <svg
        className="absolute top-[12%] right-[10%] w-16 h-16 text-vivid-light/20 dark:text-purple-400/25 animate-doodle-drift"
        viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      >
        <path d="M32 8c-6 10-8 22-6 32l8-4 8 4c2-10 0-22-6-32z" />
        <path d="M26 40l-6 8 8-2M38 40l6 8-8-2" />
        <circle cx="32" cy="26" r="4" />
        <path d="M28 48h8" />
      </svg>

      {/* ── Gear — center left, spinning ── */}
      <svg
        className="absolute top-[45%] left-[5%] w-20 h-20 text-vivid/12 dark:text-indigo-300/18 animate-doodle-spin"
        viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      >
        <circle cx="32" cy="32" r="10" />
        <path d="M32 6v8M32 50v8M6 32h8M50 32h8M13.5 13.5l5.5 5.5M45 45l5.5 5.5M50.5 13.5l-5.5 5.5M19 45l-5.5 5.5" />
      </svg>

      {/* ── Star cluster — top center, pulsing ── */}
      <svg
        className="absolute top-[5%] left-[40%] w-10 h-10 text-purple-400/25 dark:text-purple-300/30 animate-doodle-pulse"
        viewBox="0 0 40 40" fill="currentColor"
      >
        <path d="M20 2l3 8h8l-6.5 5 2.5 8L20 18l-7 5 2.5-8L9 10h8z" />
      </svg>

      {/* ── Code bracket — bottom left, bobbing ── */}
      <svg
        className="absolute bottom-[18%] left-[12%] w-14 h-14 text-vivid/18 dark:text-[#A16207]/25 animate-doodle-bob"
        style={{ animationDelay: "0.8s" }}
        viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      >
        <path d="M22 16L8 32l14 16" />
        <path d="M42 16l14 16-14 16" />
        <path d="M36 8L28 56" strokeDasharray="4 4" />
      </svg>

      {/* ── Speech bubble — right center, bobbing ── */}
      <svg
        className="absolute top-[55%] right-[8%] w-16 h-16 text-vivid-light/15 dark:text-purple-400/20 animate-doodle-bob"
        style={{ animationDelay: "1.5s" }}
        viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      >
        <path d="M10 12h36a4 4 0 014 4v18a4 4 0 01-4 4H26l-10 8v-8h-6a4 4 0 01-4-4V16a4 4 0 014-4z" />
        <path d="M20 24h16M20 30h10" strokeDasharray="3 3" />
      </svg>

      {/* ── Target — bottom right, spinning slowly ── */}
      <svg
        className="absolute bottom-[10%] right-[15%] w-14 h-14 text-purple-300/18 dark:text-purple-400/25 animate-doodle-spin-slow"
        viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      >
        <circle cx="32" cy="32" r="24" />
        <circle cx="32" cy="32" r="16" />
        <circle cx="32" cy="32" r="8" />
        <circle cx="32" cy="32" r="2" fill="currentColor" />
      </svg>

      {/* ── Small star — middle area ── */}
      <svg
        className="absolute top-[30%] right-[30%] w-8 h-8 text-vivid/15 dark:text-[#A16207]/20 animate-doodle-pulse"
        style={{ animationDelay: "2s" }}
        viewBox="0 0 32 32" fill="currentColor"
      >
        <path d="M16 2l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z" />
      </svg>

      {/* ── Zigzag path — decorative line, bottom ── */}
      <svg
        className="absolute bottom-[32%] left-[30%] w-32 h-8 text-vivid/10 dark:text-[#A16207]/15 animate-doodle-float"
        style={{ animationDelay: "3s" }}
        viewBox="0 0 128 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      >
        <path d="M4 24L20 8l16 16L52 8l16 16L84 8l16 16L116 8" />
      </svg>

      {/* ── Spark / flame — bottom center ── */}
      <svg
        className="absolute bottom-[5%] left-[48%] w-10 h-10 text-vivid-light/20 dark:text-purple-400/25 animate-doodle-flicker"
        viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      >
        <path d="M20 4c-4 8-8 14-6 22 1 4 4 8 6 10 2-2 5-6 6-10 2-8-2-14-6-22z" />
        <path d="M18 26c0 0 1 4 2 4s2-4 2-4" />
      </svg>

      {/* ── Small floating dots ── */}
      <div className="absolute top-[22%] left-[25%] w-3 h-3 rounded-full bg-vivid/10 dark:bg-indigo-400/20 animate-doodle-float" style={{ animationDelay: "0.5s" }} />
      <div className="absolute top-[65%] left-[40%] w-2 h-2 rounded-full bg-vivid-light/15 dark:bg-purple-400/20 animate-doodle-bob" style={{ animationDelay: "1s" }} />
      <div className="absolute top-[15%] right-[35%] w-2.5 h-2.5 rounded-full bg-purple-400/12 dark:bg-purple-300/20 animate-doodle-pulse" style={{ animationDelay: "2.5s" }} />
      <div className="absolute bottom-[25%] right-[28%] w-3 h-3 rounded-full bg-vivid/8 dark:bg-indigo-400/15 animate-doodle-float" style={{ animationDelay: "1.8s" }} />

      {/* ── Pencil — writing doodle ── */}
      <svg
        className="absolute top-[70%] left-[22%] w-12 h-12 text-vivid/15 dark:text-[#A16207]/20 animate-doodle-drift"
        style={{ animationDelay: "2.2s" }}
        viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      >
        <path d="M6 42l4-14L36 2l6 6-26 26z" />
        <path d="M28 10l6 6" />
        <path d="M10 28l6 6" />
      </svg>

      {/* ── Diamond — geometric accent ── */}
      <svg
        className="absolute top-[38%] right-[18%] w-8 h-8 text-purple-300/20 dark:text-purple-300/30 animate-doodle-spin-slow"
        style={{ animationDelay: "0.3s" }}
        viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      >
        <path d="M16 2L30 16 16 30 2 16z" />
        <path d="M16 2L16 30M2 16H30" strokeDasharray="2 3" />
      </svg>

    </div>
  );
}

/**
 * LoginPage
 * ---------
 * Full-page login with animated SVG doodles, interactive ParticleText branding,
 * and the sleek Framer Motion animated AuthCard.
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import AuthDoodles from "./AuthDoodles/AuthDoodles";
import AuthBrandVisual from "./AuthBrandVisual/AuthBrandVisual";
import { AuthCard } from "./AuthCard";

export default function LoginPage() {
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("ideaforge-theme");
      if (stored) return stored === "dark";
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("ideaforge-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <div className="min-h-screen flex bg-[#f8f9fc] dark:bg-[#030206] dot-grid relative transition-colors duration-300">
      {/* ── Theme Toggle in top right corner ── */}
      <div className="absolute top-5 right-5 z-50">
        <button
          type="button"
          onClick={() => setDarkMode((prev) => !prev)}
          className="grid size-10 place-items-center rounded-full border border-edge dark:border-white/10 bg-white/80 dark:bg-[#181524] text-fg-mid dark:text-slate-200 shadow-sm hover:bg-white dark:hover:bg-[#211c30] transition-colors cursor-pointer"
          aria-label={darkMode ? "Use light theme" : "Use dark theme"}
          title={darkMode ? "Switch to light theme" : "Switch to dark theme"}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {/* ── Left Panel: Doodle Playground (desktop only) ── */}
      <div className="hidden lg:flex lg:w-[55%] relative items-center justify-center overflow-hidden">
        <AuthDoodles />

        {/* Ambient glow blobs */}
        <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-vivid/8 dark:bg-[#fa520f]/15 blur-[100px] pointer-events-none animate-doodle-float" />
        <div className="absolute bottom-1/4 right-1/4 h-56 w-56 rounded-full bg-vivid-light/10 dark:bg-purple-500/15 blur-[80px] pointer-events-none animate-doodle-float" style={{ animationDelay: "2s" }} />

        {/* Branding */}
        <div className="relative z-10 text-center px-12 flex flex-col items-center gap-10 w-full">
          <AuthBrandVisual
            caption={
              authMode === "login"
                ? "Your ideas have been waiting. Sign in and pick up right where you left off."
                : "Turn scattered thoughts into structured brilliance. Create your account and start forging."
            }
          />
        </div>
      </div>

      {/* ── Right Panel: Animated Auth Card ── */}
      <div className="w-full lg:w-[45%] flex items-center justify-center px-5 py-12 sm:px-8 relative">
        {/* Mobile-only doodles (subtle, behind card) */}
        <div className="lg:hidden">
          <AuthDoodles />
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Mobile branding */}
          <div className="lg:hidden text-center mb-6">
            <Link to="/" className="text-2xl font-black tracking-tight text-fg dark:text-white">
              IdeaForge
            </Link>
          </div>

          {/* ── Animated Auth Card ── */}
          <AuthCard initialMode="login" onModeChange={setAuthMode} />

          {/* Back to home */}
          <div className="text-center mt-4">
            <Link to="/" className="text-xs text-fg-muted dark:text-slate-400 hover:text-fg dark:hover:text-white transition-colors uppercase tracking-[0.15em] font-medium">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

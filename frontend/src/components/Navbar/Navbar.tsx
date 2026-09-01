"use client";

import { Menu, Sparkles, Star, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import RadialRevealButton from "../RadialRevealButton";

const navLinks = [
  { label: "Product", to: "/#product" },
  { label: "Workflow", to: "/#workflow" },
  { label: "MetaBrain", to: "/#metabrain" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function handleLogout() {
    await logout();
    navigate("/");
    setMobileOpen(false);
  }

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "pt-4" : "pt-0"
      }`}
    >
      <div 
        className={`mx-auto flex items-center justify-between transition-all duration-500 ${
          scrolled 
            ? "h-14 w-[95%] max-w-[1000px] rounded-full border border-white/15 bg-[#0C0A09]/50 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] px-5 sm:px-8" 
            : "h-20 w-full max-w-[1200px] rounded-none border border-transparent bg-transparent px-5 sm:px-6 lg:px-0"
        }`}
      >
        <Link to="/" className="flex items-center gap-2 text-white">
          <span className="grid size-8 place-items-center rounded-lg bg-white text-[#0C0A09]">
            <Sparkles className="size-4" />
          </span>
          <span className="text-lg font-heading font-black">IdeaForge</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.to}
              className="text-sm font-medium text-[#d1d1d1] transition hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <NavLink
            to="/explore"
            className={({ isActive }) =>
              `text-sm font-medium transition ${
                isActive || location.pathname.startsWith("/idea/")
                  ? "text-white"
                  : "text-[#d1d1d1] hover:text-white"
              }`
            }
          >
            Explore
          </NavLink>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="https://github.com"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#d1d1d1] transition hover:text-white"
          >
            <Star className="size-4" />
            Star Us
          </a>
          {!isLoading && user ? (
            <>
              <Link
                to="/profile"
                className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
              >
                {user.username}
              </Link>
              <RadialRevealButton
                onClick={handleLogout}
                padding="8px 20px"
                fill="#5683da"
                hover={{ fill: "#6f98ee" }}
              >
                Logout
              </RadialRevealButton>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Sign In
              </Link>
              <RadialRevealButton
                to="/register"
                padding="8px 20px"
                fill="transparent"
                hover={{ fill: "#6f98ee" }}
                border={{ borderWidth: 1, borderColor: "rgba(255,255,255,0.15)" }}
              >
                Sign Up
              </RadialRevealButton>
            </>
          )}
        </div>

        <button
          className="grid min-h-11 min-w-11 place-items-center rounded-full border border-white/15 text-white md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <div 
        className={`md:hidden absolute left-0 right-0 top-full mt-2 mx-auto w-[95%] max-w-[400px] transition-all duration-300 origin-top ${
          mobileOpen ? "opacity-100 scale-y-100 pointer-events-auto" : "opacity-0 scale-y-95 pointer-events-none"
        }`}
      >
        <div className="rounded-2xl border border-white/10 bg-[#0C0A09]/95 backdrop-blur-xl p-5 shadow-2xl">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.to}
              className="block rounded-xl px-3 py-3 text-sm font-medium text-[#d1d1d1] hover:bg-white/10 hover:text-white"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/explore"
            className="block rounded-xl px-3 py-3 text-sm font-medium text-[#d1d1d1] hover:bg-white/10 hover:text-white"
            onClick={() => setMobileOpen(false)}
          >
            Explore
          </Link>
          {!isLoading && user ? (
            <RadialRevealButton
              onClick={handleLogout}
              className="mt-3 w-full"
              padding="10px 20px"
              fill="#5683da"
              hover={{ fill: "#6f98ee" }}
            >
              Logout
            </RadialRevealButton>
          ) : (
            <RadialRevealButton
              to="/register"
              className="mt-3 w-full"
              padding="10px 20px"
              fill="#5683da"
              hover={{ fill: "#6f98ee" }}
              onClick={() => setMobileOpen(false)}
            >
              Sign Up
            </RadialRevealButton>
          )}
        </div>
      </div>
    </nav>
  );
}

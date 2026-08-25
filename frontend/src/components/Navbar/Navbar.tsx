"use client";

import { Menu, Sparkles, Star, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

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
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-white/10 bg-[#090a0c]/88 backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5 sm:px-6 lg:px-0">
        <Link to="/" className="flex items-center gap-2 text-white">
          <span className="grid size-8 place-items-center rounded-lg bg-white text-[#090a0c]">
            <Sparkles className="size-4" />
          </span>
          <span className="text-lg font-black">IdeaForge</span>
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
              <button
                onClick={handleLogout}
                className="rounded-full bg-[#5683da] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#6f98ee]"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-[#5683da] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#6f98ee]"
              >
                Sign Up
              </Link>
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

      <div className={`md:hidden ${mobileOpen ? "block" : "hidden"}`}>
        <div className="border-t border-white/10 bg-[#090a0c] px-5 py-5">
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
            <button
              onClick={handleLogout}
              className="mt-3 min-h-11 w-full rounded-full bg-[#5683da] px-5 text-sm font-medium text-white"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/register"
              className="mt-3 block min-h-11 rounded-full bg-[#5683da] px-5 py-3 text-center text-sm font-medium text-white"
              onClick={() => setMobileOpen(false)}
            >
              Sign Up
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

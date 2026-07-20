"use client";

import { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const navLinks = [
  { label: "Explore", to: "/explore" },
  { label: "Submit idea", to: "/submit" },
  { label: "Dashboard", to: "/dashboard" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function handleLogout() {
    await logout();
    navigate("/");
    setMobileOpen(false);
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl border-edge shadow-[0_1px_0_rgba(0,0,0,0.06)]"
          : "bg-white/90 backdrop-blur-xl border-edge/80"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-black tracking-tight text-fg">
          IdeaForge
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) => {
                const active = isActive || (link.to === "/explore" && location.pathname.startsWith("/idea/"));
                return `text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors duration-200 ${active ? "text-vivid" : "text-fg-mid hover:text-fg"}`;
              }}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {!isLoading && user ? (
            <>
              <Link
                to="/profile"
                className="text-[11px] font-semibold uppercase tracking-[0.15em] text-fg-mid hover:text-fg transition-colors duration-300"
              >
                {user.username}
              </Link>
              <button
                onClick={handleLogout}
                className="px-6 py-2.5 text-[13px] font-semibold uppercase tracking-[0.1em] rounded-full border border-edge text-fg-mid hover:text-red-500 hover:border-red-300 transition-all duration-300 cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] rounded-full bg-fg text-fg-on-dark hover:bg-vivid transition-all duration-300 cursor-pointer inline-block">
              Get Started
            </Link>
          )}
        </div>

        <button
          className="md:hidden min-h-11 min-w-11 rounded-full text-fg flex items-center justify-center hover:bg-surface-alt"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ${
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white border-t border-edge px-5 py-5 space-y-3 shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="block rounded-lg px-2 py-3 text-sm font-medium uppercase tracking-widest text-fg-mid hover:bg-surface-alt hover:text-fg transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {!isLoading && user ? (
            <>
              <Link
                to="/profile"
                className="block rounded-lg px-2 py-3 text-sm font-medium uppercase tracking-widest text-fg-mid hover:bg-surface-alt hover:text-fg transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full mt-3 min-h-11 px-5 py-2.5 text-sm font-semibold rounded-full border border-edge text-fg-mid hover:text-red-500 hover:border-red-300 transition-colors cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="w-full mt-3 min-h-11 px-5 py-2.5 text-sm font-semibold rounded-full bg-fg text-fg-on-dark block text-center" onClick={() => setMobileOpen(false)}>
              Get Started
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

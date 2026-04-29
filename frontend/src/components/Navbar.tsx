"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const navLinks = [
  { label: "Explore", href: "/explore" },
  { label: "Submit Idea", href: "/submit" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Categories", href: "/categories" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.06)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 h-16 sm:h-18 flex items-center justify-between">
        <Link href="/" className="text-xl font-black tracking-tight text-fg">
          IdeaForge
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[13px] font-medium uppercase tracking-[0.15em] text-fg-mid hover:text-fg transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:block">
          <Link href="/login" className="px-6 py-2.5 text-[13px] font-semibold uppercase tracking-[0.1em] rounded-full bg-fg text-fg-on-dark hover:bg-vivid transition-all duration-300 cursor-pointer inline-block">
            Get Started
          </Link>
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
          mobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white border-t border-edge px-5 py-5 space-y-3 shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="block rounded-lg px-2 py-3 text-sm font-medium uppercase tracking-widest text-fg-mid hover:bg-surface-alt hover:text-fg transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/login" className="w-full mt-3 min-h-11 px-5 py-2.5 text-sm font-semibold rounded-full bg-fg text-fg-on-dark block text-center">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}

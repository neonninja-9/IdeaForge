import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import PageTransition from "../PageTransition/PageTransition";
import {
  Bell,
  Bot,
  FolderKanban,
  Heart,
  Home,
  Lightbulb,
  Menu,
  Moon,
  Search,
  Settings,
  Sparkles,
  Sun,
  UserRound,
  X,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { AppleSpotlight } from "../ui/apple-spotlight/apple-spotlight";
import { DotField } from "../ui/dot-field/dot-field";
import OptionWheel from "../ui/option-wheel/option-wheel";
import "./AppShell.css";

type NavigationItem = {
  label: string;
  to: string;
  icon: typeof Home;
  match?: (pathname: string) => boolean;
};

const primaryNavigation: NavigationItem[] = [
  { label: "Home", to: "/dashboard", icon: Home },
  { label: "Ideas", to: "/explore", icon: Lightbulb, match: (path) => path === "/explore" || path.startsWith("/idea/") || path === "/submit" },
  { label: "Projects", to: "/projects", icon: FolderKanban },
  { label: "Templates", to: "/templates", icon: Sparkles },
  { label: "Favorites", to: "/favorites", icon: Heart },
  { label: "AI Studio", to: "/ai-studio", icon: Bot },
];

const bottomNavigation: NavigationItem[] = [
  { label: "Home", to: "/dashboard", icon: Home },
  { label: "Ideas", to: "/explore", icon: Lightbulb, match: (path) => path === "/explore" || path.startsWith("/idea/") },
  { label: "AI Studio", to: "/ai-studio", icon: Sparkles },
  { label: "Projects", to: "/projects", icon: FolderKanban },
  { label: "Profile", to: "/profile", icon: UserRound },
];

const wheelNavigation: NavigationItem[] = [
  ...primaryNavigation,
  { label: "Settings", to: "/settings", icon: Settings },
];

const wheelNavigationLabels = wheelNavigation.map((item) => item.label);

function isCurrent(item: NavigationItem, pathname: string) {
  return item.match ? item.match(pathname) : pathname === item.to;
}

export default function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [appleSpotlightFocusSignal, setAppleSpotlightFocusSignal] = useState(0);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("ideaforge-theme") === "dark");
  const { user } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const activeWheelIndex = Math.max(0, wheelNavigation.findIndex((item) => isCurrent(item, pathname)));

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setAppleSpotlightFocusSignal((signal) => signal + 1);
      }
      if (event.key === "Escape") {
        setNotificationsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useLayoutEffect(() => {
    const documentRoot = document.documentElement;
    documentRoot.classList.add("theme-transition");
    documentRoot.classList.toggle("dark", darkMode);
    localStorage.setItem("ideaforge-theme", darkMode ? "dark" : "light");
    const timeout = window.setTimeout(() => documentRoot.classList.remove("theme-transition"), 420);
    return () => window.clearTimeout(timeout);
  }, [darkMode]);

  function submitSearch(query: string) {
    const q = query.trim();
    setMobileSearchOpen(false);
    navigate(q ? `/explore?q=${encodeURIComponent(q)}` : "/explore");
  }

  function submitMobileSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitSearch(mobileSearchQuery);
  }

  function navigateFromWheel(_index: number, item: string) {
    const target = wheelNavigation.find((nav) => nav.label === item);
    if (!target) return;
    navigate(target.to);
  }

  return (
    <div className="relative isolate min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors dark:text-slate-100" style={darkMode ? { backgroundColor: "#010101" } : undefined}>
      {darkMode && <DotField dotRadius={1} dotSpacing={11} gradientFrom="rgba(78, 73, 73, 0.45)" gradientTo="rgba(92, 85, 81, 0.35)" className="pointer-events-none fixed inset-0 z-0 bg-[#010101] opacity-80" />}
      {/* Wheel overlay — transparent, floats over the page with gradient blur */}
      <aside className="ow-overlay group fixed inset-y-0 left-0 z-50 hidden w-[320px] -translate-x-[296px] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-x-0 focus-within:translate-x-0 lg:block" aria-label="Main navigation">
        {/* Invisible hit-area so cursor can trigger the slide-in */}
        <div className="absolute inset-y-0 right-0 w-8 cursor-pointer" aria-hidden="true" />
        {/* Current page label pinned at the top */}
        <div className="relative z-10 px-8 pt-7 pb-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400 dark:text-[#7d7d7d]">Current Page</span>
          <h2 className="mt-1 font-heading text-lg font-bold text-slate-900 dark:text-white">{wheelNavigation[activeWheelIndex]?.label ?? "Home"}</h2>
        </div>
        <div className="relative h-[calc(100vh-120px)] mt-4">
          <OptionWheel
            key={activeWheelIndex}
            items={wheelNavigationLabels}
            defaultSelected={activeWheelIndex}
            textColor={darkMode ? "#5c5c5c" : "#8b8a98"}
            activeColor={darkMode ? "#ffffff" : "#1e1b4b"}
            side="left"
            fontSize={2.2}
            spacing={1.4}
            curve={1}
            tilt={8}
            blur={2}
            fade={0.25}
            smoothing={460}
            inset={64}
            loop={false}
            draggable
            soundUrl="/assets/sounds/click-soft.mp3"
            soundVolume={0.5}
            onItemClick={navigateFromWheel}
          />
        </div>
      </aside>

      <div className="relative z-10 min-h-screen transition-colors" style={darkMode ? { backgroundColor: "transparent" } : undefined}>
        <header 
          className="sticky top-0 z-40 flex h-[88px] items-center gap-6 px-6 sm:px-12"
        >
          {/* Header background with gradient and mask for smooth blur fade */}
          <div 
            className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-[var(--background)] to-[var(--background)]/0 backdrop-blur-xl [mask-image:linear-gradient(to_bottom,black_20%,transparent)] dark:from-[#312E2E] dark:to-transparent" 
            style={darkMode ? { 
              background: "linear-gradient(to bottom, rgba(49, 46, 46, 0.95), transparent)",
              WebkitMaskImage: "linear-gradient(to bottom, black 20%, transparent)"
            } : undefined} 
          />
          <button onClick={() => setMobileOpen(true)} className="grid size-11 place-items-center rounded-xl text-slate-600 hover:bg-white lg:hidden" aria-label="Open navigation">
            <Menu size={21} />
          </button>
          <Link to="/dashboard" className="flex min-w-0 items-center gap-3 text-slate-950 dark:text-white">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-vivid text-white shadow-lg shadow-vivid/20 dark:shadow-black/70">
              <Sparkles size={19} aria-hidden="true" />
            </span>
            <span className="hidden font-heading text-xl font-normal tracking-wide sm:inline uppercase">IdeaForge</span>
          </Link>
          <div className="hidden max-w-2xl flex-1 sm:flex justify-start">
            <AppleSpotlight onSubmitSearch={submitSearch} focusSignal={appleSpotlightFocusSignal} />
          </div>
          <div className="ml-auto flex items-center gap-3 sm:gap-4">
            <button onClick={() => setDarkMode((enabled) => !enabled)} className="grid size-11 place-items-center rounded-full text-slate-500 transition hover:bg-white hover:text-vivid dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white" aria-label={darkMode ? "Use light theme" : "Use dark theme"} title={darkMode ? "Use light theme" : "Use dark theme"}>
              {darkMode ? <Sun size={19} /> : <Moon size={19} />}
            </button>
            <button onClick={() => { setMobileSearchOpen(true); window.setTimeout(() => searchInputRef.current?.focus(), 0); }} className="grid size-11 place-items-center rounded-full text-slate-500 transition hover:bg-white hover:text-vivid sm:hidden" aria-label="Search community ideas">
              <Search size={20} />
            </button>
            <div className="relative">
            <button onClick={() => setNotificationsOpen((open) => !open)} className="relative grid size-11 place-items-center rounded-full text-slate-500 transition hover:bg-white hover:text-vivid dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white" aria-label="Notifications" aria-expanded={notificationsOpen} aria-haspopup="dialog">
              <Bell size={20} />
              <span className="absolute right-2.5 top-2.5 size-1.5 rounded-full bg-vivid" />
            </button>
            {notificationsOpen && <div role="dialog" aria-label="Notifications" className="absolute right-0 top-13 w-80 rounded-2xl border border-slate-100 bg-white p-5 shadow-xl shadow-slate-200/70"><div className="flex items-center justify-between"><h2 className="font-heading text-base font-bold text-slate-900">Notifications</h2><span className="rounded-full bg-slate-50 px-2 py-1 text-[10px] font-semibold text-slate-500">Prototype</span></div><div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-500">Notifications will appear here when activity and notification APIs are connected. There are no server-backed notifications yet.</div></div>}
            </div>
            <Link to="/profile" className="grid size-10 place-items-center rounded-full bg-slate-100 dark:bg-white/10 text-sm font-bold text-slate-900 dark:text-white transition hover:bg-vivid hover:text-white" aria-label="Open profile">
              {user?.username?.slice(0, 1).toUpperCase() || "U"}
            </Link>
          </div>
        </header>

        {mobileSearchOpen && <div className="fixed inset-x-0 top-0 z-[70] border-b border-slate-100 bg-white p-4 shadow-xl sm:hidden"><form onSubmit={submitMobileSearch} className="flex items-center gap-2"><Search size={19} className="ml-2 text-slate-400" /><input ref={searchInputRef} value={mobileSearchQuery} onChange={(event) => setMobileSearchQuery(event.target.value)} className="min-h-11 min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400" placeholder="Search community ideas" aria-label="Search community ideas" /><button type="button" onClick={() => setMobileSearchOpen(false)} className="min-h-11 rounded-xl px-3 text-sm font-semibold text-slate-500 hover:bg-slate-50">Cancel</button><button type="submit" className="grid size-11 place-items-center rounded-xl bg-indigo-600 text-white" aria-label="Submit search"><Search size={18} /></button></form></div>}

        <main className="pb-24 lg:pb-8"><PageTransition><Outlet /></PageTransition></main>
      </div>

      <div className={`fixed inset-0 z-[60] bg-slate-950/25 backdrop-blur-sm transition lg:hidden ${mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"}`} onClick={() => setMobileOpen(false)}>
        <aside className={`h-full w-72 bg-white p-5 shadow-2xl transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`} onClick={(event) => event.stopPropagation()}>
          <div className="mb-8 flex items-center justify-between">
            <span className="font-heading text-lg font-bold text-slate-900">Navigation</span>
            <button onClick={() => setMobileOpen(false)} className="grid size-10 place-items-center rounded-xl text-slate-500 hover:bg-slate-100" aria-label="Close navigation"><X size={20} /></button>
          </div>
          <nav aria-label="Mobile navigation" className="space-y-1">
            {primaryNavigation.map((item) => {
              const Icon = item.icon;
              const active = isCurrent(item, pathname);
              return <NavLink key={item.label} to={item.to} onClick={() => setMobileOpen(false)} className={`flex h-12 items-center gap-4 rounded-xl px-4 text-sm font-medium ${active ? "bg-vivid/10 text-vivid" : "text-slate-600"}`}><Icon size={19} />{item.label}</NavLink>;
            })}
          </nav>
        </aside>
      </div>

      <nav aria-label="Mobile quick navigation" className="fixed inset-x-0 bottom-0 z-40 grid h-[72px] grid-cols-5 border-t border-slate-200/80 bg-white/95 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
        {bottomNavigation.map((item) => {
          const Icon = item.icon;
          const active = isCurrent(item, pathname);
          return <NavLink key={item.label} to={item.to} className={`flex flex-col items-center justify-center gap-1 text-[10px] font-medium ${active ? "text-vivid" : "text-slate-400"}`} aria-current={active ? "page" : undefined}><Icon size={20} strokeWidth={active ? 2.4 : 1.8} /><span>{item.label}</span></NavLink>;
        })}
      </nav>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  Bot,
  ChevronLeft,
  ChevronRight,
  FolderKanban,
  Heart,
  Home,
  Lightbulb,
  Menu,
  Search,
  Settings,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

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

function isCurrent(item: NavigationItem, pathname: string) {
  return item.match ? item.match(pathname) : pathname === item.to;
}

export default function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { user } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const sidebarWidth = collapsed ? "lg:pl-20" : "lg:pl-64";

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
      if (event.key === "Escape") {
        setNotificationsOpen(false);
        setMobileSearchOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = search.trim();
    setMobileSearchOpen(false);
    navigate(query ? `/explore?q=${encodeURIComponent(query)}` : "/explore");
  }

  return (
    <div className="min-h-screen bg-[#fafaf8] text-slate-900">
      <aside
        className={`fixed inset-y-0 left-0 z-50 hidden border-r border-indigo-100/70 bg-white/85 px-3 py-5 backdrop-blur-xl transition-[width] duration-300 lg:flex lg:flex-col ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <div className={`mb-8 flex items-center ${collapsed ? "justify-center" : "justify-between px-2"}`}>
          <Link to="/dashboard" className="flex min-w-0 items-center gap-3 text-slate-950">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-200">
              <Sparkles size={18} aria-hidden="true" />
            </span>
            {!collapsed && <span className="font-heading text-lg font-bold tracking-tight">IdeaForge</span>}
          </Link>
          {!collapsed && (
            <button onClick={() => setCollapsed(true)} className="grid size-9 place-items-center rounded-xl text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600" aria-label="Collapse sidebar">
              <ChevronLeft size={18} />
            </button>
          )}
        </div>

        {collapsed && (
          <button onClick={() => setCollapsed(false)} className="mb-8 grid size-10 self-center place-items-center rounded-xl text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600" aria-label="Expand sidebar">
            <ChevronRight size={18} />
          </button>
        )}

        <nav aria-label="Main navigation" className="space-y-1">
          {primaryNavigation.map((item) => {
            const Icon = item.icon;
            const active = isCurrent(item, pathname);
            return (
              <NavLink
                key={item.label}
                to={item.to}
                className={`group flex h-11 items-center rounded-xl transition ${collapsed ? "justify-center" : "gap-3 px-3"} ${
                  active ? "bg-indigo-50 text-indigo-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
                aria-current={active ? "page" : undefined}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={19} strokeWidth={active ? 2.25 : 1.8} aria-hidden="true" />
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-slate-100 pt-4">
          <NavLink to="/settings" className={`flex h-11 items-center rounded-xl text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 ${collapsed ? "justify-center" : "gap-3 px-3"}`} title={collapsed ? "Settings" : undefined}>
            <Settings size={19} aria-hidden="true" />
            {!collapsed && <span className="text-sm font-medium">Settings</span>}
          </NavLink>
          <Link to="/profile" className={`mt-3 flex items-center rounded-2xl bg-slate-50 p-2 transition hover:bg-indigo-50 ${collapsed ? "justify-center" : "gap-3"}`} title={collapsed ? "Profile" : undefined}>
            <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 text-xs font-bold text-indigo-700">
              {user?.username?.slice(0, 1).toUpperCase() || "U"}
            </span>
            {!collapsed && <span className="min-w-0 text-sm font-medium text-slate-700 truncate">{user?.username || "Your profile"}</span>}
          </Link>
        </div>
      </aside>

      <div className={`min-h-screen transition-[padding] duration-300 ${sidebarWidth}`}>
        <header className="sticky top-0 z-40 flex h-[76px] items-center gap-4 border-b border-white/80 bg-[#fafaf8]/85 px-5 backdrop-blur-xl sm:px-8">
          <button onClick={() => setMobileOpen(true)} className="grid size-11 place-items-center rounded-xl text-slate-600 hover:bg-white lg:hidden" aria-label="Open navigation">
            <Menu size={21} />
          </button>
          <form onSubmit={submitSearch} className="hidden max-w-md flex-1 items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-2.5 shadow-sm transition focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-50 sm:flex">
            <Search size={18} className="text-slate-400" aria-hidden="true" />
            <input ref={searchInputRef} value={search} onChange={(event) => setSearch(event.target.value)} className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400" placeholder="Search community ideas" aria-label="Search community ideas" />
            <kbd className="rounded border border-slate-200 px-1.5 py-0.5 text-[10px] text-slate-400">⌘ K</kbd>
          </form>
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <button onClick={() => { setMobileSearchOpen(true); window.setTimeout(() => searchInputRef.current?.focus(), 0); }} className="grid size-11 place-items-center rounded-xl text-slate-500 transition hover:bg-white hover:text-indigo-600 sm:hidden" aria-label="Search community ideas">
              <Search size={20} />
            </button>
            <span className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 sm:flex">
              <span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.13)]" /> AI ready
            </span>
            <div className="relative">
            <button onClick={() => setNotificationsOpen((open) => !open)} className="relative grid size-11 place-items-center rounded-xl text-slate-500 transition hover:bg-white hover:text-indigo-600" aria-label="Notifications" aria-expanded={notificationsOpen} aria-haspopup="dialog">
              <Bell size={20} />
              <span className="absolute right-2.5 top-2.5 size-1.5 rounded-full bg-amber-400" />
            </button>
            {notificationsOpen && <div role="dialog" aria-label="Notifications" className="absolute right-0 top-13 w-80 rounded-2xl border border-slate-100 bg-white p-5 shadow-xl shadow-slate-200/70"><div className="flex items-center justify-between"><h2 className="font-heading text-base font-bold text-slate-900">Notifications</h2><span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700">Prototype</span></div><div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-500">Notifications will appear here when activity and notification APIs are connected. There are no server-backed notifications yet.</div></div>}
            </div>
            <Link to="/profile" className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 text-sm font-bold text-indigo-700" aria-label="Open profile">
              {user?.username?.slice(0, 1).toUpperCase() || "U"}
            </Link>
          </div>
        </header>

        {mobileSearchOpen && <div className="fixed inset-x-0 top-0 z-[70] border-b border-slate-100 bg-white p-4 shadow-xl sm:hidden"><form onSubmit={submitSearch} className="flex items-center gap-2"><Search size={19} className="ml-2 text-slate-400" /><input ref={searchInputRef} value={search} onChange={(event) => setSearch(event.target.value)} className="min-h-11 min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400" placeholder="Search community ideas" aria-label="Search community ideas" /><button type="button" onClick={() => setMobileSearchOpen(false)} className="min-h-11 rounded-xl px-3 text-sm font-semibold text-slate-500 hover:bg-slate-50">Cancel</button><button type="submit" className="grid size-11 place-items-center rounded-xl bg-indigo-600 text-white" aria-label="Submit search"><Search size={18} /></button></form></div>}

        <main className="pb-24 lg:pb-8"><Outlet /></main>
      </div>

      <div className={`fixed inset-0 z-[60] bg-slate-950/25 backdrop-blur-sm transition lg:hidden ${mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"}`} onClick={() => setMobileOpen(false)}>
        <aside className={`h-full w-72 bg-white p-5 shadow-2xl transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`} onClick={(event) => event.stopPropagation()}>
          <div className="mb-8 flex items-center justify-between">
            <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 font-heading text-lg font-bold"><span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white"><Sparkles size={18} /></span>IdeaForge</Link>
            <button onClick={() => setMobileOpen(false)} className="grid size-10 place-items-center rounded-xl text-slate-500 hover:bg-slate-100" aria-label="Close navigation"><X size={20} /></button>
          </div>
          <nav aria-label="Mobile navigation" className="space-y-1">
            {primaryNavigation.map((item) => {
              const Icon = item.icon;
              const active = isCurrent(item, pathname);
              return <NavLink key={item.label} to={item.to} onClick={() => setMobileOpen(false)} className={`flex h-12 items-center gap-3 rounded-xl px-3 text-sm font-medium ${active ? "bg-indigo-50 text-indigo-600" : "text-slate-600"}`}><Icon size={19} />{item.label}</NavLink>;
            })}
          </nav>
        </aside>
      </div>

      <nav aria-label="Mobile quick navigation" className="fixed inset-x-0 bottom-0 z-40 grid h-[72px] grid-cols-5 border-t border-slate-200/80 bg-white/95 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
        {bottomNavigation.map((item) => {
          const Icon = item.icon;
          const active = isCurrent(item, pathname);
          return <NavLink key={item.label} to={item.to} className={`flex flex-col items-center justify-center gap-1 text-[10px] font-medium ${active ? "text-indigo-600" : "text-slate-400"}`} aria-current={active ? "page" : undefined}><Icon size={20} strokeWidth={active ? 2.4 : 1.8} /><span>{item.label}</span></NavLink>;
        })}
      </nav>
    </div>
  );
}

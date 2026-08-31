import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
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
import notificationService from "../../services/notificationService";
import type { NotificationItem } from "../../types/idea.types";
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
  { label: "AI Studio (Soon)", to: "/ai-studio", icon: Bot, match: (path) => path === "/ai-studio" },
];

const bottomNavigation: NavigationItem[] = [
  { label: "Home", to: "/dashboard", icon: Home },
  { label: "Ideas", to: "/explore", icon: Lightbulb, match: (path) => path === "/explore" || path.startsWith("/idea/") },
  { label: "AI Studio (Soon)", to: "/ai-studio", icon: Sparkles },
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

function timeAgo(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [appleSpotlightFocusSignal, setAppleSpotlightFocusSignal] = useState(0);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const notificationCloseTimerRef = useRef<number | null>(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("ideaforge-theme") === "dark");
  const { user } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const activeWheelIndex = Math.max(0, wheelNavigation.findIndex((item) => isCurrent(item, pathname)));

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    try {
      setLoadingNotifications(true);
      const res = await notificationService.getNotifications();
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch {
      // Ignore background notification fetch errors
    } finally {
      setLoadingNotifications(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleNotificationEnter = () => {
    if (notificationCloseTimerRef.current) {
      window.clearTimeout(notificationCloseTimerRef.current);
      notificationCloseTimerRef.current = null;
    }
    setNotificationsOpen(true);
    fetchNotifications();
  };

  const handleNotificationLeave = () => {
    if (notificationCloseTimerRef.current) {
      window.clearTimeout(notificationCloseTimerRef.current);
    }
    notificationCloseTimerRef.current = window.setTimeout(() => {
      setNotificationsOpen(false);
    }, 220);
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error("Failed to mark all as read:", e);
    }
  };

  const handleNotificationClick = async (notification: NotificationItem) => {
    if (!notification.read) {
      const nid = notification.id || notification._id;
      if (nid) {
        notificationService.markAsRead(nid).catch(console.error);
        setNotifications((prev) =>
          prev.map((n) => (n.id === nid || n._id === nid ? { ...n, read: true } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      }
    }
    setNotificationsOpen(false);
    if (notification.idea) {
      const ideaId = (notification.idea as any).id || notification.idea._id;
      if (ideaId) navigate(`/idea/${ideaId}`);
    }
  };

  useEffect(() => {
    return () => {
      if (notificationCloseTimerRef.current) {
        window.clearTimeout(notificationCloseTimerRef.current);
      }
    };
  }, []);

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
    <div className="relative isolate min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors dark:text-slate-100" style={darkMode ? { backgroundColor: "#08070d" } : undefined}>
      {darkMode && <DotField dotRadius={1} dotSpacing={11} gradientFrom="rgba(33, 28, 48, 0.45)" gradientTo="rgba(24, 21, 36, 0.35)" className="pointer-events-none fixed inset-0 z-0 bg-[#08070d] opacity-80" />}
      
      {/* Wheel overlay */}
      <aside className="ow-overlay group fixed inset-y-0 left-0 z-50 hidden w-[320px] -translate-x-[296px] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-x-0 focus-within:translate-x-0 lg:block" aria-label="Main navigation">
        <div className="absolute inset-y-0 right-0 w-8 cursor-pointer" aria-hidden="true" />
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
        <header className="sticky top-0 z-40 flex h-[88px] items-center gap-2 sm:gap-6 px-4 sm:px-12">
          <div 
            className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-[var(--background)] to-[var(--background)]/0 backdrop-blur-xl [mask-image:linear-gradient(to_bottom,black_20%,transparent)] dark:from-[#08070d] dark:to-transparent" 
            style={darkMode ? { 
              background: "linear-gradient(to bottom, rgba(8, 7, 13, 0.95), transparent)",
              WebkitMaskImage: "linear-gradient(to bottom, black 20%, transparent)"
            } : undefined} 
          />
          <button onClick={() => setMobileOpen(true)} className="grid size-9 sm:size-11 place-items-center rounded-xl text-slate-600 hover:bg-white lg:hidden" aria-label="Open navigation">
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
          <div className="ml-auto flex items-center gap-1 sm:gap-4">
            <button onClick={() => setDarkMode((enabled) => !enabled)} className="grid size-9 sm:size-11 place-items-center rounded-full text-slate-500 transition hover:bg-white hover:text-vivid dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white" aria-label={darkMode ? "Use light theme" : "Use dark theme"} title={darkMode ? "Use light theme" : "Use dark theme"}>
              {darkMode ? <Sun size={19} /> : <Moon size={19} />}
            </button>
            <button onClick={() => { setMobileSearchOpen(true); window.setTimeout(() => searchInputRef.current?.focus(), 0); }} className="grid size-9 sm:size-11 place-items-center rounded-full text-slate-500 transition hover:bg-white hover:text-vivid sm:hidden" aria-label="Search community ideas">
              <Search size={20} />
            </button>
            
            {/* Notification bell */}
            <div 
              className="relative"
              onMouseEnter={handleNotificationEnter}
              onMouseLeave={handleNotificationLeave}
            >
              <button 
                onClick={() => setNotificationsOpen((open) => !open)} 
                className="relative grid size-9 sm:size-11 place-items-center rounded-full text-slate-500 transition hover:bg-white hover:text-vivid dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white" 
                aria-label="Notifications" 
                aria-expanded={notificationsOpen} 
                aria-haspopup="dialog"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute right-2 top-2 grid size-4 place-items-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-[#08070d]">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div 
                  role="dialog" 
                  aria-label="Notifications" 
                  className="absolute right-0 top-12 z-50 w-80 sm:w-96 rounded-2xl border border-slate-100 dark:border-white/10 bg-white/95 dark:bg-[#120F17]/95 p-5 shadow-2xl shadow-slate-900/15 dark:shadow-black/80 backdrop-blur-xl transition-all"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
                    <div className="flex items-center gap-2">
                      <h2 className="font-heading text-base font-bold text-slate-900 dark:text-white">Notifications</h2>
                      {unreadCount > 0 && (
                        <span className="rounded-full bg-vivid/10 dark:bg-vivid/20 px-2 py-0.5 text-[10px] font-bold text-vivid dark:text-vivid-light">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {user && notifications.some((n) => !n.read) && (
                      <button 
                        onClick={handleMarkAllRead} 
                        className="text-[11px] font-medium text-slate-400 dark:text-slate-500 hover:text-vivid dark:hover:text-vivid-light cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="mt-3 max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5">
                    {!user ? (
                      <div className="py-6 text-center">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Sign in to get notified about upvotes and comments on your ideas.</p>
                        <Link to="/login" className="mt-3 inline-flex text-xs font-semibold text-vivid dark:text-vivid-light">Sign In</Link>
                      </div>
                    ) : loadingNotifications && notifications.length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-400">Loading notifications...</div>
                    ) : notifications.length === 0 ? (
                      <div className="py-6 text-center">
                        <p className="text-xs text-slate-400 dark:text-slate-500">No notifications yet. When members interact with your ideas, updates will appear here.</p>
                      </div>
                    ) : (
                      notifications.map((n) => {
                        const nid = n.id || n._id;
                        return (
                          <div 
                            key={nid} 
                            onClick={() => handleNotificationClick(n)}
                            className={`py-2.5 first:pt-0 last:pb-0 flex items-start gap-3 cursor-pointer rounded-xl px-2 -mx-2 transition hover:bg-slate-50 dark:hover:bg-white/5 ${!n.read ? "bg-vivid/5 dark:bg-vivid/10" : ""}`}
                          >
                            <span className={`mt-1.5 size-2 rounded-full shrink-0 ${n.type === "vote" ? "bg-indigo-500" : n.type === "comment" ? "bg-emerald-500" : "bg-vivid"}`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                                {n.actor?.username || "Someone"}{" "}
                                <span className="font-normal text-slate-600 dark:text-slate-400">
                                  {n.type === "vote" ? "upvoted your idea" : n.type === "comment" ? "commented on your idea" : "interacted with you"}
                                </span>
                              </p>
                              {n.idea?.title && (
                                <p className="mt-0.5 truncate text-[11px] font-medium text-vivid dark:text-vivid-light">
                                  "{n.idea.title}"
                                </p>
                              )}
                              <span className="mt-1 block text-[10px] text-slate-400 dark:text-slate-500">
                                {timeAgo(n.createdAt)}
                              </span>
                            </div>
                            {!n.read && (
                              <span className="size-1.5 rounded-full bg-vivid shrink-0 self-center" />
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
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

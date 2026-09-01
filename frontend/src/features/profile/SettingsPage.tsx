import { useEffect, useState } from "react";
import { BellRing, ChevronRight, LogOut, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import userService, { type Preferences } from "../../services/userService";
import RadialRevealButton from "../../components/RadialRevealButton";

const defaultPreferences: Preferences = { productUpdates: true, weeklyReflection: false };

export default function SettingsPage() {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);
  const [preferencesError, setPreferencesError] = useState("");

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [profileMessage, setProfileMessage] = useState({ text: "", isError: false });
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (!user) return;
    setUsernameInput(user.username);
    setEmailInput(user.email);
    userService.getPreferences()
      .then((response) => setPreferences(response.data.preferences))
      .catch(() => setPreferencesError("Could not load your saved preferences."));
  }, [user]);

  useEffect(() => {
    if (!isLoading && !user) navigate("/login");
  }, [isLoading, navigate, user]);

  if (isLoading || !user) return <div className="min-h-[calc(100vh-76px)] bg-[var(--background)] dark:bg-transparent" />;

  async function handleLogout() {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileMessage({ text: "", isError: false });
    setSavingProfile(true);
    try {
      await userService.updateProfile({ username: usernameInput, email: emailInput });
      setProfileMessage({ text: "Profile updated successfully! Refreshing...", isError: false });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      setProfileMessage({ text: err.message || "Failed to update profile", isError: true });
    } finally {
      setSavingProfile(false);
    }
  }

  async function updatePreference(key: keyof Preferences, value: boolean) {
    const next = { ...preferences, [key]: value };
    setPreferences(next);
    setPreferencesError("");
    try {
      const response = await userService.updatePreferences(next);
      setPreferences(response.data.preferences);
    } catch {
      setPreferences(preferences);
      setPreferencesError("Could not save that preference. Please try again.");
    }
  }

  return (
    <div className="min-h-[calc(100vh-76px)] bg-[var(--background)] dark:bg-transparent px-5 py-7 sm:px-8 sm:py-10 xl:px-12 transition-colors duration-500">
      <main className="mx-auto max-w-4xl">
        <header>
          <p className="text-sm font-semibold text-[#A16207] dark:text-[#A16207]">PREFERENCES</p>
          <h1 className="font-heading mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Make your workspace yours.</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500 dark:text-slate-400">Account details come from your IdeaForge profile, and preferences are saved to your account.</p>
        </header>

        <section className="mt-9 overflow-hidden rounded-[28px] border border-slate-100 dark:border-white/5 bg-white dark:bg-[#1C1917] shadow-sm dark:shadow-none transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 px-6 py-5">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-[#FEF3C7] dark:bg-white/5 text-[#A16207] dark:text-[#A16207]">
                <SlidersHorizontal size={19} />
              </span>
              <div>
                <h2 className="font-heading font-bold text-slate-900 dark:text-white">Account</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Your current IdeaForge identity</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="text-xs font-semibold text-[#A16207] dark:text-[#A16207] hover:text-[#854D0E] dark:hover:text-indigo-300 bg-[#FEF3C7] dark:bg-white/5 px-3.5 py-2 rounded-xl transition"
            >
              {isEditingProfile ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {profileMessage.text && (
            <div className={`mx-6 mt-4 rounded-xl px-4 py-3 text-sm ${profileMessage.isError ? "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400" : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"}`}>
              {profileMessage.text}
            </div>
          )}

          {isEditingProfile ? (
            <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Username</label>
                <input
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#292524] px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-[#A16207]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Email</label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#292524] px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-[#A16207]"
                />
              </div>
              <button
                type="submit"
                disabled={savingProfile}
                className="inline-flex items-center justify-center rounded-xl bg-[#A16207] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#854D0E] disabled:opacity-50"
              >
                {savingProfile ? "Saving..." : "Save Changes"}
              </button>
            </form>
          ) : (
            <dl className="divide-y divide-slate-100 dark:divide-white/5 px-6">
              <div className="flex items-center justify-between gap-5 py-5">
                <div>
                  <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Name</dt>
                  <dd className="mt-1 font-semibold text-slate-900 dark:text-white">{user.username}</dd>
                </div>
                <ChevronRight size={18} className="text-slate-300 dark:text-slate-600" />
              </div>
              <div className="flex items-center justify-between gap-5 py-5">
                <div>
                  <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Email</dt>
                  <dd className="mt-1 font-semibold text-slate-900 dark:text-white">{user.email}</dd>
                </div>
                <ChevronRight size={18} className="text-slate-300 dark:text-slate-600" />
              </div>
            </dl>
          )}
        </section>

        <section className="mt-6 overflow-hidden rounded-[28px] border border-slate-100 dark:border-white/5 bg-white dark:bg-[#1C1917] shadow-sm dark:shadow-none transition-colors">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-white/5 px-6 py-5">
            <span className="grid size-10 place-items-center rounded-xl bg-[#FFFBEB] dark:bg-white/5 text-[#A16207] dark:text-[#CA8A04]">
              <BellRing size={19} />
            </span>
            <div>
              <h2 className="font-heading font-bold text-slate-900 dark:text-white">Workspace preferences</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Synced to your IdeaForge account</p>
            </div>
          </div>
          {preferencesError && (
            <p className="mx-6 mt-5 rounded-xl bg-rose-50 dark:bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-400">
              {preferencesError}
            </p>
          )}
          <div className="divide-y divide-slate-100 dark:divide-white/5 px-6">
            {([
              { key: "productUpdates", label: "Product updates", description: "Show occasional updates about new IdeaForge capabilities." },
              { key: "weeklyReflection", label: "Weekly reflection", description: "Keep a local reminder preference for reviewing your ideas." },
            ] as const).map((item) => (
              <label key={item.key} className="flex min-h-20 cursor-pointer items-center justify-between gap-5 py-5">
                <span>
                  <span className="block font-semibold text-slate-800 dark:text-slate-200">{item.label}</span>
                  <span className="mt-1 block text-sm leading-6 text-slate-500 dark:text-slate-400">{item.description}</span>
                </span>
                <input
                  type="checkbox"
                  checked={preferences?.[item.key] || false}
                  onChange={(event) => updatePreference(item.key, event.target.checked)}
                  className="size-5 rounded accent-[#A16207] cursor-pointer"
                  aria-label={item.label}
                />
              </label>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-[28px] border border-rose-100 dark:border-rose-500/20 bg-white dark:bg-[#1C1917] p-6 shadow-sm dark:shadow-none transition-colors">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <ShieldCheck size={19} />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-heading font-bold text-slate-900 dark:text-white">Sign out</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">End this session on the current browser.</p>
            </div>
            <RadialRevealButton
              onClick={handleLogout}
              padding="0 16px"
              style={{ minHeight: '44px', fontWeight: 600, fontSize: '0.875rem' }}
              className="shrink-0 shadow-sm dark:shadow-none"
              fill="transparent"
              colors={{ textColor: "#be123c", hoverFill: "#e11d48", hoverTextColor: "#ffffff" }}
              border={{ borderWidth: 1, borderColor: "rgba(244, 63, 94, 0.3)" }}
              rounded={25}
            >
              <span className="flex items-center gap-2">
                <LogOut size={16} /> Sign out
              </span>
            </RadialRevealButton>
          </div>
        </section>
      </main>
    </div>
  );
}

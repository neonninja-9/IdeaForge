import { useEffect, useState } from "react";
import { BellRing, ChevronRight, LogOut, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import userService, { type Preferences } from "../services/userService";

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

  if (isLoading || !user) return <div className="min-h-[calc(100vh-76px)] bg-[#fafaf8]" />;

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

  return <div className="min-h-[calc(100vh-76px)] bg-[#fafaf8] px-5 py-7 sm:px-8 sm:py-10 xl:px-12"><main className="mx-auto max-w-4xl"><header><p className="text-sm font-semibold text-indigo-600">PREFERENCES</p><h1 className="font-heading mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Make your workspace yours.</h1><p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">Account details come from your IdeaForge profile, and preferences are saved to your account.</p></header>
    <section className="mt-9 overflow-hidden rounded-[28px] border border-slate-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600"><SlidersHorizontal size={19} /></span>
          <div><h2 className="font-heading font-bold text-slate-900">Account</h2><p className="text-sm text-slate-500">Your current IdeaForge identity</p></div>
        </div>
        <button onClick={() => setIsEditingProfile(!isEditingProfile)} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-2 rounded-xl transition">
          {isEditingProfile ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {profileMessage.text && (
        <div className={`mx-6 mt-4 rounded-xl px-4 py-3 text-sm ${profileMessage.isError ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>
          {profileMessage.text}
        </div>
      )}

      {isEditingProfile ? (
        <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Username</label>
            <input value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Email</label>
            <input type="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-indigo-500" />
          </div>
          <button type="submit" disabled={savingProfile} className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50">
            {savingProfile ? "Saving..." : "Save Changes"}
          </button>
        </form>
      ) : (
        <dl className="divide-y divide-slate-100 px-6">
          <div className="flex items-center justify-between gap-5 py-5"><div><dt className="text-sm font-medium text-slate-500">Name</dt><dd className="mt-1 font-semibold text-slate-900">{user.username}</dd></div><ChevronRight size={18} className="text-slate-300" /></div>
          <div className="flex items-center justify-between gap-5 py-5"><div><dt className="text-sm font-medium text-slate-500">Email</dt><dd className="mt-1 font-semibold text-slate-900">{user.email}</dd></div><ChevronRight size={18} className="text-slate-300" /></div>
        </dl>
      )}
    </section>
    <section className="mt-6 overflow-hidden rounded-[28px] border border-slate-100 bg-white shadow-sm"><div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5"><span className="grid size-10 place-items-center rounded-xl bg-violet-50 text-violet-600"><BellRing size={19} /></span><div><h2 className="font-heading font-bold text-slate-900">Workspace preferences</h2><p className="text-sm text-slate-500">Synced to your IdeaForge account</p></div></div>{preferencesError && <p className="mx-6 mt-5 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{preferencesError}</p>}<div className="divide-y divide-slate-100 px-6">{([{ key: "productUpdates", label: "Product updates", description: "Show occasional updates about new IdeaForge capabilities." }, { key: "weeklyReflection", label: "Weekly reflection", description: "Keep a local reminder preference for reviewing your ideas." }] as const).map((item) => <label key={item.key} className="flex min-h-20 cursor-pointer items-center justify-between gap-5 py-5"><span><span className="block font-semibold text-slate-800">{item.label}</span><span className="mt-1 block text-sm leading-6 text-slate-500">{item.description}</span></span><input type="checkbox" checked={preferences?.[item.key] || false} onChange={(event) => updatePreference(item.key, event.target.checked)} className="size-5 accent-indigo-600" aria-label={item.label} /></label>)}</div></section>
    <section className="mt-6 rounded-[28px] border border-rose-100 bg-white p-6 shadow-sm"><div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-rose-50 text-rose-600"><ShieldCheck size={19} /></span><div className="min-w-0 flex-1"><h2 className="font-heading font-bold text-slate-900">Sign out</h2><p className="mt-1 text-sm leading-6 text-slate-500">End this session on the current browser.</p></div><button onClick={handleLogout} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-rose-200 px-4 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"><LogOut size={16} /> Sign out</button></div></section>
  </main></div>;
}

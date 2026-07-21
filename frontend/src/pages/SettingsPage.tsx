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

  useEffect(() => {
    if (!user) return;
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
    <section className="mt-9 overflow-hidden rounded-[28px] border border-slate-100 bg-white shadow-sm"><div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5"><span className="grid size-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600"><SlidersHorizontal size={19} /></span><div><h2 className="font-heading font-bold text-slate-900">Account</h2><p className="text-sm text-slate-500">Your current IdeaForge identity</p></div></div><dl className="divide-y divide-slate-100 px-6"><div className="flex items-center justify-between gap-5 py-5"><div><dt className="text-sm font-medium text-slate-500">Name</dt><dd className="mt-1 font-semibold text-slate-900">{user.username}</dd></div><ChevronRight size={18} className="text-slate-300" /></div><div className="flex items-center justify-between gap-5 py-5"><div><dt className="text-sm font-medium text-slate-500">Email</dt><dd className="mt-1 font-semibold text-slate-900">{user.email}</dd></div><ChevronRight size={18} className="text-slate-300" /></div></dl><p className="mx-6 mb-6 rounded-xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-500">Profile editing is not available from the current API yet.</p></section>
    <section className="mt-6 overflow-hidden rounded-[28px] border border-slate-100 bg-white shadow-sm"><div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5"><span className="grid size-10 place-items-center rounded-xl bg-violet-50 text-violet-600"><BellRing size={19} /></span><div><h2 className="font-heading font-bold text-slate-900">Workspace preferences</h2><p className="text-sm text-slate-500">Synced to your IdeaForge account</p></div></div>{preferencesError && <p className="mx-6 mt-5 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{preferencesError}</p>}<div className="divide-y divide-slate-100 px-6">{([{ key: "productUpdates", label: "Product updates", description: "Show occasional updates about new IdeaForge capabilities." }, { key: "weeklyReflection", label: "Weekly reflection", description: "Keep a local reminder preference for reviewing your ideas." }] as const).map((item) => <label key={item.key} className="flex min-h-20 cursor-pointer items-center justify-between gap-5 py-5"><span><span className="block font-semibold text-slate-800">{item.label}</span><span className="mt-1 block text-sm leading-6 text-slate-500">{item.description}</span></span><input type="checkbox" checked={preferences[item.key]} onChange={(event) => updatePreference(item.key, event.target.checked)} className="size-5 accent-indigo-600" aria-label={item.label} /></label>)}</div></section>
    <section className="mt-6 rounded-[28px] border border-rose-100 bg-white p-6 shadow-sm"><div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-rose-50 text-rose-600"><ShieldCheck size={19} /></span><div className="min-w-0 flex-1"><h2 className="font-heading font-bold text-slate-900">Sign out</h2><p className="mt-1 text-sm leading-6 text-slate-500">End this session on the current browser.</p></div><button onClick={handleLogout} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-rose-200 px-4 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"><LogOut size={16} /> Sign out</button></div></section>
  </main></div>;
}

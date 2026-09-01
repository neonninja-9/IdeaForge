import { useState, useEffect, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Sparkles, User } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

interface AuthCardProps {
  initialMode?: "login" | "register";
  onModeChange?: (mode: "login" | "register") => void;
}

const spring = {
  type: "spring" as const,
  stiffness: 340,
  damping: 28,
  mass: 0.7,
};

const fadeSlide = {
  duration: 0.22,
  ease: [0.16, 1, 0.3, 1] as const,
};

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a5.4 5.4 0 0 0-1.5-3.8 5.4 5.4 0 0 0-.1-3.8s-1.2-.4-3.9 1.4a13.3 13.3 0 0 0-7 0c-2.7-1.8-3.9-1.4-3.9-1.4a5.4 5.4 0 0 0-.1 3.8A5.4 5.4 0 0 0 2 12.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4" />
  </svg>
);

function getPasswordStrength(pw: string): { label: string; color: string; width: string } {
  if (!pw) return { label: "", color: "", width: "0%" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;

  if (score <= 1) return { label: "Weak", color: "bg-red-400", width: "20%" };
  if (score === 2) return { label: "Fair", color: "bg-orange-400", width: "40%" };
  if (score === 3) return { label: "Good", color: "bg-yellow-400", width: "60%" };
  if (score === 4) return { label: "Strong", color: "bg-green-400", width: "80%" };
  return { label: "Excellent", color: "bg-emerald-500", width: "100%" };
}

export function AuthCard({ initialMode = "login", onModeChange }: AuthCardProps) {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [username, setUsername] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setMode(initialMode);
    setError("");
    setFieldErrors({});
  }, [initialMode]);

  const toggleMode = (newMode: "login" | "register") => {
    setError("");
    setFieldErrors({});
    setMode(newMode);
    onModeChange?.(newMode);
    window.history.pushState(null, "", newMode === "login" ? "/login" : "/register");
  };

  const strength = getPasswordStrength(password);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFieldErrors({});

    // Basic frontend checks
    if (mode === "register") {
      const trimmedUser = username.trim();
      const trimmedEmail = email.trim();
      if (!trimmedUser || trimmedUser.length < 3) {
        setFieldErrors((prev) => ({ ...prev, username: "Username must be at least 3 characters" }));
        setLoading(false);
        return;
      }
      if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        setFieldErrors((prev) => ({ ...prev, email: "Valid email is required" }));
        setLoading(false);
        return;
      }
      if (!password || password.length < 8) {
        setFieldErrors((prev) => ({ ...prev, password: "Password must be at least 8 characters" }));
        setLoading(false);
        return;
      }

      try {
        await register(trimmedUser, trimmedEmail, password);
        navigate("/dashboard");
      } catch (err: unknown) {
        const authErr = err as Error & { validationErrors?: { field: string; message: string }[] };
        if (authErr.validationErrors?.length) {
          const errorsObj: Record<string, string> = {};
          for (const ve of authErr.validationErrors) {
            errorsObj[ve.field] = ve.message;
          }
          setFieldErrors(errorsObj);
        } else {
          setError(authErr.message || "Registration failed. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    } else {
      const trimmedIdentifier = identifier.trim();
      if (!trimmedIdentifier) {
        setFieldErrors((prev) => ({ ...prev, identifier: "Username or email is required" }));
        setLoading(false);
        return;
      }
      if (!password) {
        setFieldErrors((prev) => ({ ...prev, password: "Password is required" }));
        setLoading(false);
        return;
      }

      try {
        await login(trimmedIdentifier, password);
        navigate("/dashboard");
      } catch (err: unknown) {
        const authErr = err as Error & { validationErrors?: { field: string; message: string }[] };
        if (authErr.validationErrors?.length) {
          const errorsObj: Record<string, string> = {};
          for (const ve of authErr.validationErrors) {
            errorsObj[ve.field] = ve.message;
          }
          setFieldErrors(errorsObj);
        } else {
          setError(authErr.message || "Invalid credentials. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <motion.div
      layout
      transition={{ layout: spring }}
      className="relative w-full max-w-[460px] mx-auto py-2"
    >
      {/* Animated glassmorphic card container */}
      <motion.div
        layout
        transition={{ layout: spring }}
        className="rounded-[24px] border border-slate-200/80 dark:border-white/[0.08] bg-white/95 dark:bg-[#0a0714]/95 backdrop-blur-2xl p-7 sm:p-9 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] dark:shadow-[0_30px_90px_-15px_rgba(0,0,0,0.95)] transition-all"
      >
        {/* ── Animated Heading (Starts at top of card) ── */}
        <motion.div layout="position" transition={spring} className="mb-6 text-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: -6, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 6, filter: "blur(4px)" }}
              transition={fadeSlide}
              className="space-y-1.5"
            >
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                {mode === "login" ? "Welcome back" : "Forge your ideas"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-[320px] mx-auto">
                {mode === "login"
                  ? "Sign in and pick up your ideas right where you left off."
                  : "Start capturing raw thoughts and transforming them into structured clarity."}
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          {/* In Login Mode: Identifier (Username or Email) */}
          <AnimatePresence initial={false}>
            {mode === "login" && (
              <motion.div
                key="login-identifier-field"
                initial={{ opacity: 0, height: 0, y: -6 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -6 }}
                transition={{
                  height: spring,
                  opacity: { duration: 0.18 },
                  y: spring,
                }}
              >
                <div className="space-y-1.5">
                  <label
                    htmlFor="card-identifier"
                    className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300"
                  >
                    Username or Email
                  </label>
                  <input
                    id="card-identifier"
                    type="text"
                    placeholder="you@example.com or username"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    autoComplete="username"
                    className="w-full bg-slate-50/80 dark:bg-[#100c1e] border border-slate-200/90 dark:border-white/[0.08] focus:border-[#a855f7] dark:focus:border-[#a855f7] focus:outline-none focus:ring-0 !outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm h-11 rounded-xl px-3.5 transition-colors duration-200"
                  />
                  {fieldErrors.identifier && (
                    <p className="text-xs text-red-500 dark:text-red-400 mt-1">{fieldErrors.identifier}</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* In Register Mode: Username */}
          <AnimatePresence initial={false}>
            {mode === "register" && (
              <motion.div
                key="register-username-field"
                initial={{ opacity: 0, height: 0, y: -6 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -6 }}
                transition={{
                  height: spring,
                  opacity: { duration: 0.18 },
                  y: spring,
                }}
              >
                <div className="space-y-1.5">
                  <label
                    htmlFor="card-username"
                    className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300"
                  >
                    Username
                  </label>
                  <input
                    id="card-username"
                    type="text"
                    placeholder="forge_master"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    className="w-full bg-slate-50/80 dark:bg-[#100c1e] border border-slate-200/90 dark:border-white/[0.08] focus:border-[#a855f7] dark:focus:border-[#a855f7] focus:outline-none focus:ring-0 !outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm h-11 rounded-xl px-3.5 transition-colors duration-200"
                  />
                  {fieldErrors.username && (
                    <p className="text-xs text-red-500 dark:text-red-400 mt-1">{fieldErrors.username}</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* In Register Mode: Email */}
          <AnimatePresence initial={false}>
            {mode === "register" && (
              <motion.div
                key="register-email-field"
                initial={{ opacity: 0, height: 0, y: -6 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -6 }}
                transition={{
                  height: spring,
                  opacity: { duration: 0.18 },
                  y: spring,
                }}
              >
                <div className="space-y-1.5">
                  <label
                    htmlFor="card-email"
                    className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300"
                  >
                    Email address
                  </label>
                  <input
                    id="card-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    className="w-full bg-slate-50/80 dark:bg-[#100c1e] border border-slate-200/90 dark:border-white/[0.08] focus:border-[#a855f7] dark:focus:border-[#a855f7] focus:outline-none focus:ring-0 !outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm h-11 rounded-xl px-3.5 transition-colors duration-200"
                  />
                  {fieldErrors.email && (
                    <p className="text-xs text-red-500 dark:text-red-400 mt-1">{fieldErrors.email}</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Password (Both Modes) */}
          <motion.div layout="position" transition={spring}>
            <div className="space-y-1.5">
              <label
                htmlFor="card-password"
                className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="card-password"
                  type={showPassword ? "text" : "password"}
                  placeholder={mode === "register" ? "Min 8 chars, 1 uppercase, 1 digit" : "••••••••••"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === "register" ? "new-password" : "current-password"}
                  className="w-full bg-slate-50/80 dark:bg-[#100c1e] border border-slate-200/90 dark:border-white/[0.08] focus:border-[#a855f7] dark:focus:border-[#a855f7] focus:outline-none focus:ring-0 !outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm h-11 rounded-xl px-3.5 pr-11 transition-colors duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors p-1 cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-xs text-red-500 dark:text-red-400 mt-1">{fieldErrors.password}</p>
              )}

              {/* Password strength meter on register mode */}
              {mode === "register" && password && (
                <div className="mt-2.5 animate-reveal-up">
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-[#100c1e] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${strength.color}`}
                      style={{ width: strength.width }}
                    />
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400 mt-1">
                    Strength: <span className="font-semibold">{strength.label}</span>
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* ── Error Banner ── */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, scale: 0.96 }}
                animate={{ opacity: 1, height: "auto", scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-4 py-3 text-xs sm:text-sm text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/40 rounded-xl text-center leading-relaxed">
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Submit Button ── */}
          <motion.div layout="position" transition={spring} className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden h-12 rounded-xl bg-gradient-to-r from-[#fa520f] to-[#ffa110] hover:from-[#cc3a05] hover:to-[#ff8105] text-white text-sm font-semibold transition-all duration-300 shadow-[0_4px_20px_rgba(250,82,15,0.35)] hover:shadow-[0_6px_25px_rgba(250,82,15,0.5)] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <AnimatePresence mode="wait" initial={false}>
                  {loading ? (
                    <motion.span
                      key="loading-spinner"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.12 }}
                      className="inline-flex items-center gap-2"
                    >
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span>Processing…</span>
                    </motion.span>
                  ) : (
                    <motion.span
                      key={mode}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.18 }}
                    >
                      {mode === "login" ? "Sign In" : "Create Account"}
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            </button>
          </motion.div>
        </form>

        {/* ── Divider ── */}
        <motion.div layout="position" transition={spring} className="my-5">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200 dark:border-white/[0.08]" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white dark:bg-[#0a0714] px-3 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                or
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── Social Logins (Coming soon) ── */}
        <motion.div layout="position" transition={spring}>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled
              title="GitHub OAuth coming soon"
              className="flex items-center justify-center gap-2 h-10 rounded-xl border border-slate-200/80 dark:border-white/[0.08] bg-slate-100/80 dark:bg-[#100c1e] text-slate-600 dark:text-slate-300 text-xs font-medium opacity-60 cursor-not-allowed transition-all"
            >
              <GithubIcon className="h-4 w-4" />
              <span>GitHub (Soon)</span>
            </button>
            <button
              type="button"
              disabled
              title="Google OAuth coming soon"
              className="flex items-center justify-center gap-2 h-10 rounded-xl border border-slate-200/80 dark:border-white/[0.08] bg-slate-100/80 dark:bg-[#100c1e] text-slate-600 dark:text-slate-300 text-xs font-medium opacity-60 cursor-not-allowed transition-all"
            >
              <Mail className="h-4 w-4 text-rose-500" />
              <span>Google (Soon)</span>
            </button>
          </div>
        </motion.div>

        {/* ── Mode Switcher Slider at Bottom of Card (Replaces the text link) ── */}
        <motion.div layout="position" transition={spring} className="mt-6">
          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-[#100c1e] rounded-xl border border-slate-200/80 dark:border-white/[0.08] relative">
            <button
              type="button"
              onClick={() => toggleMode("login")}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 text-[13px] font-semibold rounded-[10px] transition-colors duration-200 relative z-10 cursor-pointer ${
                mode === "login"
                  ? "text-slate-900 dark:text-white"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <User className="w-4 h-4" />
              <span>Sign in</span>
              {mode === "login" && (
                <motion.div
                  layoutId="active-auth-pill"
                  transition={spring}
                  className="absolute inset-0 bg-white dark:bg-[#1f1738] shadow-sm dark:shadow-md border border-transparent dark:border-white/10 rounded-[10px] -z-10"
                />
              )}
            </button>

            <button
              type="button"
              onClick={() => toggleMode("register")}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 text-[13px] font-semibold rounded-[10px] transition-colors duration-200 relative z-10 cursor-pointer ${
                mode === "register"
                  ? "text-slate-900 dark:text-white"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Create account</span>
              {mode === "register" && (
                <motion.div
                  layoutId="active-auth-pill"
                  transition={spring}
                  className="absolute inset-0 bg-white dark:bg-[#1f1738] shadow-sm dark:shadow-md border border-transparent dark:border-white/10 rounded-[10px] -z-10"
                />
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* Trust line beneath card */}
      <motion.p
        layout="position"
        transition={spring}
        className="text-center text-[11px] text-slate-400 dark:text-slate-500 mt-4 leading-relaxed"
      >
        Secured with end-to-end encryption · Your ideas belong to you
      </motion.p>
    </motion.div>
  );
}

export default AuthCard;

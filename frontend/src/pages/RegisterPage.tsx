/**
 * RegisterPage
 * ------------
 * Registration page with the same doodle-rich aesthetic as LoginPage.
 *
 * Features:
 *   - Frontend validation matching backend rules:
 *       username: 3-30 chars, alphanumeric + underscore
 *       email:    valid email format
 *       password: min 8 chars, 1 uppercase, 1 digit
 *   - Real-time validation on blur
 *   - Password strength indicator
 *   - Loading spinner during API call
 *   - Server + validation error display
 */

import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AuthDoodles from "../components/AuthDoodles";

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
}

// ─── Validation (mirrors backend express-validator rules) ──────

function validateRegister(username: string, email: string, password: string): FormErrors {
  const errors: FormErrors = {};

  // Username: required, 3-30 chars, alphanumeric + underscore
  if (!username.trim()) {
    errors.username = "Username is required";
  } else if (username.trim().length < 3 || username.trim().length > 30) {
    errors.username = "Username must be 3–30 characters";
  } else if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
    errors.username = "Username may only contain letters, numbers, and underscores";
  }

  // Email: required, valid format
  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Must be a valid email address";
  }

  // Password: required, min 8, 1 uppercase, 1 digit
  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  } else if (!/[A-Z]/.test(password)) {
    errors.password = "Password must contain at least one uppercase letter";
  } else if (!/\d/.test(password)) {
    errors.password = "Password must contain at least one digit";
  }

  return errors;
}

// ─── Password strength ────────────────────────────────────────

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

// ─── Component ─────────────────────────────────────────────────

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const strength = getPasswordStrength(password);

  function handleBlur(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const validationErrors = validateRegister(username, email, password);
    setErrors((prev) => ({ ...prev, [field]: validationErrors[field as keyof FormErrors] }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError("");

    const validationErrors = validateRegister(username, email, password);
    setErrors(validationErrors);
    setTouched({ username: true, email: true, password: true });

    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await register(username.trim(), email.trim(), password);
      navigate("/dashboard");
    } catch (err: unknown) {
      const error = err as Error & { validationErrors?: { field: string; message: string }[] };
      if (error.validationErrors?.length) {
        const fieldErrors: FormErrors = {};
        for (const ve of error.validationErrors) {
          fieldErrors[ve.field as keyof FormErrors] = ve.message;
        }
        setErrors(fieldErrors);
      } else {
        setServerError(error.message || "Registration failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-surface-alt dot-grid relative">
      {/* ── Left Panel: Doodle Playground (desktop only) ── */}
      <div className="hidden lg:flex lg:w-[55%] relative items-center justify-center overflow-hidden">
        <AuthDoodles />

        {/* Ambient glow blobs */}
        <div className="absolute top-1/3 left-1/3 h-72 w-72 rounded-full bg-vivid/8 blur-[100px] pointer-events-none animate-doodle-float" />
        <div className="absolute bottom-1/3 right-1/4 h-56 w-56 rounded-full bg-vivid-light/10 blur-[80px] pointer-events-none animate-doodle-float" style={{ animationDelay: "2s" }} />

        {/* Branding */}
        <div className="relative z-10 text-center px-12">
          <h2 className="text-5xl xl:text-6xl font-black tracking-tight text-fg leading-[1.1] mb-5">
            Join the
            <br />
            <span className="bg-gradient-to-r from-vivid via-vivid-light to-purple-400 bg-clip-text text-transparent">
              Forge.
            </span>
          </h2>
          <p className="text-fg-mid text-lg max-w-md mx-auto leading-relaxed">
            Turn scattered thoughts into structured brilliance. Start forging your ideas today.
          </p>
        </div>
      </div>

      {/* ── Right Panel: Register Form ── */}
      <div className="w-full lg:w-[45%] flex items-center justify-center px-5 py-12 sm:px-8 relative">
        {/* Mobile-only doodles */}
        <div className="lg:hidden">
          <AuthDoodles />
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Mobile branding */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="text-2xl font-black tracking-tight text-fg">
              IdeaForge
            </Link>
          </div>

          {/* ── Card ── */}
          <div className="bg-white/80 backdrop-blur-xl border border-edge rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.06)] p-8 sm:p-10">
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-fg mb-2">
                Create account
              </h1>
              <p className="text-sm text-fg-mid">
                Already have an account?{" "}
                <Link to="/login" className="text-vivid font-semibold hover:text-vivid-hover transition-colors">
                  Sign in
                </Link>
              </p>
            </div>

            {/* Server error banner */}
            {serverError && (
              <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm animate-reveal-up">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Username */}
              <div>
                <label htmlFor="register-username" className="block text-xs font-semibold uppercase tracking-[0.12em] text-fg-mid mb-2">
                  Username
                </label>
                <input
                  id="register-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onBlur={() => handleBlur("username")}
                  placeholder="forge_master"
                  autoComplete="username"
                  className={`w-full min-h-12 px-4 py-3 text-sm bg-surface-alt border rounded-xl text-fg placeholder:text-fg-muted focus:outline-none focus:ring-2 transition-all duration-300 ${
                    touched.username && errors.username
                      ? "border-red-400 focus:ring-red-300"
                      : "border-edge focus:ring-vivid/30 focus:border-vivid"
                  }`}
                />
                {touched.username && errors.username && (
                  <p className="mt-1.5 text-xs text-red-500 animate-reveal-up">{errors.username}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="register-email" className="block text-xs font-semibold uppercase tracking-[0.12em] text-fg-mid mb-2">
                  Email
                </label>
                <input
                  id="register-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur("email")}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={`w-full min-h-12 px-4 py-3 text-sm bg-surface-alt border rounded-xl text-fg placeholder:text-fg-muted focus:outline-none focus:ring-2 transition-all duration-300 ${
                    touched.email && errors.email
                      ? "border-red-400 focus:ring-red-300"
                      : "border-edge focus:ring-vivid/30 focus:border-vivid"
                  }`}
                />
                {touched.email && errors.email && (
                  <p className="mt-1.5 text-xs text-red-500 animate-reveal-up">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="register-password" className="block text-xs font-semibold uppercase tracking-[0.12em] text-fg-mid mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => handleBlur("password")}
                    placeholder="Min 8 chars, 1 uppercase, 1 digit"
                    autoComplete="new-password"
                    className={`w-full min-h-12 px-4 py-3 pr-12 text-sm bg-surface-alt border rounded-xl text-fg placeholder:text-fg-muted focus:outline-none focus:ring-2 transition-all duration-300 ${
                      touched.password && errors.password
                        ? "border-red-400 focus:ring-red-300"
                        : "border-edge focus:ring-vivid/30 focus:border-vivid"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-muted hover:text-fg transition-colors p-1"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.98 8.223A10.477 10.477 0 001.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    )}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <p className="mt-1.5 text-xs text-red-500 animate-reveal-up">{errors.password}</p>
                )}

                {/* Password strength meter */}
                {password && (
                  <div className="mt-3 animate-reveal-up">
                    <div className="h-1.5 w-full bg-surface-alt rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${strength.color}`}
                        style={{ width: strength.width }}
                      />
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-fg-muted mt-1.5">
                      Strength: <span className="font-semibold">{strength.label}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full overflow-hidden min-h-12 rounded-xl bg-fg text-fg-on-dark text-sm font-semibold uppercase tracking-[0.1em] transition-all duration-300 hover:shadow-[0_0_40px_rgba(108,60,224,0.3)] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting && (
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  )}
                  {isSubmitting ? "Creating account…" : "Create Account"}
                </span>
                <span className="absolute inset-0 bg-vivid translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </button>
            </form>

            {/* Terms */}
            <p className="mt-5 text-[10px] text-fg-muted text-center leading-relaxed">
              By creating an account, you agree to our{" "}
              <a href="#" className="text-vivid hover:underline">Terms of Service</a>{" "}
              and{" "}
              <a href="#" className="text-vivid hover:underline">Privacy Policy</a>.
            </p>
          </div>

          {/* Back to home */}
          <div className="text-center mt-6">
            <Link to="/" className="text-xs text-fg-muted hover:text-fg transition-colors uppercase tracking-[0.15em] font-medium">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

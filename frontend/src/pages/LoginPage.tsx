/**
 * LoginPage
 * ---------
 * Full-page login with animated SVG doodles.
 *
 * Layout:
 *   Desktop — split: left 55% doodle playground, right 45% glassmorphic form card
 *   Mobile  — full-width form with subtle doodles behind
 *
 * Features:
 *   - Frontend validation (email + password required)
 *   - Loading spinner during API call
 *   - Server error display
 *   - Link to register page
 *   - Uses landing page theme tokens throughout
 */

import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AuthDoodles from "../components/AuthDoodles";
import { InteractiveParticles } from "../components/ui/interactive-particles";

interface FormErrors {
  identifier?: string;
  password?: string;
}

// ─── Validation ────────────────────────────────────────────────

function validateLogin(identifier: string, password: string): FormErrors {
  const errors: FormErrors = {};

  if (!identifier.trim()) {
    errors.identifier = "Username or email is required";
  }

  if (!password) {
    errors.password = "Password is required";
  }

  return errors;
}

// ─── Component ─────────────────────────────────────────────────

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  function handleBlur(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const validationErrors = validateLogin(identifier, password);
    setErrors((prev) => ({ ...prev, [field]: validationErrors[field as keyof FormErrors] }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError("");

    const validationErrors = validateLogin(identifier, password);
    setErrors(validationErrors);
    setTouched({ identifier: true, password: true });

    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await login(identifier, password);
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
        setServerError(error.message || "Login failed. Please try again.");
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
        <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-vivid/8 blur-[100px] pointer-events-none animate-doodle-float" />
        <div className="absolute bottom-1/4 right-1/4 h-56 w-56 rounded-full bg-vivid-light/10 blur-[80px] pointer-events-none animate-doodle-float" style={{ animationDelay: "2s" }} />

        {/* Branding */}
        <div className="relative z-10 text-center px-12 flex flex-col items-center gap-10 w-full">
          <div className="w-full">
            <div className="h-[250px] w-full mb-5 -mt-10">
              <InteractiveParticles 
                src="/ideaforge-text.svg" 
                background="transparent" 
                color="#6c3ce0" 
                allowUpload={false} 
              />
            </div>
            <p className="text-fg-mid text-lg max-w-md mx-auto leading-relaxed -mt-12">
              Your ideas have been waiting. Sign in and pick up right where you left off.
            </p>
          </div>
        </div>
      </div>

      {/* ── Right Panel: Login Form ── */}
      <div className="w-full lg:w-[45%] flex items-center justify-center px-5 py-12 sm:px-8 relative">
        {/* Mobile-only doodles (subtle, behind form) */}
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
                Sign in
              </h1>
              <p className="text-sm text-fg-mid">
                Don't have an account?{" "}
                <Link to="/register" className="text-vivid font-semibold hover:text-vivid-hover transition-colors">
                  Create one free
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
              {/* Identifier */}
              <div>
                <label htmlFor="login-identifier" className="block text-xs font-semibold uppercase tracking-[0.12em] text-fg-mid mb-2">
                  Username or Email
                </label>
                <input
                  id="login-identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  onBlur={() => handleBlur("identifier")}
                  placeholder="you@example.com or username"
                  autoComplete="username"
                  className={`w-full min-h-12 px-4 py-3 text-sm bg-surface-alt border rounded-xl text-fg placeholder:text-fg-muted focus:outline-none focus:ring-2 transition-all duration-300 ${touched.identifier && errors.identifier
                      ? "border-red-400 focus:ring-red-300"
                      : "border-edge focus:ring-vivid/30 focus:border-vivid"
                    }`}
                />
                {touched.identifier && errors.identifier && (
                  <p className="mt-1.5 text-xs text-red-500 animate-reveal-up">{errors.identifier}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="login-password" className="block text-xs font-semibold uppercase tracking-[0.12em] text-fg-mid mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => handleBlur("password")}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className={`w-full min-h-12 px-4 py-3 pr-12 text-sm bg-surface-alt border rounded-xl text-fg placeholder:text-fg-muted focus:outline-none focus:ring-2 transition-all duration-300 ${touched.password && errors.password
                        ? "border-red-400 focus:ring-red-300"
                        : "border-edge focus:ring-vivid/30 focus:border-vivid"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-muted hover:text-fg transition-colors p-1"
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
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full overflow-hidden min-h-12 rounded-xl bg-vivid text-fg-on-dark text-sm font-semibold transition-all duration-300 hover:shadow-[0_0_40px_rgba(108,60,224,0.3)] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting && (
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  )}
                  {isSubmitting ? "Signing in…" : "Sign In"}
                </span>
                <span className="absolute inset-0 bg-vivid-hover translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-edge" />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-fg-muted">or</span>
              <div className="flex-1 h-px bg-edge" />
            </div>

            {/* OAuth placeholder */}
            <button
              disabled
              className="w-full min-h-12 rounded-xl border border-edge bg-surface-alt text-fg-mid text-sm font-medium flex items-center justify-center gap-3 cursor-not-allowed opacity-50 transition-all"
              title="Coming soon"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google — Coming Soon
            </button>
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

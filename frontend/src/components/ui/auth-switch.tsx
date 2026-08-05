import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

type AuthSwitchMode = "login" | "register";

type AuthSwitchProps = {
  mode: AuthSwitchMode;
  className?: string;
};

function AuthSwitch({ mode, className }: AuthSwitchProps) {
  const isLogin = mode === "login";

  return (
    <div className={cn("space-y-4", className)}>
      <div>
        <h1 className="mb-2 text-2xl font-black tracking-tight text-fg dark:text-white sm:text-3xl">
          {isLogin ? "Sign in" : "Create account"}
        </h1>
        <p className="text-sm text-fg-mid dark:text-slate-400">
          {isLogin
            ? "Pick up your ideas right where you left off."
            : "Start turning scattered thoughts into structured brilliance."}
        </p>
      </div>

      <div className="grid grid-cols-2 rounded-xl border border-edge dark:border-white/10 bg-surface-alt dark:bg-[#181524] p-1 text-sm font-semibold">
        <Link
          to="/login"
          aria-current={isLogin ? "page" : undefined}
          className={cn(
            "flex min-h-10 items-center justify-center rounded-lg px-3 text-center transition-all duration-200",
            isLogin
              ? "bg-white dark:bg-[#252038] text-fg dark:text-white shadow-sm dark:shadow-md border border-transparent dark:border-white/10"
              : "text-fg-mid dark:text-slate-400 hover:text-fg dark:hover:text-white"
          )}
        >
          Sign in
        </Link>
        <Link
          to="/register"
          aria-current={!isLogin ? "page" : undefined}
          className={cn(
            "flex min-h-10 items-center justify-center rounded-lg px-3 text-center transition-all duration-200",
            !isLogin
              ? "bg-white dark:bg-[#252038] text-fg dark:text-white shadow-sm dark:shadow-md border border-transparent dark:border-white/10"
              : "text-fg-mid dark:text-slate-400 hover:text-fg dark:hover:text-white"
          )}
        >
          Create one
        </Link>
      </div>
    </div>
  );
}

export { AuthSwitch, AuthSwitch as Component };
export default AuthSwitch;

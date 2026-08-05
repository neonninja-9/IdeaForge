import { Link } from "react-router-dom"

import { cn } from "@/lib/utils"

type AuthSwitchMode = "login" | "register"

type AuthSwitchProps = {
  mode: AuthSwitchMode
  className?: string
}

function AuthSwitch({ mode, className }: AuthSwitchProps) {
  const isLogin = mode === "login"

  return (
    <div className={cn("space-y-4", className)}>
      <div>
        <h1 className="mb-2 text-2xl font-black tracking-tight text-fg sm:text-3xl">
          {isLogin ? "Sign in" : "Create account"}
        </h1>
        <p className="text-sm text-fg-mid">
          {isLogin
            ? "Pick up your ideas right where you left off."
            : "Start turning scattered thoughts into structured brilliance."}
        </p>
      </div>

      <div className="grid grid-cols-2 rounded-xl border border-edge bg-surface-alt p-1 text-sm font-semibold">
        <Link
          to="/login"
          aria-current={isLogin ? "page" : undefined}
          className={cn(
            "flex min-h-10 items-center justify-center rounded-lg px-3 text-center transition-colors",
            isLogin
              ? "bg-white text-fg shadow-sm"
              : "text-fg-mid hover:text-fg"
          )}
        >
          Sign in
        </Link>
        <Link
          to="/register"
          aria-current={!isLogin ? "page" : undefined}
          className={cn(
            "flex min-h-10 items-center justify-center rounded-lg px-3 text-center transition-colors",
            !isLogin
              ? "bg-white text-fg shadow-sm"
              : "text-fg-mid hover:text-fg"
          )}
        >
          Create one
        </Link>
      </div>
    </div>
  )
}

export { AuthSwitch, AuthSwitch as Component }
export default AuthSwitch

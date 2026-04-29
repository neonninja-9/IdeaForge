"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";
import Link from "next/link";

export default function LoginPage() {
  const [errorMessage, dispatch, isPending] = useActionState(
    async (prevState: string | undefined, formData: FormData) => {
      const result = await loginAction(formData);
      return result?.error || undefined;
    },
    undefined
  );

  return (
    <div className="max-w-md mx-auto px-5 sm:px-6 py-20">
      <div className="bg-white border border-edge rounded-3xl p-8 shadow-sm">
        <h1 className="text-3xl font-black tracking-tight mb-2 text-center text-fg">Sign In</h1>
        <p className="text-fg-mid text-center mb-8">Welcome back to IdeaForge</p>

        <form action={dispatch} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2 text-fg" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-3 bg-surface border border-edge rounded-xl focus:outline-none focus:ring-2 focus:ring-vivid/50"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-fg" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="w-full px-4 py-3 bg-surface border border-edge rounded-xl focus:outline-none focus:ring-2 focus:ring-vivid/50"
              placeholder="••••••••"
            />
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 bg-fg text-fg-on-dark font-semibold rounded-xl hover:bg-vivid transition-colors disabled:opacity-70 flex justify-center"
          >
            {isPending ? (
              <span className="animate-pulse">Signing in...</span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-fg-mid">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-vivid hover:underline font-semibold">
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}

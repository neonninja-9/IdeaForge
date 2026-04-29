"use client";

import { useActionState, useEffect } from "react";
import { registerAction } from "./actions";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [state, dispatch, isPending] = useActionState(registerAction, undefined);

  useEffect(() => {
    if (state?.success) {
      router.push("/login?registered=true");
    }
  }, [state, router]);

  return (
    <div className="max-w-md mx-auto px-5 sm:px-6 py-20">
      <div className="bg-white border border-edge rounded-3xl p-8 shadow-sm">
        <h1 className="text-3xl font-black tracking-tight mb-2 text-center text-fg">Create Account</h1>
        <p className="text-fg-mid text-center mb-8">Join IdeaForge today</p>

        <form action={dispatch} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2 text-fg" htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-3 bg-surface border border-edge rounded-xl focus:outline-none focus:ring-2 focus:ring-vivid/50"
              placeholder="John Doe"
            />
            {state?.fields?.name && (
              <p className="text-red-500 text-xs mt-1">{state.fields.name[0]}</p>
            )}
          </div>

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
            {state?.fields?.email && (
              <p className="text-red-500 text-xs mt-1">{state.fields.email[0]}</p>
            )}
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
            {state?.fields?.password && (
              <p className="text-red-500 text-xs mt-1">{state.fields.password[0]}</p>
            )}
          </div>

          {state?.error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100">
              {state.error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 bg-fg text-fg-on-dark font-semibold rounded-xl hover:bg-vivid transition-colors disabled:opacity-70 flex justify-center"
          >
            {isPending ? (
              <span className="animate-pulse">Creating account...</span>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-fg-mid">
          Already have an account?{" "}
          <Link href="/login" className="text-vivid hover:underline font-semibold">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

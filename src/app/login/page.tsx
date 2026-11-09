"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/app-store";

export default function LoginPage() {
  const router = useRouter();
  const { login, signup } = useApp();
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const result = mode === "login" ? await login(email, password) : await signup(email, password);
    setBusy(false);
    if (result.error) return setError(result.error);
    router.push("/profile");
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-10 sm:px-6">
      <div className="card-surface rounded-[28px] p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rust/80">Account</p>
        <h1 className="mt-2 text-3xl font-semibold text-brown">
          {mode === "login" ? "Welcome back" : "Create your artist account"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-brown/75">
          Use your email to sign in. For production Gmail/Google sign-in, configure Supabase Auth
          with the Google provider and set the keys in <code>.env.local</code>.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-brown">Email</span>
            <input
              className="input-autumn"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@gmail.com"
              autoComplete="email"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-brown">Password</span>
            <input
              className="input-autumn"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
          </label>
          {error ? <p className="rounded-xl bg-[rgba(168,93,68,0.12)] px-3 py-2 text-sm text-rust">{error}</p> : null}
          <button type="submit" disabled={busy} className="btn-primary w-full">
            {busy ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}
          </button>
        </form>
        <button
          className="mt-4 text-sm font-medium text-rust underline decoration-[rgba(168,93,68,0.3)]"
          onClick={() => setMode((m) => (m === "login" ? "signup" : "login"))}
        >
          {mode === "login" ? "Need an account? Sign up" : "Already have an account? Log in"}
        </button>
      </div>
    </main>
  );
}

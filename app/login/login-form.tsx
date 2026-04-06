"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { formatAuthError } from "@/lib/auth-errors";
import { validateEmail, validatePassword } from "@/lib/auth-validation";
import { supabase } from "@/lib/supabaseClient";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    form?: string;
  }>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (active && data.session) {
        router.replace("/profile");
      }
    });
    return () => {
      active = false;
    };
  }, [router]);

  const runValidation = useCallback(() => {
    const e = validateEmail(email);
    const p = validatePassword(password);
    setErrors({
      email: e,
      password: p,
      form: undefined,
    });
    return !e && !p;
  }, [email, password]);

  async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    setSubmitted(true);
    setErrors((prev) => ({ ...prev, form: undefined }));
    if (!runValidation()) return;

    setLoading(true);
    try {
      const trimmed = email.trim();
      const { error } = await supabase.auth.signInWithPassword({
        email: trimmed,
        password,
      });
      if (error) {
        setErrors((prev) => ({
          ...prev,
          form: formatAuthError(error),
        }));
        return;
      }
      router.push("/profile");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  function onEmailChange(v: string) {
    setEmail(v);
    if (submitted) {
      const e = validateEmail(v);
      setErrors((prev) => ({ ...prev, email: e, form: undefined }));
    }
  }

  function onPasswordChange(v: string) {
    setPassword(v);
    if (submitted) {
      const p = validatePassword(v);
      setErrors((prev) => ({ ...prev, password: p, form: undefined }));
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue your search for next semester."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-teal-700 underline-offset-4 hover:text-teal-800 hover:underline"
          >
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {errors.form && (
          <p
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
            role="alert"
          >
            {errors.form}
          </p>
        )}

        <div>
          <label
            htmlFor="login-email"
            className="block text-sm font-medium text-zinc-700"
          >
            Email
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "login-email-error" : undefined}
            className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            placeholder="you@thapar.edu"
          />
          {errors.email && (
            <p id="login-email-error" className="mt-1.5 text-sm text-red-600">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="login-password"
            className="block text-sm font-medium text-zinc-700"
          >
            Password
          </label>
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            aria-invalid={errors.password ? true : undefined}
            aria-describedby={
              errors.password ? "login-password-error" : undefined
            }
            className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            placeholder="••••••••"
          />
          {errors.password && (
            <p id="login-password-error" className="mt-1.5 text-sm text-red-600">
              {errors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-zinc-900 py-3 text-base font-semibold text-white shadow-md transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Log in"}
        </button>
      </form>
    </AuthShell>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { formatAuthError } from "@/lib/auth-errors";
import {
  validatePassword,
  validatePasswordMatch,
  validateThaparEmail,
} from "@/lib/auth-validation";
import { supabase } from "@/lib/supabaseClient";

export function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
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
    const e = validateThaparEmail(email);
    const p = validatePassword(password);
    const c = validatePasswordMatch(password, confirmPassword);
    setErrors({
      email: e,
      password: p,
      confirmPassword: c,
      form: undefined,
    });
    return !e && !p && !c;
  }, [email, password, confirmPassword]);

  async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    setSubmitted(true);
    setErrors((prev) => ({ ...prev, form: undefined }));
    if (!runValidation()) return;

    setLoading(true);
    try {
      const trimmed = email.trim();
      const { data, error } = await supabase.auth.signUp({
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
      setErrors((prev) => ({
        ...prev,
        email: validateThaparEmail(v),
        form: undefined,
      }));
    }
  }

  function onPasswordChange(v: string) {
    setPassword(v);
    if (submitted) {
      setErrors((prev) => ({
        ...prev,
        password: validatePassword(v),
        confirmPassword: validatePasswordMatch(v, confirmPassword),
        form: undefined,
      }));
    }
  }

  function onConfirmChange(v: string) {
    setConfirmPassword(v);
    if (submitted) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validatePasswordMatch(password, v),
        form: undefined,
      }));
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Create a profile and start finding roommates for next semester."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-teal-700 underline-offset-4 hover:text-teal-800 hover:underline"
          >
            Log in
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
            htmlFor="signup-email"
            className="block text-sm font-medium text-zinc-700"
          >
            Email
          </label>
          <input
            id="signup-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "signup-email-error" : undefined}
            className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            placeholder="you@thapar.edu"
          />
          {errors.email && (
            <p id="signup-email-error" className="mt-1.5 text-sm text-red-600">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="signup-password"
            className="block text-sm font-medium text-zinc-700"
          >
            Password
          </label>
          <input
            id="signup-password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            aria-invalid={errors.password ? true : undefined}
            aria-describedby={
              errors.password ? "signup-password-error" : undefined
            }
            className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            placeholder="At least 8 characters"
          />
          {errors.password && (
            <p
              id="signup-password-error"
              className="mt-1.5 text-sm text-red-600"
            >
              {errors.password}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="signup-confirm"
            className="block text-sm font-medium text-zinc-700"
          >
            Confirm password
          </label>
          <input
            id="signup-confirm"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => onConfirmChange(e.target.value)}
            aria-invalid={errors.confirmPassword ? true : undefined}
            aria-describedby={
              errors.confirmPassword ? "signup-confirm-error" : undefined
            }
            className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            placeholder="Repeat password"
          />
          {errors.confirmPassword && (
            <p
              id="signup-confirm-error"
              className="mt-1.5 text-sm text-red-600"
            >
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-zinc-900 py-3 text-base font-semibold text-white shadow-md transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-60"
        >
          {loading ? "Creating account…" : "Sign up"}
        </button>
      </form>
    </AuthShell>
  );
}

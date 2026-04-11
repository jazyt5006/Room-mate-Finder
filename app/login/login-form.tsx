"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { formatAuthError } from "@/lib/auth-errors";
import { validatePassword, validateThaparEmail } from "@/lib/auth-validation";
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    void supabase.auth.getSession().then(async ({ data }) => {
      if (active && data.session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id, gender, branch")
          .eq("id", data.session.user.id)
          .single();
        if (active) {
          const complete = profile && profile.gender && profile.branch;
          router.replace(complete ? "/matches" : "/profile");
        }
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!active) return;
      if (session && (event === "SIGNED_IN" || event === "TOKEN_REFRESHED")) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id, gender, branch")
          .eq("id", session.user.id)
          .single();
        if (active) {
          const complete = profile && profile.gender && profile.branch;
          router.replace(complete ? "/matches" : "/profile");
        }
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [router]);

  async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const emailError = validateThaparEmail(email);
    const passwordError = validatePassword(password);
    setErrors({ email: emailError, password: passwordError, form: undefined });
    if (emailError || passwordError) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        setErrors((prev) => ({ ...prev, form: formatAuthError(error) }));
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, gender, branch")
        .eq("id", (await supabase.auth.getSession()).data.session?.user.id)
        .single();
      const complete = profile && profile.gender && profile.branch;
      router.push(complete ? "/matches" : "/profile");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  function onEmailChange(v: string) {
    setEmail(v);
    setErrors((prev) => ({ ...prev, email: undefined, form: undefined }));
  }

  function onPasswordChange(v: string) {
    setPassword(v);
    setErrors((prev) => ({ ...prev, password: undefined, form: undefined }));
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in with your verified Thapar email and password."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-purple-600 underline-offset-4 hover:text-purple-700 hover:underline"
          >
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="rounded-2xl border border-purple-100 bg-purple-50/70 px-4 py-3 text-sm text-purple-900 font-medium">
          Only verified <span className="font-semibold">@thapar.edu</span>{" "}
          accounts can sign in.
        </div>
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
            className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 hover:border-slate-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
            placeholder="you@thapar.edu"
            disabled={loading}
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
            className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 hover:border-slate-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
            placeholder="Enter your password"
            disabled={loading}
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
          className="w-full rounded-full bg-gradient-to-r from-purple-600 to-pink-500 py-3.5 text-base font-bold text-white shadow-xl shadow-purple-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-purple-500/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Log in"}
        </button>
      </form>
    </AuthShell>
  );
}

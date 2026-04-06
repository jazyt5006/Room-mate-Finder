"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"signup" | "verify">("signup");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    otp?: string;
    form?: string;
  }>({});
  const [signupLoading, setSignupLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (active && data.session) {
        router.replace("/profile");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (session && (event === "SIGNED_IN" || event === "TOKEN_REFRESHED")) {
        router.replace("/profile");
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [router]);

  async function handleSignup(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const emailError = validateThaparEmail(email);
    const passwordError = validatePassword(password);
    const confirmError = validatePasswordMatch(password, confirmPassword);
    setErrors({
      email: emailError,
      password: passwordError,
      confirmPassword: confirmError,
      otp: undefined,
      form: undefined,
    });
    setNotice(null);
    if (emailError || passwordError || confirmError) return;

    setSignupLoading(true);
    try {
      const trimmed = email.trim();
      const { data, error } = await supabase.auth.signUp({
        email: trimmed,
        password,
        options: { emailRedirectTo: `${window.location.origin}/profile` },
      });
      if (error) {
        setErrors((prev) => ({
          ...prev,
          form: formatAuthError(error),
        }));
        return;
      }

      if (data.session) {
        // If email confirmations are off, keep behavior consistent.
        router.push("/profile");
        router.refresh();
        return;
      }

      setStep("verify");
      setNotice(
        "Verification code sent. Enter the 6-digit code from your email to activate your account."
      );
    } finally {
      setSignupLoading(false);
    }
  }

  async function handleVerifyOtp(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const emailError = validateThaparEmail(email);
    const token = otp.trim();
    const otpError =
      token.length === 6 ? undefined : "Enter the 6-digit OTP code.";
    setErrors({ email: emailError, otp: otpError, form: undefined });
    setNotice(null);
    if (emailError || otpError) return;

    setVerifyLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token,
        type: "signup",
      });
      if (error) {
        setErrors((prev) => ({ ...prev, form: formatAuthError(error) }));
        return;
      }
      setNotice("Verification successful. Redirecting to your profile...");
      router.push("/profile");
      router.refresh();
    } finally {
      setVerifyLoading(false);
    }
  }

  async function handleResendCode() {
    setErrors((prev) => ({ ...prev, form: undefined }));
    setNotice(null);
    setResendLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email.trim(),
        options: { emailRedirectTo: `${window.location.origin}/profile` },
      });
      if (error) {
        setErrors((prev) => ({ ...prev, form: formatAuthError(error) }));
        return;
      }
      setNotice("A fresh verification code has been sent to your email.");
    } finally {
      setResendLoading(false);
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

  function onConfirmPasswordChange(v: string) {
    setConfirmPassword(v);
    setErrors((prev) => ({
      ...prev,
      confirmPassword: undefined,
      form: undefined,
    }));
  }

  function onOtpChange(v: string) {
    const cleaned = v.replace(/\D/g, "").slice(0, 6);
    setOtp(cleaned);
    setErrors((prev) => ({ ...prev, otp: undefined, form: undefined }));
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Sign up with your Thapar email, then verify your email code."
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
      <form
        onSubmit={step === "signup" ? handleSignup : handleVerifyOtp}
        className="space-y-5"
        noValidate
      >
        <div className="rounded-2xl border border-teal-100 bg-teal-50/70 px-4 py-3 text-sm text-teal-900">
          Only <span className="font-semibold">@thapar.edu</span> email
          addresses are allowed.
        </div>
        {errors.form && (
          <p
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
            role="alert"
          >
            {errors.form}
          </p>
        )}
        {notice && (
          <p
            className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
            role="status"
          >
            {notice}
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
            className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 hover:border-zinc-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            placeholder="you@thapar.edu"
            disabled={step === "verify" || signupLoading || verifyLoading || resendLoading}
          />
          {errors.email && (
            <p id="signup-email-error" className="mt-1.5 text-sm text-red-600">
              {errors.email}
            </p>
          )}
        </div>

        {step === "signup" && (
          <>
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
                className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 hover:border-zinc-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                placeholder="At least 8 characters"
                disabled={signupLoading}
              />
              {errors.password && (
                <p id="signup-password-error" className="mt-1.5 text-sm text-red-600">
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="signup-confirm-password"
                className="block text-sm font-medium text-zinc-700"
              >
                Confirm password
              </label>
              <input
                id="signup-confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => onConfirmPasswordChange(e.target.value)}
                aria-invalid={errors.confirmPassword ? true : undefined}
                aria-describedby={
                  errors.confirmPassword
                    ? "signup-confirm-password-error"
                    : undefined
                }
                className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 hover:border-zinc-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                placeholder="Repeat your password"
                disabled={signupLoading}
              />
              {errors.confirmPassword && (
                <p
                  id="signup-confirm-password-error"
                  className="mt-1.5 text-sm text-red-600"
                >
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </>
        )}

        {step === "verify" && (
          <div>
            <label htmlFor="signup-otp" className="block text-sm font-medium text-zinc-700">
              Enter OTP code
            </label>
            <input
              id="signup-otp"
              name="otp"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="one-time-code"
              value={otp}
              onChange={(e) => onOtpChange(e.target.value)}
              aria-invalid={errors.otp ? true : undefined}
              aria-describedby={errors.otp ? "signup-otp-error" : undefined}
              className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-center text-lg tracking-[0.25em] text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 hover:border-zinc-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
              placeholder="000000"
              disabled={verifyLoading || resendLoading}
            />
            {errors.otp && (
              <p id="signup-otp-error" className="mt-1.5 text-sm text-red-600">
                {errors.otp}
              </p>
            )}
          </div>
        )}

        {step === "signup" ? (
          <button
            type="submit"
            disabled={signupLoading}
            className="w-full rounded-full bg-zinc-900 py-3 text-base font-semibold text-white shadow-md transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-60"
          >
            {signupLoading ? "Creating account..." : "Sign up"}
          </button>
        ) : (
          <div className="space-y-3">
            <button
              type="submit"
              disabled={verifyLoading || resendLoading}
              className="w-full rounded-full bg-zinc-900 py-3 text-base font-semibold text-white shadow-md transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-60"
            >
              {verifyLoading ? "Verifying..." : "Verify email and continue"}
            </button>
            <button
              type="button"
              onClick={() => void handleResendCode()}
              disabled={verifyLoading || resendLoading}
              className="w-full rounded-full border border-teal-300 bg-teal-50 py-3 text-sm font-semibold text-teal-800 transition hover:bg-teal-100 disabled:pointer-events-none disabled:opacity-60"
            >
              {resendLoading ? "Resending code..." : "Resend verification code"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("signup");
                setOtp("");
                setNotice(null);
                setErrors((prev) => ({ ...prev, otp: undefined, form: undefined }));
              }}
              disabled={signupLoading || verifyLoading || resendLoading}
              className="w-full rounded-full border border-zinc-300 bg-white py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-60"
            >
              Edit signup details
            </button>
          </div>
        )}
      </form>
    </AuthShell>
  );
}

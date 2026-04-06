import type { AuthError } from "@supabase/supabase-js";

export function formatAuthError(error: AuthError): string {
  const raw = error.message ?? "Something went wrong.";
  const lower = raw.toLowerCase();

  if (
    lower.includes("invalid login credentials") ||
    lower.includes("invalid credentials")
  ) {
    return "Invalid email or password.";
  }
  if (lower.includes("otp") || lower.includes("token")) {
    return "Invalid or expired OTP. Request a new code and try again.";
  }
  if (
    lower.includes("already registered") ||
    lower.includes("user already registered")
  ) {
    return "An account with this email already exists. Try logging in.";
  }
  if (lower.includes("signups not allowed for otp")) {
    return "Signups are disabled for OTP in Supabase settings.";
  }
  if (lower.includes("password should be at least")) {
    return "Password must be at least 8 characters long.";
  }
  if (lower.includes("email not confirmed")) {
    return "Verify your email before logging in. Check your inbox for the verification code or link.";
  }

  return raw;
}

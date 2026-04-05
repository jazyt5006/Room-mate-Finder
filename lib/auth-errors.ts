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
  if (
    lower.includes("already registered") ||
    lower.includes("user already registered")
  ) {
    return "An account with this email already exists. Try logging in.";
  }
  if (lower.includes("email not confirmed")) {
    return "Confirm your email before signing in.";
  }

  return raw;
}

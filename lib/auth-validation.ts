const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const THAPAR_DOMAIN_RE = /^[^\s@]+@thapar\.edu$/i;

export const MIN_PASSWORD_LENGTH = 8;

export function validateEmail(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return "Email is required.";
  if (!EMAIL_RE.test(trimmed)) return "Enter a valid email address.";
  return undefined;
}

export function validateThaparEmail(value: string): string | undefined {
  const base = validateEmail(value);
  if (base) return base;
  if (!THAPAR_DOMAIN_RE.test(value.trim())) {
    return "Use your @thapar.edu email address.";
  }
  return undefined;
}

export function validatePassword(value: string): string | undefined {
  if (!value) return "Password is required.";
  if (value.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  return undefined;
}

export function validatePasswordMatch(
  password: string,
  confirm: string
): string | undefined {
  if (!confirm) return "Please confirm your password.";
  if (password !== confirm) return "Passwords do not match.";
  return undefined;
}

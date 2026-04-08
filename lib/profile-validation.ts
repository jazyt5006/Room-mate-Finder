export function validateName(value: string): string | undefined {
  const t = value.trim();
  if (!t) return "Name is required.";
  if (t.length < 2) return "Enter your full name.";
  return undefined;
}

export function validateBranch(value: string): string | undefined {
  const t = value.trim();
  if (!t) return "Branch is required.";
  return undefined;
}

export function validateYear(value: string): string | undefined {
  if (!value) return "Select your year.";
  return undefined;
}

export function validateCgpa(value: string): string | undefined {
  if (value === "") return "CGPA is required.";
  const n = Number(value);
  if (Number.isNaN(n)) return "Enter a valid number.";
  if (n < 0 || n > 10) return "CGPA must be between 0 and 10.";
  return undefined;
}

export function validateGender(value: string): string | undefined {
  if (!value) return "Select your gender.";
  if (value !== "Male" && value !== "Female") return "Invalid gender selection.";
  return undefined;
}

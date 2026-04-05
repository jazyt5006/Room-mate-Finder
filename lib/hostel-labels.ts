/** Labels for `hostel_preference` values stored in Supabase (aligned with profile form). */
export const HOSTEL_LABELS: Record<string, string> = {
  "": "Not specified",
  none: "No preference",
  j: "Hostel J",
  k: "Hostel K",
  l: "Hostel L",
  m: "Hostel M",
  n: "Hostel N",
  other: "Other / off-campus",
};

export function formatHostelPreference(value: string): string {
  if (value in HOSTEL_LABELS) return HOSTEL_LABELS[value];
  return value.trim() || "Not specified";
}

/** Labels for `hostel_preference` values stored in Supabase (aligned with profile form). */
export const HOSTEL_LABELS: Record<string, string> = {
  "": "Not specified",
  none: "No preference",
  a: "Hostel A",
  b: "Hostel B",
  c: "Hostel C",
  d: "Hostel D",
  e: "Hostel E",
  f: "Hostel F",
  g: "Hostel G",
  h: "Hostel H",
  i: "Hostel I",
  j: "Hostel J",
  k: "Hostel K",
  l: "Hostel L",
  m: "Hostel M",
  n: "Hostel N",
  o: "Hostel O",
  p: "Hostel - PG",
  pg: "Hostel - PG",
  q: "Hostel Q",
  frf: "Hostel FRF",
  frg: "Hostel FRG",
  other: "Other / off-campus",
};

export function formatHostelPreference(value: string): string {
  if (value in HOSTEL_LABELS) return HOSTEL_LABELS[value];
  return value.trim() || "Not specified";
}

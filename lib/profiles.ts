import type { CompatibilityTraits } from "@/lib/compatibility-score";
import { supabase } from "@/lib/supabaseClient";

/** Row shape for `public.profiles` — align column names with your Supabase table. */
export type ProfileRow = {
  id: string;
  full_name: string;
  branch: string;
  year: number;
  cgpa: number;
  hostel_preference: string;
  cleanliness: number;
  sleep_cycle: number;
  social_habits: number;
  study_habits: number;
  noise_tolerance: number;
  guests_frequency: number;
  gender: string;
  last_active?: string;
};

export async function upsertProfile(row: ProfileRow) {
  return supabase.from("profiles").upsert(row, { onConflict: "id" });
}

export async function fetchProfileById(userId: string) {
  return supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
}

export async function updateLastActive(userId: string) {
  return supabase
    .from("profiles")
    .update({ last_active: new Date().toISOString() })
    .eq("id", userId);
}

export function profileToCompatibilityTraits(
  row: ProfileRow
): CompatibilityTraits {
  return {
    cgpa: Number(row.cgpa),
    cleanliness: row.cleanliness,
    sleepCycle: row.sleep_cycle,
    socialHabits: row.social_habits,
    studyHabits: row.study_habits,
    noiseTolerance: row.noise_tolerance,
    guestsFrequency: row.guests_frequency,
    branch: row.branch,
  };
}

export function calculateProfileCompletion(profile: Partial<ProfileRow> | null): number {
  if (!profile) return 0;

  const fields = [
    profile.full_name,
    profile.branch,
    profile.cgpa !== null && profile.cgpa !== undefined,
    profile.year,
    profile.gender,
    profile.hostel_preference,
    profile.cleanliness,
    profile.sleep_cycle,
    profile.social_habits,
    profile.study_habits,
    profile.noise_tolerance,
    profile.guests_frequency,
  ];

  const total = fields.length;
  const filled = fields.filter((f) => {
    if (typeof f === "string") return f.trim().length > 0;
    if (typeof f === "number") return true; 
    if (typeof f === "boolean") return f;
    return !!f;
  }).length;

  return Math.round((filled / total) * 100);
}

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
};

export async function upsertProfile(row: ProfileRow) {
  return supabase.from("profiles").upsert(row, { onConflict: "id" });
}

export function profileToCompatibilityTraits(
  row: ProfileRow
): CompatibilityTraits {
  return {
    cgpa: Number(row.cgpa),
    cleanliness: row.cleanliness,
    sleepCycle: row.sleep_cycle,
    socialHabits: row.social_habits,
  };
}

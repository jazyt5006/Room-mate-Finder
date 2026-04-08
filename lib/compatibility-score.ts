/**
 * Numeric traits used to compare two students for roommate fit.
 * CGPA is on the usual 0–10 scale; lifestyle fields use 1–5 (as on the profile form).
 */

export type CompatibilityTraits = {
  cgpa: number;
  cleanliness: number;
  sleepCycle: number;
  socialHabits: number;
  branch?: string;
};

/**
 * Calculates compatibility score based on specific point rules.
 * Max points = 90. Normalized to 100%.
 */
export function calculateCompatibilityScore(
  a: CompatibilityTraits,
  b: CompatibilityTraits
): number {
  let points = 0;

  // Same branch -> +20
  if (a.branch && b.branch && a.branch.toLowerCase() === b.branch.toLowerCase()) {
    points += 20;
  }

  // CGPA difference <= 0.5 -> +15
  if (Math.abs(a.cgpa - b.cgpa) <= 0.5) {
    points += 15;
  }

  // Cleanliness difference <= 1 -> +20
  if (Math.abs(a.cleanliness - b.cleanliness) <= 1) {
    points += 20;
  }

  // Sleep cycle similar (diff <= 1) -> +20
  if (Math.abs(a.sleepCycle - b.sleepCycle) <= 1) {
    points += 20;
  }

  // Social habits similar (diff <= 1) -> +15
  if (Math.abs(a.socialHabits - b.socialHabits) <= 1) {
    points += 15;
  }

  // Normalize points (0-90) to a percentage (0-100)
  const MAX_POINTS = 90;
  const percentage = (points / MAX_POINTS) * 100;
  
  return Math.round(percentage);
}

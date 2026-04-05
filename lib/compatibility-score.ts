/**
 * Numeric traits used to compare two students for roommate fit.
 * CGPA is on the usual 0–10 scale; lifestyle fields use 1–5 (as on the profile form).
 */
export type CompatibilityTraits = {
  cgpa: number;
  cleanliness: number;
  sleepCycle: number;
  socialHabits: number;
};

const MAX_CGPA = 10;
const MIN_SCALE = 1;
const MAX_SCALE = 5;

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/** 0 = no overlap, 100 = identical CGPA (after clamping to 0–10). */
export function cgpaSimilarityPercent(a: number, b: number): number {
  const ca = clamp(a, 0, MAX_CGPA);
  const cb = clamp(b, 0, MAX_CGPA);
  const diff = Math.abs(ca - cb);
  return 100 * (1 - diff / MAX_CGPA);
}

/** 0 = opposite ends of the scale, 100 = same rating (1–5). */
export function scaleSimilarityPercent(a: number, b: number): number {
  const sa = clamp(a, MIN_SCALE, MAX_SCALE);
  const sb = clamp(b, MIN_SCALE, MAX_SCALE);
  const maxDiff = MAX_SCALE - MIN_SCALE;
  const diff = Math.abs(sa - sb);
  return 100 * (1 - diff / maxDiff);
}

/**
 * Overall roommate compatibility as a percentage (0–100).
 * Combines CGPA closeness and similarity on cleanliness, sleep cycle, and social habits.
 * Each of the four factors is weighted equally (25%).
 */
export function calculateCompatibilityScore(
  a: CompatibilityTraits,
  b: CompatibilityTraits
): number {
  const parts = [
    cgpaSimilarityPercent(a.cgpa, b.cgpa),
    scaleSimilarityPercent(a.cleanliness, b.cleanliness),
    scaleSimilarityPercent(a.sleepCycle, b.sleepCycle),
    scaleSimilarityPercent(a.socialHabits, b.socialHabits),
  ];
  const avg = parts.reduce((sum, p) => sum + p, 0) / parts.length;
  return Math.round(avg * 100) / 100;
}

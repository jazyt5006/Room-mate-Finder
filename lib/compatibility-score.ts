/**
 * Numeric traits used to compare two students for roommate fit.
 * CGPA is on the usual 0–10 scale; lifestyle fields use 1–5 (as on the profile form).
 */

export type CompatibilityTraits = {
  cgpa: number;
  cleanliness: number;
  sleepCycle: number;
  socialHabits: number;
  studyHabits: number;
  noiseTolerance: number;
  guestsFrequency: number;
  branch?: string;
};

export type MatchResult = {
  score: number;
  reasons: string[];
};
/**
 * Calculates compatibility score based on specific point rules.
 * Max points = 90. Normalized to 100%.
 */
export function calculateCompatibilityScore(
  a: CompatibilityTraits,
  b: CompatibilityTraits
): MatchResult {
  // Dealbreaker Enforcement Phase
  const sleepDiff = Math.abs(a.sleepCycle - b.sleepCycle);
  const guestsDiff = Math.abs(a.guestsFrequency - b.guestsFrequency);
  const noiseDiff = Math.abs(a.noiseTolerance - b.noiseTolerance);
  
  if (sleepDiff >= 3 || guestsDiff >= 3 || noiseDiff >= 3) {
    return {
      score: 0,
      reasons: ["Fundamentally incompatible lifestyles"],
    };
  }
  let points = 0;
  const reasons: string[] = ["Same hostel"]; // Since hostel is a hard filter prerequisite

  // Helper for 1-5 scale normalized similarity
  const calcSim = (valA: number, valB: number) => 1 - Math.abs(valA - valB) / 4;

  // -- ACADEMIC (30 max) --
  // CGPA (20)
  const cgpaSim = 1 - Math.min(Math.abs(a.cgpa - b.cgpa) / 2, 1);
  points += 20 * cgpaSim;
  if (cgpaSim >= 0.75) reasons.push("Similar CGPA");

  // Branch (10)
  if (a.branch && b.branch && a.branch.toLowerCase() === b.branch.toLowerCase()) {
    points += 10;
    reasons.push("Same branch");
  }

  // -- LIFESTYLE (35 max) --
  // Cleanliness (10)
  const cleanSim = calcSim(a.cleanliness, b.cleanliness);
  points += 10 * cleanSim;
  if (cleanSim >= 0.75) {
    if (a.cleanliness >= 4 && b.cleanliness >= 4) reasons.push("Very tidy");
    else reasons.push("Matching cleanliness");
  }

  // Sleep cycle (15)
  const sleepSim = calcSim(a.sleepCycle, b.sleepCycle);
  points += 15 * sleepSim;
  if (sleepSim >= 0.75) {
    if (a.sleepCycle >= 4 && b.sleepCycle >= 4) reasons.push("Night owls");
    else if (a.sleepCycle <= 2 && b.sleepCycle <= 2) reasons.push("Early birds");
    else reasons.push("Matching sleep cycle");
  }

  // Social habits (10)
  const socialSim = calcSim(a.socialHabits, b.socialHabits);
  points += 10 * socialSim;
  if (socialSim >= 0.75) {
    if (a.socialHabits >= 4 && b.socialHabits >= 4) reasons.push("Highly social");
    else if (a.socialHabits <= 2 && b.socialHabits <= 2) reasons.push("Introverts");
    else reasons.push("Similar social habits");
  }

  // -- BEHAVIOR (35 max) --
  // Study habits (15)
  const studySim = calcSim(a.studyHabits, b.studyHabits);
  points += 15 * studySim;
  if (studySim >= 0.75) {
    if (a.studyHabits >= 4 && b.studyHabits >= 4) reasons.push("Study focused");
    else reasons.push("Similar study habits");
  }

  // Noise tolerance (10)
  const noiseSim = calcSim(a.noiseTolerance, b.noiseTolerance);
  points += 10 * noiseSim;
  if (noiseSim >= 0.75) {
    if (a.noiseTolerance >= 4 && b.noiseTolerance >= 4) reasons.push("Noise tolerant");
    else if (a.noiseTolerance <= 2 && b.noiseTolerance <= 2) reasons.push("Needs silence");
    else reasons.push("Similar noise tolerance");
  }

  // Guests frequency (10)
  const guestsSim = calcSim(a.guestsFrequency, b.guestsFrequency);
  points += 10 * guestsSim;
  if (guestsSim >= 0.75) {
    if (a.guestsFrequency >= 4 && b.guestsFrequency >= 4) reasons.push("Loves hosting");
    else if (a.guestsFrequency <= 2 && b.guestsFrequency <= 2) reasons.push("Prefers quiet space");
    else reasons.push("Similar guest preferences");
  }

  // Cap tags to top 3 so they look like distinct badges
  const tags = reasons.slice(0, 3);

  return {
    score: Math.round(points),
    reasons: tags,
  };
}

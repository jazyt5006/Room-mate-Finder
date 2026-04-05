import type { CompatibilityTraits } from "@/lib/compatibility-score";

/** Fixed “you” profile used for demo compatibility against dummy students. */
export const sampleYou: CompatibilityTraits = {
  cgpa: 8.2,
  cleanliness: 4,
  sleepCycle: 3,
  socialHabits: 3,
};

export type DummyUser = {
  id: string;
  name: string;
  branch: string;
  year: "1" | "2" | "3" | "4";
} & CompatibilityTraits;

export const dummyUsers: DummyUser[] = [
  {
    id: "u1",
    name: "Arjun Mehta",
    branch: "COE",
    year: "2",
    cgpa: 8.4,
    cleanliness: 4,
    sleepCycle: 3,
    socialHabits: 3,
  },
  {
    id: "u2",
    name: "Priya Sharma",
    branch: "ENC",
    year: "2",
    cgpa: 7.1,
    cleanliness: 2,
    sleepCycle: 5,
    socialHabits: 5,
  },
  {
    id: "u3",
    name: "Rohan Verma",
    branch: "ECE",
    year: "3",
    cgpa: 8.9,
    cleanliness: 5,
    sleepCycle: 2,
    socialHabits: 2,
  },
  {
    id: "u4",
    name: "Neha Kaur",
    branch: "COE",
    year: "1",
    cgpa: 8.3,
    cleanliness: 4,
    sleepCycle: 4,
    socialHabits: 4,
  },
  {
    id: "u5",
    name: "Karan Singh",
    branch: "ME",
    year: "4",
    cgpa: 6.5,
    cleanliness: 3,
    sleepCycle: 3,
    socialHabits: 4,
  },
];

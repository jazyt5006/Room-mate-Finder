import Link from "next/link";
import { calculateCompatibilityScore } from "@/lib/compatibility-score";
import { dummyUsers, sampleYou } from "@/lib/dummy-users";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Matches | Thapar Roommate Finder",
  description: "See how compatible you are with other students (demo data).",
};

const YEAR_LABEL: Record<string, string> = {
  "1": "1st year",
  "2": "2nd year",
  "3": "3rd year",
  "4": "4th year",
};

function scoreColor(score: number): string {
  if (score >= 80) return "text-emerald-700 bg-emerald-50 border-emerald-200";
  if (score >= 60) return "text-teal-800 bg-teal-50 border-teal-200";
  if (score >= 40) return "text-amber-800 bg-amber-50 border-amber-200";
  return "text-zinc-700 bg-zinc-100 border-zinc-200";
}

export default function MatchesPage() {
  const ranked = dummyUsers
    .map((user) => ({
      user,
      score: calculateCompatibilityScore(sampleYou, user),
    }))
    .sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-teal-50/30 to-zinc-50 font-sans text-zinc-900">
      <header className="border-b border-zinc-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="text-sm font-medium text-teal-700 hover:text-teal-800"
          >
            ← Home
          </Link>
          <span className="text-sm font-semibold text-zinc-500">Demo matches</span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
          Compatibility matches
        </h1>
        <p className="mt-2 max-w-xl text-sm text-zinc-600">
          Compared to a sample profile (CGPA {sampleYou.cgpa}, same sliders as
          your profile form). Dummy students below are for demonstration only.
        </p>

        <ul className="mt-8 space-y-4">
          {ranked.map(({ user, score }, i) => (
            <li key={user.id}>
              <article className="flex flex-col gap-4 rounded-2xl border border-zinc-200/90 bg-white/90 p-4 shadow-sm backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-5">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h2 className="font-semibold text-zinc-900">{user.name}</h2>
                    <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                      #{i + 1} match
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-600">
                    {user.branch} · {YEAR_LABEL[user.year]}
                  </p>
                  <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-zinc-500 sm:grid-cols-4">
                    <div>
                      <dt className="text-zinc-400">CGPA</dt>
                      <dd className="font-medium text-zinc-700">{user.cgpa}</dd>
                    </div>
                    <div>
                      <dt className="text-zinc-400">Clean</dt>
                      <dd className="font-medium text-zinc-700">
                        {user.cleanliness}/5
                      </dd>
                    </div>
                    <div>
                      <dt className="text-zinc-400">Sleep</dt>
                      <dd className="font-medium text-zinc-700">
                        {user.sleepCycle}/5
                      </dd>
                    </div>
                    <div>
                      <dt className="text-zinc-400">Social</dt>
                      <dd className="font-medium text-zinc-700">
                        {user.socialHabits}/5
                      </dd>
                    </div>
                  </dl>
                </div>
                <div
                  className={`flex shrink-0 flex-col items-stretch rounded-xl border px-4 py-3 text-center sm:min-w-[140px] sm:items-end sm:text-right ${scoreColor(score)}`}
                >
                  <span className="text-xs font-medium uppercase tracking-wide opacity-80">
                    Match
                  </span>
                  <span className="text-2xl font-bold tabular-nums">{score}%</span>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

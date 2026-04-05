"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { calculateCompatibilityScore } from "@/lib/compatibility-score";
import { sampleYou } from "@/lib/dummy-users";
import {
  profileToCompatibilityTraits,
  type ProfileRow,
} from "@/lib/profiles";
import { supabase } from "@/lib/supabaseClient";

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

type RankedProfile = ProfileRow & { score: number };

export function MatchesView() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ranked, setRanked] = useState<RankedProfile[]>([]);
  const [baselineNote, setBaselineNote] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const { data: rows, error: fetchError } = await supabase
        .from("profiles")
        .select(
          "id, full_name, branch, year, cgpa, hostel_preference, cleanliness, sleep_cycle, social_habits"
        );

      if (cancelled) return;

      if (fetchError) {
        setError(fetchError.message);
        setRanked([]);
        setLoading(false);
        return;
      }

      const list = (rows ?? []) as ProfileRow[];

      let baseline = sampleYou;
      let note =
        "Compared to a sample profile (same defaults as the profile form demo). Sign in and save your profile to compare against yours.";

      if (session?.user) {
        const mine = list.find((p) => p.id === session.user.id);
        if (mine) {
          baseline = profileToCompatibilityTraits(mine);
          note =
            "Compared to your saved profile. You are not shown in the list below.";
        } else {
          note =
            "You are signed in but have no saved profile yet—using sample traits for scoring. Complete your profile for personalized match %.";
        }
      }

      const others = session?.user
        ? list.filter((p) => p.id !== session.user.id)
        : list;

      const scored: RankedProfile[] = others.map((user) => ({
        ...user,
        score: calculateCompatibilityScore(
          baseline,
          profileToCompatibilityTraits(user)
        ),
      }));

      scored.sort((a, b) => b.score - a.score);

      setBaselineNote(note);
      setRanked(scored);
      setLoading(false);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

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
          <span className="text-sm font-semibold text-zinc-500">
            Compatibility matches
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
          Compatibility matches
        </h1>
        {!loading && baselineNote ? (
          <p className="mt-2 max-w-xl text-sm text-zinc-600">{baselineNote}</p>
        ) : null}

        {error && (
          <p
            className="mt-6 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
            role="alert"
          >
            {error}
          </p>
        )}

        {loading && !error && (
          <ul className="mt-8 space-y-4" aria-busy="true">
            {[1, 2, 3].map((k) => (
              <li
                key={k}
                className="h-36 animate-pulse rounded-2xl border border-zinc-200/90 bg-white/60"
              />
            ))}
          </ul>
        )}

        {!loading && !error && ranked.length === 0 && (
          <p className="mt-8 text-sm text-zinc-600">
            No profiles yet. Be the first to{" "}
            <Link
              href="/profile"
              className="font-semibold text-teal-700 underline-offset-4 hover:underline"
            >
              save a profile
            </Link>
            .
          </p>
        )}

        {!loading && ranked.length > 0 && (
          <ul className="mt-8 space-y-4">
            {ranked.map((user, i) => (
              <li key={user.id}>
                <article className="flex flex-col gap-4 rounded-2xl border border-zinc-200/90 bg-white/90 p-4 shadow-sm backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-5">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <h2 className="font-semibold text-zinc-900">
                        {user.full_name}
                      </h2>
                      <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                        #{i + 1} match
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-zinc-600">
                      {user.branch} ·{" "}
                      {YEAR_LABEL[String(user.year)] ?? `Year ${user.year}`}
                    </p>
                    <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-zinc-500 sm:grid-cols-4">
                      <div>
                        <dt className="text-zinc-400">CGPA</dt>
                        <dd className="font-medium text-zinc-700">
                          {user.cgpa}
                        </dd>
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
                          {user.sleep_cycle}/5
                        </dd>
                      </div>
                      <div>
                        <dt className="text-zinc-400">Social</dt>
                        <dd className="font-medium text-zinc-700">
                          {user.social_habits}/5
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <div
                    className={`flex shrink-0 flex-col items-stretch rounded-xl border px-4 py-3 text-center sm:min-w-[140px] sm:items-end sm:text-right ${scoreColor(user.score)}`}
                  >
                    <span className="text-xs font-medium uppercase tracking-wide opacity-80">
                      Match
                    </span>
                    <span className="text-2xl font-bold tabular-nums">
                      {user.score}%
                    </span>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

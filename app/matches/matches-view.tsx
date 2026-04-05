"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { calculateCompatibilityScore } from "@/lib/compatibility-score";
import { sampleYou } from "@/lib/dummy-users";
import { formatHostelPreference } from "@/lib/hostel-labels";
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

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function scoreAccent(score: number): {
  ring: string;
  badge: string;
  glow: string;
} {
  if (score >= 80) {
    return {
      ring: "from-emerald-400 to-teal-500",
      badge: "bg-emerald-600 text-white shadow-emerald-500/35",
      glow: "shadow-[0_0_40px_-8px_rgba(16,185,129,0.45)]",
    };
  }
  if (score >= 60) {
    return {
      ring: "from-teal-400 to-cyan-500",
      badge: "bg-teal-600 text-white shadow-teal-500/35",
      glow: "shadow-[0_0_40px_-8px_rgba(20,184,166,0.4)]",
    };
  }
  if (score >= 40) {
    return {
      ring: "from-amber-400 to-orange-400",
      badge: "bg-amber-600 text-white shadow-amber-500/30",
      glow: "shadow-[0_0_36px_-8px_rgba(245,158,11,0.35)]",
    };
  }
  return {
    ring: "from-zinc-300 to-zinc-400",
    badge: "bg-zinc-700 text-white shadow-zinc-500/25",
    glow: "shadow-[0_0_28px_-10px_rgba(113,113,122,0.35)]",
  };
}

type RankedProfile = ProfileRow & { score: number };

function MatchCard({ user, rank }: { user: RankedProfile; rank: number }) {
  const accent = scoreAccent(user.score);
  return (
    <article
      className={`group relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-lg shadow-zinc-200/40 transition duration-300 hover:border-teal-200/80 hover:shadow-xl hover:shadow-teal-100/50 sm:p-6 ${accent.glow}`}
    >
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent.ring} opacity-90`}
        aria-hidden
      />

      <div className="flex flex-col gap-5 sm:flex-row sm:items-stretch sm:justify-between sm:gap-6">
        <div className="flex min-w-0 flex-1 gap-4">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-100 to-emerald-50 text-base font-bold tracking-tight text-teal-800 ring-2 ring-white shadow-inner shadow-teal-900/5"
            aria-hidden
          >
            {initials(user.full_name)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
                {user.full_name}
              </h2>
              <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                #{rank} match
              </span>
            </div>
            <p className="mt-1 text-sm text-zinc-600">
              <span className="font-medium text-zinc-800">{user.branch}</span>
              <span className="mx-1.5 text-zinc-300" aria-hidden>
                ·
              </span>
              <span>
                {YEAR_LABEL[String(user.year)] ?? `Year ${user.year}`}
              </span>
            </p>

            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-zinc-50/90 px-4 py-3 ring-1 ring-zinc-100/80">
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  CGPA
                </dt>
                <dd className="mt-0.5 text-lg font-semibold tabular-nums text-zinc-900">
                  {user.cgpa}
                </dd>
              </div>
              <div className="rounded-2xl bg-zinc-50/90 px-4 py-3 ring-1 ring-zinc-100/80">
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  Hostel preference
                </dt>
                <dd className="mt-0.5 text-sm font-medium leading-snug text-zinc-800">
                  {formatHostelPreference(user.hostel_preference ?? "")}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="flex flex-col items-stretch justify-center sm:w-[148px] sm:shrink-0">
          <div
            className={`flex flex-col items-center justify-center rounded-2xl px-5 py-4 text-center shadow-lg ${accent.badge}`}
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/90">
              Match
            </span>
            <span
              className="mt-1 text-4xl font-bold tabular-nums tracking-tight"
              aria-label={`${user.score} percent compatible`}
            >
              {user.score}%
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

function MatchesEmptyState() {
  return (
    <div className="mt-10 flex flex-col items-center rounded-3xl border border-dashed border-zinc-200 bg-gradient-to-b from-white to-zinc-50/80 px-6 py-14 text-center shadow-sm sm:px-10">
      <div
        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-3xl shadow-inner ring-1 ring-teal-100"
        aria-hidden
      >
        🤝
      </div>
      <h2 className="mt-6 text-xl font-semibold tracking-tight text-zinc-900">
        No matches yet
      </h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-600">
        Once students add their profiles, they will show up here ranked by how
        well their habits align with yours. Be the first to go live—or invite
        friends to join.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/profile"
          className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
        >
          Complete your profile
        </Link>
        <Link
          href="/signup"
          className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-800 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:ring-offset-2"
        >
          Invite others to sign up
        </Link>
      </div>
      <p className="mt-8 text-xs text-zinc-500">
        <Link href="/" className="font-medium text-teal-700 hover:underline">
          Back to home
        </Link>
      </p>
    </div>
  );
}

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

      // Best matches first; tie-break alphabetically by name for stable ordering
      scored.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.full_name.localeCompare(b.full_name, undefined, {
          sensitivity: "base",
        });
      });

      setBaselineNote(note);
      setRanked(scored);
      setLoading(false);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const showList = !loading && !error && ranked.length > 0;

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

        {showList ? (
          <p className="mt-3 text-xs font-medium uppercase tracking-wider text-zinc-400">
            Sorted by match % · highest first
          </p>
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
          <ul className="mt-8 space-y-5" aria-busy="true">
            {[1, 2, 3].map((k) => (
              <li
                key={k}
                className="h-44 animate-pulse rounded-3xl border border-zinc-200/90 bg-white/70 shadow-md"
              />
            ))}
          </ul>
        )}

        {!loading && !error && ranked.length === 0 && <MatchesEmptyState />}

        {showList && (
          <ul className="mt-8 space-y-5">
            {ranked.map((user, i) => (
              <li key={user.id}>
                <MatchCard user={user} rank={i + 1} />
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

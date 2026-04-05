import { Suspense } from "react";
import { MatchesView } from "./matches-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Matches | Thapar Roommate Finder",
  description:
    "See how compatible you are with other students based on CGPA and living-style sliders.",
};

function MatchesFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-teal-50/30 to-zinc-50 font-sans text-zinc-900">
      <header className="border-b border-zinc-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:px-6">
          <span className="text-sm font-medium text-zinc-400">← Home</span>
          <span className="text-sm font-semibold text-zinc-500">
            Compatibility matches
          </span>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="h-9 w-64 animate-pulse rounded-lg bg-zinc-200/80" />
        <div className="mt-2 h-10 max-w-xl animate-pulse rounded-lg bg-zinc-200/60" />
        <ul className="mt-8 space-y-4">
          {[1, 2, 3].map((k) => (
            <li
              key={k}
              className="h-36 animate-pulse rounded-2xl border border-zinc-200/90 bg-white/60"
            />
          ))}
        </ul>
      </main>
    </div>
  );
}

export default function MatchesPage() {
  return (
    <Suspense fallback={<MatchesFallback />}>
      <MatchesView />
    </Suspense>
  );
}

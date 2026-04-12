import { Suspense } from "react";
import { ConnectionsView } from "./connections-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connections | TIET Roomie",
  description: "Manage your incoming requests and mutual connections.",
};

function ConnectionsFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-teal-50/30 to-zinc-50 font-sans text-zinc-900">
      <header className="border-b border-zinc-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:px-6">
          <span className="text-sm font-medium text-zinc-400">← Home</span>
          <span className="text-sm font-semibold text-zinc-500">Connections</span>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="h-9 w-48 animate-pulse rounded-lg bg-zinc-200/80" />
        <div className="mt-8 h-12 w-full max-w-md animate-pulse rounded-full bg-zinc-200/60" />
        <ul className="mt-10 space-y-4">
          {[1, 2].map((k) => (
            <li
              key={k}
              className="h-32 animate-pulse rounded-2xl border border-zinc-200/90 bg-white/60"
            />
          ))}
        </ul>
      </main>
    </div>
  );
}

export default function ConnectionsPage() {
  return (
    <Suspense fallback={<ConnectionsFallback />}>
      <ConnectionsView />
    </Suspense>
  );
}

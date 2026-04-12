"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { calculateCompatibilityScore } from "@/lib/compatibility-score";
import { formatHostelPreference } from "@/lib/hostel-labels";
import { RevealOnScroll } from "@/components/reveal-on-scroll";
import { ConnectButton } from "@/components/connect-button";
import {
  fetchUserConnectionRequests,
  sendConnectionRequest,
  updateConnectionStatus,
  type ConnectionRequestRow,
} from "@/lib/connections";
import {
  profileToCompatibilityTraits,
  updateLastActive,
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

function formatRelativeTime(isoString?: string): string {
  if (!isoString) return "Active recently";
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "Active recently";
  
  const diffHours = Math.max(0, Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60)));
  
  if (diffHours < 1) return "Active now";
  if (diffHours < 24) return `Active ${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `Active ${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
}

function scoreAccent(score: number): {
  ring: string;
  badge: string;
  glow: string;
  bgGradient: string;
} {
  if (score >= 80) {
    return {
      ring: "from-purple-400 to-pink-500",
      badge: "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-purple-500/40",
      glow: "shadow-[0_0_40px_-8px_rgba(168,85,247,0.4)]",
      bgGradient: "from-purple-100/80 to-pink-50/50",
    };
  }
  if (score >= 60) {
    return {
      ring: "from-indigo-400 to-purple-400",
      badge: "bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-indigo-500/35",
      glow: "shadow-[0_0_40px_-8px_rgba(99,102,241,0.35)]",
      bgGradient: "from-indigo-100/80 to-purple-50/50",
    };
  }
  if (score >= 40) {
    return {
      ring: "from-rose-400 to-orange-400",
      badge: "bg-gradient-to-br from-rose-500 to-orange-500 text-white shadow-rose-500/30",
      glow: "shadow-[0_0_36px_-8px_rgba(244,63,94,0.3)]",
      bgGradient: "from-rose-100/80 to-orange-50/50",
    };
  }
  return {
    ring: "from-slate-300 to-slate-400",
    badge: "bg-gradient-to-br from-slate-500 to-slate-600 text-white shadow-slate-500/25",
    glow: "shadow-[0_0_28px_-10px_rgba(100,116,139,0.3)]",
    bgGradient: "from-slate-100 to-slate-50/50",
  };
}

type RankedProfile = ProfileRow & { score: number; reasons: string[]; connectionRequest?: ConnectionRequestRow };

function MatchCard({
  user,
  rank,
  currentUserId,
  onSendRequest,
  onAcceptRequest,
  onRejectRequest,
  disableNew,
}: {
  user: RankedProfile;
  rank: number;
  currentUserId: string;
  onSendRequest: (receiverId: string, message: string) => Promise<void>;
  onAcceptRequest: (requestId: string) => Promise<void>;
  onRejectRequest: (requestId: string) => Promise<void>;
  disableNew: boolean;
}) {
  const accent = scoreAccent(user.score);
  return (
    <article
      className={`group relative overflow-hidden rounded-[2.5rem] border ${rank === 1 ? 'border-yellow-300/80 ring-2 ring-yellow-400/30 hover:border-yellow-400' : 'border-slate-200/80 hover:border-purple-200'} bg-white p-6 sm:p-8 shadow-lg shadow-slate-200/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${accent.glow}`}
    >
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${rank === 1 ? 'from-yellow-400 to-amber-500' : accent.ring} opacity-90`}
        aria-hidden
      />

      <div className="flex flex-col gap-6 sm:flex-row sm:items-stretch sm:justify-between">
        <div className="flex min-w-0 flex-1 gap-5">
          <div
            className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.25rem] bg-gradient-to-br ${accent.bgGradient} text-xl font-extrabold tracking-tight text-slate-800 ring-4 ring-white shadow-inner shadow-slate-900/5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
            aria-hidden
          >
            {initials(user.full_name)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h2 className="text-2xl font-black tracking-tight text-slate-900">
                {user.full_name}
              </h2>
              {rank === 1 ? (
                 <span className="rounded-full bg-yellow-100 px-3 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-yellow-800 shadow-sm border border-yellow-300 inline-flex items-center gap-1">
                   <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                   Top Match
                 </span>
              ) : (
                <span className="rounded-full bg-slate-100 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-600 shadow-sm border border-slate-200">
                  #{rank} match
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-slate-500 mb-6 flex flex-wrap items-center">
              <span className="text-slate-700">{user.branch}</span>
              <span className="mx-2 text-slate-300" aria-hidden>
                ·
              </span>
              <span>
                {YEAR_LABEL[String(user.year)] ?? `Year ${user.year}`}
              </span>
              <span className="mx-2 text-slate-300" aria-hidden>
                ·
              </span>
              <span className="text-slate-400 text-xs font-medium inline-flex items-center gap-1">
                <span className={`block w-1.5 h-1.5 rounded-full ${formatRelativeTime(user.last_active) === 'Active now' ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`} />
                {formatRelativeTime(user.last_active)}
              </span>
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {user.reasons.map((r, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-purple-50/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-purple-700 shadow-sm border border-purple-200">
                  <svg className="w-3 h-3 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center sm:w-[160px] sm:shrink-0 mt-2 sm:mt-0 gap-3">
          <div
            className={`flex flex-col items-center justify-center rounded-[1.5rem] px-6 py-5 w-full text-center shadow-xl transition-transform duration-500 group-hover:scale-105 ${accent.badge}`}
          >
            <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-white/90">
              Match
            </span>
            <span
              className="mt-1 text-5xl font-extrabold tabular-nums tracking-tighter"
              aria-label={`${user.score} percent compatible`}
            >
              {user.score}%
            </span>
          </div>
          <ConnectButton
            receiverId={user.id}
            connectionRequest={user.connectionRequest || null}
            currentUserId={currentUserId}
            onSendRequest={onSendRequest}
            onAcceptRequest={onAcceptRequest}
            onRejectRequest={onRejectRequest}
            disableNew={disableNew}
          />
        </div>
      </div>
    </article>
  );
}

function MatchesEmptyState() {
  return (
    <div className="mt-10 flex flex-col items-center rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white/50 backdrop-blur-sm px-6 py-16 text-center shadow-sm sm:px-12">
      <div
        className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-purple-100 to-pink-100 text-4xl shadow-inner ring-1 ring-purple-200 mb-2"
        aria-hidden
      >
        🤝
      </div>
      <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">
        No matches yet
      </h2>
      <p className="mt-3 max-w-md text-base leading-relaxed text-slate-600 font-medium">
        You're one of the first ones here! Once other students add their profiles, they will show up ranked by how well their habits align with yours. 
      </p>
      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center w-full max-w-xs">
        <Link
          href="/profile"
          className="w-full rounded-full bg-gradient-to-r from-purple-600 to-pink-500 py-3.5 text-sm font-bold text-white shadow-xl shadow-purple-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-purple-500/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 inline-flex items-center justify-center"
        >
          Check your profile
        </Link>
      </div>
    </div>
  );
}

function MatchCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[2.5rem] border border-slate-200/80 bg-white p-6 sm:p-8 shadow-lg shadow-slate-200/50">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-stretch sm:justify-between animate-pulse">
        <div className="flex min-w-0 flex-1 gap-5">
          <div className="h-16 w-16 shrink-0 rounded-[1.25rem] bg-slate-200" />
          <div className="min-w-0 flex-1 py-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-6 w-40 rounded bg-slate-200" />
              <div className="h-5 w-16 rounded-full bg-slate-100" />
            </div>
            <div className="h-4 w-48 rounded bg-slate-100 mb-6" />
            <div className="flex gap-2">
              <div className="h-6 w-24 rounded-full bg-slate-100" />
              <div className="h-6 w-20 rounded-full bg-slate-100" />
              <div className="h-6 w-16 rounded-full bg-slate-100" />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center sm:w-[160px] sm:shrink-0 mt-2 sm:mt-0 gap-3">
          <div className="h-28 w-full rounded-[1.5rem] bg-slate-100" />
          <div className="h-10 w-28 rounded-full bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

export function MatchesView() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ranked, setRanked] = useState<RankedProfile[]>([]);
  const [baselineNote, setBaselineNote] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [pendingSentCount, setPendingSentCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        if (!cancelled && pathname !== "/login") {
          router.replace("/login");
        }
        return;
      }

      setCurrentUserId(session.user.id);

      const { data: mine, error: mineError } = await supabase
        .from("profiles")
        .select("id, cleanliness, sleep_cycle, social_habits, hostel_preference, cgpa, gender, branch, year, study_habits, noise_tolerance, guests_frequency")
        .eq("id", session.user.id)
        .single();

      if (mineError || !mine || !mine.gender || !mine.branch) {
        if (!cancelled && pathname !== "/profile") {
          router.replace("/profile");
        }
        return;
      }
      
      const { data: rows, error: fetchError } = await supabase
        .from("profiles")
        .select(
           "id, full_name, branch, year, cgpa, hostel_preference, cleanliness, sleep_cycle, social_habits, gender, study_habits, noise_tolerance, guests_frequency, last_active"
        )
        .eq("gender", mine.gender)
        .eq("hostel_preference", mine.hostel_preference)
        .eq("year", mine.year)
        .neq("id", session.user.id);

      if (cancelled) return;

      updateLastActive(session.user.id).catch(console.error);

      if (fetchError) {
        setError(fetchError.message);
        setRanked([]);
        setLoading(false);
        return;
      }

      const others = (rows ?? []) as ProfileRow[];

      // Fetch connection requests
      const { data: reqs } = await fetchUserConnectionRequests(session.user.id);
      const requests = (reqs ?? []) as ConnectionRequestRow[];
      
      const sentPending = requests.filter(r => r.sender_id === session.user.id && r.status === "pending").length;
      setPendingSentCount(sentPending);

      let baseline = profileToCompatibilityTraits(mine as ProfileRow);
      let note = "Compared to your saved profile. You are not shown in the list below.";

      const scored: RankedProfile[] = others.map((user) => {
        const req = requests.find(
          (r) =>
            (r.sender_id === user.id && r.receiver_id === session.user.id) ||
            (r.receiver_id === user.id && r.sender_id === session.user.id)
        );
        const matchRes = calculateCompatibilityScore(
            baseline,
            profileToCompatibilityTraits(user)
        );
        return {
          ...user,
          score: matchRes.score,
          reasons: matchRes.reasons,
          connectionRequest: req,
        };
      }).filter((u) => u.score >= 40);

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

  async function handleSendRequest(receiverId: string, message: string) {
    if (!currentUserId) return;
    const reqRes = await sendConnectionRequest(currentUserId, receiverId, message);
    if (reqRes.error) {
      throw new Error(reqRes.error.message);
    }
    const req = reqRes.data;
    
    setRanked((prev) => 
      prev.map((u) => 
        u.id === receiverId 
          ? { ...u, connectionRequest: req as ConnectionRequestRow } 
          : u
      )
    );
    setPendingSentCount((prev) => prev + 1);
  }

  async function handleAcceptRequest(requestId: string) {
    await updateConnectionStatus(requestId, "accepted");
    setRanked((prev) =>
      prev.map((u) =>
        u.connectionRequest?.id === requestId
          ? { ...u, connectionRequest: { ...u.connectionRequest, status: "accepted" } as ConnectionRequestRow }
          : u
      )
    );
  }

  async function handleRejectRequest(requestId: string) {
    await updateConnectionStatus(requestId, "rejected");
    setRanked((prev) =>
      prev.map((u) =>
        u.connectionRequest?.id === requestId
          ? { ...u, connectionRequest: { ...u.connectionRequest, status: "rejected" } as ConnectionRequestRow }
          : u
      )
    );
  }

  const showList = !loading && !error && ranked.length > 0;

  return (
    <div className="flex-1 w-full relative pb-20">
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(168,85,247,0.08),transparent)]"
        aria-hidden
      />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 relative z-10">
        <RevealOnScroll effect="fade-up">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent inline-block pb-1">
                Compatibility Matches
              </h1>
              {!loading && baselineNote && (
                <p className="mt-3 max-w-xl text-base font-medium text-slate-500">{baselineNote}</p>
              )}
            </div>
            {showList && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-purple-600 ring-1 ring-inset ring-purple-500/20 shadow-sm self-start md:self-auto">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" />
                Ranked by alignment
              </span>
            )}
          </div>
        </RevealOnScroll>

        {error && (
          <RevealOnScroll effect="fade-in">
            <div
              className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800 shadow-sm"
              role="alert"
            >
              {error}
            </div>
          </RevealOnScroll>
        )}

        {loading && !error && (
          <ul className="mt-10 space-y-6" aria-busy="true">
            {[1, 2, 3].map((k, idx) => (
              <RevealOnScroll key={k} effect="fade-up" delayMs={idx * 100}>
                <li>
                  <MatchCardSkeleton />
                </li>
              </RevealOnScroll>
            ))}
          </ul>
        )}

        {!loading && !error && ranked.length === 0 && (
          <RevealOnScroll effect="fade-up" delayMs={100}>
            <MatchesEmptyState />
          </RevealOnScroll>
        )}

        {showList && (
          <ul className="mt-10 space-y-6">
            {ranked.map((user, i) => (
              <RevealOnScroll key={user.id} effect="fade-up" delayMs={i * 100}>
                <li>
                  <MatchCard
                    user={user}
                    rank={i + 1}
                    currentUserId={currentUserId}
                    onSendRequest={handleSendRequest}
                    onAcceptRequest={handleAcceptRequest}
                    onRejectRequest={handleRejectRequest}
                    disableNew={pendingSentCount >= 5}
                  />
                </li>
              </RevealOnScroll>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

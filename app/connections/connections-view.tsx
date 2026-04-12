"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  fetchUserConnectionRequests,
  fetchAcceptedEmails,
  ConnectionRequestRow,
  updateConnectionStatus,
  cancelConnectionRequest,
} from "@/lib/connections";
import { supabase } from "@/lib/supabaseClient";
import { RevealOnScroll } from "@/components/reveal-on-scroll";
import { calculateCompatibilityScore } from "@/lib/compatibility-score";
import {
  profileToCompatibilityTraits,
  type ProfileRow,
} from "@/lib/profiles";

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

type CombinedRequest = ConnectionRequestRow & {
  otherUser: ProfileRow;
  otherEmail?: string;
  matchScore: number;
};

export function ConnectionsView() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"incoming" | "accepted" | "sent">("incoming");

  const [currentUserId, setCurrentUserId] = useState("");
  const [requests, setRequests] = useState<CombinedRequest[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null); // store requested ID being acted upon

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        if (!cancelled) router.replace("/login");
        return;
      }
      setCurrentUserId(session.user.id);

      // Fetch my profile
      const { data: myProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
        
      if (!myProfile && !cancelled) {
        router.replace("/profile");
        return;
      }

      const baseline = profileToCompatibilityTraits(myProfile as ProfileRow);

      // Fetch connection requests
      const { data: reqs, error: reqErr } = await fetchUserConnectionRequests(session.user.id);
      if (reqErr) {
        setError(reqErr.message);
        setLoading(false);
        return;
      }

      const allReqs = (reqs ?? []) as ConnectionRequestRow[];
      if (allReqs.length === 0) {
        if (!cancelled) {
          setRequests([]);
          setLoading(false);
        }
        return;
      }

      const profileIds = Array.from(
        new Set(
          allReqs.flatMap((r) => [r.sender_id, r.receiver_id])
        )
      ).filter((id) => id !== session.user.id);

      // Fetch profiles
      const { data: profiles, error: profErr } = await supabase
        .from("profiles")
        .select("*")
        .in("id", profileIds);

      if (profErr) {
        setError(profErr.message);
        setLoading(false);
        return;
      }
      const others = (profiles ?? []) as ProfileRow[];

      // Fetch emails (via rpc) for accepted ones
      const { data: emailData, error: emailErr } = await fetchAcceptedEmails(session.user.id);
      
      const emailsList = (emailData ?? []) as { profile_id: string; email: string }[];
      const emailMap = new Map<string, string>();
      for (const e of emailsList) {
        emailMap.set(e.profile_id, e.email);
      }

      const combined: CombinedRequest[] = allReqs
        .map((r) => {
          const otherId = r.sender_id === session.user.id ? r.receiver_id : r.sender_id;
          const userObj = others.find((u) => u.id === otherId);
          if (!userObj) return null;
          
          return {
            ...r,
            otherUser: userObj,
            otherEmail: emailMap.get(otherId),
            matchScore: calculateCompatibilityScore(
              baseline,
              profileToCompatibilityTraits(userObj)
            ).score,
          };
        })
        .filter(Boolean) as CombinedRequest[];

      if (!cancelled) {
        setRequests(combined);
        setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function handleAccept(reqId: string) {
    setActionLoading(reqId);
    try {
      await updateConnectionStatus(reqId, "accepted");
      // Fetch the email since it's newly accepted
      const { data: emailData } = await fetchAcceptedEmails(currentUserId);
      const newEmail = emailData?.[0]?.email; // this might return multiple but ideally we just map again

      setRequests((prev) =>
        prev.map((r) => {
          if (r.id === reqId) {
            // Find the correct email from the re-fetched list
            const matchedEmail = emailData?.find((e: any) => e.profile_id === r.otherUser.id)?.email;
            return { ...r, status: "accepted", otherEmail: matchedEmail || r.otherEmail };
          }
          return r;
        })
      );
    } catch (err: any) {
      alert(err.message || "Failed to accept.");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReject(reqId: string) {
    setActionLoading(reqId);
    try {
      await updateConnectionStatus(reqId, "rejected");
      setRequests((prev) => prev.map((r) => (r.id === reqId ? { ...r, status: "rejected" } : r)));
    } catch (err: any) {
      alert(err.message || "Failed to reject.");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleCancel(reqId: string) {
    if (!confirm("Are you sure you want to cancel this pending request?")) return;
    setActionLoading(reqId);
    try {
      await cancelConnectionRequest(reqId);
      setRequests((prev) => prev.filter((r) => r.id !== reqId));
    } catch (err: any) {
      alert(err.message || "Failed to cancel.");
    } finally {
      setActionLoading(null);
    }
  }

  const incoming = requests.filter((r) => r.receiver_id === currentUserId && r.status === "pending");
  const accepted = requests.filter((r) => r.status === "accepted");
  const sent = requests.filter((r) => r.sender_id === currentUserId && r.status === "pending");

  let currentList: CombinedRequest[] = [];
  if (activeTab === "incoming") currentList = incoming;
  else if (activeTab === "accepted") currentList = accepted;
  else if (activeTab === "sent") currentList = sent;

  return (
    <div className="flex-1 w-full relative pb-20 min-h-screen">
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(168,85,247,0.08),transparent)]"
        aria-hidden
      />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 relative z-10">
        <RevealOnScroll effect="fade-up">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent inline-block pb-1">
                Connections
              </h1>
              <p className="mt-3 max-w-xl text-base font-medium text-slate-500">
                Manage your incoming requests and mutual connections. Contact info is shared only after mutual acceptance.
              </p>
            </div>
            <Link
              href="/matches"
              className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600 ring-1 ring-inset ring-slate-200/50 hover:bg-slate-200 transition-colors self-start md:self-auto shadow-sm"
            >
              Find More Matches
            </Link>
          </div>
        </RevealOnScroll>

        <RevealOnScroll effect="fade-in">
          <div className="flex overflow-x-auto rounded-full bg-slate-100/80 p-1 backdrop-blur-md mb-8 max-w-2xl ring-1 ring-slate-200 shadow-inner">
            <button
              onClick={() => setActiveTab("incoming")}
              className={`flex-1 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-bold transition-all duration-300 ${
                activeTab === "incoming"
                  ? "bg-white text-purple-700 shadow-sm ring-1 ring-slate-200/50"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Incoming ({incoming.length})
              {incoming.length > 0 && (
                <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-red-400 animate-pulse" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("accepted")}
              className={`flex-1 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-bold transition-all duration-300 ${
                activeTab === "accepted"
                  ? "bg-white text-purple-700 shadow-sm ring-1 ring-slate-200/50"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Accepted ({accepted.length})
            </button>
            <button
              onClick={() => setActiveTab("sent")}
              className={`flex-1 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-bold transition-all duration-300 ${
                activeTab === "sent"
                  ? "bg-white text-purple-700 shadow-sm ring-1 ring-slate-200/50"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Pending Sent ({sent.length})
            </button>
          </div>
        </RevealOnScroll>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800 shadow-sm mb-6">
            {error}
          </div>
        )}

        {loading && !error ? (
          <ul className="space-y-6" aria-busy="true">
            {[1, 2].map((k) => (
              <li key={k} className="h-40 animate-pulse rounded-[2rem] border border-slate-200/90 bg-white shadow-xl shadow-slate-200/40" />
            ))}
          </ul>
        ) : !loading && currentList.length === 0 ? (
          <div className="mt-8 flex flex-col items-center rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white/50 backdrop-blur-sm px-6 py-16 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-slate-100 text-2xl shadow-inner ring-1 ring-slate-200 mb-4">
              📭
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              No {activeTab} connections
            </h2>
            <p className="mt-2 text-sm text-slate-500 font-medium">
              {activeTab === "incoming" && "You haven't received any connection requests yet."}
              {activeTab === "accepted" && "You haven't mutually accepted any connections yet."}
              {activeTab === "sent" && "You have no pending outgoing connection requests."}
            </p>
          </div>
        ) : (
          <ul className="space-y-6">
            {currentList.map((req, i) => (
              <RevealOnScroll key={req.id} effect="fade-up" delayMs={i * 80}>
                <article className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-lg shadow-slate-200/30 transition-all hover:-translate-y-1 hover:border-purple-200 hover:shadow-xl">
                  {/* Decorative faint glow */}
                  <div className="absolute inset-x-0 -top-10 h-20 bg-gradient-to-b from-purple-100/50 to-transparent blur-2xl pointer-events-none" />

                  <div className="flex flex-col sm:flex-row gap-6 relative">
                    <div className="flex flex-1 gap-5 overflow-hidden">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-indigo-100/80 to-purple-50/50 text-lg font-extrabold text-slate-800 ring-4 ring-white shadow-inner shadow-slate-900/5">
                        {initials(req.otherUser.full_name)}
                      </div>
                      <div className="min-w-0 flex-1 flex flex-col justify-center">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h2 className="text-lg font-bold tracking-tight text-slate-900 truncate">
                            {req.otherUser.full_name}
                          </h2>
                          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[11px] font-bold tracking-wider ring-1 ring-purple-500/20 shadow-sm border border-purple-100">
                            Match {req.matchScore}%
                          </div>
                        </div>
                        <p className="text-sm font-medium text-slate-500 mt-1 truncate">
                          <span className="text-slate-700">{req.otherUser.branch}</span>
                          <span className="mx-2 text-slate-300">·</span>
                          <span>{YEAR_LABEL[String(req.otherUser.year)] ?? `Year ${req.otherUser.year}`}</span>
                          <span className="mx-2 text-slate-300">·</span>
                          <span className="uppercase text-[10px] tracking-widest text-slate-400 font-bold">CGPA {req.otherUser.cgpa}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end sm:shrink-0 gap-3">
                      {activeTab === "incoming" && (
                        <>
                          <button
                            onClick={() => handleReject(req.id)}
                            disabled={actionLoading === req.id}
                            className="rounded-full bg-slate-100 px-5 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleAccept(req.id)}
                            disabled={actionLoading === req.id}
                            className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02] hover:shadow-emerald-500/40 disabled:opacity-50"
                          >
                            Accept
                          </button>
                        </>
                      )}

                      {activeTab === "sent" && (
                        <button
                          onClick={() => handleCancel(req.id)}
                          disabled={actionLoading === req.id}
                          className="rounded-full bg-white border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50 hover:text-red-600 disabled:opacity-50 shadow-sm"
                        >
                          Cancel Request
                        </button>
                      )}

                      {activeTab === "accepted" && req.otherEmail && (
                        <a
                          href={`mailto:${req.otherEmail}`}
                          className="rounded-full bg-purple-50 border border-purple-200 px-5 py-2.5 text-sm font-bold text-purple-700 transition-colors hover:bg-purple-100 shadow-sm inline-flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Email
                        </a>
                      )}
                    </div>
                  </div>

                  {req.message && (
                    <div className="mt-4 rounded-xl bg-slate-50/80 p-4 border border-slate-100 shadow-inner">
                      <p className="text-sm font-medium text-slate-700 italic">
                        <span className="text-xl leading-none text-purple-300 font-serif inline-block translate-y-1 mr-1">"</span>
                        {req.message}
                        <span className="text-xl leading-none text-purple-300 font-serif inline-block translate-y-1 ml-1">"</span>
                      </p>
                    </div>
                  )}

                  {activeTab === "accepted" && !req.message && (
                    <div className="mt-4 px-2">
                       <p className="text-sm font-medium text-slate-500">
                         {req.otherEmail || "Email hidden."}
                       </p>
                    </div>
                  )}
                </article>
              </RevealOnScroll>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

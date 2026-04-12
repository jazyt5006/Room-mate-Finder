"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ConnectionRequestRow } from "@/lib/connections";

type ConnectButtonProps = {
  receiverId: string;
  connectionRequest: ConnectionRequestRow | null;
  currentUserId: string;
  onSendRequest: (receiverId: string, message: string) => Promise<void>;
  onAcceptRequest: (requestId: string) => Promise<void>;
  onRejectRequest: (requestId: string) => Promise<void>;
  disableNew: boolean;
};

export function ConnectButton({
  receiverId,
  connectionRequest,
  currentUserId,
  onSendRequest,
  onAcceptRequest,
  onRejectRequest,
  disableNew,
}: ConnectButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && !loading) {
          setIsModalOpen(false);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isModalOpen, loading]);

  if (connectionRequest) {
    if (connectionRequest.status === "accepted") {
      return (
        <span className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-500/20 cursor-default animate-in fade-in zoom-in duration-300">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Connected
        </span>
      );
    }
    if (connectionRequest.status === "pending") {
      if (connectionRequest.sender_id === currentUserId) {
        return (
          <span className="flex items-center justify-center gap-2 rounded-full bg-slate-100 border border-slate-200 px-4 py-2 text-xs font-bold text-slate-400 shadow-sm cursor-not-allowed">
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Pending
          </span>
        );
      } else {
        return (
          <div className="flex flex-col items-center gap-1 w-full mt-1">
            <span className="flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-purple-600 mb-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              Requested You
            </span>
            <div className="flex items-center gap-2 w-full">
              <button
                onClick={() => {
                  setLoading(true);
                  onRejectRequest(connectionRequest.id).finally(() => setLoading(false));
                }}
                disabled={loading}
                className="flex-1 rounded-full bg-slate-100 border border-slate-200 px-3 py-1.5 text-[11px] font-bold text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50 shadow-sm"
              >
                Reject
              </button>
              <button
                onClick={() => {
                  setLoading(true);
                  onAcceptRequest(connectionRequest.id).finally(() => setLoading(false));
                }}
                disabled={loading}
                className="flex-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 px-3 py-1.5 text-[11px] font-bold text-white shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02] hover:shadow-emerald-500/40 disabled:opacity-50"
              >
                Accept
              </button>
            </div>
          </div>
        );
      }
    }
    if (connectionRequest.status === "rejected") {
      // Just hide or show disabled depending on preference. We'll show nothing.
      return null;
    }
  }

  async function handleSend() {
    if (disableNew) {
      setError("You've reached the maximum limit of 5 pending requests. Please cancel some or wait.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onSendRequest(receiverId, message);
      setIsModalOpen(false);
      setMessage("");
    } catch (err: any) {
      setError(err.message || "Failed to send request.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-purple-500/20 transition-all hover:scale-[1.02] hover:shadow-purple-500/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
      >
        <span>Connect</span>
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {isModalOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => !loading && setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-sm rounded-[2rem] border border-white/20 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold tracking-tight text-slate-900">
              Send Connection Request
            </h3>
            <p className="mt-2 text-sm text-slate-500 font-medium">
              Add a quick note to introduce yourself! (Optional)
            </p>

            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-800">
                {error}
              </div>
            )}
            {disableNew && !error && (
              <div className="mt-4 rounded-xl border border-orange-200 bg-orange-50 p-3 text-xs font-medium text-orange-800">
                You have reached the maximum of 5 active pending requests. Please go to your Connections to manage them.
              </div>
            )}

            <div className="mt-5">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={140}
                rows={3}
                placeholder="Hi, I noticed we have similar habits! Let's connect."
                className="w-full resize-none rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-500/10"
              />
              <div className="mt-1.5 flex justify-end">
                <span className="text-[10px] font-semibold text-slate-400">
                  {message.length} / 140
                </span>
              </div>
            </div>

            <p className="mt-4 text-[11px] font-semibold text-slate-500 bg-slate-100 rounded-lg px-3 py-2 border border-slate-200">
              Your contact info is shared only <span className="text-purple-600">after mutual acceptance</span>.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={loading}
                className="rounded-full px-4 py-2 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={loading || disableNew}
                className="rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-2 text-sm font-bold text-white shadow-md shadow-purple-500/20 transition-all hover:scale-[1.02] hover:shadow-purple-500/40 disabled:pointer-events-none disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {loading ? "Sending..." : "Send Request"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

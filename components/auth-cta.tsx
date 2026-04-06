"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function AuthCta() {
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    let active = true;

    void supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setSignedIn(Boolean(data.session));
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setSignedIn(Boolean(session));
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await supabase.auth.signOut();
      setSignedIn(false);
    } finally {
      setSigningOut(false);
    }
  }

  if (loading) {
    return null;
  }

  if (signedIn) {
    return (
      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/profile"
          className="hidden text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-900 sm:inline"
        >
          Your profile
        </Link>
        <button
          type="button"
          onClick={() => void handleSignOut()}
          disabled={signingOut}
          className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-800 shadow-sm transition hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-60"
        >
          {signingOut ? "Signing out..." : "Sign out"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <Link
        href="/login"
        className="hidden text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 sm:inline"
      >
        Sign in
      </Link>
      <Link
        href="/signup"
        className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800"
      >
        Get started
      </Link>
    </div>
  );
}

import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
  /** Wider content column for dense forms (e.g. profile). */
  wide?: boolean;
};

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
  wide = false,
}: AuthShellProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-teal-50/40 to-zinc-50 font-sans text-zinc-900">
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(20,184,166,0.12),transparent)]"
        aria-hidden
      />
      <div
        className={`relative mx-auto flex min-h-screen flex-col justify-center px-4 py-10 sm:px-6 ${wide ? "max-w-2xl" : "max-w-lg"}`}
      >
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-2 self-center text-lg font-semibold tracking-tight text-zinc-900 sm:justify-start"
        >
          <span
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 text-sm font-bold text-white shadow-sm"
            aria-hidden
          >
            TR
          </span>
          Thapar Roommate Finder
        </Link>

        <div className="rounded-2xl border border-zinc-200/80 bg-white/90 p-6 shadow-xl shadow-zinc-200/50 backdrop-blur-sm sm:p-8">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
              {title}
            </h1>
            <p className="mt-2 text-sm text-zinc-600">{subtitle}</p>
          </div>
          <div className="mt-8">{children}</div>
        </div>

        <p className="mt-8 text-center text-sm text-zinc-600">{footer}</p>
      </div>
    </div>
  );
}

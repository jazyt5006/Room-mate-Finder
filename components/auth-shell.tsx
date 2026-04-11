import Link from "next/link";
import type { ReactNode } from "react";
import { RevealOnScroll } from "@/components/reveal-on-scroll";

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
    <div className="min-h-[calc(100vh-4.5rem)] bg-[#FAFAFA] font-sans flex flex-col">
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(168,85,247,0.08),transparent)]"
        aria-hidden
      />
      <div
        className={`relative mx-auto flex flex-1 flex-col justify-center px-4 py-10 sm:px-6 w-full ${wide ? "max-w-3xl" : "max-w-xl"}`}
      >
        <RevealOnScroll effect="fade-up">
          <div className="rounded-[2rem] border border-slate-200/60 bg-white/95 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-md sm:p-10 transition-all hover:shadow-2xl hover:border-purple-200/50">
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                {title}
              </h1>
              <p className="mt-3 text-base text-slate-600 font-medium">{subtitle}</p>
            </div>
            <div className="mt-10">{children}</div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll effect="fade-in" delayMs={200}>
          <p className="mt-8 text-center text-sm font-medium text-slate-600">{footer}</p>
        </RevealOnScroll>
      </div>
    </div>
  );
}

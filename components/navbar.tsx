import Link from "next/link";
import { AuthCta } from "@/components/auth-cta";
import { RevealOnScroll } from "@/components/reveal-on-scroll";

type NavItem = { href: string; label: string; route?: boolean };

const navLinks: NavItem[] = [
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/matches", label: "Matches", route: true },
  { href: "/profile", label: "Profile", route: true },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all">
      <nav
        className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Main"
      >
        <RevealOnScroll effect="fade-scale" className="flex">
          <Link
            href="/"
            className="group flex items-center gap-3 text-lg font-bold tracking-tight text-slate-900 transition-all hover:opacity-90"
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 via-fuchsia-500 to-pink-500 text-sm font-extrabold text-white shadow-lg shadow-purple-500/20 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3"
              aria-hidden
            >
              TR
            </div>
            <span className="hidden sm:inline bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              TIET Roomie
            </span>
            <span className="sm:hidden bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              TIET Roomie
            </span>
          </Link>
        </RevealOnScroll>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((item, idx) => {
            const innerLink = (
              <span className="relative group-hover:text-purple-600 transition-colors">
                {item.label}
                <span className="absolute -bottom-1.5 left-0 h-[2px] w-0 bg-purple-500 transition-all duration-300 ease-out group-hover:w-full rounded-full opacity-0 group-hover:opacity-100"></span>
              </span>
            );

            return (
              <RevealOnScroll key={item.href} effect="fade-in" delayMs={idx * 50}>
                {item.route ? (
                  <Link
                    href={item.href}
                    className="group text-sm font-semibold text-slate-600 transition-all"
                  >
                    {innerLink}
                  </Link>
                ) : (
                  <a
                    href={item.href}
                    className="group text-sm font-semibold text-slate-600 transition-all"
                  >
                    {innerLink}
                  </a>
                )}
              </RevealOnScroll>
            );
          })}
        </div>

        <RevealOnScroll effect="fade-scale" delayMs={200} className="flex items-center gap-3">
          <AuthCta />
          <details className="relative md:hidden group cursor-pointer inline-block">
            <summary className="list-none rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-md transition-all hover:bg-white hover:shadow-md hover:border-purple-100 [&::-webkit-details-marker]:hidden block h-full">
              Menu
            </summary>
            <div className="absolute right-0 mt-3 w-56 transform opacity-0 scale-95 pointer-events-none transition-all duration-200 ease-out group-open:opacity-100 group-open:scale-100 group-open:pointer-events-auto rounded-2xl border border-slate-100 bg-white/95 py-2 shadow-2xl shadow-slate-200/60 backdrop-blur-xl origin-top-right">
              {navLinks.map((item) =>
                item.route ? (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-purple-50 hover:text-purple-600"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.href}
                    href={item.href}
                    className="block px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-purple-50 hover:text-purple-600"
                  >
                    {item.label}
                  </a>
                )
              )}
              <div className="mx-4 my-2 h-px bg-slate-100" />
              <Link
                href="/login"
                className="block px-5 py-2.5 text-sm font-semibold text-purple-600 transition-colors hover:bg-purple-50"
              >
                Sign in
              </Link>
            </div>
          </details>
        </RevealOnScroll>
      </nav>
    </header>
  );
}

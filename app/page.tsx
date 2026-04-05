import Link from "next/link";

type NavItem = { href: string; label: string; route?: boolean };

const navLinks: NavItem[] = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#next-semester", label: "Next semester" },
  { href: "/matches", label: "Matches", route: true },
  { href: "/profile", label: "Profile", route: true },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 font-sans text-zinc-900">
      <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md">
        <nav
          className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8"
          aria-label="Main"
        >
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold tracking-tight text-zinc-900"
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 text-sm font-bold text-white shadow-sm"
              aria-hidden
            >
              TR
            </span>
            <span className="hidden sm:inline">Thapar Roommate Finder</span>
            <span className="sm:hidden">Roommate Finder</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((item) =>
              item.route ? (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
                >
                  {item.label}
                </a>
              )
            )}
          </div>

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

            <details className="relative md:hidden">
              <summary className="list-none cursor-pointer rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm [&::-webkit-details-marker]:hidden">
                Menu
              </summary>
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-zinc-200 bg-white py-2 shadow-lg">
                {navLinks.map((item) =>
                  item.route ? (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <a
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
                    >
                      {item.label}
                    </a>
                  )
                )}
                <Link
                  href="/login"
                  className="block border-t border-zinc-100 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
                >
                  Sign in
                </Link>
              </div>
            </details>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <section
          className="relative overflow-hidden border-b border-zinc-200/60 bg-gradient-to-b from-white via-teal-50/40 to-zinc-50"
          aria-labelledby="hero-heading"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(20,184,166,0.15),transparent)]"
            aria-hidden
          />
          <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-24 lg:px-8 lg:pb-32 lg:pt-28">
            <div className="mx-auto max-w-3xl text-center">
              <p className="mb-4 inline-flex items-center rounded-full border border-teal-200/80 bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-800">
                Next semester at Thapar
              </p>
              <h1
                id="hero-heading"
                className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl sm:leading-[1.1] lg:text-6xl"
              >
                Find roommates for{" "}
                <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  next semester
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600 sm:text-xl">
                Match with students who share your schedule, habits, and hostel
                preferences—before the rush of room allocation.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-4">
                <Link
                  href="/signup"
                  className="inline-flex h-12 w-full min-w-[200px] items-center justify-center rounded-full bg-zinc-900 px-8 text-base font-semibold text-white shadow-md transition hover:bg-zinc-800 sm:w-auto"
                >
                  Find roommates
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex h-12 w-full min-w-[200px] items-center justify-center rounded-full border border-zinc-300 bg-white px-8 text-base font-semibold text-zinc-800 shadow-sm transition hover:border-zinc-400 hover:bg-zinc-50 sm:w-auto"
                >
                  See how it works
                </a>
              </div>
            </div>

            <div
              id="features"
              className="mx-auto mt-16 grid max-w-4xl gap-4 sm:grid-cols-3 sm:gap-6"
            >
              {[
                {
                  title: "Profile & preferences",
                  desc: "Share your branch, year, sleep schedule, and what you need in a roommate.",
                },
                {
                  title: "Compatible matches",
                  desc: "Discover students who fit your lifestyle—not just random Instagram DMs.",
                },
                {
                  title: "Plan ahead",
                  desc: "Lock in a group early so next semester feels settled before allocation.",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="rounded-2xl border border-zinc-200/80 bg-white/90 p-5 text-left shadow-sm backdrop-blur-sm"
                >
                  <h2 className="text-sm font-semibold text-zinc-900">
                    {card.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="border-b border-zinc-200/60 bg-white py-16 sm:py-20"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              How it works
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-zinc-600">
              From solo search to a ready group for the upcoming semester.
            </p>
            <ol className="mx-auto mt-12 grid max-w-3xl gap-8 sm:grid-cols-3 sm:gap-6">
              {[
                {
                  step: "1",
                  title: "Create your profile",
                  body: "Add your branch, hostel preferences, and roommate deal-breakers.",
                },
                {
                  step: "2",
                  title: "Browse & connect",
                  body: "Find compatible students and start conversations in one place.",
                },
                {
                  step: "3",
                  title: "Form your group",
                  body: "Agree on a room together before next semester’s allocation window.",
                },
              ].map((item) => (
                <li key={item.step} className="relative text-center">
                  <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-800">
                    {item.step}
                  </span>
                  <h3 className="mt-4 font-semibold text-zinc-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-600">{item.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="next-semester" className="bg-zinc-50 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              Built for Thapar students
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-zinc-600">
              Whether you are moving hostels, switching room types, or entering
              your second year, Thapar Roommate Finder helps you line up the
              right people for next semester—early and stress-free.
            </p>
            <div className="mt-8 text-sm text-zinc-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-teal-700 underline-offset-4 hover:text-teal-800 hover:underline"
              >
                Sign in
              </Link>{" "}
              to continue your search.
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 bg-white py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} Thapar Roommate Finder
          </p>
          <p className="text-sm text-zinc-400">
            Thapar Institute of Engineering and Technology
          </p>
        </div>
      </footer>
    </div>
  );
}

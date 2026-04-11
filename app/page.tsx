import Link from "next/link";
import { RevealOnScroll } from "@/components/reveal-on-scroll";

export default function Home() {
  return (
    <div className="flex flex-col bg-[#FAFAFA] overflow-x-hidden">


      <main className="flex-1">
        {/* Dynamic Hero Section */}
        <section
          className="relative px-4 pt-24 pb-32 sm:pt-36 sm:pb-40 lg:pt-48 lg:pb-52 overflow-visible"
          aria-labelledby="hero-heading"
        >
          {/* Subtle Dynamic Gradients (Blobs) */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-[#FAFAFA] to-[#FAFAFA]"></div>
          
          <div className="pointer-events-none absolute left-1/2 top-0 -z-10 -translate-x-1/2 transform-gpu blur-3xl opacity-50 h-[40rem] w-[80rem]" aria-hidden="true">
            <div
              className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-purple-200 to-pink-200 opacity-60"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
          <div className="pointer-events-none absolute right-[10%] top-[10%] -z-10 rounded-full bg-fuchsia-300/20 blur-[100px] h-[300px] w-[300px]" />
          <div className="pointer-events-none absolute left-[10%] top-[30%] -z-10 rounded-full bg-purple-300/20 blur-[100px] h-[250px] w-[250px]" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10 flex flex-col items-center">
            
            <RevealOnScroll effect="fade-up">
              <span className="inline-flex items-center gap-2 rounded-full border border-purple-200/50 bg-white/60 px-4 py-1.5 text-sm font-bold text-purple-700 tracking-wide mb-8 shadow-sm backdrop-blur-md transition-transform hover:scale-105">
                <span className="flex h-2 w-2 rounded-full bg-purple-500 animate-pulse"></span>
                Reimagined for Thapar Students
              </span>
            </RevealOnScroll>

            <RevealOnScroll effect="fade-up" delayMs={150}>
              <h1
                id="hero-heading"
                className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl md:text-7xl lg:text-[5.5rem] leading-[1.1] max-w-4xl"
              >
                Find Your <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 pb-2 inline-block">
                  Perfect Roommate
                </span>
              </h1>
            </RevealOnScroll>

            <RevealOnScroll effect="fade-up" delayMs={300}>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl font-medium">
                Match with students who share your schedule, habits, and hostel preferences—before the rush of room allocation. Never settle for a random roommate again.
              </p>
            </RevealOnScroll>

            <RevealOnScroll effect="fade-up" delayMs={450}>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6 w-full max-w-md mx-auto sm:max-w-none">
                <Link
                  href="/signup"
                  className="group relative inline-flex h-14 w-full sm:w-auto items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-10 text-base font-bold tracking-wide text-white shadow-xl shadow-purple-500/25 transition-all duration-300 hover:scale-[1.03] hover:shadow-purple-500/40 hover:-translate-y-0.5"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started
                    <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite] transition-all"></div>
                </Link>
                <a
                  href="#how-it-works"
                  className="group inline-flex h-14 w-full sm:w-auto items-center justify-center rounded-full bg-white px-10 text-base font-bold text-slate-700 shadow-sm ring-1 ring-slate-200/80 transition-all duration-300 hover:bg-slate-50 hover:ring-purple-200 hover:text-purple-600 hover:shadow-md hover:-translate-y-0.5"
                >
                  See how it works
                </a>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* Premium Features Section */}
        <section id="features" className="relative bg-white py-24 sm:py-32 border-t border-slate-100 overflow-visible">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <RevealOnScroll effect="fade-up">
              <div className="mx-auto max-w-2xl text-center mb-16 sm:mb-24">
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
                  Everything you need to find the right match
                </h2>
              </div>
            </RevealOnScroll>
            
            <div className="mx-auto grid max-w-lg grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
              {/* Feature 1 */}
              <RevealOnScroll delayMs={0}>
                <div className="group relative flex flex-col h-full overflow-hidden rounded-[2rem] bg-white p-8 ring-1 ring-slate-200/60 shadow-lg shadow-slate-200/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-100/80 hover:ring-indigo-300 z-10 bg-gradient-to-b from-white to-white hover:to-indigo-50/30">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:bg-indigo-100 group-hover:-rotate-3">
                    <svg className="h-7 w-7 transition-all duration-500 group-hover:scale-110" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 transition-colors group-hover:text-indigo-900">Smart Matching</h3>
                  <p className="text-slate-600 leading-relaxed text-base font-medium flex-1">
                    Our algorithm calculates compatibility scores based on your CGPA, branch, and daily habits to find the most scientifically aligned roommate for you.
                  </p>
                </div>
              </RevealOnScroll>

              {/* Feature 2 */}
              <RevealOnScroll delayMs={150}>
                <div className="group relative flex flex-col h-full overflow-hidden rounded-[2rem] bg-white p-8 ring-1 ring-slate-200/60 shadow-lg shadow-slate-200/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-100/80 hover:ring-purple-300 z-10 bg-gradient-to-b from-white to-white hover:to-purple-50/30">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:bg-purple-100 group-hover:rotate-3">
                    <svg className="h-7 w-7 transition-all duration-500 group-hover:scale-110" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 transition-colors group-hover:text-purple-900">Same Hostel Filtering</h3>
                  <p className="text-slate-600 leading-relaxed text-base font-medium flex-1">
                    Lock down matches strictly within your preferred hostel. Ensure your future roommate actually lives where you plan to live next semester.
                  </p>
                </div>
              </RevealOnScroll>

              {/* Feature 3 */}
              <RevealOnScroll delayMs={300}>
                <div className="group relative flex flex-col h-full overflow-hidden rounded-[2rem] bg-white p-8 ring-1 ring-slate-200/60 shadow-lg shadow-slate-200/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-pink-100/80 hover:ring-pink-300 z-10 bg-gradient-to-b from-white to-white hover:to-pink-50/30">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-50 text-pink-600 mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:bg-pink-100 group-hover:-rotate-3">
                    <svg className="h-7 w-7 transition-all duration-500 group-hover:scale-110" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 transition-colors group-hover:text-pink-900">Lifestyle Compatibility</h3>
                  <p className="text-slate-600 leading-relaxed text-base font-medium flex-1">
                    Filter by sleep cycles, social habits, and cleanliness levels to prevent friction and ensure a harmonious living environment.
                  </p>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="bg-[#FAFAFA] py-24 sm:py-32 relative overflow-hidden">
          {/* Subtle line background pattern */}
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <RevealOnScroll effect="fade-up">
              <div className="mx-auto max-w-2xl text-center mb-16 sm:mb-24">
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                  How it Works
                </h2>
                <p className="mt-5 text-lg text-slate-500 font-medium">
                  Three simple steps to secure your peace of mind before hostel allocation begins.
                </p>
              </div>
            </RevealOnScroll>

            <div className="mx-auto grid max-w-lg grid-cols-1 gap-12 lg:max-w-4xl lg:grid-cols-3 lg:gap-16 relative">
              {/* Desktop Connecting Line */}
              <div className="hidden lg:block absolute top-[4.5rem] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 -z-10 rounded-full opacity-60" />
              
              {[
                {
                  step: "1",
                  title: "Create Profile",
                  desc: "Set up your account, enter your branch, hostel preference and rate yourself.",
                  color: "indigo",
                  gradient: "from-indigo-500 to-indigo-400"
                },
                {
                  step: "2",
                  title: "Get Matches",
                  desc: "Instantly view scored compatibility matches tailored to your exact preferences.",
                  color: "purple",
                  gradient: "from-purple-500 to-fuchsia-400"
                },
                {
                  step: "3",
                  title: "Connect",
                  desc: "Reach out via Instagram or WhatsApp and lock in your future room together.",
                  color: "pink",
                  gradient: "from-pink-500 to-rose-400"
                }
              ].map((item, idx) => (
                <RevealOnScroll key={item.step} effect="fade-up" delayMs={idx * 200}>
                  <div className="relative flex flex-col items-center text-center group cursor-default">
                    {/* Step Bubble Glow Background */}
                    <div className={`absolute top-6 w-24 h-24 bg-${item.color}-300 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 -z-10`}></div>
                    
                    <div className={`flex h-20 w-20 items-center justify-center rounded-[2rem] bg-white shadow-xl shadow-${item.color}-100/50 border border-slate-100 text-3xl font-extrabold text-white bg-gradient-to-br ${item.gradient} mb-8 transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-110 group-hover:shadow-2xl`}>
                      {item.step}
                    </div>
                    <h3 className="text-2xl font-extrabold text-slate-900 mb-4 transition-colors group-hover:text-slate-800">{item.title}</h3>
                    <p className="text-slate-600 font-medium leading-relaxed max-w-sm px-4 lg:px-0">{item.desc}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-100">
          <RevealOnScroll effect="fade-scale">
            <div className="relative mx-auto max-w-5xl rounded-[3rem] bg-slate-900 border border-slate-800 px-6 py-20 sm:px-16 text-center shadow-2xl overflow-hidden isolation-auto">
              
              {/* Dark background dynamic blob overlays */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900 -z-10"></div>
              
              <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-purple-600 blur-[100px] opacity-40 mix-blend-screen" />
              <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-pink-600 blur-[100px] opacity-40 mix-blend-screen" />
              
              <h2 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl mb-8 relative z-10 leading-tight">
                Stop worrying about <br className="hidden sm:block" />
                next semester's roommate.
              </h2>
              
              <div className="relative z-10 flex flex-col items-center justify-center gap-4 sm:flex-row mt-10">
                <Link
                  href="/signup"
                  className="group relative inline-flex h-16 w-full sm:w-auto items-center justify-center overflow-hidden rounded-full bg-white px-10 text-lg font-bold text-slate-900 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Join TIET Roomie Now
                    <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          </RevealOnScroll>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 text-lg font-bold tracking-tight text-slate-900">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 text-xs font-bold text-white shadow-sm">
              TR
            </span>
            <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              TIET Roomie
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-500 text-center sm:text-left">
            © {new Date().getFullYear()} TIET Roomie. Built for Thapar students.
          </p>
        </div>
      </footer>
    </div>
  );
}

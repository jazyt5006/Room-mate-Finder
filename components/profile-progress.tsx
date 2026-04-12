"use client";

import { RevealOnScroll } from "./reveal-on-scroll";

export function ProfileProgress({ percentage }: { percentage: number }) {
  const isComplete = percentage === 100;
  
  return (
    <RevealOnScroll effect="fade-up">
      <div className="w-full rounded-[1.5rem] bg-white p-5 border border-slate-200/80 shadow-md shadow-slate-200/50 mb-8 max-w-2xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900">Profile Completion</h3>
          <span className="text-lg font-extrabold text-purple-600">{percentage}%</span>
        </div>
        
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${percentage}%` }}
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            role="progressbar"
          />
        </div>
        
        {!isComplete ? (
          <p className="mt-3 text-xs font-semibold text-slate-500">
            Complete your profile to unlock higher-accuracy matches based on your true preferences!
          </p>
        ) : (
          <p className="mt-3 text-xs font-semibold text-emerald-600 inline-flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Your profile looks great! Ready to find roommates.
          </p>
        )}
      </div>
    </RevealOnScroll>
  );
}

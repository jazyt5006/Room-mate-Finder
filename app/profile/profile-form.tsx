"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { fetchProfileById, upsertProfile } from "@/lib/profiles";
import { supabase } from "@/lib/supabaseClient";
import {
  validateBranch,
  validateCgpa,
  validateName,
  validateYear,
} from "@/lib/profile-validation";

const HOSTEL_OPTIONS = [
  { value: "", label: "Select preference" },
  { value: "none", label: "No preference" },

  { value: "a", label: "Hostel A" },
  { value: "b", label: "Hostel B" },
  { value: "c", label: "Hostel C" },
  { value: "d", label: "Hostel D" },
  { value: "e", label: "Hostel E" },
  { value: "f", label: "Hostel F" },
  { value: "g", label: "Hostel G" },
  { value: "h", label: "Hostel H" },
  { value: "i", label: "Hostel I" },
  { value: "j", label: "Hostel J" },
  { value: "k", label: "Hostel K" },
  { value: "l", label: "Hostel L" },
  { value: "m", label: "Hostel M" },
  { value: "n", label: "Hostel N" },
  { value: "o", label: "Hostel O" },

  { value: "pg", label: "Hostel - PG" }, // P
  { value: "q", label: "Hostel Q" },

  { value: "frf", label: "Hostel FRF" },
  { value: "frg", label: "Hostel FRG" },

  { value: "other", label: "Other / off-campus" },
] as const;

const YEAR_OPTIONS = [
  { value: "", label: "Select year" },
  { value: "1", label: "1st year" },
  { value: "2", label: "2nd year" },
  { value: "3", label: "3rd year" },
  { value: "4", label: "4th year" },
] as const;

type SliderField = "cleanliness" | "sleepCycle" | "socialHabits";

function SliderRow({
  id,
  label,
  hint,
  value,
  onChange,
}: {
  id: string;
  label: string;
  hint: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <label
            htmlFor={id}
            className="text-sm font-medium text-zinc-800"
          >
            {label}
          </label>
          <p className="mt-0.5 text-xs text-zinc-500">{hint}</p>
        </div>
        <span
          className="tabular-nums text-lg font-semibold text-teal-700"
          aria-live="polite"
        >
          {value}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={1}
        max={5}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-200 accent-teal-600 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-teal-600 [&::-webkit-slider-thumb]:shadow"
        aria-valuemin={1}
        aria-valuemax={5}
        aria-valuenow={value}
      />
      <div className="mt-1 flex justify-between text-[10px] font-medium uppercase tracking-wide text-zinc-400">
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>5</span>
      </div>
    </div>
  );
}

export function ProfileForm() {
  const router = useRouter();
  const formId = useId();
  const [name, setName] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [hostel, setHostel] = useState("");
  const [cleanliness, setCleanliness] = useState(3);
  const [sleepCycle, setSleepCycle] = useState(3);
  const [socialHabits, setSocialHabits] = useState(3);

  const [errors, setErrors] = useState<{
    name?: string;
    branch?: string;
    year?: string;
    cgpa?: string;
    hostel?: string;
  }>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [checkingExisting, setCheckingExisting] = useState(true);
  const [initialCheckError, setInitialCheckError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function checkExistingProfile() {
      setCheckingExisting(true);
      setInitialCheckError(null);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!active) return;
      if (!session?.user) {
        setInitialCheckError("Sign in to create your profile.");
        setCheckingExisting(false);
        return;
      }

      const { data, error } = await fetchProfileById(session.user.id);
      if (!active) return;

      if (error) {
        setInitialCheckError(error.message);
        setCheckingExisting(false);
        return;
      }

      if (data?.id) {
        router.replace("/matches");
        return;
      }

      setCheckingExisting(false);
    }

    void checkExistingProfile();
    return () => {
      active = false;
    };
  }, [router]);

  const setSlider = useCallback(
    (field: SliderField, n: number) => {
      const setters = {
        cleanliness: setCleanliness,
        sleepCycle: setSleepCycle,
        socialHabits: setSocialHabits,
      } as const;
      setters[field](n);
    },
    []
  );

  function runValidation(): boolean {
    const e = {
      name: validateName(name),
      branch: validateBranch(branch),
      year: validateYear(year),
      cgpa: validateCgpa(cgpa),
      hostel: !hostel ? "Select a hostel preference." : undefined,
    };
    setErrors(e);
    return !e.name && !e.branch && !e.year && !e.cgpa && !e.hostel;
  }

  async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (saving || checkingExisting) return;
    setSaveError(null);
    setSubmitted(true);
    if (!runValidation()) return;

    setSaving(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        setSaveError("Sign in to save your profile.");
        return;
      }

      const { error } = await upsertProfile({
        id: session.user.id,
        full_name: name.trim(),
        branch: branch.trim(),
        year: Number(year),
        cgpa: Number(cgpa),
        hostel_preference: hostel,
        cleanliness,
        sleep_cycle: sleepCycle,
        social_habits: socialHabits,
      });

      if (error) {
        setSaveError(error.message);
        return;
      }
      router.push("/matches");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  function patchField<K extends keyof typeof errors>(
    key: K,
    value: string,
    validate: (v: string) => string | undefined
  ) {
    if (!submitted) return;
    setErrors((prev) => ({ ...prev, [key]: validate(value) }));
  }

  return (
    <AuthShell
      wide
      title="Your profile"
      subtitle="Tell us about yourself so we can suggest compatible roommates for next semester."
      footer={
        <>
          <Link
            href="/"
            className="font-semibold text-teal-700 underline-offset-4 hover:text-teal-800 hover:underline"
          >
            Back to home
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {checkingExisting && (
          <p
            className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700"
            role="status"
          >
            Checking your profile status...
          </p>
        )}
        {initialCheckError && (
          <p
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
            role="alert"
          >
            {initialCheckError}
          </p>
        )}
        {saveError && (
          <p
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
            role="alert"
          >
            {saveError}
          </p>
        )}
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label
              htmlFor={`${formId}-name`}
              className="block text-sm font-medium text-zinc-700"
            >
              Full name
            </label>
            <input
              id={`${formId}-name`}
              name="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                patchField("name", e.target.value, validateName);
              }}
              className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
              placeholder="e.g. Arjun Singh"
              aria-invalid={errors.name ? true : undefined}
            />
            {errors.name && (
              <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor={`${formId}-branch`}
              className="block text-sm font-medium text-zinc-700"
            >
              Branch
            </label>
            <input
              id={`${formId}-branch`}
              name="branch"
              type="text"
              value={branch}
              onChange={(e) => {
                setBranch(e.target.value);
                patchField("branch", e.target.value, validateBranch);
              }}
              className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
              placeholder="e.g. COE, ECE"
              aria-invalid={errors.branch ? true : undefined}
            />
            {errors.branch && (
              <p className="mt-1.5 text-sm text-red-600">{errors.branch}</p>
            )}
          </div>

          <div>
            <label
              htmlFor={`${formId}-year`}
              className="block text-sm font-medium text-zinc-700"
            >
              Year
            </label>
            <select
              id={`${formId}-year`}
              name="year"
              value={year}
              onChange={(e) => {
                setYear(e.target.value);
                patchField("year", e.target.value, validateYear);
              }}
              className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
              aria-invalid={errors.year ? true : undefined}
            >
              {YEAR_OPTIONS.map((o) => (
                <option key={o.value || "empty"} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {errors.year && (
              <p className="mt-1.5 text-sm text-red-600">{errors.year}</p>
            )}
          </div>

          <div>
            <label
              htmlFor={`${formId}-cgpa`}
              className="block text-sm font-medium text-zinc-700"
            >
              CGPA
            </label>
            <input
              id={`${formId}-cgpa`}
              name="cgpa"
              type="number"
              inputMode="decimal"
              min={0}
              max={10}
              step={0.01}
              value={cgpa}
              onChange={(e) => {
                setCgpa(e.target.value);
                patchField("cgpa", e.target.value, validateCgpa);
              }}
              className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
              placeholder="e.g. 8.5"
              aria-invalid={errors.cgpa ? true : undefined}
            />
            {errors.cgpa && (
              <p className="mt-1.5 text-sm text-red-600">{errors.cgpa}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor={`${formId}-hostel`}
              className="block text-sm font-medium text-zinc-700"
            >
              Hostel preference
            </label>
            <select
              id={`${formId}-hostel`}
              name="hostel"
              value={hostel}
              onChange={(e) => {
                const v = e.target.value;
                setHostel(v);
                if (submitted) {
                  setErrors((prev) => ({
                    ...prev,
                    hostel: !v ? "Select a hostel preference." : undefined,
                  }));
                }
              }}
              className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
              aria-invalid={errors.hostel ? true : undefined}
            >
              {HOSTEL_OPTIONS.map((o) => (
                <option key={o.value || "placeholder"} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {errors.hostel && (
              <p className="mt-1.5 text-sm text-red-600">{errors.hostel}</p>
            )}
          </div>
        </div>

        <div className="border-t border-zinc-200 pt-6">
          <h2 className="text-sm font-semibold text-zinc-900">
            Living style (1 = low, 5 = high)
          </h2>
          <p className="mt-1 text-xs text-zinc-500">
            Adjust the sliders to reflect what future roommates should know.
          </p>
          <div className="mt-6 space-y-8">
            <SliderRow
              id={`${formId}-clean`}
              label="Cleanliness"
              hint="How tidy you keep your side of the room."
              value={cleanliness}
              onChange={(n) => setSlider("cleanliness", n)}
            />
            <SliderRow
              id={`${formId}-sleep`}
              label="Sleep cycle"
              hint="1 = early riser · 5 = night owl"
              value={sleepCycle}
              onChange={(n) => setSlider("sleepCycle", n)}
            />
            <SliderRow
              id={`${formId}-social`}
              label="Social habits"
              hint="1 = quiet / private · 5 = very social"
              value={socialHabits}
              onChange={(n) => setSlider("socialHabits", n)}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving || checkingExisting || Boolean(initialCheckError)}
          className="w-full rounded-full bg-zinc-900 py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save profile"}
        </button>
      </form>
    </AuthShell>
  );
}

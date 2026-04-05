import type { Metadata } from "next";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = {
  title: "Sign up | Thapar Roommate Finder",
  description:
    "Join Thapar Roommate Finder to create a profile and find roommates for next semester.",
};

export default function SignupPage() {
  return <SignupForm />;
}

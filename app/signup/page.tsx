import type { Metadata } from "next";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = {
  title: "Sign up | TIET Roomie",
  description:
    "Join TIET Roomie to create a profile and find roommates for next semester.",
};

export default function SignupPage() {
  return <SignupForm />;
}

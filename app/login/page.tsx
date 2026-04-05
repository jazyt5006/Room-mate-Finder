import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in | Thapar Roommate Finder",
  description:
    "Sign in to Thapar Roommate Finder to continue your search for next semester.",
};

export default function LoginPage() {
  return <LoginForm />;
}

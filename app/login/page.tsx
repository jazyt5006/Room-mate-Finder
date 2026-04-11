import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in | TIET Roomie",
  description:
    "Sign in to TIET Roomie to continue your search for next semester.",
};

export default function LoginPage() {
  return <LoginForm />;
}

import type { Metadata } from "next";
import { ProfileForm } from "./profile-form";

export const metadata: Metadata = {
  title: "Your profile | TIET Roomie",
  description:
    "Set your branch, preferences, and living style to find compatible roommates at Thapar.",
};

export default function ProfilePage() {
  return <ProfileForm />;
}

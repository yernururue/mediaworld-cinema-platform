import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "./login-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | MediaWorld",
  description: "Sign in or create a MediaWorld account to access your personalized film collection, watch history, reviews, and curated cinematic experiences.",
  openGraph: {
    title: "Sign In | MediaWorld",
    description: "Sign in or create a MediaWorld account to access your personalized film collection, watch history, reviews, and curated cinematic experiences.",
    type: "website",
  },
};

export default async function LoginPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Instant server-side redirect to avoid client-side flashing for logged-in users
  if (user) {
    redirect("/profile");
  }

  return <LoginForm />;
}

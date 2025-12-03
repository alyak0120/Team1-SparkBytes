"use client";

import { useRouter } from "next/navigation";
import SignUpForm from "@/components/sign-up-form";

export default function Page() {
  const router = useRouter();

  return (
    <div className="flex min-h-svh w-full items-center justify-center">
      <SignUpForm
        onSignUp={() => router.push("/")}   // ⬅️ fixed redirect
        onNavigate={(path) => router.push(`/auth/${path}`)}
      />
    </div>
  );
}

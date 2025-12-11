'use client';

import { useRouter } from "next/navigation";

export default function AboutClient() {
  const router = useRouter();

  return (
    <section className="text-center py-12 bg-gray-100">
      <p className="text-gray-700 mb-6">
        Have feedback, ideas, or want to join our team? Let’s chat!
      </p>
      <div className="flex justify-center gap-4">
        <button
          aria-label="about-client-login-button"
          onClick={() => router.push("/auth/login")}
          className="bg-red-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-700 transition"
        >
          Log In
        </button>
        <button
          onClick={() => router.push("/auth/sign-up")}
          aria-label="about-client-sign-up-button"
          className="border border-red-600 text-red-700 px-6 py-2 rounded-full font-semibold hover:bg-red-50 transition"
          style={{backgroundColor: "#CC0000", color: "white"}}
        >
          Sign Up
        </button>
      </div>
    </section>
  );
}

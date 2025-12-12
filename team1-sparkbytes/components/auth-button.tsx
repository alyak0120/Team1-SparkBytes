"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { LogoutButton } from "./logout-button";

export function AuthButton() {
  const [user, setUser] = useState<any>(null);
  const [firstName, setFirstName] = useState<string>("");
  const supabase = createClient();

  useEffect(() => {
    // Load current session
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
    });

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);
  useEffect(() => {
    async function loadUser() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      setUser(userData.user);

      // Fetch display name from profiles table
      const { data: profile } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", userData.user.id)
        .single();

      if (profile?.name) {
        const first = profile.name.split(" ")[0]; // 👈 GET FIRST NAME ONLY
        setFirstName(first);
      }
    }

    loadUser();
  }, []);

  

  // -----------------------------
  // Not logged in
  // -----------------------------
  if (!user) {
    return (
      <div className="flex gap-2">
        <Button asChild size="sm" variant="outline">
          <Link href="/auth/login">Sign in</Link>
        </Button>
        <Button asChild size="sm" variant="default" style={{backgroundColor: "#CC0000", color: "white"}}>
          <Link href="/auth/sign-up">Sign up</Link>
        </Button>
      </div>
    );
  }

  // -----------------------------
  // Logged in
  // -----------------------------
  return (
    <div style={{color: "black"}} className="flex items-center gap-4">
      Hey, {firstName || user.email}!
      <LogoutButton />
    </div>
  );
}

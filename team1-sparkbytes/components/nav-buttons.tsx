"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { LogoutButton } from "./logout-button";

export function NavButtons() {
  const [user, setUser] = useState<any>(null);
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

  // -----------------------------
  // Not logged in
  // -----------------------------
  if (!user) {
    return (
        <div className="max-w-6xl py-3 px-4 flex gap-2 items-center">
            <Button size="sm" style={{backgroundColor: "#CC0000", color: "white"}}><Link href="/">About</Link></Button>
        </div>
    );
  }

  // -----------------------------
  // Logged in
  // -----------------------------
  return (
    <div className="max-w-6xl py-3 px-4 flex gap-2 items-center">
        <Button size="sm" style={{backgroundColor: "#CC0000", color: "white"}}><Link href="/event">Events</Link></Button>
        <Button size="sm" style={{backgroundColor: "#CC0000", color: "white"}}><Link href="/dashboard">Your Account</Link></Button>
        <Button size="sm" style={{backgroundColor: "#CC0000", color: "white"}}><Link href="/">About</Link></Button>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check session once on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });

    // Listen for login/logout events
    supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    router.push("/auth/login");
  };

  return isLoggedIn ? (
    <Button onClick={handleLogout}>Logout</Button>
  ) : (
    <Button onClick={() => router.push("/auth/login")}>Login</Button>
  );
}

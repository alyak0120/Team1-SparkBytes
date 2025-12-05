"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();          // refresh layout so AuthButton updates
    router.push("/auth/login"); // go back to login page
  };

  return (
    <Button
      size="sm"
      style={{ backgroundColor: "#CC0000", color: "white" }}
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
}

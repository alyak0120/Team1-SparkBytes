"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return <Button size="sm" style={{backgroundColor: "#CC0000", color: "white"}} onClick={logout}>Logout</Button>;
}

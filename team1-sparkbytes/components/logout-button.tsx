"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh(); // refresh layout so AuthButton updates
    router.push("/auth/login"); // redirect to sign-in page
  };

<<<<<<< HEAD
  return (
    <Button onClick={handleLogout}>
      Logout
    </Button>
  );
=======
  return <Button size="sm" style={{backgroundColor: "#CC0000", color: "white"}} onClick={logout}>Logout</Button>;
>>>>>>> main
}

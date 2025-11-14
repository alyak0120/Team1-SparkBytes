/* create new next route ~/app/profile/page.tsx */
/* profile page server component */
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supabase = await createClient();

  //get current user
  const {
    data: { user },
  } = await supabase.auth.getUser(); /* get user from supabase auth */

  /*if not logged in → redirect to login*/
  if (!user) redirect("/auth/login");

  // fetch user profile from the database
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-3xl font-semibold">Your Profile</h1>

      <div className="space-y-2 text-sm">
        <p>
          <span className="font-medium">Email:</span> {user.email}
        </p>

        <p>
          <span className="font-medium">Full name:</span>{" "}
          {profile?.full_name ?? "Not set yet"}
        </p>

        <p>
          <span className="font-medium">Bio:</span>{" "}
          {profile?.bio ?? "No bio yet"}
        </p>
      </div>
    </div>
  );
}

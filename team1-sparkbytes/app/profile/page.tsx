/* app/profile/page.tsx */
/* profile page server component */
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  //create Supabase server client
  const supabase = await createClient();

  //get current user from Supabase Auth (accounts table)
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  //if not logged in or there was an auth error → redirect to login
  if (userError || !user) {
    redirect("/auth/login");
  }

  //fetch user profile from the "profiles" table using the auth user id
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Error loading profile:", profileError);
  }

  //render data
  return (
    <div className="flex-1 w-full max-w-2xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-3xl font-semibold">Your Profile</h1>

      <div className="space-y-2 text-sm">
        <p>
          <span className="font-medium">Email:</span>{" "}
          {profile?.email ?? user.email}
        </p>

        <p>
          <span className="font-medium">Name:</span>{" "}
          {profile?.name ?? "Not set yet"}
        </p>

        <p>
          <span className="font-medium">BU ID:</span>{" "}
          {profile?.bu_id ?? "Not set yet"}
        </p>

        <p>
          <span className="font-medium">Preferences:</span>{" "}
          {profile?.preferences
            ? JSON.stringify(profile.preferences)
            : "No preferences set"}
        </p>
      </div>
    </div>
  );
}

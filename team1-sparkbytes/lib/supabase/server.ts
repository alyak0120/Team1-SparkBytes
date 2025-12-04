import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  //cookies() is async in RSC
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        //reading cookies
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        //not allowed in layouts/server components- make no-ops
        set(_name: string, _value: string, _options: CookieOptions) {
          //no-op in RSC context
        },
        remove(_name: string, _options: CookieOptions) {
          //no-op in RSC context
        },
      },
    }
  );
}


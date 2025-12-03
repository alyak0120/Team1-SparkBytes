import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Server-side API route that inserts an event into the `events` table.
// IMPORTANT: this route uses the SERVICE ROLE KEY and must only run server-side.

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing Supabase env vars', {
        hasUrl: Boolean(SUPABASE_URL),
        hasServiceKey: Boolean(SUPABASE_SERVICE_ROLE_KEY),
      });
      return NextResponse.json({ error: 'Supabase environment variables are not set on the server. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.' }, { status: 500 });
    }

    const supabaseAdmin = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY,
    );

    const { data, error } = await supabaseAdmin.from('events').insert([body]);

    if (error) {
      console.error('Supabase insert error (server)', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err: any) {
    console.error('API /api/events error', err);
    return NextResponse.json({ error: err?.message ?? 'Unknown error' }, { status: 500 });
  }
}

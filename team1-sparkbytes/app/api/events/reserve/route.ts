import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const { eventId, userId } = await req.json();

  // Use server-side env variables
  const SUPABASE_URL = process.env.SUPABASE_URL!;
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!SUPABASE_URL || !SERVICE_KEY) {
    throw new Error("Supabase server env variables are missing!");
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    db: { schema: "public" }
  });

  // 1. Create reservation
  const { error: reservationError } = await supabase
    .from("reservations")
    .insert({ event_id: eventId, user_id: userId });

  if (reservationError) {
    return NextResponse.json({ error: reservationError.message }, { status: 400 });
  }

  // 2. Increment attendee count using RPC
  const { error: rpcError } = await supabase.rpc("increment_attendee", {
    eventid: eventId
  });

  if (rpcError) {
    return NextResponse.json({ error: rpcError.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
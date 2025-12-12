import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      title,
      description,
      dietary_tags,
      allergy_tags,
      location,
      address,
      campus,
      capacity,
      start_time,
      end_time,
      image_url // <-- include image URL from client
    } = body;

    // -----------------------------
    // VALIDATION
    // -----------------------------
    if (!title || !description || !location || !campus || !start_time || !end_time) {
      return NextResponse.json(
        { error: "Missing required fields: title, description, location, campus, start_time, end_time" },
        { status: 400 }
      );
    }

    const cap = Number(capacity);
    if (isNaN(cap) || cap <= 0 || cap > 10000) {
      return NextResponse.json(
        { error: "Capacity must be a number between 1 and 10,000" },
        { status: 400 }
      );
    }

    if (isNaN(Date.parse(start_time)) || isNaN(Date.parse(end_time))) {
      return NextResponse.json(
        { error: "start_time and end_time must be valid ISO date strings" },
        { status: 400 }
      );
    }

    // -----------------------------
    // CREATE SUPABASE CLIENT (SERVICE ROLE)
    // -----------------------------
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_KEY) {
  throw new Error("Supabase server env variables are missing!");
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false }
});

    // -----------------------------
    // INSERT EVENT
    // -----------------------------
    const { data: event, error: insertErr } = await supabase
      .from("events")
      .insert({
        title,
        description,
        dietary_tags: dietary_tags || [],
        allergy_tags: allergy_tags || [],
        location,
        address: address || null,
        campus,
        capacity: cap,
        start_time,
        end_time,
        image_url: image_url || null // <-- insert image URL
      })
      .select()
      .single();

    if (insertErr) {
      console.error("Event insert error:", insertErr);
      return NextResponse.json({ error: insertErr.message }, { status: 500 });
    }

    return NextResponse.json({ event }, { status: 200 });
  } catch (err: any) {
    console.error("Unhandled error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

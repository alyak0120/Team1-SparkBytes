import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const minutes = 15;

  // Call the Postgres function
  const { data, error } = await supabase.rpc(
    "get_bookmarked_events_starting_soon",
    { p_minutes: minutes }
  );

  if (error) {
    console.error("Error fetching bookmarked events:", error);
    return NextResponse.json(
      { error: "Failed to fetch upcoming bookmarked events" },
      { status: 500 }
    );
  }

  if (!data || data.length === 0) {
    return NextResponse.json({
      ok: true,
      sent: 0,
      message: "No bookmarked events starting soon."
    });
  }

  // Send emails for each upcoming event
  let sent = 0;

  for (const ev of data) {
    if (!ev.user_email) continue;

    try {
      await resend.emails.send({
        from: "SparkBytes <no-reply@sparkbytes.app>",
        to: ev.user_email,
        subject: `Reminder: ${ev.event_title} is starting soon!`,
        html: `
          <p>Your bookmarked event <b>${ev.event_title}</b> starts in the next ${minutes} minutes!</p>
          <p>Starts at: ${ev.starts_at_ts}</p>
        `
      });
      sent++;
    } catch (err) {
      console.error("Failed to send reminder:", err);
    }
  }

  return NextResponse.json({ ok: true, sent });
}

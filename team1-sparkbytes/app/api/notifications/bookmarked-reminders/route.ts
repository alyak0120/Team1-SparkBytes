import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY || "");

// SERVER-ONLY Supabase client using SERVICE ROLE key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // DO NOT expose this to the browser
);

export async function GET() {
  try {
    // 1. Call the RPC to find upcoming bookmarked events (next 15 min)
    const { data, error } = await supabaseAdmin.rpc(
      "get_bookmarked_events_starting_soon",
      { minutes_ahead: 15 }
    );

    if (error) {
      console.error("RPC error:", error);
      return NextResponse.json(
        { error: "Failed to fetch upcoming bookmarked events" },
        { status: 500 }
      );
    }

    const rows = data || [];

    // If nothing to do, return early
    if (!rows.length) {
      return NextResponse.json({
        ok: true,
        sent: 0,
        message: "No bookmarked events starting soon.",
      });
    }

    // 2. For each row, send an email + record notification
    let sentCount = 0;

    for (const row of rows) {
      const { user_id, user_email, event_id, event_title, starts_at } = row as {
        user_id: string;
        user_email: string;
        event_id: number;
        event_title: string;
        starts_at: string;
      };

      // If no RESEND_API_KEY yet, just log instead of sending
      if (!process.env.RESEND_API_KEY) {
        console.log("[BOOKMARK REMINDER MOCK] Would email:", {
          to: user_email,
          event_title,
          starts_at,
        });
      } else {
        await resend.emails.send({
          from: "SparkBytes <no-reply@sparkbytes.app>",
          to: user_email,
          subject: `“${event_title}” starts soon!`,
          html: `
            <p>Hi,</p>
            <p>Your bookmarked event <b>${event_title}</b> is starting soon.</p>
            <p>Start time: ${starts_at}</p>
            <p>See more details on SparkBytes.</p>
          `,
        });
      }

      // 3. Insert into event_notifications so we don't send duplicates
      const { error: insertError } = await supabaseAdmin
        .from("event_notifications")
        .insert({
          user_id,
          event_id,
          notification_type: "15min_before",
        });

      if (insertError) {
        console.error("Failed to record event notification:", insertError);
      } else {
        sentCount++;
      }
    }

    return NextResponse.json({
      ok: true,
      sent: sentCount,
    });
  } catch (err) {
    console.error("Error in bookmarked-reminders endpoint:", err);
    return NextResponse.json(
      { error: "Unexpected error in reminder endpoint" },
      { status: 500 }
    );
  }
}

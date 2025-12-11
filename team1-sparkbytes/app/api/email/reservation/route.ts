import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const apiKey = process.env.RESEND_API_KEY;

// Warn if API key missing (email mock mode)
if (!apiKey) {
  console.warn("[EMAIL] RESEND_API_KEY is missing — email sending will be mocked.");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, eventTitle, eventTime, location } = body;

    console.log("[EMAIL] Incoming Request:", body);

    if (!userId || !eventTitle || !eventTime) {
      console.warn("[EMAIL] Missing required fields:", { userId, eventTitle, eventTime });
      return NextResponse.json(
        { error: "Missing fields: userId, eventTitle, eventTime are required." },
        { status: 400 }
      );
    }

    // Initialize Supabase Admin client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // must be present
    );

    // Fetch user's email via admin API
    console.log("[EMAIL] Fetching user from Supabase Admin:", userId);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.admin.getUserById(userId);

    if (userError || !user?.email) {
      console.warn("[EMAIL] Could not fetch user or email:", userError);
      return NextResponse.json({ ok: true, mocked: true });
    }

    const email = user.email;

    console.log("[EMAIL] User email retrieved:", email);

    // Mock mode if missing Resend key
    if (!apiKey) {
      console.log("[EMAIL MOCK] Would send reservation email to:", email);
      return NextResponse.json({ ok: true, mocked: true });
    }

    const resend = new Resend(apiKey);

    const html = `
      <div style="font-family: Arial, sans-serif; background:#f8fafc; padding:24px;">
        <div style="max-width:520px;margin:auto;background:white;padding:28px;border-radius:12px; box-shadow:0 3px 10px rgba(0,0,0,0.06);">

          <h2 style="color:#ff7043; text-align:center; margin-bottom:12px;">
            🥳 Reservation Confirmed!
          </h2>

          <p style="font-size:16px; color:#333;">
            You've successfully reserved a serving for:
          </p>

          <div style="background:#fff3e0; padding:18px; border-radius:10px; margin:20px 0;">
            <h3 style="margin:0; color:#c65d2e; font-size:18px;">${eventTitle}</h3>
            <p style="margin:6px 0 0; color:#333;">
              📅 <strong>${eventTime}</strong><br>
              📍 ${location || "Location TBA"}
            </p>
          </div>

          <p style="font-size:15px; color:#333;">
            Make sure to check in on time so you don't miss your serving!
          </p>

          <p style="font-size:15px; margin-top:22px; color:#333;">
            – SparkBytes Team 🍊
          </p>

        </div>
      </div>
    `;

    console.log("[EMAIL] Sending email…");

    const result = await resend.emails.send({
      from: "SparkBytes <no-reply@resend.dev>", // FIXED — valid Resend domain
      to: email,
      subject: `Your SparkBytes Reservation 🍽️`,
      html,
    });

    console.log("[EMAIL] Resend API response:", result);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[EMAIL ERROR]", err);
    return NextResponse.json(
      { error: "Failed to send reservation email." },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  console.warn("[EMAIL] RESEND_API_KEY is not set. Email sending will be mocked.");
}

const resend = new Resend(apiKey || ""); // still instantiate, but we log above

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, eventTitle, eventTime, location } = body;

    console.log("[EMAIL] Incoming reservation email request:", body);

    if (!email || !eventTitle || !eventTime) {
      console.warn("[EMAIL] Missing required fields:", { email, eventTitle, eventTime });
      return NextResponse.json(
        { error: "Missing fields (email, eventTitle, eventTime required)" },
        { status: 400 }
      );
    }

    // Mock mode if missing API key
    if (!apiKey) {
      console.log("[EMAIL MOCK] Would send reservation email:", {
        email,
        eventTitle,
        eventTime,
        location,
      });
      return NextResponse.json({ ok: true, mocked: true });
    }

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

    const result = await resend.emails.send({
      from: "SparkBytes <no-reply@sparkbytes.app>",
      to: email,
      subject: `Your SparkBytes Reservation 🍽️`,
      html,
    });

    console.log("[EMAIL] Resend API response:", result);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Reservation email error:", err);
    return NextResponse.json(
      { error: "Failed to send reservation email" },
      { status: 500 }
    );
  }
}

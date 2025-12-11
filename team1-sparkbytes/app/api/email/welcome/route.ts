import { NextResponse } from "next/server";
import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    // Mock mode if missing API key
    if (!apiKey) {
      console.log("[MOCK] Would send welcome email to:", email);
      return NextResponse.json({ ok: true, mocked: true });
    }

    const resend = new Resend(apiKey);
    <div style="font-family: Arial, sans-serif; background:#fafafa; padding:24px;">
      <div style="max-width:500px;margin:auto;background:white;padding:28px;border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.05);">
        
        <h2 style="color:#ff7043; text-align:center; margin-bottom:12px;">
          🍊 Welcome to SparkBytes!
        </h2>

        <p style="font-size:16px; color:#333;">
          Hi ${name || "there"},<br><br>
          We're excited to have you join <strong>SparkBytes</strong> — your new way to discover free food around BU while helping reduce campus waste.
        </p>

        <div style="background:#fff3e0; padding:16px; border-radius:10px; margin:18px 0; text-align:center;">
          <p style="margin:0; font-size:15px; color:#c65d2e;">
            You’ll start getting alerts when new events are posted.
          </p>
        </div>

        <p style="font-size:15px; color:#333;">
          Thanks for joining the SparkBytes community!  
        </p>

        <p style="font-size:15px; margin-top:24px; color:#333;">
          – The SparkBytes Team 🍽️
        </p>

      </div>
    </div>
    `;

    await resend.emails.send({
      from: "SparkBytes <no-reply@sparkbytes.app>",
      to: email,
      subject: "Welcome to SparkBytes 🎉",
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Welcome email error:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}

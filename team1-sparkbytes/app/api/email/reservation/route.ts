import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { email, eventTitle } = await req.json();

    if (!email || !eventTitle) {
      return NextResponse.json({ error: "Missing email or eventTitle" }, { status: 400 });
    }

    // Mock mode when API key missing
    if (!process.env.RESEND_API_KEY) {
      console.log("[MOCK EMAIL] Reservation email to:", email, "Event:", eventTitle);
      return NextResponse.json({ ok: true, mocked: true });
    }

    await resend.emails.send({
      from: "SparkBytes <no-reply@sparkbytes.app>",
      to: email,
      subject: `You're Reserved for ${eventTitle}! 🎉`,
      html: `
        <p>Your reservation for <b>${eventTitle}</b> is confirmed! 🎉</p>
        <p>See you soon!</p>
        <p>— The SparkBytes Team</p>
      `
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error sending reservation email:", error);
    return NextResponse.json({ error: "Email send failed" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Missing email" },
        { status: 400 }
      );
    }

    // If you don't have RESEND_API_KEY set yet, just log and pretend.
    if (!process.env.RESEND_API_KEY) {
      console.log("[WELCOME EMAIL MOCK] Would send welcome email to:", {
        email,
        name,
      });
      return NextResponse.json({ ok: true, mocked: true });
    }

    await resend.emails.send({
      from: "SparkBytes <no-reply@sparkbytes.app>",
      to: email,
      subject: "Welcome to SparkBytes 🎉",
      html: `
        <p>Hi ${name || "there"},</p>
        <p>Thanks for signing up for <b>SparkBytes</b>! 🎉</p>
        <p>You'll now be able to find free food events around BU and help reduce food waste.</p>
        <p>Happy snacking,<br/>The SparkBytes Team</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error sending welcome email:", err);
    return NextResponse.json(
      { error: "Failed to send welcome email" },
      { status: 500 }
    );
  }
}

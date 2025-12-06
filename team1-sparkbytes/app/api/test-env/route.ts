import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    resendKey: process.env.RESEND_API_KEY ? "LOADED" : "MISSING",
  });
}

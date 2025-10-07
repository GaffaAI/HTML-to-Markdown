import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { turnstileToken } = await req.json();

  if (typeof turnstileToken !== "string" || !turnstileToken) {
    return NextResponse.json(
      { error: "Missing or invalid turnstileToken", success: false },
      { status: 400 },
    );
  }
  try {
    const result = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${process.env.TURNSTILE_SECRET_KEY}&response=${turnstileToken}`,
      },
    );

    if (!result.ok) {
      return NextResponse.json(
        { error: "Failed to verify Turnstile token", success: false },
        { status: 502 },
      );
    }

    const data = await result.json();

    if (!data.success) {
      return NextResponse.json(
        { error: "Invalid Turnstile token", success: false },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Error validating Turnstile token", success: false },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/lib/drupal/user";

export async function POST(request: NextRequest) {
  let body: { name?: string; email?: string; password?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, password } = body;

  if (!name || !email || !password) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  try {
    await registerUser(name, email, password);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Registration failed. Please try again.";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}

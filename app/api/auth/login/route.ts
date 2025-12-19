
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Mock Login
    // In a real app, hash password and check.
    // Here, just find user or create dummy.
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Auto-register for MVP
      user = await prisma.user.create({
        data: {
          email,
          password: password, // In real app, hash this!
          name: email.split("@")[0],
          role: email === "admin@team.core" ? "ADMIN" : "MEMBER",
        },
      });
    }

    if (user.password !== password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Set cookie/session (Simplified)
    // handling cookies in Next.js App Router:
    // We would return a Set-Cookie header.
    // For MVP, we pass back the user object and store it in Context/LocalStorage or use cookies helper.

    // Let's use a simple approach: Return User info.

    // Update lastSeenAt
    await prisma.user.update({
      where: { id: user.id },
      data: { lastSeenAt: new Date() }
    });

    const response = NextResponse.json({ success: true, user });
    response.cookies.set("auth_token", String(user.id), { httpOnly: true }); // Simplest "auth"

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}

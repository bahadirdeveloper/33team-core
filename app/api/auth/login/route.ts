import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signJWT } from "@/lib/token";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Check password
    // Note: For existing plain text passwords (like '123'), we need a migration strategy or reset.
    // Simple hack: if password matches plain text, re-hash it. Else check hash.

    let isValid = await bcrypt.compare(password, user.password);

    // Fallback for legacy plain text users (Migration)
    if (!isValid && user.password === password) {
      isValid = true;
      // Upgrade to hash
      const newHash = await bcrypt.hash(password, 10);
      await prisma.user.update({
        where: { id: user.id },
        data: { password: newHash }
      });
    }

    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Update lastSeenAt
    await prisma.user.update({
      where: { id: user.id },
      data: { lastSeenAt: new Date() }
    });

    // Create JWT
    const token = await signJWT({
      sub: user.id.toString(),
      role: user.role,
      mustChangePassword: user.mustChangePassword
    });

    const response = NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } });

    // Set secure cookie
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 // 1 day
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}

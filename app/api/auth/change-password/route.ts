import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJWT, signJWT } from "@/lib/token";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const { password } = await request.json();

        // 1. Get current user from token
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const payload = await verifyJWT(token);
        if (!payload || !payload.sub) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        const userId = parseInt(payload.sub);

        // 2. Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Update user
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                password: hashedPassword,
                mustChangePassword: false // Clear flag
            }
        });

        // 4. Issue new token with updated state
        const newToken = await signJWT({
            sub: updatedUser.id.toString(),
            role: updatedUser.role,
            mustChangePassword: false
        });

        const response = NextResponse.json({ success: true });

        response.cookies.set("auth_token", newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 // 1 day
        });

        return response;

    } catch (error) {
        console.error("Change pass error:", error);
        return NextResponse.json({ error: "Failed to change password" }, { status: 500 });
    }
}

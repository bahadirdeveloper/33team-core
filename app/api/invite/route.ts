
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/invite
export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        // Check if exists
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        // Create user with default password (invite logic simplified)
        const newUser = await prisma.user.create({
            data: {
                email,
                name: email.split("@")[0],
                password: "123", // Default password for invited users
                role: "MEMBER"
            }
        });

        return NextResponse.json({ success: true, user: newUser });
    } catch (error) {
        return NextResponse.json({ error: "Invite failed" }, { status: 500 });
    }
}


import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                lastSeenAt: true,
                // Calculate detailed score if needed, or we can fetch tasks count
                tasks: {
                    where: { status: "COMPLETED" },
                    select: { points: true }
                }
            }
        });

        const enrichedUsers = users.map(u => {
            const totalScore = u.tasks.reduce((acc, t) => acc + t.points, 0); // Each completed task adds points (default 1)
            const isOnline = u.lastSeenAt && (new Date().getTime() - new Date(u.lastSeenAt).getTime() < 5 * 60 * 1000); // 5 mins

            return {
                id: u.id,
                name: u.name,
                email: u.email,
                avatar: `https://ui-avatars.com/api/?name=${u.name}&background=random`, // Simple avatar
                totalScore,
                isOnline,
                lastSeenAt: u.lastSeenAt
            };
        });

        // Sort by score desc
        enrichedUsers.sort((a, b) => b.totalScore - a.totalScore);

        return NextResponse.json(enrichedUsers);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}

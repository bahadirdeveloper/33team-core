
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/cron/check-expired
// This endpoint should be called by a cron job (e.g. Vercel Cron or external)
export async function GET() {
    try {
        const now = new Date();

        // Find tasks that are TAKEN and dueAt < now
        const expiredTasks = await prisma.task.findMany({
            where: {
                status: "TAKEN",
                dueAt: {
                    lt: now
                }
            }
        });

        // Update them to AVAILABLE and clear assignment
        const count = expiredTasks.length;
        if (count > 0) {
            await prisma.task.updateMany({
                where: {
                    id: { in: expiredTasks.map((t: { id: number }) => t.id) }
                },
                data: {
                    status: "AVAILABLE",
                    assignedToId: null
                }
            });
        }

        return NextResponse.json({ success: true, expiredCount: count });
    } catch (error) {
        return NextResponse.json({ error: "Cron job failed" }, { status: 500 });
    }
}


import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/tasks/take
export async function POST(request: Request) {
    try {
        const { taskId, userId } = await request.json();

        const task = await prisma.task.findUnique({ where: { id: taskId } });
        if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });
        if (task.status !== "AVAILABLE") return NextResponse.json({ error: "Task not available" }, { status: 400 });

        // Dependencies check
        const dependencies = await prisma.taskDependency.findMany({
            where: { taskId },
            include: { dependsOn: true }
        });

        const pendingDeps = dependencies.filter((d: (typeof dependencies)[number]) => d.dependsOn.status !== "COMPLETED");
        if (pendingDeps.length > 0) {
            return NextResponse.json({ error: "Dependencies not met" }, { status: 400 });
        }

        const updated = await prisma.task.update({
            where: { id: taskId },
            data: {
                status: "TAKEN",
                assignedToId: userId
            }
        });

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: "Failed to take task" }, { status: 500 });
    }
}


import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/tasks/submit
export async function POST(request: Request) {
    try {
        const { taskId, userId, outputType, outputUrl, note } = await request.json();

        const task = await prisma.task.findUnique({ where: { id: taskId } });
        if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });

        // Validate user assignment
        if (task.assignedToId !== userId) {
            return NextResponse.json({ error: "Not assigned to this user" }, { status: 403 });
        }

        // Transaction: Create submission and update task
        const result = await prisma.$transaction(async (tx) => {
            const submission = await tx.taskSubmission.create({
                data: {
                    taskId,
                    userId,
                    outputType,
                    outputUrl,
                    note
                }
            });

            const updatedTask = await tx.task.update({
                where: { id: taskId },
                data: {
                    status: "COMPLETED"
                }
            });

            return { submission, updatedTask };
        });

        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: "Failed to submit task" }, { status: 500 });
    }
}

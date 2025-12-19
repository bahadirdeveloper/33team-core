
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT /api/tasks/[id] - Update Task
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const taskId = parseInt(id);
        if (isNaN(taskId)) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        const body = await request.json();
        // body: { title, description, points, dueAt, ... }

        // Normalize date if present
        if (body.dueAt) {
            body.dueAt = new Date(body.dueAt);
        }

        const updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: {
                title: body.title,
                description: body.description,
                points: body.points ? Number(body.points) : undefined,
                dueAt: body.dueAt,
                status: body.status, // Allow status override if needed
                outputType: body.outputType
            }
        });

        return NextResponse.json(updatedTask);
    } catch (error) {
        console.error("Task Update Error:", error);
        return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
    }
}

// DELETE /api/tasks/[id] - Delete Task
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const taskId = parseInt(id);
        if (isNaN(taskId)) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        // First delete dependencies/submissions if CASCADE is not set or to be safe
        // SQLite/Prisma usually handles cascade if defined, but let's be explicit if needed.
        // Schema relations:
        // TaskDependency (dependsOn, task)
        // TaskSubmission (task)

        // Deleting via transaction to ensure clean cleanup
        await prisma.$transaction([
            prisma.taskDependency.deleteMany({
                where: {
                    OR: [
                        { taskId: taskId },
                        { dependsOnId: taskId }
                    ]
                }
            }),
            prisma.taskSubmission.deleteMany({
                where: { taskId: taskId }
            }),
            prisma.task.delete({
                where: { id: taskId }
            })
        ]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Task Delete Error:", error);
        return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
    }
}

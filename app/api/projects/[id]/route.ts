
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const projectId = parseInt(id);

        if (isNaN(projectId)) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        // Deleting a project needs to clean up all related data:
        // 1. Tasks in branches of this project
        // 2. Dependencies and Submissions of those tasks
        // 3. Branches
        // 4. Servers
        // 5. The Project itself

        // Since Prisma/SQLite might not have full CASCADE configured in the DB engine,
        // we can use a transaction or rely on relation delete actions if configured in schema.
        // Our schema relations don't have explicit onDelete: Cascade, so we should do it manually for safety.

        await prisma.$transaction(async (tx) => {
            // Find all branches
            const branches = await tx.projectBranch.findMany({
                where: { projectId },
                select: { id: true }
            });
            const branchIds = branches.map(b => b.id);

            if (branchIds.length > 0) {
                // Find all tasks in these branches
                const tasks = await tx.task.findMany({
                    where: { branchId: { in: branchIds } },
                    select: { id: true }
                });
                const taskIds = tasks.map(t => t.id);

                if (taskIds.length > 0) {
                    // Delete Submissions
                    await tx.taskSubmission.deleteMany({
                        where: { taskId: { in: taskIds } }
                    });

                    // Delete Dependencies
                    await tx.taskDependency.deleteMany({
                        where: {
                            OR: [
                                { taskId: { in: taskIds } },
                                { dependsOnId: { in: taskIds } }
                            ]
                        }
                    });

                    // Delete Tasks
                    await tx.task.deleteMany({
                        where: { id: { in: taskIds } }
                    });
                }

                // Delete Branches
                await tx.projectBranch.deleteMany({
                    where: { id: { in: branchIds } }
                });
            }

            // Delete Servers
            await tx.server.deleteMany({
                where: { projectId }
            });

            // Delete Project
            await tx.project.delete({
                where: { id: projectId }
            });
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete Project Error:", error);
        return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
    }
}

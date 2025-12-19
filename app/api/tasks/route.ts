
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


// GET /api/tasks?status=AVAILABLE&projectId=...
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const projectId = searchParams.get("projectId");
    const branchId = searchParams.get("branchId");

    try {
        const whereClause: any = {};
        if (status) {
            whereClause.status = status;
        }

        if (branchId) {
            whereClause.branchId = parseInt(branchId);
        } else if (projectId) {
            whereClause.branch = {
                projectId: parseInt(projectId)
            };
        }

        const tasks = await prisma.task.findMany({
            where: whereClause,
            include: {
                branch: {
                    include: {
                        project: true
                    }
                },
                assignedTo: {
                    select: { name: true }
                },
                dependencies: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(tasks);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
    }
}

// POST /api/tasks - Create Task (Admin)
export async function POST(request: Request) {
    try {
        const body = await request.json();
        // body: { title, branchId, dependencies: [taskId, ...], points, dueAt... }

        const task = await prisma.task.create({
            data: {
                title: body.title,
                description: body.description,
                branchId: parseInt(body.branchId),
                points: body.points || 1,
                dueAt: body.dueAt ? new Date(body.dueAt) : null,
                outputType: body.outputType || "URL"
                // Dependencies logic to be added if needed
            }
        });

        if (body.dependencies && body.dependencies.length > 0) {
            // create dependencies
            await prisma.taskDependency.createMany({
                data: body.dependencies.map((depId: number) => ({
                    taskId: task.id,
                    dependsOnId: depId
                }))
            });
        }

        return NextResponse.json(task);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
    }
}

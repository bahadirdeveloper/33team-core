
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/projects - List all projects with progress
export async function GET() {
    try {
        // Fetch projects with their branches and tasks to calculate progress
        const projects = await prisma.project.findMany({
            include: {
                branches: {
                    include: {
                        tasks: {
                            select: { status: true }
                        }
                    }
                },
                servers: true
            }
        });

        const enriched = projects.map(p => {
            const allTasks = p.branches.flatMap(b => b.tasks);
            const total = allTasks.length;
            const completed = allTasks.filter(t => t.status === 'COMPLETED').length;
            const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

            return {
                ...p,
                stats: {
                    total,
                    completed,
                    progress
                }
            };
        });

        return NextResponse.json(enriched);
    } catch (error) {
        console.error("Projects API Error:", error);
        return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
    }
}

// POST /api/projects - Create new project
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, description, repoUrl, branches } = body;
        // branches: string[] names

        const project = await prisma.project.create({
            data: {
                name,
                description,
                repoUrl,
                branches: {
                    create: branches ? branches.map((b: string) => ({ name: b })) : []
                }
            },
            include: {
                branches: true
            }
        });

        return NextResponse.json(project);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
    }
}

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import ProjectView from "./ProjectView";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: PageProps) {
    const { id } = await params;
    const projectId = parseInt(id);
    console.log("DEBUG: ProjectPage visiting ID:", projectId);

    if (isNaN(projectId)) return notFound();

    const currentUser = await getCurrentUser();

    try {
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: {
                branches: {
                    include: {
                        tasks: {
                            select: { status: true }
                        },
                        owners: {
                            where: { status: 'ACTIVE' },
                            include: {
                                user: true
                            }
                        }
                    }
                }
            }
        });

        if (!project) return notFound();

        // Calculate stats
        const allTasks = project.branches.flatMap((b: (typeof project.branches)[number]) => b.tasks);
        const total = allTasks.length;
        const completed = allTasks.filter((t: { status: string }) => t.status === 'COMPLETED').length;
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

        const projectWithStats = {
            ...project,
            stats: { total, completed, progress }
        };

        // Fetch deliverables
        const deliverables = await prisma.taskSubmission.findMany({
            where: {
                task: {
                    branch: {
                        projectId: projectId
                    }
                }
            },
            take: 50,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                task: {
                    include: {
                        branch: true
                    }
                },
                user: true
            }
        });

        const serializedDeliverables = deliverables.map((d: (typeof deliverables)[number]) => ({
            id: d.id,
            outputType: d.outputType,
            outputUrl: d.outputUrl,
            note: d.note,
            createdAt: d.createdAt.toISOString(),
            task: {
                title: d.task.title,
                branch: {
                    id: d.task.branch.id,
                    name: d.task.branch.name
                }
            },
            user: {
                id: d.user.id,
                name: d.user.name,
                email: d.user.email
            }
        }));

        return <ProjectView project={projectWithStats} currentUser={currentUser} deliverables={serializedDeliverables} />;
    } catch (error) {
        console.error("Error fetching project:", error);
        return <div>Hata oluştu.</div>;
    }
}

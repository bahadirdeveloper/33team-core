
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const ownerships = await prisma.branchOwnership.findMany({
            where: {
                userId: user.id,
                status: "ACTIVE",
            },
            include: {
                branch: {
                    include: {
                        project: true,
                    },
                },
            },
        });

        const formatted = ownerships.map((o) => ({
            ownership: {
                id: o.id,
                role: o.role,
                status: o.status,
                note: o.note,
                createdAt: o.createdAt,
            },
            branch: {
                id: o.branch.id,
                name: o.branch.name,
                description: "", // ProjectBranch doesn't have description in schema, only Name/ProjectId. Wait check schema.
                projectId: o.branch.projectId,
            },
            project: {
                id: o.branch.project.id,
                name: o.branch.project.name,
            },
        }));

        return NextResponse.json(formatted);
    } catch (error) {
        console.error("My-areas error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

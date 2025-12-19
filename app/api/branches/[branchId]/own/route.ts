
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ branchId: string }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { branchId: branchIdStr } = await params;
        if (!branchIdStr) {
            return NextResponse.json({ error: "Branch ID required" }, { status: 400 });
        }

        const branchId = parseInt(branchIdStr);
        if (isNaN(branchId)) {
            return NextResponse.json({ error: "Invalid Branch ID" }, { status: 400 });
        }

        // Check if branch exists
        const branch = await prisma.projectBranch.findUnique({
            where: { id: branchId },
        });

        if (!branch) {
            return NextResponse.json({ error: "Branch not found" }, { status: 404 });
        }

        // Check existing ownership
        const existingOwnership = await prisma.branchOwnership.findUnique({
            where: {
                userId_branchId: {
                    userId: user.id,
                    branchId: branchId,
                },
            },
        });

        if (existingOwnership) {
            if (existingOwnership.status === "ACTIVE") {
                return NextResponse.json(
                    { error: "Bu alan zaten sahiplendin." },
                    { status: 409 }
                );
            } else {
                // Reactivate if PAUSED
                const updated = await prisma.branchOwnership.update({
                    where: { id: existingOwnership.id },
                    data: {
                        status: "ACTIVE",
                        role: "CONTRIBUTOR", // reset or keep? Prompt says "Oluştur... role=CONTRIBUTOR". I'll reset.
                    },
                });
                return NextResponse.json(updated);
            }
        }

        // Create new
        const newOwnership = await prisma.branchOwnership.create({
            data: {
                userId: user.id,
                branchId: branchId,
                role: "CONTRIBUTOR",
                status: "ACTIVE",
            },
        });

        return NextResponse.json(newOwnership);
    } catch (error) {
        console.error("Ownership error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

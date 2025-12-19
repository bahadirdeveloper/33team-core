
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ branchId: string }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { branchId: branchIdStr } = await params;
        const branchId = parseInt(branchIdStr);

        if (isNaN(branchId)) {
            return NextResponse.json({ error: "Invalid Branch ID" }, { status: 400 });
        }

        // Check ProjectBranch
        const branch = await prisma.projectBranch.findUnique({
            where: { id: branchId },
        });

        if (!branch) {
            return NextResponse.json({ error: "Branch not found" }, { status: 404 });
        }

        // Check Ownership
        const ownership = await prisma.branchOwnership.findUnique({
            where: {
                userId_branchId: {
                    userId: user.id,
                    branchId: branchId,
                },
            },
        });

        if (!ownership || ownership.status !== "ACTIVE") { // If paused, they are effectively "not there" or "already left"
            return NextResponse.json(
                { error: "Bu alan zaten sahipsiz veya sana ait değil." },
                { status: 404 }
            );
        }

        // Soft Delete (PAUSED)
        await prisma.branchOwnership.update({
            where: { id: ownership.id },
            data: { status: "PAUSED" },
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("Leave error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

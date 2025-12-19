
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        // 1. Create 11 Users
        const usersData = Array.from({ length: 11 }).map((_, i) => ({
            name: `Team Member ${i + 1}`,
            email: `member${i + 1}@team.core`,
            password: "123",
            role: i === 0 ? "ADMIN" : "MEMBER", // First one is admin
            lastSeenAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60) // Random last seen in last hour
        }));

        // Upsert users
        for (const u of usersData) {
            await prisma.user.upsert({
                where: { email: u.email },
                update: {},
                create: u
            });
        }

        // 2. Ensure a default Project exists
        const project = await prisma.project.upsert({
            where: { id: 1 }, // Assuming ID 1
            update: {},
            create: {
                name: "Alpha Project",
                description: "Takım yönetim sisteminin ana projesi.",
                branches: {
                    create: [
                        { name: "Üretim" },
                        { name: "Düşünme & Planlama" },
                        { name: "Otomasyon & AI" },
                        { name: "İletişim & Yayılım" }
                    ]
                }
            },
            include: { branches: true }
        });

        // 3. Create some tasks (if none exist)
        const taskCount = await prisma.task.count();
        if (taskCount < 20) {
            const branches = project.branches;
            const tasksPayload = Array.from({ length: 20 }).map((_, i) => {
                const branch = branches[i % branches.length];
                return {
                    title: `Görev #${i + 1}: ${branch.name} geliştirmesi`,
                    description: "Otomatik oluşturulan örnek görev.",
                    branchId: branch.id,
                    points: 1,
                    status: i < 5 ? "TAKEN" : "AVAILABLE",
                    assignedToId: i < 5 ? (i + 1) : null // Assign first 5 to first 5 users
                };
            });

            await prisma.task.createMany({
                data: tasksPayload
            });
        }

        return NextResponse.json({ success: true, message: "Seeded 11 users and tasks." });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Seed failed" }, { status: 500 });
    }
}

import { prisma } from "@/lib/prisma";
import HubView from "./HubView";

export const dynamic = "force-dynamic";

export default async function HubPage() {
    try {
        const projects = await prisma.project.findMany({
            include: {
                branches: {
                    include: {
                        owners: {
                            where: { status: 'ACTIVE' }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Calculate metrics
        const projectsWithMetrics = projects.map((p: (typeof projects)[number]) => {
            const totalBranches = p.branches.length;
            const unownedBranches = p.branches.filter((b: (typeof p.branches)[number]) => b.owners.length === 0).length;

            return {
                id: p.id,
                name: p.name,
                description: p.description,
                metrics: {
                    totalBranches,
                    unownedBranches
                }
            };
        });

        return (
            <div className="max-w-6xl mx-auto">
                <div className="mb-8 border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 text-transparent bg-clip-text mb-2">
                            Proje Vitrini
                        </h1>
                        <p className="text-slate-400 text-lg">
                            Ekipteki tüm projeler ve geliştirme alanlarının durumu.
                        </p>
                    </div>
                    {/* Optional: Add search or create button here later */}
                </div>

                <HubView projects={projectsWithMetrics} />
            </div>
        );

    } catch (error) {
        console.error("Hub Page Error:", error);
        return (
            <div className="p-4 bg-red-900/20 border border-red-900/50 text-red-400 rounded">
                Projeler yüklenirken bir hata oluştu.
            </div>
        );
    }
}

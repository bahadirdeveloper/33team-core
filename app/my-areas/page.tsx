import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import MyAreasView from "./MyAreasView";

export default async function MyAreasPage() {
    const user = await getCurrentUser();

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <h1 className="text-2xl font-bold text-slate-200">Giriş Yapmalısın</h1>
                <p className="text-slate-400">Alanlarını görmek için lütfen giriş yap.</p>
                <Link
                    href="/login"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition-colors"
                >
                    Giriş Yap
                </Link>
            </div>
        );
    }

    try {
        const ownerships = await prisma.branchOwnership.findMany({
            where: {
                userId: user.id,
                status: 'ACTIVE'
            },
            include: {
                branch: {
                    include: {
                        project: true,
                        tasks: {
                            where: { status: 'AVAILABLE' },
                            select: { id: true }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Serialize to avoid "Date object" warnings in Client Components
        const serializedOwnerships = JSON.parse(JSON.stringify(ownerships));

        return (
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 border-b border-slate-800 pb-6">
                    <h1 className="text-3xl font-bold text-white mb-2">Benim Alanlarım</h1>
                    <p className="text-slate-400">
                        Sorumluluğunu üstlendiğin ve aktif olarak geliştirdiğin proje alanları.
                    </p>
                </div>

                <MyAreasView areas={serializedOwnerships} />
            </div>
        );

    } catch (error) {
        console.error("My Areas Fetch Error:", error);
        return (
            <div className="p-4 bg-red-900/20 border border-red-900/50 text-red-400 rounded">
                Veriler yüklenirken bir hata oluştu.
            </div>
        );
    }
}

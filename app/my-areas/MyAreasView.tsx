"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Building2, GitBranch, ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";

interface Area {
    id: number; // Ownership ID
    role: string;
    branch: {
        id: number;
        name: string;
        project: {
            id: number;
            name: string;
        };
        _count?: {
            tasks: number;
        };
        // If we fetched tasks array instead of count in prisma include
        tasks?: { id: number }[];
    };
}

interface MyAreasViewProps {
    areas: Area[];
}

export default function MyAreasView({ areas }: MyAreasViewProps) {
    const router = useRouter();
    const [loadingId, setLoadingId] = useState<number | null>(null);

    const handleLeave = async (branchId: number, ownershipId: number) => {
        if (!confirm("Bu alanı bırakmak istediğinize emin misiniz?")) return;

        setLoadingId(ownershipId);
        try {
            const res = await fetch(`/api/branches/${branchId}/leave`, {
                method: "DELETE",
            });

            if (res.ok) {
                router.refresh();
            } else {
                alert("Alandan ayrılırken bir hata oluştu.");
            }
        } catch (error) {
            console.error("Leave error:", error);
            alert("Bir hata oluştu.");
        } finally {
            setLoadingId(null);
        }
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case "OWNER": return "Sahip";
            case "CO_OWNER": return "Eş Sahip";
            case "CONTRIBUTOR": return "Katkıcı";
            default: return role;
        }
    };

    if (areas.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="bg-slate-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-800">
                    <GitBranch className="text-slate-500" size={32} />
                </div>
                <h3 className="text-xl font-medium text-slate-300 mb-2">Henüz bir alan sahiplenmedin</h3>
                <p className="text-slate-500 mb-6 max-w-md mx-auto">
                    Projelerden sorumluluk alarak burada takibini yapabilirsin.
                </p>
                <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors font-medium"
                >
                    Projeleri İncele <ArrowRight size={16} />
                </Link>
            </div>
        );
    }

    return (
        <div className="grid gap-4">
            {areas.map((ownership) => {
                const openTaskCount = ownership.branch.tasks?.length || 0;

                return (
                    <div
                        key={ownership.id}
                        className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 transition-all hover:border-slate-700 hover:shadow-lg hover:shadow-black/20"
                    >
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">

                            {/* Left Content */}
                            <div className="space-y-4 flex-1">
                                <div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                                        <Building2 size={14} />
                                        <Link href={`/projects/${ownership.branch.project.id}`} className="hover:text-blue-400 transition-colors">
                                            {ownership.branch.project.name}
                                        </Link>
                                    </div>
                                    <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 text-transparent bg-clip-text">
                                        {ownership.branch.name}
                                    </h3>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                        {getRoleLabel(ownership.role)}
                                    </span>

                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
                                        <BookOpen size={12} />
                                        {openTaskCount} Açık Görev
                                    </span>
                                </div>
                            </div>

                            {/* Right Actions */}
                            <div className="flex items-center pt-2">
                                <button
                                    onClick={() => handleLeave(ownership.branch.id, ownership.id)}
                                    disabled={loadingId === ownership.id}
                                    className="group flex items-center gap-2 text-slate-500 hover:text-red-400 hover:bg-red-950/30 px-4 py-2 rounded transition-all text-sm font-medium border border-transparent hover:border-red-900/50"
                                >
                                    {loadingId === ownership.id ? (
                                        "İşleniyor..."
                                    ) : (
                                        <>
                                            <Trash2 size={16} className="transition-transform group-hover:scale-110" />
                                            Alanı Bırak
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

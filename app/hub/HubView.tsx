import Link from "next/link";
import { Folder, GitBranch, AlertCircle, ArrowRight } from "lucide-react";

interface ProjectSummary {
    id: number;
    name: string;
    description: string | null;
    metrics: {
        totalBranches: number;
        unownedBranches: number;
    };
}

interface HubViewProps {
    projects: ProjectSummary[];
}

export default function HubView({ projects }: HubViewProps) {
    if (projects.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="bg-slate-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-800">
                    <Folder className="text-slate-500" size={32} />
                </div>
                <h3 className="text-xl font-medium text-slate-300 mb-2">Henüz proje oluşturulmamış.</h3>
                <p className="text-slate-500 mb-6 max-w-md mx-auto">
                    Yeni bir proje oluşturarak ekibin çalışabileceği alanlar yaratın.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
                <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="group block bg-slate-900/50 border border-slate-800 rounded-xl p-6 transition-all hover:border-slate-700 hover:bg-slate-900 hover:shadow-lg hover:shadow-black/20"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-slate-800/50 w-10 h-10 rounded-lg flex items-center justify-center border border-slate-700/50 group-hover:border-slate-600 group-hover:bg-slate-800 transition-colors">
                            <Folder size={20} className="text-blue-400" />
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 -mr-2">
                            <ArrowRight size={20} />
                        </div>
                    </div>

                    <h3 className="text-xl font-bold text-slate-200 mb-2 group-hover:text-white transition-colors">
                        {project.name}
                    </h3>

                    <p className="text-slate-500 text-sm mb-6 line-clamp-2 min-h-[2.5rem]">
                        {project.description || "Bu proje için açıklama eklenmemiş."}
                    </p>

                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
                            <GitBranch size={12} />
                            {project.metrics.totalBranches} Alan
                        </span>

                        {project.metrics.unownedBranches > 0 ? (
                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                <AlertCircle size={12} />
                                {project.metrics.unownedBranches} Sahipsiz
                            </span>
                        ) : (
                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                <AlertCircle size={12} />
                                Hepsi Sahipli
                            </span>
                        )}
                    </div>
                </Link>
            ))}
        </div>
    );
}

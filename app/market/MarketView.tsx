"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export interface Task {
    id: number;
    title: string;
    description: string;
    points: number;
    branch: {
        id: number;
        name: string;
        project: {
            name: string;
        }
    };
    branchId: number;
    dependencies: any[];
    outputType?: string;
}

export interface Project {
    id: number;
    name: string;
    branches: {
        id: number;
        name: string;
    }[];
}

interface MarketViewProps {
    tasks: Task[];
    projects: Project[];
    projectId?: string;
    branchId?: string;
    onFilterChange: (pId: string | null, bId: string | null) => void;
    onTakeTask: (taskId: number) => void;
}

export default function MarketView({
    tasks,
    projects,
    projectId,
    branchId,
    onFilterChange,
    onTakeTask
}: MarketViewProps) {

    // Derived state for branches dropdown
    const selectedProject = projects.find(p => p.id.toString() === projectId);
    const branches = selectedProject?.branches || [];

    const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        onFilterChange(val === "" ? null : val, null);
    };

    const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        onFilterChange(projectId || null, val === "" ? null : val);
    };

    const handleClear = () => {
        onFilterChange(null, null);
    };

    return (
        <div>
            {/* Filter Bar */}
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 mb-8 flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex gap-2 w-full sm:w-auto">
                    <select
                        className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-slate-300 w-full sm:w-48"
                        value={projectId || ""}
                        onChange={handleProjectChange}
                    >
                        <option value="">Proje Seç</option>
                        {projects.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>

                    <select
                        className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-slate-300 w-full sm:w-48"
                        value={branchId || ""}
                        onChange={handleBranchChange}
                        disabled={!projectId}
                    >
                        <option value="">Alan Seç</option>
                        {branches.map(b => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                    </select>
                </div>

                <div className="ml-auto">
                    {(projectId || branchId) && (
                        <button
                            onClick={handleClear}
                            className="text-xs text-slate-400 hover:text-white underline"
                        >
                            Temizle
                        </button>
                    )}
                </div>
            </div>

            {/* Task Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tasks.map((task) => (
                    <div key={task.id} className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-blue-500/50 transition-colors relative group">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-mono text-slate-500">
                                    {task.branch.project.name}
                                </span>
                                <span className="text-xs font-mono text-blue-400 bg-blue-900/30 px-2 py-1 rounded w-fit">
                                    {task.branch.name}
                                </span>
                            </div>
                            <span className="text-emerald-400 font-bold">+{task.points} Puan</span>
                        </div>

                        <h3 className="text-xl font-semibold mb-2">{task.title}</h3>
                        <p className="text-slate-400 text-sm mb-4 line-clamp-3">{task.description}</p>

                        <div className="flex gap-2 mb-4">
                            {task.outputType && (
                                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-600 border border-slate-800 px-1.5 py-0.5 rounded">
                                    {task.outputType}
                                </span>
                            )}
                        </div>

                        {task.dependencies.length > 0 && (
                            <div className="mb-4 text-xs text-amber-500">
                                ⚠️ Bu görevin {task.dependencies.length} adet ön koşulu var.
                            </div>
                        )}

                        <button
                            onClick={() => onTakeTask(task.id)}
                            className="w-full bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg transition-colors border border-slate-700"
                        >
                            Görevi Üstlen
                        </button>
                    </div>
                ))}

                {tasks.length === 0 && (
                    <div className="col-span-full text-center py-12 text-slate-500">
                        Bu filtreye uygun açık görev yok.
                    </div>
                )}
            </div>
        </div>
    );
}

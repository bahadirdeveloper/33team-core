"use client";

import { useState } from "react";
import { ExternalLink, Github, Server, FileText } from "lucide-react";

export interface Deliverable {
    id: number;
    outputType: string; // URL, REPO, SERVICE
    outputUrl: string;
    note: string | null;
    createdAt: string; // ISO String
    task: {
        title: string;
        branch: {
            id: number;
            name: string;
        };
    };
    user: {
        id: number;
        name: string;
        email: string;
    };
}

interface DeliverablesWallProps {
    deliverables: Deliverable[];
}

export default function DeliverablesWall({ deliverables }: DeliverablesWallProps) {
    const [typeFilter, setTypeFilter] = useState<string>("ALL");

    // Extract unique branches for filter (if needed efficiently)
    // For MVP, user asked for Type Filter mainly. Branch filter optional.

    const filtered = deliverables.filter(d => {
        if (typeFilter !== "ALL" && d.outputType !== typeFilter) return false;
        return true;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex gap-2">
                    <FilterButton active={typeFilter === "ALL"} onClick={() => setTypeFilter("ALL")} label="Tümü" />
                    <FilterButton active={typeFilter === "URL"} onClick={() => setTypeFilter("URL")} label="URL" />
                    <FilterButton active={typeFilter === "REPO"} onClick={() => setTypeFilter("REPO")} label="Repo" />
                    <FilterButton active={typeFilter === "SERVICE"} onClick={() => setTypeFilter("SERVICE")} label="Servis" />
                </div>
            </div>

            <div className="grid gap-4">
                {filtered.map(item => (
                    <DeliverableCard key={item.id} item={item} />
                ))}

                {filtered.length === 0 && (
                    <div className="py-12 text-center text-slate-500 border border-slate-800 rounded-lg border-dashed">
                        {deliverables.length === 0 ? "Bu projede henüz teslim edilmiş çıktı yok." : "Filtreye uygun çıktı bulunamadı."}
                    </div>
                )}
            </div>
        </div>
    );
}

function DeliverableCard({ item }: { item: Deliverable }) {
    const timeAgo = new Date(item.createdAt).toLocaleDateString("tr-TR", {
        day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
    });

    return (
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl hover:border-slate-700 transition-colors">
            <div className="flex justify-between items-start mb-2">
                <div className="flex gap-2 items-center">
                    <OutputTypeBadge type={item.outputType} />
                    <span className="text-xs text-slate-500 font-mono">
                        {item.task.branch.name}
                    </span>
                </div>
                <span className="text-xs text-slate-500">{timeAgo}</span>
            </div>

            <h4 className="font-semibold text-lg text-slate-200 mb-1">
                {item.task.title}
            </h4>

            <div className="flex items-center gap-2 mb-4 text-xs text-slate-400">
                <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-300">
                    {item.user.name.charAt(0).toUpperCase()}
                </div>
                <span>{item.user.name} tarafından teslim edildi</span>
            </div>

            <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800/50">
                <div className="flex items-center gap-2 mb-2">
                    <a
                        href={item.outputUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1 break-all"
                    >
                        <ExternalLink size={14} />
                        {item.outputUrl}
                    </a>
                </div>
                {item.note && (
                    <p className="text-sm text-slate-400 italic border-t border-slate-800 pt-2 mt-2">
                        “{item.note}”
                    </p>
                )}
            </div>
        </div>
    );
}

function OutputTypeBadge({ type }: { type: string }) {
    let icon = <ExternalLink size={12} />;
    let colorClass = "bg-blue-500/10 text-blue-400 border-blue-500/20";
    let label = type;

    if (type === "REPO") {
        icon = <Github size={12} />;
        colorClass = "bg-purple-500/10 text-purple-400 border-purple-500/20";
    } else if (type === "SERVICE") {
        icon = <Server size={12} />;
        colorClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    }

    return (
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border flex items-center gap-1 ${colorClass}`}>
            {icon} {label}
        </span>
    );
}

function FilterButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
    return (
        <button
            onClick={onClick}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${active
                    ? "bg-slate-100 text-slate-900 border-slate-100"
                    : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-600"
                }`}
        >
            {label}
        </button>
    );
}

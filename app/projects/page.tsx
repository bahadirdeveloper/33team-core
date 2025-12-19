
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Project {
    id: number;
    name: string;
    description: string;
    repoUrl: string;
    stats?: {
        total: number;
        completed: number;
        progress: number;
    };
}

import { Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ProjectsPage() {
    const { user } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProjects = () => {
        fetch("/api/projects")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setProjects(data);
                } else {
                    console.error("API returned non-array:", data);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Fetch error:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleDelete = async (projectId: number) => {
        if (!confirm("Bu projeyi ve altındaki tüm görevleri silmek istediğinize emin misiniz?")) return;

        try {
            const res = await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
            if (res.ok) {
                // Remove locally to avoid re-fetch lag
                setProjects(prev => prev.filter(p => p.id !== projectId));
            } else {
                alert("Silme işlemi başarısız.");
            }
        } catch (error) {
            console.error(error);
            alert("Bir hata oluştu.");
        }
    };

    if (loading) return <div className="text-center py-10">Yükleniyor...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text">
                    Aktif Projeler
                </h1>
                <Link
                    href="/admin"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                    + Yeni Proje
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        className="group relative bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors shadow-lg"
                    >
                        {user?.role === "ADMIN" && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleDelete(project.id);
                                }}
                                className="absolute top-4 right-4 text-slate-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all z-10 p-1"
                                title="Projeyi Sil"
                            >
                                <Trash2 size={18} />
                            </button>
                        )}

                        <div className="flex justify-between items-start mb-4 pr-6">
                            <h2 className="text-xl font-semibold text-white">{project.name}</h2>
                            {project.stats && (
                                <span className={`px-2 py-1 text-xs rounded-full ${project.stats.progress === 100 ? 'bg-green-900 text-green-300' : 'bg-slate-800 text-slate-400'
                                    }`}>
                                    %{project.stats.progress}
                                </span>
                            )}
                        </div>

                        <p className="text-slate-400 text-sm mb-6 line-clamp-2">
                            {project.description || "Açıklama yok."}
                        </p>

                        {project.stats && (
                            <div className="mb-6">
                                <div className="flex justify-between text-xs text-slate-500 mb-2">
                                    <span>İlerleme</span>
                                    <span>{project.stats.completed} / {project.stats.total} Görev</span>
                                </div>
                                <div className="w-full bg-slate-800 rounded-full h-2">
                                    <div
                                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${project.stats.progress}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <Link
                                href={`/projects/${project.id}`}
                                className="flex-1 text-center bg-slate-800 hover:bg-slate-700 text-white text-sm py-2 rounded transition-colors"
                            >
                                Detaylar
                            </Link>
                        </div>
                    </div>
                ))}

                {projects.length === 0 && (
                    <div className="col-span-full text-center py-12 text-slate-500 border border-dashed border-slate-800 rounded-xl">
                        Henüz hiç proje yok.
                    </div>
                )}
            </div>
        </div>
    );
}

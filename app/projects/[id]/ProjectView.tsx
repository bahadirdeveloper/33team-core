"use client";

import { useState } from "react";
import { Trash2, Edit2, X, Check, Users, UserPlus, UserMinus, Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

import DeliverablesWall, { Deliverable } from "./DeliverablesWall";

// Types
interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface BranchOwner {
    id: number;
    userId: number;
    branchId: number;
    user: User;
    status: string;
}

interface ProjectBranch {
    id: number;
    name: string;
    projectId: number;
    owners: BranchOwner[];
}

interface ProjectStats {
    total: number;
    completed: number;
    progress: number;
}

interface Project {
    id: number;
    name: string;
    description: string | null;
    repoUrl: string | null;
    deploymentUrl: string | null;
    branches: ProjectBranch[];
    stats: ProjectStats;
}

interface ProjectViewProps {
    project: Project;
    currentUser: User | null;
    deliverables: Deliverable[];
}

export default function ProjectView({ project, currentUser, deliverables }: ProjectViewProps) {
    return (
        <div>
            {/* Header Section */}
            <div className="mb-8 border-b border-slate-800 pb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text mb-2">
                    {project.name}
                </h1>
                <p className="text-slate-400 text-lg">{project.description}</p>

                <div className="flex gap-4 mt-6">
                    {project.repoUrl && (
                        <a href={project.repoUrl} target="_blank" className="bg-slate-800 border border-slate-700 px-4 py-2 rounded text-sm hover:text-white hover:border-slate-500 transition-colors">
                            GitHub Repo
                        </a>
                    )}
                    {project.deploymentUrl && (
                        <a href={project.deploymentUrl} target="_blank" className="bg-slate-800 border border-slate-700 px-4 py-2 rounded text-sm hover:text-white hover:border-slate-500 transition-colors">
                            Live Deployment
                        </a>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Branches & Tasks Section */}
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Proje Dalları ve İlerleme</h2>
                        <div className="space-y-6">
                            {project.branches && project.branches.map((branch) => (
                                <div key={branch.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                                    <h3 className="text-xl font-semibold mb-4 text-blue-300">{branch.name} Branch</h3>
                                    <ProjectTasks branchId={branch.id} projectId={project.id} currentUserRole={currentUser?.role} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* NEW: Alanlar (Branches) Section */}
                    <div className="border-t border-slate-800 pt-8">
                        <h2 className="text-2xl font-bold mb-6">Alanlar (Branches)</h2>
                        <div className="grid gap-4">
                            {project.branches && project.branches.length > 0 ? (
                                project.branches.map((branch) => (
                                    <BranchOwnershipCard
                                        key={branch.id}
                                        branch={branch}
                                        currentUser={currentUser}
                                    />
                                ))
                            ) : (
                                <div className="text-slate-500 italic">Bu proje için henüz alan tanımlanmamış.</div>
                            )}
                        </div>
                    </div>

                    {/* NEW: Deliverables Wall */}
                    <div className="border-t border-slate-800 pt-8">
                        <h2 className="text-2xl font-bold mb-6">Çıktılar Duvarı</h2>
                        <DeliverablesWall deliverables={deliverables} />
                    </div>
                </div>

                <div>
                    {/* Stats Section */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sticky top-4">
                        <h3 className="text-xl font-bold mb-4">Proje Haritası</h3>
                        <p className="text-sm text-slate-500 mb-4">
                            Bu proje toplam <strong>{project.stats?.total || 0}</strong> görevden oluşuyor.
                        </p>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                <span>Planlanan</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                <span>Yapılan</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span>Tamamlanan</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Sub-Components ---

function BranchOwnershipCard({ branch, currentUser }: { branch: ProjectBranch, currentUser: User | null }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Determine status
    const activeOwner = branch.owners.find(o => o.status === 'ACTIVE');
    const isOwnedByMe = activeOwner?.userId === currentUser?.id;
    const isOwnedByOthers = activeOwner && !isOwnedByMe;

    // Actions
    const handleOwn = async () => {
        if (!currentUser) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/branches/${branch.id}/own`, { method: "POST" });
            if (res.ok) {
                router.refresh(); // Refresh server component data
            } else {
                alert("Sahiplenme başarısız.");
            }
        } catch (error) {
            console.error(error);
            alert("Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    const handleLeave = async () => {
        if (!currentUser) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/branches/${branch.id}/leave`, { method: "DELETE" });
            if (res.ok) {
                router.refresh();
            } else {
                alert("Bırakma başarısız.");
            }
        } catch (error) {
            console.error(error);
            alert("Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-lg text-slate-200">{branch.name}</span>
                    <Badge status={isOwnedByMe ? 'mine' : isOwnedByOthers ? 'taken' : 'free'} ownerName={activeOwner?.user.name} />
                </div>
                <p className="text-sm text-slate-500">
                    {branch.name} geliştirmeleri ve sorumluluğu.
                </p>
            </div>

            <div className="flex items-center gap-3">
                {!currentUser ? (
                    <span className="text-xs text-slate-600 border border-slate-800 px-3 py-1 rounded-full">
                        Giriş yapmalısın
                    </span>
                ) : (
                    <>
                        {/* Action Buttons */}
                        {!activeOwner && (
                            <button
                                onClick={handleOwn}
                                disabled={loading}
                                className="flex items-center gap-2 bg-emerald-600/10 text-emerald-500 border border-emerald-600/20 hover:bg-emerald-600/20 px-4 py-2 rounded-md transition-colors text-sm font-medium disabled:opacity-50"
                            >
                                {loading ? '...' : <><UserPlus size={16} /> Sahiplen</>}
                            </button>
                        )}

                        {isOwnedByMe && (
                            <button
                                onClick={handleLeave}
                                disabled={loading}
                                className="flex items-center gap-2 bg-red-600/10 text-red-500 border border-red-600/20 hover:bg-red-600/20 px-4 py-2 rounded-md transition-colors text-sm font-medium disabled:opacity-50"
                            >
                                {loading ? '...' : <><UserMinus size={16} /> Bırak</>}
                            </button>
                        )}

                        {isOwnedByOthers && (
                            <div className="flex items-center gap-2 text-slate-500 px-4 py-2 text-sm bg-slate-900 rounded-md border border-slate-800 select-none opacity-70">
                                <Shield size={16} />
                                Sahipli
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

function Badge({ status, ownerName }: { status: 'mine' | 'taken' | 'free', ownerName?: string }) {
    if (status === 'mine') {
        return (
            <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                Sen Sahiplendin
            </span>
        );
    }
    if (status === 'taken') {
        return (
            <span className="bg-amber-500/10 text-amber-400 text-xs px-2 py-0.5 rounded border border-amber-500/20 flex items-center gap-1">
                {ownerName || 'Sahipli'}
            </span>
        );
    }
    return (
        <span className="bg-slate-700/50 text-slate-400 text-xs px-2 py-0.5 rounded border border-slate-700/50">
            Sahipsiz
        </span>
    );
}

// Reuse existing ProjectTasks logic but receiving props needed
function ProjectTasks({ branchId, projectId, currentUserRole }: { branchId: number, projectId: number, currentUserRole?: string }) {
    const [tasks, setTasks] = useState<any[]>([]);
    const [editingTask, setEditingTask] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const refreshTasks = () => {
        fetch(`/api/tasks?projectId=${projectId}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setTasks(data.filter((t: any) => t.branchId === branchId));
                }
                setLoading(false);
            })
            .catch(console.error);
    };

    useState(() => {
        refreshTasks();
    });

    const handleDelete = async (taskId: number) => {
        if (!confirm("Bu görevi silmek istediğinize emin misiniz?")) return;
        try {
            await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
            refreshTasks();
        } catch (e) {
            console.error(e);
            alert("Silme başarısız");
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetch(`/api/tasks/${editingTask.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: editingTask.title,
                    status: editingTask.status
                })
            });
            setEditingTask(null);
            refreshTasks();
        } catch (e) {
            console.error(e);
            alert("Güncelleme başarısız");
        }
    };

    if (loading) return <div className="text-sm text-slate-600">Yükleniyor...</div>;

    return (
        <div className="space-y-3 relative">
            {tasks.map(task => (
                <div key={task.id} className="group flex items-center justify-between bg-slate-950 p-3 rounded border border-slate-800 hover:border-slate-700 transition-colors">
                    <div className="flex items-center gap-3">
                        <StatusIcon status={task.status} />
                        <span className={task.status === "COMPLETED" ? "line-through text-slate-500" : ""}>
                            {task.title}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        {task.assignedTo && (
                            <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">
                                {task.assignedTo.name}
                            </span>
                        )}

                        {/* Admin Controls */}
                        {currentUserRole === "ADMIN" && (
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => setEditingTask(task)} className="p-1 hover:text-blue-400 text-slate-500">
                                    <Edit2 size={14} />
                                </button>
                                <button onClick={() => handleDelete(task.id)} className="p-1 hover:text-red-400 text-slate-500">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {tasks.length === 0 && <span className="text-sm text-slate-500 italic">Görev yok.</span>}

            {/* Edit Modal */}
            {editingTask && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Görevi Düzenle</h3>
                            <button onClick={() => setEditingTask(null)}><X size={20} /></button>
                        </div>

                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm mb-1 text-slate-400">Başlık</label>
                                <input
                                    className="w-full bg-slate-950 border border-slate-800 rounded p-2"
                                    value={editingTask.title}
                                    onChange={e => setEditingTask({ ...editingTask, title: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm mb-1 text-slate-400">Durum</label>
                                    <select
                                        className="w-full bg-slate-950 border border-slate-800 rounded p-2"
                                        value={editingTask.status}
                                        onChange={e => setEditingTask({ ...editingTask, status: e.target.value })}
                                    >
                                        <option value="AVAILABLE">Available</option>
                                        <option value="TAKEN">Taken</option>
                                        <option value="COMPLETED">Completed</option>
                                        <option value="EXPIRED">Expired</option>
                                    </select>
                                </div>
                            </div>

                            <button className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-bold text-white flex justify-center items-center gap-2">
                                <Check size={18} /> Kaydet
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatusIcon({ status }: { status: string }) {
    if (status === "COMPLETED") return <span className="text-green-500">✓</span>;
    if (status === "TAKEN") return <span className="text-orange-500">⚡</span>;
    if (status === "EXPIRED") return <span className="text-red-500">✕</span>;
    return <span className="text-slate-500">○</span>;
}

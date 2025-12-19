
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AdminPage() {
    const { user } = useAuth();

    // Create Project State
    const [projName, setProjName] = useState("");
    const [projDesc, setProjDesc] = useState("");

    // Create Task State
    const [projects, setProjects] = useState<any[]>([]);
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [taskTitle, setTaskTitle] = useState("");
    const [taskBranchId, setTaskBranchId] = useState("");
    const [taskPoints, setTaskPoints] = useState(10);

    useEffect(() => {
        fetch("/api/projects")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setProjects(data);
                else console.error("Admin projects error", data);
            })
            .catch(console.error);
    }, []);

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        const branches = ["Üretim", "Düşünme & Planlama", "Otomasyon & AI", "İletişim & Yayılım"]; // Default branches

        await fetch("/api/projects", {
            method: "POST",
            body: JSON.stringify({ name: projName, description: projDesc, branches })
        });
        alert("Proje oluşturuldu");
        setProjName("");
        setProjDesc("");
        // refresh
        fetch("/api/projects")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setProjects(data);
            });
    };

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!taskBranchId) return alert("Branch seçin");

        await fetch("/api/tasks", {
            method: "POST",
            body: JSON.stringify({
                title: taskTitle,
                branchId: taskBranchId,
                // points: default handled by DB/API as 1
                description: "Admin tarafından eklendi."
            })
        });
        alert("Görev oluşturuldu");
        setTaskTitle("");
    };

    if (!user || user.role !== "ADMIN" && user.email !== "admin@team.core") {
        // simple check for demo
        return <div className="p-8">Yetkiniz yok. (Giriş yaparken 'admin@team.core' kullanın)</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
                <h2 className="text-2xl font-bold mb-6">Yeni Proje Oluştur</h2>
                <form onSubmit={handleCreateProject} className="space-y-4 bg-slate-900 p-6 rounded-xl border border-slate-800">
                    <div>
                        <label className="block mb-1">Proje Adı</label>
                        <input className="w-full bg-slate-950 border border-slate-700 rounded p-2" value={projName} onChange={e => setProjName(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block mb-1">Açıklama</label>
                        <textarea className="w-full bg-slate-950 border border-slate-700 rounded p-2" value={projDesc} onChange={e => setProjDesc(e.target.value)} />
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-bold w-full">Oluştur</button>
                </form>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-6">Görev Ekle</h2>
                <form onSubmit={handleCreateTask} className="space-y-4 bg-slate-900 p-6 rounded-xl border border-slate-800">
                    <div>
                        <label className="block mb-1">Proje Seç</label>
                        <select onChange={e => {
                            const p = projects.find(x => x.id === Number(e.target.value));
                            setSelectedProject(p);
                            setTaskBranchId("");
                        }} className="w-full bg-slate-950 border border-slate-700 rounded p-2">
                            <option value="">Seçiniz</option>
                            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>

                    {selectedProject && (
                        <div>
                            <label className="block mb-1">Branch (Dal)</label>
                            <select
                                value={taskBranchId}
                                onChange={e => setTaskBranchId(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded p-2"
                            >
                                <option value="">Seçiniz</option>
                                {selectedProject.branches && selectedProject.branches.map((b: any) => (
                                    <option key={b.id} value={b.id}>{b.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="block mb-1">Görev Başlığı</label>
                        <input className="w-full bg-slate-950 border border-slate-700 rounded p-2" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} required />
                    </div>

                    {/* Hidden Points (Default 1) */}

                    <button className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded text-white font-bold w-full">
                        Görevi Ekle
                    </button>
                </form>
            </div>

            <div className="md:col-span-2 border-t border-slate-800 pt-8 mt-8">
                <h2 className="text-2xl font-bold mb-6">Ekip Yönetimi</h2>
                <InviteUserForm />
            </div>
        </div>
    );
}

function InviteUserForm() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/invite", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });
            const data = await res.json();

            if (res.ok) {
                alert(`Davet başarılı! Kullanıcı oluşturuldu.\nEmail: ${email}\nŞifre: 123`);
                setEmail("");
            } else {
                alert("Hata: " + data.error);
            }
        } catch (err) {
            console.error(err);
            alert("Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleInvite} className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex gap-4 items-end">
            <div className="flex-1">
                <label className="block mb-1 text-slate-400">Yeni Üye E-mail</label>
                <input
                    type="email"
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="ornek@team.core"
                    required
                />
            </div>
            <button
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded text-white font-bold transition-colors disabled:opacity-50"
            >
                {loading ? "Ekleniyor..." : "Ekibe Ekle"}
            </button>
        </form>
    );
}

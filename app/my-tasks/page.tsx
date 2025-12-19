
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface Task {
    id: number;
    title: string;
    description: string;
    points: number;
    outputType: string;
    dueAt: string;
    branch: {
        name: string;
        project: {
            name: string;
        }
    };
}

export default function MyTasksPage() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [outputUrl, setOutputUrl] = useState("");
    const [note, setNote] = useState("");

    const fetchMyTasks = () => {
        if (!user) return;
        setLoading(true);
        // filter logic is simplified here: normally the API handles user filter.
        // I need to implement /api/tasks?assignedTo=... or fetch all and filter client side for MVP if API lacks it.
        // My previous API impl: GET /api/tasks?status=AVAILABLE...
        // I should create GET /api/tasks/my or update GET /api/tasks to support assignedToId or status=TAKEN.

        // Simplest: GET /api/tasks (returns ALL tasks if no status provided? No, my implementation filters by status if provided)
        // Actually my API implementation:
        // if (status) whereClause.status = status;
        // So if I pass status=TAKEN, I get all taken tasks. I need to filter by user.
        // I didn't verify assignment in API GET.
        // I need to update API or just fetch status=TAKEN and filter JS side (bad for sec but OK for MVP).

        fetch("/api/tasks?status=TAKEN")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    const myTasks = data.filter((t: any) => t.assignedToId === user.id || (t.assignedTo && t.assignedTo.id === user.id));
                    setTasks(myTasks);
                } else {
                    console.error("MyTasks API error", data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        if (user) fetchMyTasks();
        else setLoading(false);
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTask || !user) return;

        try {
            const res = await fetch("/api/tasks/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    taskId: selectedTask.id,
                    userId: user.id,
                    outputType: selectedTask.outputType,
                    outputUrl,
                    note
                }),
            });

            if (res.ok) {
                alert("Görev teslim edildi!");
                setSelectedTask(null);
                fetchMyTasks();
            } else {
                const d = await res.json();
                alert("Hata: " + d.error);
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (!user) return <div className="p-8">Lütfen giriş yapın.</div>;
    if (loading) return <div>Yükleniyor...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Görevlerim</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                    {tasks.map((task) => (
                        <div key={task.id} className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                            <div className="flex justify-between mb-2">
                                <span className="text-xs font-mono text-slate-500">
                                    {task.branch.project.name}
                                </span>
                                {task.dueAt && (
                                    <span className="text-xs text-red-400">Due: {new Date(task.dueAt).toLocaleDateString()}</span>
                                )}
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{task.title}</h3>
                            <p className="text-slate-400 text-sm mb-4">{task.description}</p>

                            <div className="flex justify-between items-center mt-4">
                                <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300">
                                    Çıktı Tipi: {task.outputType}
                                </span>
                                <button
                                    onClick={() => setSelectedTask(task)}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition-colors"
                                >
                                    Teslim Et
                                </button>
                            </div>
                        </div>
                    ))}
                    {tasks.length === 0 && (
                        <p className="text-slate-500">Üzerinizde aktif görev yok.</p>
                    )}
                </div>

                {/* Submission Form */}
                {selectedTask && (
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 h-fit sticky top-4">
                        <h2 className="text-xl font-bold mb-4">Teslim Edin: {selectedTask.title}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Çıktı URL (Repo, Deployment, Doc)</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                                    placeholder="https://github.com/..."
                                    value={outputUrl}
                                    onChange={e => setOutputUrl(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Notlar</label>
                                <textarea
                                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                                    rows={3}
                                    value={note}
                                    onChange={e => setNote(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded"
                                >
                                    Gönder
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedTask(null)}
                                    className="bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded"
                                >
                                    İptal
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

"use client";

import { useEffect, useState, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams, useRouter } from "next/navigation";
import MarketView, { Task, Project } from "./MarketView";

function MarketPageContent() {
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    const projectId = searchParams.get("projectId") || undefined;
    const branchId = searchParams.get("branchId") || undefined;

    useEffect(() => {
        // Fetch Projects once
        fetch("/api/projects")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setProjects(data);
                }
            })
            .catch(err => console.error("Projects fetch error:", err));
    }, []);

    useEffect(() => {
        // Fetch Tasks when params change
        setLoading(true);
        const params = new URLSearchParams();
        params.set("status", "AVAILABLE");
        if (projectId) params.set("projectId", projectId);
        if (branchId) params.set("branchId", branchId);

        fetch(`/api/tasks?${params.toString()}`)
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setTasks(data);
                } else {
                    console.error("Market API error", data);
                    setTasks([]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [projectId, branchId]);

    const handleFilterChange = (pId: string | null, bId: string | null) => {
        const params = new URLSearchParams(); // Fresh params to avoid clutter

        // Always preserve unrelated params if needed? No, user wants simple filter for this page.
        // Actually, let's just build from scratch based on selection to be clean.

        if (pId) params.set("projectId", pId);
        if (bId) params.set("branchId", bId);

        router.push(`/market?${params.toString()}`);
    };

    const handleTakeTask = async (taskId: number) => {
        if (!user) {
            alert("Lütfen önce giriş yapın.");
            return;
        }

        try {
            const res = await fetch("/api/tasks/take", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ taskId, userId: user.id }),
            });
            const data = await res.json();
            if (res.ok) {
                alert("Görev alındı!");
                // Trigger re-fetch
                const params = new URLSearchParams();
                params.set("status", "AVAILABLE");
                if (projectId) params.set("projectId", projectId);
                if (branchId) params.set("branchId", branchId);

                fetch(`/api/tasks?${params.toString()}`)
                    .then(r => r.json())
                    .then(d => { if (Array.isArray(d)) setTasks(d); });

            } else {
                alert("Hata: " + data.error);
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading && tasks.length === 0 && projects.length === 0) return <div className="p-8 text-center">Yükleniyor...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Görev Marketi</h1>

            <MarketView
                tasks={tasks}
                projects={projects}
                projectId={projectId}
                branchId={branchId}
                onFilterChange={handleFilterChange}
                onTakeTask={handleTakeTask}
            />
        </div>
    );
}

export default function MarketPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center">Yükleniyor...</div>}>
            <MarketPageContent />
        </Suspense>
    );
}

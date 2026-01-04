"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trash2, FolderOpen, Plus, ArrowRight, GitBranch, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ProjectCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/ui/PageTransition";
import { toast } from "sonner";

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
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        toast.error("Projeler yüklenirken hata oluştu");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (projectId: number) => {
    if (!confirm("Bu projeyi ve altındaki tüm görevleri silmek istediğinize emin misiniz?"))
      return;

    toast.promise(
      fetch(`/api/projects/${projectId}`, { method: "DELETE" }).then((res) => {
        if (res.ok) {
          setProjects((prev) => prev.filter((p) => p.id !== projectId));
        } else {
          throw new Error("Silme başarısız");
        }
      }),
      {
        loading: "Proje siliniyor...",
        success: "Proje başarıyla silindi!",
        error: "Silme işlemi başarısız",
      }
    );
  };

  return (
    <PageTransition>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 text-transparent bg-clip-text"
          >
            Aktif Projeler
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 mt-1"
          >
            {projects.length} proje bulunuyor
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Link href="/admin">
            <Button icon={<Plus size={18} />}>Yeni Proje</Button>
          </Link>
        </motion.div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          type="project"
          action={
            <Link href="/admin">
              <Button icon={<Plus size={18} />}>İlk Projeyi Oluştur</Button>
            </Link>
          }
        />
      ) : (
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <StaggerItem key={project.id}>
              <motion.div
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group relative bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/10"
              >
                {/* Gradient top border */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Delete button */}
                {user?.role === "ADMIN" && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(project.id);
                    }}
                    className="absolute top-4 right-4 p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all z-10"
                    title="Projeyi Sil"
                  >
                    <Trash2 size={16} />
                  </motion.button>
                )}

                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20">
                      <FolderOpen className="h-6 w-6 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                        {project.name}
                      </h2>
                      {project.stats && (
                        <div className="flex items-center gap-2 mt-1">
                          <GitBranch size={12} className="text-slate-500" />
                          <span className="text-xs text-slate-500">
                            {project.stats.total} görev
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-slate-400 text-sm mb-5 line-clamp-2 min-h-[40px]">
                    {project.description || "Açıklama yok."}
                  </p>

                  {/* Progress */}
                  {project.stats && (
                    <div className="mb-5">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-slate-500">İlerleme</span>
                        <div className="flex items-center gap-2">
                          <CheckCircle2
                            size={12}
                            className={cn(
                              project.stats.progress === 100
                                ? "text-emerald-400"
                                : "text-slate-500"
                            )}
                          />
                          <span
                            className={cn(
                              "font-medium",
                              project.stats.progress === 100
                                ? "text-emerald-400"
                                : "text-slate-400"
                            )}
                          >
                            {project.stats.completed} / {project.stats.total}
                          </span>
                        </div>
                      </div>
                      <ProgressBar
                        value={project.stats.progress}
                        color={project.stats.progress === 100 ? "emerald" : "blue"}
                      />
                    </div>
                  )}

                  {/* Action */}
                  <Link href={`/projects/${project.id}`}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2 bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white py-2.5 rounded-xl text-sm font-medium transition-all group/btn"
                    >
                      Detayları Gör
                      <ArrowRight
                        size={16}
                        className="group-hover/btn:translate-x-1 transition-transform"
                      />
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </PageTransition>
  );
}

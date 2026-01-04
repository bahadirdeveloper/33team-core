"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { FolderOpen, Package, CheckCircle2, Search } from "lucide-react";

type EmptyStateType = "project" | "task" | "search" | "default";

interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

const typeConfig: Record<
  EmptyStateType,
  { icon: React.ReactNode; title: string; description: string }
> = {
  project: {
    icon: <FolderOpen className="h-12 w-12" />,
    title: "Henüz proje yok",
    description: "Yeni bir proje oluşturarak başlayın.",
  },
  task: {
    icon: <CheckCircle2 className="h-12 w-12" />,
    title: "Görev bulunamadı",
    description: "Bu kriterlere uygun görev bulunmuyor.",
  },
  search: {
    icon: <Search className="h-12 w-12" />,
    title: "Sonuç bulunamadı",
    description: "Farklı anahtar kelimeler deneyin.",
  },
  default: {
    icon: <Package className="h-12 w-12" />,
    title: "İçerik yok",
    description: "Burada henüz bir şey yok.",
  },
};

export function EmptyState({
  type = "default",
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const config = typeConfig[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col items-center justify-center py-16 px-6",
        "border border-dashed border-slate-700 rounded-2xl",
        "bg-slate-900/30 backdrop-blur-sm",
        className
      )}
    >
      <div className="p-4 rounded-2xl bg-slate-800/50 text-slate-500 mb-4">
        {config.icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-300 mb-2">
        {title || config.title}
      </h3>
      <p className="text-sm text-slate-500 text-center max-w-sm mb-6">
        {description || config.description}
      </p>
      {action && <div>{action}</div>}
    </motion.div>
  );
}

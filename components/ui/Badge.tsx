"use client";

import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "purple";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  className?: string;
  pulse?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-slate-700/50 text-slate-300 border-slate-600/50",
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  danger: "bg-red-500/10 text-red-400 border-red-500/20",
  info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  purple: "bg-violet-500/10 text-violet-400 border-violet-500/20",
};

const sizeClasses = {
  sm: "px-1.5 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
};

export function Badge({
  children,
  variant = "default",
  size = "sm",
  className,
  pulse = false,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-medium",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
        </span>
      )}
      {children}
    </span>
  );
}

// Status badge (görev durumları için)
interface StatusBadgeProps {
  status: "AVAILABLE" | "TAKEN" | "COMPLETED" | "EXPIRED";
  size?: "sm" | "md";
}

const statusConfig: Record<string, { variant: BadgeVariant; label: string; pulse?: boolean }> = {
  AVAILABLE: { variant: "success", label: "Müsait", pulse: true },
  TAKEN: { variant: "info", label: "Alındı" },
  COMPLETED: { variant: "purple", label: "Tamamlandı" },
  EXPIRED: { variant: "danger", label: "Süresi Doldu" },
};

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.AVAILABLE;
  return (
    <Badge variant={config.variant} size={size} pulse={config.pulse}>
      {config.label}
    </Badge>
  );
}

// Puan badge'i
interface PointsBadgeProps {
  points: number;
  size?: "sm" | "md";
}

export function PointsBadge({ points, size = "sm" }: PointsBadgeProps) {
  return (
    <Badge variant="warning" size={size}>
      ⭐ {points} puan
    </Badge>
  );
}

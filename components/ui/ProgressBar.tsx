"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  color?: "blue" | "emerald" | "purple" | "amber";
  className?: string;
  animated?: boolean;
}

const colorClasses = {
  blue: "from-blue-500 to-indigo-500",
  emerald: "from-emerald-500 to-teal-500",
  purple: "from-violet-500 to-purple-500",
  amber: "from-amber-500 to-orange-500",
};

const sizeClasses = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

export function ProgressBar({
  value,
  max = 100,
  size = "md",
  showLabel = false,
  color = "blue",
  className,
  animated = true,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between text-xs text-slate-400 mb-1.5">
          <span>İlerleme</span>
          <span>%{Math.round(percentage)}</span>
        </div>
      )}
      <div
        className={cn(
          "w-full bg-slate-800 rounded-full overflow-hidden",
          sizeClasses[size]
        )}
      >
        <motion.div
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={cn(
            "h-full bg-gradient-to-r rounded-full",
            colorClasses[color],
            percentage === 100 && "shadow-lg shadow-emerald-500/30"
          )}
        />
      </div>
    </div>
  );
}

// Dairesel progress
interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: "blue" | "emerald" | "purple" | "amber";
  showLabel?: boolean;
}

export function CircularProgress({
  value,
  max = 100,
  size = 60,
  strokeWidth = 6,
  color = "blue",
  showLabel = true,
}: CircularProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const colorMap = {
    blue: "#3B82F6",
    emerald: "#10B981",
    purple: "#8B5CF6",
    amber: "#F59E0B",
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1E293B"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colorMap[color]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      {showLabel && (
        <span className="absolute text-sm font-semibold text-white">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
}

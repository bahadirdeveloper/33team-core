"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "success";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-900/25 hover:scale-[1.02] active:scale-[0.98]",
  secondary:
    "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:scale-[1.02] active:scale-[0.98]",
  ghost: "hover:bg-slate-800 text-slate-400 hover:text-slate-200 hover:scale-[1.02] active:scale-[0.98]",
  danger:
    "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:scale-[1.02] active:scale-[0.98]",
  success:
    "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 hover:scale-[1.02] active:scale-[0.98]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  iconPosition = "left",
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-slate-900",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        icon && iconPosition === "left" && icon
      )}
      {children}
      {!loading && icon && iconPosition === "right" && icon}
    </button>
  );
}

// Icon Button
interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  tooltip?: string;
}

export function IconButton({
  icon,
  variant = "ghost",
  size = "md",
  tooltip,
  className,
  ...props
}: IconButtonProps) {
  const sizeMap = {
    sm: "h-7 w-7",
    md: "h-9 w-9",
    lg: "h-11 w-11",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg transition-all duration-200",
        "hover:scale-105 active:scale-95",
        variantClasses[variant],
        sizeMap[size],
        className
      )}
      title={tooltip}
      {...props}
    >
      {icon}
    </button>
  );
}

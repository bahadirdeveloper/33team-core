"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  glowColor?: "blue" | "purple" | "emerald" | "amber";
}

const glowColors = {
  blue: "hover:shadow-blue-500/10",
  purple: "hover:shadow-violet-500/10",
  emerald: "hover:shadow-emerald-500/10",
  amber: "hover:shadow-amber-500/10",
};

export function Card({
  children,
  className,
  hover = true,
  glow = false,
  glowColor = "blue",
}: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { y: -2, transition: { duration: 0.2 } } : undefined}
      className={cn(
        "bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl",
        "transition-all duration-300",
        hover && "hover:border-slate-700",
        glow && `hover:shadow-xl ${glowColors[glowColor]}`,
        className
      )}
    >
      {children}
    </motion.div>
  );
}

// Kart başlık
interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export function CardHeader({ children, className, action }: CardHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-6 py-4 border-b border-slate-800",
        className
      )}
    >
      <div className="font-semibold text-white">{children}</div>
      {action && <div>{action}</div>}
    </div>
  );
}

// Kart içerik
interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={cn("p-6", className)}>{children}</div>;
}

// Kart footer
interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div
      className={cn(
        "px-6 py-4 border-t border-slate-800 bg-slate-900/30",
        className
      )}
    >
      {children}
    </div>
  );
}

// Stat Card
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("p-6", className)} glow glowColor="blue">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
          {trend && (
            <p
              className={cn(
                "text-xs mt-2 font-medium",
                trend.isPositive ? "text-emerald-400" : "text-red-400"
              )}
            >
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        {icon && (
          <div className="p-3 rounded-xl bg-slate-800/50 text-slate-400">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}

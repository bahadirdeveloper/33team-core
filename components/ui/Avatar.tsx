"use client";

import { cn, getAvatarColor, getInitials } from "@/lib/utils";

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  showStatus?: boolean;
  isOnline?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "h-7 w-7 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-11 w-11 text-base",
  xl: "h-14 w-14 text-lg",
};

const statusSizeClasses = {
  sm: "h-2 w-2",
  md: "h-2.5 w-2.5",
  lg: "h-3 w-3",
  xl: "h-3.5 w-3.5",
};

export function Avatar({
  name,
  size = "md",
  showStatus = false,
  isOnline = false,
  className,
}: AvatarProps) {
  const initials = getInitials(name);
  const colorClass = getAvatarColor(name);

  return (
    <div className="relative inline-flex">
      <div
        className={cn(
          "flex items-center justify-center rounded-full font-semibold text-white shadow-lg",
          colorClass,
          sizeClasses[size],
          className
        )}
      >
        {initials}
      </div>
      {showStatus && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-2 border-slate-900",
            statusSizeClasses[size],
            isOnline ? "bg-emerald-500" : "bg-slate-500"
          )}
        />
      )}
    </div>
  );
}

// Avatar grubu (birden fazla avatar yan yana)
interface AvatarGroupProps {
  users: { name: string; isOnline?: boolean }[];
  max?: number;
  size?: "sm" | "md" | "lg";
}

export function AvatarGroup({ users, max = 4, size = "md" }: AvatarGroupProps) {
  const visibleUsers = users.slice(0, max);
  const remainingCount = users.length - max;

  return (
    <div className="flex -space-x-2">
      {visibleUsers.map((user, i) => (
        <Avatar
          key={i}
          name={user.name}
          size={size}
          className="ring-2 ring-slate-900"
        />
      ))}
      {remainingCount > 0 && (
        <div
          className={cn(
            "flex items-center justify-center rounded-full bg-slate-700 font-medium text-slate-300 ring-2 ring-slate-900",
            sizeClasses[size]
          )}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}

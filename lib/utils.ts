import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";
import { tr } from "date-fns/locale";

// Tailwind class merger utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Avatar renk paleti
const avatarColors = [
  "bg-gradient-to-br from-pink-500 to-rose-500",
  "bg-gradient-to-br from-violet-500 to-purple-500",
  "bg-gradient-to-br from-blue-500 to-cyan-500",
  "bg-gradient-to-br from-emerald-500 to-teal-500",
  "bg-gradient-to-br from-orange-500 to-amber-500",
  "bg-gradient-to-br from-red-500 to-pink-500",
  "bg-gradient-to-br from-indigo-500 to-blue-500",
  "bg-gradient-to-br from-cyan-500 to-teal-500",
];

// Kullanıcı adından avatar rengi hesapla
export function getAvatarColor(name: string): string {
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return avatarColors[hash % avatarColors.length];
}

// Kullanıcı adından baş harfleri al
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Tarih formatlama
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  if (isToday(d)) {
    return `Bugün ${format(d, "HH:mm")}`;
  }
  if (isYesterday(d)) {
    return `Dün ${format(d, "HH:mm")}`;
  }
  return format(d, "d MMM yyyy", { locale: tr });
}

// Göreceli zaman
export function formatRelativeTime(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: tr });
}

// Kalan süre hesaplama
export function getTimeRemaining(dueDate: Date | string): {
  text: string;
  isUrgent: boolean;
  isExpired: boolean;
} {
  const now = new Date();
  const due = new Date(dueDate);
  const diff = due.getTime() - now.getTime();

  if (diff < 0) {
    return { text: "Süresi doldu", isUrgent: true, isExpired: true };
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (days > 1) {
    return { text: `${days} gün kaldı`, isUrgent: false, isExpired: false };
  }
  if (days === 1) {
    return { text: "1 gün kaldı", isUrgent: true, isExpired: false };
  }
  if (hours > 0) {
    return { text: `${hours} saat kaldı`, isUrgent: true, isExpired: false };
  }

  const minutes = Math.floor(diff / (1000 * 60));
  return { text: `${minutes} dakika kaldı`, isUrgent: true, isExpired: false };
}

// Status renkleri
export const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  AVAILABLE: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
  },
  TAKEN: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/20",
  },
  COMPLETED: {
    bg: "bg-violet-500/10",
    text: "text-violet-400",
    border: "border-violet-500/20",
  },
  EXPIRED: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    border: "border-red-500/20",
  },
};

// Status label
export const statusLabels: Record<string, string> = {
  AVAILABLE: "Müsait",
  TAKEN: "Alındı",
  COMPLETED: "Tamamlandı",
  EXPIRED: "Süresi Doldu",
};

// Puan formatı
export function formatPoints(points: number): string {
  if (points >= 1000) {
    return `${(points / 1000).toFixed(1)}k`;
  }
  return points.toString();
}

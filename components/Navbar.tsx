"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import {
  LayoutGrid,
  ShoppingBag,
  CheckSquare,
  Settings,
  LogOut,
  Bell,
  Search,
  Command,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const links = [
    { href: "/projects", label: "Projeler", icon: LayoutGrid },
    { href: "/market", label: "Görev Marketi", icon: ShoppingBag },
    { href: "/my-tasks", label: "Görevlerim", icon: CheckSquare },
    { href: "/admin", label: "Admin", icon: Settings, adminOnly: true },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="sticky top-0 z-30 bg-slate-900/70 backdrop-blur-xl border-b border-slate-800/50">
      <div className="px-6 py-3">
        <div className="flex justify-between items-center">
          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {links.map((link) => {
              if (link.adminOnly && user?.role !== "ADMIN") return null;
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              const Icon = link.icon;

              return (
                <Link key={link.href} href={link.href}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-900/10"
                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
                    )}
                  >
                    <Icon size={18} />
                    <span>{link.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500"
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Search Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-all"
            >
              <Search size={16} />
              <span className="text-sm hidden md:inline">Ara...</span>
              <kbd className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs bg-slate-700 rounded border border-slate-600">
                <Command size={10} />K
              </kbd>
            </motion.button>

            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all"
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
            </motion.button>

            {/* Divider */}
            <div className="h-8 w-px bg-slate-700/50" />

            {/* User Section */}
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-800/30">
                  <Avatar name={user.name} size="sm" showStatus isOnline />
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-slate-200">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.role}</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  title="Çıkış Yap"
                >
                  <LogOut size={18} />
                </motion.button>
              </div>
            ) : (
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-medium shadow-lg shadow-blue-900/25 transition-all"
                >
                  Giriş Yap
                </motion.button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

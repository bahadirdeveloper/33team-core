
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const links = [
        { href: "/projects", label: "Projeler" },
        { href: "/market", label: "Görev Marketi" },
        { href: "/my-tasks", label: "Görevlerim" },
        { href: "/admin", label: "Admin" },
    ];

    const handleLogout = () => {
        logout();
    };

    return (
        <nav className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800 px-8 py-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-6">
                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive
                                    ? "bg-blue-600/20 text-blue-400 border border-blue-600/30"
                                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </div>

                {user ? (
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-slate-300">
                            {user.name} <span className="text-xs text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded ml-1">{user.role}</span>
                        </span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm px-3 py-1.5 rounded-lg border border-red-500/20 transition-colors"
                        >
                            Çıkış
                        </button>
                    </div>
                ) : (
                    <Link
                        href="/login"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-900/20"
                    >
                        Giriş Yap
                    </Link>
                )}
            </div>
        </nav>
    );
}

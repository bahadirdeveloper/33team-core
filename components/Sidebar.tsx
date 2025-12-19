
"use client";

import { useEffect, useState } from "react";
import { User, Activity, Plus } from "lucide-react";

interface TeamMember {
    id: number;
    name: string;
    avatar: string;
    totalScore: number;
    isOnline: boolean;
}

export default function Sidebar() {
    const [team, setTeam] = useState<TeamMember[]>([]);

    useEffect(() => {
        const fetchTeam = () => {
            fetch("/api/users")
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) setTeam(data);
                })
                .catch(console.error);
        };

        fetchTeam();
        const interval = setInterval(fetchTeam, 10000); // Refresh every 10s
        return () => clearInterval(interval);
    }, []);

    return (
        <aside className="w-64 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 h-screen fixed left-0 top-0 p-6 flex flex-col z-40">
            <div className="mb-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 text-transparent bg-clip-text">
                    TeamCore
                </h2>
                <p className="text-xs text-slate-500 mt-1">v2.0 Beta</p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6">

                {/* Active Team Section */}
                <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Activity size={12} /> Ekip ({team.length})
                    </h3>
                    <div className="space-y-3">
                        {team.map(member => (
                            <div key={member.id} className="flex items-center gap-3 group">
                                <div className="relative">
                                    <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full bg-slate-800" />
                                    {member.isOnline && (
                                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-slate-900 rounded-full animate-pulse"></span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-200 truncate group-hover:text-blue-400 transition-colors">
                                        {member.name}
                                    </p>
                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                        {member.totalScore} Puan
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Admin Action (Mock) */}
            <div className="mt-auto pt-6 border-t border-slate-800">
                <button
                    onClick={() => {
                        const email = prompt("Davet edilecek e-posta adresi:");
                        if (email) {
                            fetch("/api/invite", {
                                method: "POST",
                                body: JSON.stringify({ email })
                            })
                                .then(res => res.json())
                                .then(data => {
                                    if (data.success) alert("Davet gönderildi (Kullanıcı oluşturuldu: 123)");
                                    else alert("Hata: " + data.error);
                                })
                                .catch(err => alert("Hata oluştu"));
                        }
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-lg text-sm transition-all"
                >
                    <Plus size={16} /> Davet Et
                </button>
            </div>
        </aside>
    );
}

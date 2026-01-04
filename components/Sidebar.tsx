"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Plus, Trophy, TrendingUp, Sparkles, UserPlus } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { cn, formatPoints } from "@/lib/utils";
import { toast } from "sonner";

interface TeamMember {
  id: number;
  name: string;
  avatar: string;
  totalScore: number;
  isOnline: boolean;
}

export default function Sidebar() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = () => {
      fetch("/api/users")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setTeam(data);
          setIsLoading(false);
        })
        .catch(console.error);
    };

    fetchTeam();
    const interval = setInterval(fetchTeam, 10000);
    return () => clearInterval(interval);
  }, []);

  const onlineCount = team.filter((m) => m.isOnline).length;
  const topPerformer = team.reduce(
    (max, m) => (m.totalScore > (max?.totalScore || 0) ? m : max),
    null as TeamMember | null
  );

  const handleInvite = () => {
    const email = prompt("Davet edilecek e-posta adresi:");
    if (email) {
      toast.promise(
        fetch("/api/invite", {
          method: "POST",
          body: JSON.stringify({ email }),
        }).then((res) => res.json()),
        {
          loading: "Davet gönderiliyor...",
          success: "Davet başarıyla gönderildi!",
          error: "Davet gönderilemedi",
        }
      );
    }
  };

  return (
    <aside className="w-64 bg-slate-900/80 backdrop-blur-xl border-r border-slate-800/50 h-screen fixed left-0 top-0 flex flex-col z-40">
      {/* Header */}
      <div className="p-6 border-b border-slate-800/50">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/30">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 text-transparent bg-clip-text">
              TeamCore
            </h2>
            <p className="text-[10px] text-slate-500 font-medium tracking-wider">
              WORKSPACE v2.0
            </p>
          </div>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <div className="p-4 grid grid-cols-2 gap-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-3"
        >
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <Activity size={14} />
            <span className="text-xs font-medium">Çevrimiçi</span>
          </div>
          <p className="text-2xl font-bold text-white">{onlineCount}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-3"
        >
          <div className="flex items-center gap-2 text-amber-400 mb-1">
            <Trophy size={14} />
            <span className="text-xs font-medium">Toplam</span>
          </div>
          <p className="text-2xl font-bold text-white">{team.length}</p>
        </motion.div>
      </div>

      {/* Top Performer */}
      {topPerformer && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="mx-4 mb-4 p-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={14} className="text-amber-400" />
            <span className="text-xs font-medium text-amber-400">
              En İyi Performans
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Avatar name={topPerformer.name} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {topPerformer.name}
              </p>
              <p className="text-xs text-amber-400/80">
                {formatPoints(topPerformer.totalScore)} puan
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Team List */}
      <div className="flex-1 overflow-y-auto px-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Ekip Üyeleri
          </h3>
          <span className="text-xs text-slate-600">{team.length} kişi</span>
        </div>

        <div className="space-y-1">
          <AnimatePresence>
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2 animate-pulse"
                  >
                    <div className="w-9 h-9 rounded-full bg-slate-800" />
                    <div className="flex-1">
                      <div className="h-4 w-24 bg-slate-800 rounded mb-1" />
                      <div className="h-3 w-16 bg-slate-800/50 rounded" />
                    </div>
                  </div>
                ))
              : team.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 4 }}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all",
                      "hover:bg-slate-800/50 group"
                    )}
                  >
                    <Avatar
                      name={member.name}
                      size="md"
                      showStatus
                      isOnline={member.isOnline}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate group-hover:text-blue-400 transition-colors">
                        {member.name}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-slate-500">
                          {formatPoints(member.totalScore)} puan
                        </span>
                        {member.totalScore > 100 && (
                          <Trophy size={10} className="text-amber-500" />
                        )}
                      </div>
                    </div>
                    {member.isOnline && (
                      <span className="text-[10px] text-emerald-400 font-medium px-1.5 py-0.5 bg-emerald-500/10 rounded">
                        Aktif
                      </span>
                    )}
                  </motion.div>
                ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="p-4 border-t border-slate-800/50">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleInvite}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 hover:from-blue-600/30 hover:to-indigo-600/30 text-blue-400 py-2.5 rounded-xl text-sm font-medium border border-blue-500/20 transition-all"
        >
          <UserPlus size={16} />
          Takıma Davet Et
        </motion.button>
      </div>
    </aside>
  );
}

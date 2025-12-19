"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirm) {
            alert("Şifreler eşleşmiyor");
            return;
        }

        if (password.length < 6) {
            alert("Şifre en az 6 karakter olmalı");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password })
            });

            if (res.ok) {
                alert("Şifreniz değiştirildi. Yönlendiriliyorsunuz...");
                // Reload window to re-check auth state or redirect
                window.location.href = "/";
            } else {
                const d = await res.json();
                alert(d.error || "Hata oluştu");
            }
        } catch (e) {
            console.error(e);
            alert("Bir hata oluştu");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text mb-2">
                    Şifre Değişikliği Gerekli
                </h1>
                <p className="text-slate-400 mb-6">
                    Güvenliğiniz için lütfen yeni bir şifre belirleyin.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Yeni Şifre</label>
                        <input
                            type="password"
                            className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white focus:border-blue-500 outline-none transition-colors"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Şifre Tekrar</label>
                        <input
                            type="password"
                            className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white focus:border-blue-500 outline-none transition-colors"
                            value={confirm}
                            onChange={e => setConfirm(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Kaydediliyor..." : "Şifreyi Güncelle ve Devam Et"}
                    </button>
                </form>
            </div>
        </div>
    );
}

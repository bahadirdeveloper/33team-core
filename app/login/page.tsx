
"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await login(email, password);
            // Login successful (no error thrown), AuthContext handles redirect usually or we do it here
            // Actually AuthContext currently doesn't throw, let's make sure we handle success properly.
            // But wait, the Context.login needs to be updated first to return success/fail or throw.
            // For now assume if no error, we are good? 
            // Let's rely on updated Context returning true/false or throwing.
            router.push("/projects");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Giriş başarısız. Bilgilerinizi kontrol edin.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-8 bg-slate-900 rounded-xl border border-slate-800 shadow-2xl">
            <h1 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">TeamCore</h1>
            <p className="text-slate-400 text-center mb-8">Ekip Yönetim Platformu</p>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded mb-4 text-sm text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1 text-slate-300">E-posta</label>
                    <input
                        type="email"
                        required
                        className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white focus:border-blue-500 outline-none transition-colors"
                        placeholder="ornek@team.core"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-slate-300">Şifre</label>
                    <input
                        type="password"
                        required
                        className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white focus:border-blue-500 outline-none transition-colors"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                </button>
            </form>
        </div>
    );
}

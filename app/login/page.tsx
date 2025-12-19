
"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        await login(email);
        router.push("/projects");
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-8 bg-slate-900 rounded-xl border border-slate-800">
            <h1 className="text-2xl font-bold mb-6 text-center">Giriş Yap</h1>
            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">E-posta</label>
                    <input
                        type="email"
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-white focus:border-blue-500 outline-none"
                        placeholder="ornek@team.core"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
                >
                    Giriş Yap
                </button>
                <p className="text-xs text-center text-slate-500">
                    Demo: "admin@team.core" veya herhangi bir email.
                </p>
            </form>
        </div>
    );
}

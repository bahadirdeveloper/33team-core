
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
    id: number;
    email: string;
    name: string;
    role: "ADMIN" | "MEMBER";
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check localStorage for persisted mock session
        const stored = localStorage.getItem("teamcore_user");
        if (stored) {
            setUser(JSON.parse(stored));
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Giriş başarısız");
            }

            const data = await res.json();
            if (data.user) {
                setUser(data.user);
                localStorage.setItem("teamcore_user", JSON.stringify(data.user));
            }
        } catch (err) {
            console.error("Login Error", err);
            throw err; // Re-throw to be caught by component
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("teamcore_user");
        // Call API logout
        fetch("/api/auth/logout", { method: "POST" });
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

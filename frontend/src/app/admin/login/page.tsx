"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { api } from "@/config/api";

export default function AdminLoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (event: FormEvent) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {

            const res = await fetch(api.auth.login, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (!res.ok) {
                setError("Invalid username or password");
                setLoading(false);
                return;
            }

            const data = await res.json();
            // Store JWT token and redirect to admin panel
            sessionStorage.setItem("menescape-admin-token", data.access_token);
            router.push("/admin");
        } catch {
            setError("Login failed. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 text-[var(--navy)]">
                        <div className="grid h-14 w-14 place-items-center rounded-full bg-transparent overflow-hidden">
                            <Image
                                src="/Logo_Sade.svg"
                                alt="MenEscape logo"
                                width={56}
                                height={56}
                                className="h-14 w-14 object-contain scale-[1.6]"
                                priority
                            />
                        </div>
                        <span className="text-xl font-bold">MenEscape</span>
                    </div>
                </div>

                <div className="lux-card rounded-3xl bg-white p-8">
                    <div className="text-center mb-6">
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">
                            Admin Access
                        </p>
                        <h1 className="mt-2 text-2xl font-bold text-[var(--navy)]">
                            Sign in to Admin Panel
                        </h1>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label
                                htmlFor="admin-username"
                                className="block text-sm font-semibold text-[var(--navy)]"
                            >
                                Username
                            </label>
                            <input
                                id="admin-username"
                                type="text"
                                required
                                className="lux-field mt-2 w-full px-4 py-3 text-sm"
                                placeholder="Enter username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="username"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="admin-password"
                                className="block text-sm font-semibold text-[var(--navy)]"
                            >
                                Password
                            </label>
                            <input
                                id="admin-password"
                                type="password"
                                required
                                className="lux-field mt-2 w-full px-4 py-3 text-sm"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-600 text-center">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full cta-luxe rounded-full bg-[linear-gradient(135deg,_#ec4899,_#3b82f6)] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/30 disabled:opacity-50"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <a
                            href="/"
                            className="text-sm text-slate-500 hover:text-[var(--navy)] transition-colors"
                        >
                            ← Back to website
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

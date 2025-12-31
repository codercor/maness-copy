"use client";

import { useState } from "react";
import { api } from "@/config/api";
import Link from "next/link";

export default function UnsubscribePage() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleUnsubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus("loading");
        try {
            const res = await fetch(api.newsletter.unsubscribe, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (res.ok) {
                setStatus("success");
            } else {
                setStatus("error");
                setMessage("Could not unsubscribe. Please check your email and try again.");
            }
        } catch (error) {
            setStatus("error");
            setMessage("An error occurred. Please try again later.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center">
                <Link href="/" className="inline-block mb-8">
                    <span className="text-2xl font-bold tracking-tighter text-[var(--navy)]">
                        MENESCAPE
                    </span>
                </Link>

                {status === "success" ? (
                    <div>
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="material-symbols-outlined text-3xl">check</span>
                        </div>
                        <h1 className="text-2xl font-bold text-[var(--navy)] mb-4">Unsubscribed</h1>
                        <p className="text-slate-600 mb-8">
                            You have been successfully removed from our newsletter list. We're sorry to see you go!
                        </p>
                        <Link
                            href="/"
                            className="inline-block px-6 py-3 bg-[var(--navy)] text-white font-bold rounded-full hover:bg-blue-900 transition-colors"
                        >
                            Return Home
                        </Link>
                    </div>
                ) : (
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--navy)] mb-2">Unsubscribe</h1>
                        <p className="text-slate-500 mb-8">
                            Enter your email address below to unsubscribe from our newsletter.
                        </p>

                        <form onSubmit={handleUnsubscribe} className="space-y-4">
                            <input
                                type="email"
                                required
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[var(--navy)]/20 transition-all text-center"
                            />

                            {status === "error" && (
                                <p className="text-sm text-rose-500">{message}</p>
                            )}

                            <button
                                type="submit"
                                disabled={status === "loading"}
                                className="w-full py-3 bg-rose-500 text-white font-bold rounded-full hover:bg-rose-600 transition-colors disabled:opacity-50"
                            >
                                {status === "loading" ? "Processing..." : "Unsubscribe"}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import type { Translations } from "@/types";
import { api } from "@/config/api";

// Google Client ID - should match backend
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

interface AuthModalProps {
    copy: Translations;
    userModalRef: React.RefObject<HTMLDivElement | null>;
    onClose: () => void;
    onLogin?: (user: any) => void;
}

export function AuthModal({ copy, userModalRef, onClose, onLogin }: AuthModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError(null);

        try {
            // Load Google Identity Services
            if (typeof window === "undefined" || !(window as any).google) {
                await loadGoogleScript();
            }

            const google = (window as any).google;

            // Initialize Code Client (Authorization Code Flow)
            const client = google.accounts.oauth2.initCodeClient({
                client_id: GOOGLE_CLIENT_ID,
                scope: 'email profile openid',
                ux_mode: 'popup',
                callback: (response: any) => {
                    if (response.code) {
                        handleGoogleCode(response.code);
                    } else {
                        setLoading(false);
                    }
                },
                error_callback: () => {
                    setError("Google sign-in failed");
                    setLoading(false);
                }
            });

            // Request Authorization Code
            client.requestCode();

        } catch (err) {
            console.error("Google login error:", err);
            setError("Failed to initialize Google login");
            setLoading(false);
        }
    };

    const handleGoogleCode = async (code: string) => {
        try {
            // Send authorization code to backend
            const res = await fetch(api.auth.google, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || "Authentication failed");
            }

            const data = await res.json();

            // Store token
            localStorage.setItem("menescape-token", data.access_token);
            localStorage.setItem("menescape-user", JSON.stringify(data.user));

            // Notify parent
            if (onLogin) {
                onLogin(data.user);
            }

            onClose();
        } catch (err) {
            console.error("Backend auth error:", err);
            setError("Authentication failed. " + (err instanceof Error ? err.message : ""));
        } finally {
            setLoading(false);
        }
    };

    const loadGoogleScript = (): Promise<void> => {
        return new Promise((resolve, reject) => {
            if ((window as any).google) {
                resolve();
                return;
            }

            const script = document.createElement("script");
            script.src = "https://accounts.google.com/gsi/client";
            script.async = true;
            script.defer = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error("Failed to load Google script"));
            document.head.appendChild(script);
        });
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6"
            onClick={onClose}
        >
            <div
                ref={userModalRef}
                className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
                onClick={(event) => event.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="user-auth-title"
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">
                            {copy.userAuth.label}
                        </p>
                        <h3
                            id="user-auth-title"
                            className="mt-2 text-xl font-bold text-[var(--navy)]"
                        >
                            {copy.userAuth.title}
                        </h3>
                    </div>
                    <button onClick={onClose} aria-label="Close">
                        <span className="material-symbols-outlined text-slate-400">
                            close
                        </span>
                    </button>
                </div>
                <p className="mt-3 text-sm text-slate-500">{copy.userAuth.subtitle}</p>

                {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                        {error}
                    </div>
                )}

                <div className="mt-6 space-y-3">
                    {/* Google Sign-In Button */}
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="flex w-full items-center justify-center gap-3 rounded-full border border-black/10 px-4 py-3 text-sm font-bold text-[var(--navy)] hover:bg-slate-50 transition-colors disabled:opacity-50"
                    >
                        {loading ? (
                            <div className="animate-spin h-5 w-5 border-2 border-[var(--navy)] border-t-transparent rounded-full" />
                        ) : (
                            <>
                                <svg className="h-5 w-5" viewBox="0 0 24 24">
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                {copy.userAuth.google}
                            </>
                        )}
                    </button>
                    {/* Hidden fallback button removed */}
                </div>

                <p className="mt-4 text-xs text-slate-400">{copy.userAuth.note}</p>
            </div>
        </div>
    );
}

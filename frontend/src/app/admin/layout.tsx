"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { api } from "@/config/api";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthed, setIsAuthed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Skip auth check for login page
        if (pathname === "/admin/login") {
            setIsAuthed(true);
            setIsLoading(false);
            return;
        }

        const token = sessionStorage.getItem("menescape-admin-token");
        if (!token) {
            router.push("/admin/login");
            return;
        }

        // Verify token is still valid
        fetch(api.auth.verify, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) {
                    sessionStorage.removeItem("menescape-admin-token");
                    router.push("/admin/login");
                    return;
                }
                setIsAuthed(true);
                setIsLoading(false);
            })
            .catch(() => {
                router.push("/admin/login");
            });
    }, [router, pathname]);

    const handleLogout = () => {
        sessionStorage.removeItem("menescape-admin-token");
        router.push("/admin/login");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-[var(--navy)] border-t-transparent rounded-full mx-auto"></div>
                    <p className="mt-4 text-slate-500">Loading...</p>
                </div>
            </div>
        );
    }

    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    if (!isAuthed) return null;

    return (
        <div className="min-h-screen bg-[var(--bg)] flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-black/10 bg-white/90 backdrop-blur">
                <div className="mx-auto flex h-16 w-full px-6 items-center justify-between">
                    <div className="flex items-center gap-3 text-[var(--navy)]">
                        <div className="grid h-10 w-10 place-items-center rounded-full bg-transparent overflow-hidden">
                            <Image
                                src="/Logo_Sade.svg"
                                alt="MenEscape logo"
                                width={40}
                                height={40}
                                className="h-10 w-10 object-contain scale-[1.6]"
                            />
                        </div>
                        <span className="font-bold text-lg">Admin Panel</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <a
                            href="/"
                            target="_blank"
                            className="text-sm text-slate-500 hover:text-[var(--navy)] transition-colors flex items-center gap-1"
                        >
                            View Website
                            <span className="material-symbols-outlined text-xs">open_in_new</span>
                        </a>
                        <button
                            onClick={handleLogout}
                            className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-100 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex flex-1">
                <AdminSidebar />
                <main className="flex-1 p-8 overflow-y-auto h-[calc(100vh-64px)]">
                    {children}
                </main>
            </div>
        </div>
    );
}

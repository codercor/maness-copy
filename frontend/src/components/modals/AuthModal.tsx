"use client";

import { signIn } from "next-auth/react";
import type { Translations } from "@/types";

interface AuthModalProps {
    copy: Translations;
    userModalRef: React.RefObject<HTMLDivElement | null>;
    onClose: () => void;
}

export function AuthModal({ copy, userModalRef, onClose }: AuthModalProps) {
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
                <div className="mt-6 space-y-3">
                    <button
                        type="button"
                        onClick={() => signIn("google")}
                        className="flex w-full items-center justify-center gap-3 rounded-full border border-black/10 px-4 py-3 text-sm font-bold text-[var(--navy)]"
                    >
                        <span className="grid h-8 w-8 place-items-center rounded-full bg-[#f7f5f1] text-xs font-bold text-[var(--navy)]">
                            G
                        </span>
                        {copy.userAuth.google}
                    </button>
                    <button
                        type="button"
                        onClick={() => signIn("apple")}
                        className="flex w-full items-center justify-center gap-3 rounded-full bg-[var(--navy)] px-4 py-3 text-sm font-bold text-white"
                    >
                        <span className="grid h-8 w-8 place-items-center rounded-full bg-white/15 text-xs font-bold text-white">
                            A
                        </span>
                        {copy.userAuth.apple}
                    </button>
                </div>
                <p className="mt-4 text-xs text-slate-400">{copy.userAuth.note}</p>
            </div>
        </div>
    );
}

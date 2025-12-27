"use client";

import type { Translations, Package } from "@/types";

interface AffiliateModalProps {
    copy: Translations;
    localizedPackage: Package;
    modalRef: React.RefObject<HTMLDivElement | null>;
    onClose: () => void;
    onConfirm: () => void;
}

export function AffiliateModal({
    copy,
    localizedPackage,
    modalRef,
    onClose,
    onConfirm,
}: AffiliateModalProps) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6"
            onClick={onClose}
        >
            <div
                ref={modalRef}
                className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
                onClick={(event) => event.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="affiliate-title"
                aria-describedby="affiliate-desc"
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">
                            {copy.affiliate.label}
                        </p>
                        <h3
                            id="affiliate-title"
                            className="mt-2 text-xl font-bold text-[var(--navy)]"
                        >
                            {copy.affiliate.title}
                        </h3>
                    </div>
                    <button onClick={onClose} aria-label="Close">
                        <span className="material-symbols-outlined text-slate-400">
                            close
                        </span>
                    </button>
                </div>
                <p id="affiliate-desc" className="mt-4 text-sm text-slate-600">
                    {copy.affiliate.description}{" "}
                    <strong>{localizedPackage.partner.name}</strong>{" "}
                    {copy.affiliate.descriptionSuffix}
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                        className="flex-1 rounded-full border border-black/10 px-4 py-2 text-sm font-bold text-[var(--navy)]"
                        onClick={onClose}
                    >
                        {copy.affiliate.stay}
                    </button>
                    <button
                        className="flex-1 rounded-full bg-[var(--navy)] px-4 py-2 text-sm font-bold text-white"
                        onClick={onConfirm}
                    >
                        {copy.affiliate.continue}
                    </button>
                </div>
            </div>
        </div>
    );
}

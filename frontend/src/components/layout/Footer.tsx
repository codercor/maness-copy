"use client";

import Link from "next/link";
import Image from "next/image";
import type { FormEvent } from "react";
import type { Translations } from "@/types";

interface FooterProps {
    copy: Translations;
    footerEmail: string;
    setFooterEmail: (email: string) => void;
    footerStatus: string;
    onFooterSubmit: (event: FormEvent) => void;
    footerRef: React.RefObject<HTMLElement | null>;
}

export function Footer({
    copy,
    footerEmail,
    setFooterEmail,
    footerStatus,
    onFooterSubmit,
    footerRef,
}: FooterProps) {
    return (
        <footer className="bg-white py-16" ref={footerRef}>
            <div className="mx-auto grid w-[min(1200px,92vw)] gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
                <div>
                    <div className="flex items-center gap-3 text-[var(--navy)]">
                        <div className="grid h-12 w-12 place-items-center rounded-full bg-transparent overflow-hidden">
                            <Image
                                src="/Logo_Sade.svg"
                                alt="MenEscape logo"
                                width={52}
                                height={52}
                                className="h-12 w-12 object-contain scale-[1.6]"
                            />
                        </div>
                        <span className="text-lg font-bold">MenEscape</span>
                    </div>
                    <h3 className="mt-6 text-2xl font-bold">
                        {copy.footer.brandLine}
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                        {copy.footer.phase4}
                    </p>
                    <form
                        className="mt-6 flex flex-wrap gap-3"
                        onSubmit={onFooterSubmit}
                    >
                        <input
                            type="email"
                            required
                            className="lux-field flex-1 px-4 py-2 text-sm"
                            placeholder={copy.newsletter.placeholder}
                            value={footerEmail}
                            onChange={(event) => setFooterEmail(event.target.value)}
                        />
                        <button
                            type="submit"
                            className="rounded-full bg-[var(--navy)] px-4 py-2 text-sm font-bold text-white"
                        >
                            {copy.footer.join}
                        </button>
                    </form>
                    {footerStatus && (
                        <p className="mt-3 text-xs font-semibold text-[var(--navy)]">
                            {footerStatus}
                        </p>
                    )}
                </div>
                <div>
                    <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--navy)]">
                        {copy.footer.explore}
                    </h4>
                    <ul className="mt-4 space-y-2 text-sm text-slate-500">
                        <li>
                            <Link href="/#destinations">{copy.nav.destinations}</Link>
                        </li>
                        <li>
                            <Link href="/#experience">{copy.nav.experience}</Link>
                        </li>
                        <li>
                            <Link href="/#community">{copy.nav.community}</Link>
                        </li>
                        <li>
                            <Link href="/about">{copy.footer.about}</Link>
                        </li>
                        <li>
                            <Link href="/contact">{copy.footer.contact}</Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--navy)]">
                        {copy.footer.resources}
                    </h4>
                    <ul className="mt-4 space-y-2 text-sm text-slate-500">
                        <li>
                            <Link href="/legal/terms">{copy.footer.terms}</Link>
                        </li>
                        <li>
                            <Link href="/legal/privacy">{copy.footer.privacy}</Link>
                        </li>
                        <li>
                            <Link href="/legal/gdpr">{copy.legal.gdprTitle}</Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="mx-auto mt-10 flex w-[min(1200px,92vw)] flex-wrap justify-between gap-4 text-xs text-slate-400">
                <span>{copy.footer.rights}</span>
                <span>{copy.footer.closing}</span>
            </div>
        </footer>
    );
}

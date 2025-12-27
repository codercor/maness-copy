"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import type { Language, LanguageOption, Translations } from "@/types";

interface HeaderProps {
    session: any; // Can be user object or null
    language: Language;
    setLanguage: (lang: Language) => void;
    languageOptions: LanguageOption[];
    copy: Translations;
    activeSection: string;
    scrollProgress: number;
    navOpen: boolean;
    setNavOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
    headerRef: React.RefObject<HTMLElement | null>;
    onUserAuthOpen: () => void;
    onLogout?: () => void;
}

const navItems = [
    { id: "destinations", key: "destinations" as const, href: "/#destinations" },
    { id: "experience", key: "experience" as const, href: "/#experience" },
    { id: "community", key: "community" as const, href: "/#community" },
    { id: "about", key: "about" as const, href: "/about" },
    { id: "contact", key: "contact" as const, href: "/contact" },
];

export function Header({
    session,
    language,
    setLanguage,
    activeSection,
    scrollProgress,
    navOpen,
    setNavOpen,
    headerRef,
    onUserAuthOpen,
    onLogout,
    copy,
    languageOptions,
}: HeaderProps) {
    return (
        <header
            ref={headerRef}
            className="sticky top-0 z-40 border-b border-black/10 bg-white/90 backdrop-blur relative"
        >
            <div
                className="absolute left-0 top-0 h-1 bg-[linear-gradient(135deg,_#ec4899,_#3b82f6)]"
                style={{ width: `${Math.min(scrollProgress * 100, 100)}%` }}
            />
            <div className="mx-auto flex h-20 w-[min(1200px,92vw)] items-center gap-6">
                <Link href="/" className="flex items-center gap-3 font-extrabold text-[var(--navy)]">
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
                    <span className="text-lg tracking-tight">MenEscape</span>
                </Link>
                <nav className="hidden flex-1 items-center justify-center gap-8 text-sm font-semibold text-[var(--navy)] md:flex">
                    {navItems.map((item) => (
                        <Link
                            key={item.id}
                            className={`nav-link transition-colors hover:text-[var(--gold)] ${activeSection === item.id ? "text-[var(--gold)]" : ""
                                }`}
                            href={item.href}
                            aria-current={activeSection === item.id ? "page" : undefined}
                        >
                            {copy.nav[item.key]}
                        </Link>
                    ))}
                </nav>
                <div className="ml-auto flex items-center gap-3">
                    {session ? (
                        <div className="flex items-center gap-3 pl-4 border-l border-black/10">
                            {session.picture ? (
                                <div className="relative h-8 w-8 overflow-hidden rounded-full border border-black/10">
                                    <Image
                                        src={session.picture}
                                        alt={session.name || "User"}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--navy)] text-xs font-bold text-white">
                                    {session.name?.[0]?.toUpperCase() || session.email?.[0]?.toUpperCase() || "U"}
                                </div>
                            )}
                            <div className="hidden flex-col md:flex">
                                <span className="text-xs font-bold text-[var(--navy)]">
                                    {session.name?.split(" ")[0] || "User"}
                                </span>
                                <button
                                    onClick={() => onLogout?.()}
                                    className="text-[10px] font-semibold text-slate-500 hover:text-[var(--gold)] text-left transition-colors"
                                >
                                    {copy.header.signOut}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={onUserAuthOpen}
                            className="hidden rounded-full border border-[var(--navy)] px-6 py-2.5 text-sm font-bold text-[var(--navy)] transition-colors hover:bg-[var(--navy)] hover:text-white sm:inline-flex"
                        >
                            {copy.header.signIn}
                        </button>
                    )}
                    <label className="hidden items-center gap-2 rounded-full border border-black/10 px-3 py-2 text-xs font-semibold text-[var(--navy)] sm:flex">
                        <span className="material-symbols-outlined text-base">
                            language
                        </span>
                        <span className="sr-only">{copy.header.languageLabel}</span>
                        <select
                            className="bg-transparent text-xs font-semibold text-[var(--navy)] focus:outline-none"
                            value={language}
                            onChange={(event) => setLanguage(event.target.value as Language)}
                            aria-label={copy.header.languageLabel}
                        >
                            {languageOptions.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </label>
                    <button
                        className="md:hidden"
                        onClick={() => setNavOpen((open) => !open)}
                        aria-label="Toggle menu"
                        aria-expanded={navOpen}
                        aria-controls="mobile-menu"
                    >
                        <span className="material-symbols-outlined text-2xl text-[var(--navy)]">
                            menu
                        </span>
                    </button>
                </div>
            </div>
            {navOpen && (
                <div
                    className="absolute left-0 right-0 top-full border-t border-black/10 bg-white/95 shadow-lg md:hidden"
                    id="mobile-menu"
                >
                    <div className="mx-auto flex w-[min(1200px,92vw)] flex-col gap-4 py-4 text-sm font-semibold text-[var(--navy)]">
                        {navItems.map((item) => (
                            <Link
                                key={item.id}
                                href={item.href}
                                onClick={() => setNavOpen(false)}
                                className={`transition-colors hover:text-[var(--gold)] ${activeSection === item.id ? "text-[var(--gold)]" : ""
                                    }`}
                                aria-current={activeSection === item.id ? "page" : undefined}
                            >
                                {copy.nav[item.key]}
                            </Link>
                        ))}
                        {session ? (
                            <button
                                type="button"
                                onClick={() => {
                                    setNavOpen(false);
                                    onLogout?.();
                                }}
                                className="text-left text-sm font-semibold text-[var(--navy)]"
                            >
                                {copy.header.signOut}
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => {
                                    setNavOpen(false);
                                    onUserAuthOpen();
                                }}
                                className="text-left text-sm font-semibold text-[var(--navy)]"
                            >
                                {copy.header.signIn}
                            </button>
                        )}
                        <label className="flex items-center gap-2 text-sm font-semibold text-[var(--navy)]">
                            <span className="material-symbols-outlined text-base">
                                language
                            </span>
                            <select
                                className="bg-transparent text-sm font-semibold text-[var(--navy)] focus:outline-none"
                                value={language}
                                onChange={(event) =>
                                    setLanguage(event.target.value as Language)
                                }
                                aria-label={copy.header.languageLabel}
                            >
                                {languageOptions.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                </div>
            )}
        </header>
    );
}

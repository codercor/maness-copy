"use client";

import Link from "next/link";
import Image from "next/image";
import { signIn, signOut } from "next-auth/react";
import type { Session } from "next-auth";
import type { Language, LanguageOption, Translations } from "@/types";

interface HeaderProps {
    session: Session | null;
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
}

const navItems = [
    { id: "destinations", key: "destinations" as const },
    { id: "experience", key: "experience" as const },
    { id: "community", key: "community" as const },
];

export function Header({
    session,
    language,
    setLanguage,
    languageOptions,
    copy,
    activeSection,
    scrollProgress,
    navOpen,
    setNavOpen,
    headerRef,
    onUserAuthOpen,
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
                        <a
                            key={item.id}
                            className={`nav-link transition-colors hover:text-[var(--gold)] ${activeSection === item.id ? "text-[var(--gold)]" : ""
                                }`}
                            href={`/#${item.id}`}
                            aria-current={activeSection === item.id ? "page" : undefined}
                        >
                            {copy.nav[item.key]}
                        </a>
                    ))}
                </nav>
                <div className="ml-auto flex items-center gap-3">
                    {session ? (
                        <button
                            type="button"
                            onClick={() => signOut()}
                            className="hidden rounded-full border border-[var(--navy)] px-4 py-2 text-xs font-bold text-[var(--navy)] sm:inline-flex"
                        >
                            {copy.header.signOut}
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={onUserAuthOpen}
                            className="hidden rounded-full border border-[var(--navy)] px-4 py-2 text-xs font-bold text-[var(--navy)] sm:inline-flex"
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
                    <a
                        href="#booking"
                        className="header-cta cta-luxe hidden rounded-full bg-[linear-gradient(135deg,_#ec4899,_#3b82f6)] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 sm:inline-flex"
                    >
                        {copy.header.findEscape}
                    </a>
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
                            <a
                                key={item.id}
                                href={`/#${item.id}`}
                                onClick={() => setNavOpen(false)}
                                className={`transition-colors hover:text-[var(--gold)] ${activeSection === item.id ? "text-[var(--gold)]" : ""
                                    }`}
                                aria-current={activeSection === item.id ? "page" : undefined}
                            >
                                {copy.nav[item.key]}
                            </a>
                        ))}
                        {session ? (
                            <button
                                type="button"
                                onClick={() => {
                                    setNavOpen(false);
                                    signOut();
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

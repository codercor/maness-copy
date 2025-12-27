"use client";

import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthModal } from "@/components/modals/AuthModal";
import { useTranslation } from "@/hooks/useTranslation";

interface SiteLayoutProps {
    children: React.ReactNode;
}

export function SiteLayout({ children }: SiteLayoutProps) {
    const { t, language, setLanguage, languageOptions } = useTranslation();

    // UI State
    const [navOpen, setNavOpen] = useState(false);
    const [userAuthOpen, setUserAuthOpen] = useState(false);
    const [session, setSession] = useState<any>(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    // Footer State
    const [footerEmail, setFooterEmail] = useState("");
    const [footerStatus, setFooterStatus] = useState("");

    const headerRef = useRef<HTMLElement>(null);
    const footerRef = useRef<HTMLElement>(null);
    const userModalRef = useRef<HTMLDivElement>(null);

    // Auth Effect
    useEffect(() => {
        const userStr = localStorage.getItem("menescape-user");
        if (userStr) {
            try {
                setSession({ user: JSON.parse(userStr) });
            } catch (e) {
                localStorage.removeItem("menescape-user");
            }
        }
    }, []);

    const handleLogin = (user: any) => {
        setSession({ user });
        setUserAuthOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("menescape-token");
        localStorage.removeItem("menescape-user");
        setSession(null);
    };

    // Scroll Effect
    useEffect(() => {
        const handleScroll = () => {
            const total = document.body.scrollHeight - window.innerHeight;
            const progress = total > 0 ? window.scrollY / total : 0;
            setScrollProgress(progress);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleFooterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFooterStatus(t.newsletter.success);
        setFooterEmail("");
        setTimeout(() => setFooterStatus(""), 4000);
    };

    return (
        <div className="bg-[var(--background)] min-h-screen flex flex-col">
            <Header
                session={session?.user}
                language={language}
                setLanguage={setLanguage}
                languageOptions={languageOptions}
                copy={t}
                activeSection="inner-page" // Placeholder for inner pages
                scrollProgress={scrollProgress}
                navOpen={navOpen}
                setNavOpen={setNavOpen}
                headerRef={headerRef}
                onUserAuthOpen={() => setUserAuthOpen(true)}
                onLogout={handleLogout}
            />

            <main className="flex-grow">
                {children}
            </main>

            <Footer
                copy={t}
                footerEmail={footerEmail}
                setFooterEmail={setFooterEmail}
                footerStatus={footerStatus}
                onFooterSubmit={handleFooterSubmit}
                footerRef={footerRef}
            />

            {userAuthOpen && (
                <AuthModal
                    copy={t}
                    onClose={() => setUserAuthOpen(false)}
                    onLogin={handleLogin}
                    userModalRef={userModalRef}
                />
            )}
        </div>
    );
}

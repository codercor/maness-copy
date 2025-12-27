"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";

// Components
import { ItinerarySection } from "@/components";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { useTranslation } from "@/hooks/useTranslation";

// Data - translations
import contentTranslationsData from "@/data/content-translations.json";

// Types
import type {
    PackageId,
    Package,
    Language,
    Translations,
    ContentTranslations,
    LanguageOption,
    DestinationContentTranslation,
} from "@/types";

// API Config
import { api } from "@/config/api";

const contentTranslations = contentTranslationsData as Record<string, ContentTranslations>;

export default function PackageDetailsPage() {
    const params = useParams();
    const packageId = params.id as string;
    const { t: copy, language, translations } = useTranslation();

    // Refs
    const headerRef = useRef<HTMLElement | null>(null);
    const itineraryRef = useRef<HTMLElement | null>(null);
    const bookingRef = useRef<HTMLElement | null>(null);
    const timelineRef = useRef<HTMLDivElement | null>(null);

    // State
    const reducedMotion = useReducedMotion();
    const [navOpen, setNavOpen] = useState(false);
    const [packageData, setPackageData] = useState<Package | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState("");
    const [includedOpen, setIncludedOpen] = useState(false);
    const [itineraryProgress, setItineraryProgress] = useState(0);
    const [scrollProgress, setScrollProgress] = useState(0);
    const footerRef = useRef<HTMLElement | null>(null);

    const motionEnabled = !reducedMotion;
    const baseCopy = translations.en;
    // copy is already localized from useTranslation hook, no need to recalc
    const contentCopy = language === "en" ? null : contentTranslations[language] ?? null;
    const itineraryServices = copy.itinerary?.services?.length === 3 ? copy.itinerary.services : baseCopy.itinerary.services;
    const trustItems = copy.booking?.trustItems?.length === 3 ? copy.booking.trustItems : baseCopy.booking.trustItems;

    // Fetch package data
    useEffect(() => {
        if (!packageId) return;

        const fetchPackage = async () => {
            try {
                const response = await fetch(api.packages.get(packageId), { cache: "no-store" });
                if (response.ok) {
                    const data = await response.json();
                    setPackageData(data);
                    if (data.departures?.[0]) {
                        setSelectedDate(data.departures[0]);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch package:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPackage();
    }, [packageId]);

    // Get localized package
    // PRIORITY:
    // 1. Database Migrated Translations (packageData.translations)
    // 2. Static JSON File Overrides (contentTranslations.json)
    // 3. Database Legacy Destination (packageData.destination)
    // 4. Fallback (English / Default)
    const localizedPackage = useMemo(() => {
        if (!packageData) return null;

        // Check for DB-based translations (NEW SYSTEM)
        if (packageData.translations && packageData.translations[language]) {
            const trans = packageData.translations[language];
            return {
                ...packageData,
                destination: {
                    ...packageData.destination,
                    title: trans.title || packageData.destination?.title || packageData.name,
                    quickLook: trans.quickLook || packageData.destination?.quickLook || '',
                    description: trans.description || (packageData.destination as any)?.description || '',
                    dates: packageData.destination?.dates || '', // Dates usually not translated
                    price: packageData.destination?.price || '', // Price usually not translated
                    image: packageData.destination?.image || '',
                },
                // Add logic for itinerary translation if schema supports it in future
                // For now, fallback to JSON or legacy for itinerary items
            };
        }

        // Fallback to Static JSON (OLD SYSTEM)
        if (contentCopy?.destinations) {
            const destTrans = contentCopy.destinations[packageId as PackageId] as (DestinationContentTranslation & { itinerary?: { title?: string; items?: string[] }[] }) | undefined;
            if (destTrans) {
                return {
                    ...packageData,
                    destination: {
                        ...packageData.destination,
                        title: destTrans.title ?? packageData.destination?.title ?? packageData.name,
                        quickLook: destTrans.quickLook ?? packageData.destination?.quickLook ?? '',
                        dates: packageData.destination?.dates ?? '',
                        price: packageData.destination?.price ?? '',
                        image: packageData.destination?.image ?? '',
                    },
                    itinerary: packageData.itinerary.map((day, i) => ({
                        ...day,
                        title: destTrans.itinerary?.[i]?.title ?? day.title,
                        items: destTrans.itinerary?.[i]?.items ?? day.items,
                    })),
                };
            }
        }

        return packageData;
    }, [packageData, contentCopy, packageId, language]);

    // Date formatting
    const formatDate = (dateString: string): string => {
        const d = new Date(dateString);
        return d.toLocaleDateString(language === "de" ? "de-DE" : language === "el" ? "el-GR" : "en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
        });
    };

    const formatSpots = (count: number): string => {
        if (language === "de") return `${count} Plätze verfügbar`;
        if (language === "el") return `${count} θέσεις διαθέσιμες`;
        return `${count} spots left`;
    };

    // Handle affiliate booking
    const handleBookClick = () => {
        if (packageData?.partner?.url) {
            window.open(packageData.partner.url, "_blank");
        }
    };

    // Track itinerary scroll progress
    useEffect(() => {
        const handleScroll = () => {
            if (!timelineRef.current) return;
            const rect = timelineRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const start = windowHeight * 0.8;
            const end = windowHeight * 0.2;
            const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end + rect.height)));
            setItineraryProgress(progress);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-[var(--navy)] border-t-transparent rounded-full mx-auto" />
                    <p className="mt-4 text-slate-500">Loading package...</p>
                </div>
            </div>
        );
    }

    if (!packageData || !localizedPackage) {
        return (
            <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-[var(--navy)]">Package Not Found</h1>
                    <p className="mt-2 text-slate-500">The requested package could not be found.</p>
                    <Link
                        href="/"
                        className="mt-4 inline-block rounded-full bg-[var(--navy)] px-6 py-2 text-white"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <SiteLayout>
            <div className="min-h-screen bg-[var(--bg)]">
                {/* Hero section with package image */}
                <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${packageData.image || packageData.destination?.image || ''})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                        <div className="mx-auto w-[min(1200px,92vw)]">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
                            >
                                <span className="material-symbols-outlined text-sm">arrow_back</span>
                                Back to Home
                            </Link>
                            <h1 className="text-4xl md:text-5xl font-bold text-white">
                                {localizedPackage.destination?.title || localizedPackage.translations?.en?.title || localizedPackage.name}
                            </h1>
                            <p className="mt-2 text-lg text-white/80">
                                {packageData.dates || packageData.destination?.dates || ''} • {packageData.price || packageData.destination?.price || ''}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Itinerary Section */}
                <ItinerarySection
                    copy={copy}
                    localizedPackage={localizedPackage}
                    currentPackage={packageData}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    itineraryServices={itineraryServices}
                    trustItems={trustItems}
                    includedOpen={includedOpen}
                    setIncludedOpen={setIncludedOpen}
                    onBookClick={handleBookClick}
                    formatDate={formatDate}
                    formatSpots={formatSpots}
                    itineraryRef={itineraryRef}
                    bookingRef={bookingRef}
                    timelineRef={timelineRef}
                    itineraryProgress={itineraryProgress}
                    motionEnabled={motionEnabled}
                    language={language}
                />
            </div>
        </SiteLayout>
    );
}

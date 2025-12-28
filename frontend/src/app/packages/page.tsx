"use client";

import { useState, useEffect, useMemo } from "react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PackageCard } from "@/components/ui/PackageCard";
import { api } from "@/config/api";
import { useTranslationContext } from "@/context/TranslationContext";
import type { Package, PackageDetails, PackageId } from "@/types";

export default function PackagesPage() {
    const { t, language } = useTranslationContext();
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "date-asc">("date-asc");
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 9;

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const res = await fetch(api.packages.list, { cache: "no-store" });
                if (res.ok) {
                    const data = (await res.json()) as { packages?: PackageDetails };
                    if (data.packages) {
                        // Convert record to array
                        const pkgsArray = Object.values(data.packages);
                        setPackages(pkgsArray);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch packages:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPackages();
    }, []);

    // Filter and Sort Logic
    const filteredPackages = useMemo(() => {
        let result = [...packages];

        // Search Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter((pkg) => {
                const title = pkg.translations?.en?.title || pkg.name || "";
                const destTitle = pkg.destination?.title || "";
                return (
                    title.toLowerCase().includes(query) ||
                    destTitle.toLowerCase().includes(query)
                );
            });
        }

        // Sorting
        result.sort((a, b) => {
            const getPrice = (p: Package) => {
                const priceStr = p.price || p.destination?.price || "0";
                return parseFloat(priceStr.replace(/[^0-9.]/g, "")) || 0;
            };

            const getDate = (p: Package) => {
                const dateStr = p.dates || p.destination?.dates || "";
                // Very basic date parsing for sorting purposes
                return dateStr;
            };

            switch (sortBy) {
                case "price-asc":
                    return getPrice(a) - getPrice(b);
                case "price-desc":
                    return getPrice(b) - getPrice(a);
                case "date-asc":
                default:
                    // Simple string comparison for now as dates are often ranges strings
                    return getDate(a).localeCompare(getDate(b));
            }
        });

        return result;
    }, [packages, searchQuery, sortBy]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredPackages.length / ITEMS_PER_PAGE);
    const paginatedPackages = filteredPackages.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    return (
        <SiteLayout>
            <div className="min-h-screen bg-[var(--bg)]">
                {/* Header */}
                <div className="bg-[var(--navy)] text-white py-12 md:py-20 px-6 transform relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-[var(--navy)] opacity-50" />
                    {/* Decorative wave */}
                    <svg className="absolute bottom-0 left-0 w-full h-12 text-[var(--bg)] fill-current" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" />
                        <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" />
                        <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" />
                    </svg>
                    <div className="relative z-10 mx-auto w-[min(1200px,92vw)] text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.packagesPage.title}</h1>
                        <p className="text-white/80 max-w-2xl mx-auto text-lg">
                            {t.packagesPage.subtitle}
                        </p>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="sticky top-[80px] z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
                    <div className="mx-auto w-[min(1200px,92vw)] py-4 flex flex-col md:flex-row gap-4 items-center justify-between">

                        {/* Search */}
                        <div className="relative w-full md:w-96">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                            <input
                                type="text"
                                placeholder={t.packagesPage.searchPlaceholder}
                                value={searchQuery}
                                onChange={handleSearch}
                                className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-300 focus:border-[var(--navy)] focus:ring-1 focus:ring-[var(--navy)] outline-none transition-all text-sm"
                            />
                        </div>

                        {/* Sort */}
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <span className="text-sm font-semibold text-slate-500 whitespace-nowrap">{t.packagesPage.sortBy}</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="px-4 py-2 rounded-full border border-slate-300 bg-white text-sm focus:border-[var(--navy)] outline-none cursor-pointer flex-1 md:flex-none"
                            >
                                <option value="date-asc">{t.packagesPage.sortDateAsc}</option>
                                <option value="price-asc">{t.packagesPage.sortPriceAsc}</option>
                                <option value="price-desc">{t.packagesPage.sortPriceDesc}</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="mx-auto w-[min(1200px,92vw)] py-12">
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="animate-spin h-10 w-10 border-4 border-[var(--navy)] border-t-transparent rounded-full mx-auto" />
                            <p className="mt-4 text-slate-500">{t.packagesPage.loading}</p>
                        </div>
                    ) : filteredPackages.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl p-8 border border-slate-100">
                            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">free_cancellation</span>
                            <h3 className="text-xl font-bold text-[var(--navy)] mb-2">{t.packagesPage.noResults}</h3>
                            <p className="text-slate-500">{t.packagesPage.noResultsHint}</p>
                            <button
                                onClick={() => { setSearchQuery(""); setSortBy("date-asc"); }}
                                className="mt-4 text-[var(--navy)] font-semibold hover:underline"
                            >
                                {t.packagesPage.clearFilters}
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {paginatedPackages.map((pkg) => (
                                    <PackageCard key={pkg.id} pkg={pkg} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-12 flex justify-center items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="h-10 w-10 rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-sm">chevron_left</span>
                                    </button>

                                    {Array.from({ length: totalPages }).map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`h-10 w-10 rounded-full font-bold text-sm transition-colors ${currentPage === i + 1
                                                ? "bg-[var(--navy)] text-white"
                                                : "border border-slate-300 hover:bg-slate-50 text-slate-600"
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="h-10 w-10 rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </SiteLayout>
    );
}

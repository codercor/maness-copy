"use client";

import { useState, useEffect, useMemo } from "react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { DestinationCard } from "@/components/ui/DestinationCard";
import { api } from "@/config/api";
import type { GalleryItem } from "@/types";

interface GalleryItemWithId extends GalleryItem {
    _id: string;
}

export default function DestinationsPage() {
    const [destinations, setDestinations] = useState<GalleryItemWithId[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"title-asc" | "title-desc" | "featured">("featured");
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 9;

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const res = await fetch(api.gallery.list, { cache: "no-store" });
                if (res.ok) {
                    const data = (await res.json()) as GalleryItemWithId[];
                    setDestinations(data);
                }
            } catch (error) {
                console.error("Failed to fetch destinations:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDestinations();
    }, []);

    // Filter and Sort Logic
    const filteredDestinations = useMemo(() => {
        let result = [...destinations];

        // Search Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter((item) => {
                return (
                    item.title.toLowerCase().includes(query) ||
                    item.description.toLowerCase().includes(query)
                );
            });
        }

        // Sorting
        result.sort((a, b) => {
            switch (sortBy) {
                case "title-asc":
                    return a.title.localeCompare(b.title);
                case "title-desc":
                    return b.title.localeCompare(a.title);
                case "featured":
                default:
                    // Featured first, then by title
                    if (a.featured === b.featured) return a.title.localeCompare(b.title);
                    return a.featured ? -1 : 1;
            }
        });

        return result;
    }, [destinations, searchQuery, sortBy]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredDestinations.length / ITEMS_PER_PAGE);
    const paginatedDestinations = filteredDestinations.slice(
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
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-900 to-[var(--navy)] opacity-50" />
                    {/* Decorative wave different from packages page */}
                    <svg className="absolute bottom-0 left-0 w-full h-16 text-[var(--bg)] fill-current" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M985.66,92.83C906.67,72,823.78,31,432.84,26.42V0H0V46.61C21.61,49.12,189.65,65.3,313,67.33v.06c30.17,0.48,59.3,1.35,86.9,3.61c83,6.8,166.7,27.1,248.9,46.1c96.8,22.3,196.8,13,296-12C1064.06,99.8,1130.63,97.77,1200,97.69V0h-47L985.66,92.83z" opacity=".25"></path>
                        <path d="M321.39,56.44c120-21.2,258-29.07,388,11.23C775.25,87,839.84,98.66,903.09,102.7c33.08,2.11,66.45-6.73,99.5-19.87C1062.3,62.86,1124.69,73,1200,81.45V0H0v46.29c47.79,22.2,103.59,32.17,158,28C213.68,70.57,269.41,65.63,321.39,56.44z" opacity=".5"></path>
                        <path d="M1200,0H0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46c59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0z"></path>
                    </svg>
                    <div className="relative z-10 mx-auto w-[min(1200px,92vw)] text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Destinations</h1>
                        <p className="text-white/80 max-w-2xl mx-auto text-lg">
                            Embark on a journey to the world's most breathtaking locations. Find your perfect escape today.
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
                                placeholder="Search destinations..."
                                value={searchQuery}
                                onChange={handleSearch}
                                className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-300 focus:border-[var(--navy)] focus:ring-1 focus:ring-[var(--navy)] outline-none transition-all text-sm"
                            />
                        </div>

                        {/* Sort */}
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <span className="text-sm font-semibold text-slate-500 whitespace-nowrap">Sort by:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="px-4 py-2 rounded-full border border-slate-300 bg-white text-sm focus:border-[var(--navy)] outline-none cursor-pointer flex-1 md:flex-none"
                            >
                                <option value="featured">Featured First</option>
                                <option value="title-asc">Name: A to Z</option>
                                <option value="title-desc">Name: Z to A</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="mx-auto w-[min(1200px,92vw)] py-12">
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="animate-spin h-10 w-10 border-4 border-[var(--navy)] border-t-transparent rounded-full mx-auto" />
                            <p className="mt-4 text-slate-500">Loading destinations...</p>
                        </div>
                    ) : filteredDestinations.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl p-8 border border-slate-100">
                            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">location_off</span>
                            <h3 className="text-xl font-bold text-[var(--navy)] mb-2">No destinations found</h3>
                            <p className="text-slate-500">Try adjusting your search or filters.</p>
                            <button
                                onClick={() => { setSearchQuery(""); setSortBy("featured"); }}
                                className="mt-4 text-[var(--navy)] font-semibold hover:underline"
                            >
                                Clear all filters
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
                                {paginatedDestinations.map((item, index) => {
                                    // Vary heights for masonry effect based on index 
                                    const heights = ['h-64', 'h-80', 'h-72', 'h-96', 'h-56'];
                                    const heightClass = heights[index % heights.length];
                                    return (
                                        <DestinationCard key={item._id || index} item={item} heightClass={heightClass} />
                                    );
                                })}
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

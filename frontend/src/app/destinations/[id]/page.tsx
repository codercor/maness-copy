"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { GalleryItem, Package } from "@/types";
import { api } from "@/config/api";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PackageCard } from "@/components/ui/PackageCard";

interface DestinationWithId extends GalleryItem {
    _id: string;
}

export default function DestinationDetailPage() {
    const params = useParams();
    const destinationId = params.id as string;

    const [destination, setDestination] = useState<DestinationWithId | null>(null);
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!destinationId) return;

        const fetchData = async () => {
            try {
                // Fetch destination details
                const destResponse = await fetch(api.gallery.get(destinationId));
                if (!destResponse.ok) {
                    throw new Error("Destination not found");
                }
                const destData = await destResponse.json();
                setDestination(destData);

                // Fetch packages for this destination
                const pkgResponse = await fetch(api.gallery.packages(destinationId));
                if (pkgResponse.ok) {
                    const pkgData = await pkgResponse.json();
                    setPackages(pkgData);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load destination");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [destinationId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin h-10 w-10 border-4 border-[var(--navy)] border-t-transparent rounded-full mx-auto" />
                    <p className="mt-4 text-slate-500">Loading destination...</p>
                </div>
            </div>
        );
    }

    if (error || !destination) {
        return (
            <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
                <div className="text-center">
                    <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">
                        explore_off
                    </span>
                    <h1 className="text-2xl font-bold text-[var(--navy)]">Destination Not Found</h1>
                    <p className="mt-2 text-slate-500">{error || "The requested destination could not be found."}</p>
                    <Link
                        href="/#destination-gallery"
                        className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--navy)] px-6 py-3 text-white font-semibold hover:opacity-90 transition-opacity"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        Back to Destinations
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <SiteLayout>
            <div className="min-h-screen bg-[var(--bg)]">
                {/* Hero Section */}
                <section className="relative h-[50vh] min-h-[400px] max-h-[600px] overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${destination.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-black/40 to-black/20" />

                    {/* Back Button */}
                    <div className="absolute top-6 left-6 z-10">
                        <Link
                            href="/#destination-gallery"
                            className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-4 py-2 text-white hover:bg-white/30 transition-colors"
                        >
                            <span className="material-symbols-outlined text-lg">arrow_back</span>
                            <span className="text-sm font-semibold">All Destinations</span>
                        </Link>
                    </div>

                    {/* Hero Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                        <div className="mx-auto w-[min(1200px,92vw)]">
                            {/* Featured Badge */}
                            {destination.featured && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--gold)] px-3 py-1 text-xs font-bold text-white mb-4">
                                    <span className="material-symbols-outlined text-sm">star</span>
                                    Featured Destination
                                </span>
                            )}

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                                {destination.title}
                            </h1>

                            <div className="mt-4 flex flex-wrap items-center gap-4">
                                <span className="inline-flex items-center gap-2 text-white/80">
                                    <span className="material-symbols-outlined text-lg">schedule</span>
                                    <span className="text-sm font-medium">{destination.duration}</span>
                                </span>
                            </div>

                            <p className="mt-4 text-lg text-white/90 max-w-2xl">
                                {destination.quickLook}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Description Section */}
                <section className="py-12">
                    <div className="mx-auto w-[min(1200px,92vw)]">
                        <div className="lux-card rounded-3xl bg-white p-8">
                            <h2 className="text-2xl font-bold text-[var(--navy)] mb-4">About This Destination</h2>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                {destination.description}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Packages Section */}
                <section className="py-12 bg-gradient-to-b from-transparent to-slate-50/50">
                    <div className="mx-auto w-[min(1200px,92vw)]">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--navy)]">
                                <span className="material-symbols-outlined text-sm text-white">luggage</span>
                            </span>
                            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--gold)]">
                                Available Packages
                            </p>
                        </div>

                        <h2 className="text-3xl font-bold text-[var(--navy)] mb-2">
                            Travel Packages to {destination.title}
                        </h2>
                        <p className="text-slate-500 mb-8">
                            Explore our curated travel experiences for this stunning destination
                        </p>

                        {packages.length === 0 ? (
                            <div className="lux-card rounded-3xl bg-white p-12 text-center">
                                <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">
                                    inventory_2
                                </span>
                                <h3 className="text-xl font-bold text-[var(--navy)] mb-2">
                                    No Packages Available Yet
                                </h3>
                                <p className="text-slate-500 mb-6">
                                    We're working on exciting new packages for this destination. Check back soon!
                                </p>
                                <Link
                                    href="/#destinations"
                                    className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--navy)] px-6 py-3 text-[var(--navy)] font-semibold hover:bg-[var(--navy)] hover:text-white transition-colors"
                                >
                                    Browse All Packages
                                </Link>
                            </div>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {packages.map((pkg) => (
                                    <PackageCard key={pkg.id} pkg={pkg} />
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Footer CTA */}
                <section className="py-16 bg-[var(--navy)]">
                    <div className="mx-auto w-[min(1200px,92vw)] text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">
                            Ready to Explore {destination.title}?
                        </h2>
                        <p className="text-white/70 mb-8 max-w-xl mx-auto">
                            Contact us to plan your perfect getaway or browse our other stunning destinations.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                href="/#contact"
                                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-[var(--navy)] font-bold hover:opacity-90 transition-opacity"
                            >
                                <span className="material-symbols-outlined">mail</span>
                                Get In Touch
                            </Link>
                            <Link
                                href="/#destination-gallery"
                                className="inline-flex items-center gap-2 rounded-full border-2 border-white px-8 py-4 text-white font-bold hover:bg-white/10 transition-colors"
                            >
                                <span className="material-symbols-outlined">explore</span>
                                More Destinations
                            </Link>
                        </div>
                    </div>
                </section>
            </div >
        </SiteLayout >
    );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { PackageDetails, PackageId, Package, ItineraryDay, DestinationInfo } from "@/types";
import { api, UPLOADS_URL } from "@/config/api";

// Import initial data
import initialPackageDetailsData from "@/data/packages.json";

const initialPackages = initialPackageDetailsData as unknown as PackageDetails;

export default function AdminPage() {
    const router = useRouter();
    const [isAuthed, setIsAuthed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [adminToken, setAdminToken] = useState("");

    // Form state
    const [saving, setSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState("");
    const [editPackageId, setEditPackageId] = useState<PackageId>("mykonos");
    const [showAddModal, setShowAddModal] = useState(false);
    const [newPackageId, setNewPackageId] = useState("");
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Data state
    const [packages, setPackages] = useState<PackageDetails>(initialPackages);

    // Check auth on mount
    useEffect(() => {
        const token = sessionStorage.getItem("menescape-admin-token");
        if (!token) {
            router.push("/admin/login");
            return;
        }

        // Verify token is still valid
        fetch(api.auth.verify, {
            method: "GET",
            headers: { Authorization: `Basic ${token}` },
        })
            .then((res) => {
                if (!res.ok) {
                    sessionStorage.removeItem("menescape-admin-token");
                    router.push("/admin/login");
                    return;
                }
                setAdminToken(token);
                setIsAuthed(true);
                setIsLoading(false);
            })
            .catch(() => {
                router.push("/admin/login");
            });
    }, [router]);

    // Load existing data
    useEffect(() => {
        if (!isAuthed) return;

        fetch(api.packages.list, { cache: "no-store" })
            .then((res) => res.json())
            .then((data: { packages?: PackageDetails }) => {
                if (data.packages && Object.keys(data.packages).length) {
                    // Check if the loaded data has the new destination structure
                    const packageIds = Object.keys(data.packages) as PackageId[];
                    const firstPkg = data.packages[packageIds[0]];
                    if (firstPkg && firstPkg.destination) {
                        // New structure - use it
                        setPackages(data.packages);
                        // Set editPackageId to first available package
                        if (!packageIds.includes(editPackageId)) {
                            setEditPackageId(packageIds[0]);
                        }
                    }
                }
            })
            .catch(() => {
                // Keep initial data
            });
    }, [isAuthed]);

    const handleSave = async () => {
        setSaving(true);
        setSaveStatus("");

        try {
            const response = await fetch(api.packages.bulk, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Basic ${adminToken}`,
                },
                body: JSON.stringify({ packages }),
            });

            if (!response.ok) {
                const error = (await response.json()) as { error?: string };
                setSaveStatus(error?.error ?? "Save failed");
                setSaving(false);
                return;
            }

            setSaveStatus("Saved successfully!");
        } catch {
            setSaveStatus("Network error. Please try again.");
        }
        setSaving(false);
    };

    const handleReset = () => {
        setPackages(initialPackages);
        setSaveStatus("");
    };

    const handleLogout = () => {
        sessionStorage.removeItem("menescape-admin-token");
        router.push("/admin/login");
    };

    const updatePackageField = (
        packageId: PackageId,
        field: keyof Package,
        value: string | number | string[]
    ) => {
        setPackages((prev) => ({
            ...prev,
            [packageId]: { ...prev[packageId], [field]: value },
        }));
    };

    const updateDestinationField = (
        packageId: PackageId,
        field: keyof DestinationInfo,
        value: string
    ) => {
        setPackages((prev) => ({
            ...prev,
            [packageId]: {
                ...prev[packageId],
                destination: {
                    ...prev[packageId].destination,
                    [field]: value,
                },
            },
        }));
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(api.upload.image, {
                method: "POST",
                headers: {
                    Authorization: `Basic ${adminToken}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Upload failed");
            }

            const data = await response.json();
            const imageUrl = `${UPLOADS_URL}${data.url}`;
            updateDestinationField(editPackageId, "image", imageUrl);
        } catch (error) {
            setSaveStatus("Image upload failed");
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const updateItineraryDay = (
        packageId: PackageId,
        dayIndex: number,
        field: keyof ItineraryDay,
        value: string | string[]
    ) => {
        setPackages((prev) => ({
            ...prev,
            [packageId]: {
                ...prev[packageId],
                itinerary: prev[packageId].itinerary.map((day, i) =>
                    i === dayIndex ? { ...day, [field]: value } : day
                ),
            },
        }));
    };

    const handleAddPackage = () => {
        const id = newPackageId.toLowerCase().replace(/[^a-z0-9]/g, "");
        if (!id || packages[id as PackageId]) {
            return; // Invalid or duplicate ID
        }

        const newPackage: Package = {
            id: id as PackageId,
            name: `New Package: ${newPackageId}`,
            destination: {
                title: newPackageId,
                dates: "TBD",
                price: "€0",
                image: "https://via.placeholder.com/400x300",
                quickLook: "Description coming soon...",
            },
            departures: [new Date().toISOString().split("T")[0]],
            spots: 10,
            partner: {
                name: "Partner Name",
                url: "https://example.com",
            },
            itinerary: [
                {
                    day: "01",
                    title: "Day 1",
                    items: ["Activity 1", "Activity 2"],
                },
            ],
        };

        setPackages((prev) => ({
            ...prev,
            [id]: newPackage,
        }));
        setEditPackageId(id as PackageId);
        setNewPackageId("");
        setShowAddModal(false);
    };

    const handleRemovePackage = (packageId: PackageId) => {
        if (Object.keys(packages).length <= 1) {
            setSaveStatus("Cannot remove the last package");
            return;
        }

        const confirmed = window.confirm(`Are you sure you want to remove "${packageId}"?`);
        if (!confirmed) return;

        setPackages((prev) => {
            const { [packageId]: _, ...rest } = prev;
            return rest as PackageDetails;
        });

        // Select another package
        const remaining = Object.keys(packages).filter((id) => id !== packageId) as PackageId[];
        if (remaining.length > 0) {
            setEditPackageId(remaining[0]);
        }
    };

    const addItineraryDay = (packageId: PackageId) => {
        setPackages((prev) => {
            const pkg = prev[packageId];
            const nextDay = String(pkg.itinerary.length + 1).padStart(2, "0");
            return {
                ...prev,
                [packageId]: {
                    ...pkg,
                    itinerary: [
                        ...pkg.itinerary,
                        { day: nextDay, title: `Day ${pkg.itinerary.length + 1}`, items: ["New activity"] },
                    ],
                },
            };
        });
    };

    const removeItineraryDay = (packageId: PackageId, dayIndex: number) => {
        setPackages((prev) => ({
            ...prev,
            [packageId]: {
                ...prev[packageId],
                itinerary: prev[packageId].itinerary.filter((_, i) => i !== dayIndex),
            },
        }));
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-[var(--navy)] border-t-transparent rounded-full mx-auto"></div>
                    <p className="mt-4 text-slate-500">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthed) {
        return null;
    }

    const currentPackage = packages[editPackageId];

    // Handle case where package or destination is not loaded yet
    if (!currentPackage || !currentPackage.destination) {
        return (
            <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-[var(--navy)] border-t-transparent rounded-full mx-auto"></div>
                    <p className="mt-4 text-slate-500">Loading package data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg)]">
            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-black/10 bg-white/90 backdrop-blur">
                <div className="mx-auto flex h-16 w-[min(1400px,95vw)] items-center justify-between">
                    <div className="flex items-center gap-3 text-[var(--navy)]">
                        <div className="grid h-10 w-10 place-items-center rounded-full bg-transparent overflow-hidden">
                            <Image
                                src="/Logo_Sade.svg"
                                alt="MenEscape logo"
                                width={40}
                                height={40}
                                className="h-10 w-10 object-contain scale-[1.6]"
                            />
                        </div>
                        <span className="font-bold">Admin Panel</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <a
                            href="/"
                            className="text-sm text-slate-500 hover:text-[var(--navy)] transition-colors"
                        >
                            View Website
                        </a>
                        <button
                            onClick={handleLogout}
                            className="rounded-full border border-red-300 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="mx-auto w-[min(1400px,95vw)] py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[var(--navy)]">Edit Packages</h1>
                    <p className="mt-2 text-slate-500">
                        Manage packages, destinations, and itineraries
                    </p>
                </div>

                {/* Package Selector */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className="text-sm font-semibold text-slate-500">Select Package:</span>
                    <div className="flex flex-wrap gap-2">
                        {(Object.keys(packages) as PackageId[]).map((pkgId) => (
                            <button
                                key={pkgId}
                                type="button"
                                className={`rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${editPackageId === pkgId
                                    ? "bg-[var(--navy)] text-white"
                                    : "border border-[var(--navy)] text-[var(--navy)] hover:bg-slate-50"
                                    }`}
                                onClick={() => setEditPackageId(pkgId)}
                            >
                                {pkgId}
                            </button>
                        ))}
                        <button
                            type="button"
                            onClick={() => setShowAddModal(true)}
                            className="rounded-full px-4 py-2.5 text-sm font-bold bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center gap-1"
                        >
                            <span className="material-symbols-outlined text-base">add</span>
                            Add
                        </button>
                    </div>
                    <div className="ml-auto">
                        <button
                            type="button"
                            onClick={() => handleRemovePackage(editPackageId)}
                            className="rounded-full border border-red-300 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1"
                        >
                            <span className="material-symbols-outlined text-base">delete</span>
                            Remove
                        </button>
                    </div>
                </div>

                {/* Add Package Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <div className="lux-card rounded-3xl bg-white p-8 w-full max-w-md mx-4">
                            <h2 className="text-xl font-bold text-[var(--navy)] mb-4">Add New Package</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">
                                        Package ID (lowercase, no spaces)
                                    </label>
                                    <input
                                        className="lux-field w-full px-3 py-2 text-sm"
                                        placeholder="e.g., barcelona, ibiza"
                                        value={newPackageId}
                                        onChange={(e) => setNewPackageId(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                                {packages[newPackageId.toLowerCase().replace(/[^a-z0-9]/g, "") as PackageId] && (
                                    <p className="text-sm text-red-600">This package ID already exists</p>
                                )}
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowAddModal(false);
                                            setNewPackageId("");
                                        }}
                                        className="flex-1 rounded-full border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleAddPackage}
                                        disabled={!newPackageId.trim() || !!packages[newPackageId.toLowerCase().replace(/[^a-z0-9]/g, "") as PackageId]}
                                        className="flex-1 rounded-full bg-green-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-green-700 transition-colors disabled:opacity-50"
                                    >
                                        Create Package
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Package Details */}
                <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="lux-card rounded-3xl bg-white p-6">
                        <h2 className="text-xl font-bold text-[var(--navy)] mb-4">Package Info</h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="sm:col-span-2 lg:col-span-3">
                                <label className="block text-xs font-semibold text-slate-500 mb-1">
                                    Package Name
                                </label>
                                <input
                                    className="lux-field w-full px-3 py-2 text-sm"
                                    value={currentPackage.name}
                                    onChange={(e) =>
                                        updatePackageField(editPackageId, "name", e.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">
                                    Available Spots
                                </label>
                                <input
                                    className="lux-field w-full px-3 py-2 text-sm"
                                    type="number"
                                    value={currentPackage.spots}
                                    onChange={(e) =>
                                        updatePackageField(
                                            editPackageId,
                                            "spots",
                                            parseInt(e.target.value, 10) || 0
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* Destination Info */}
                    <div className="lux-card rounded-3xl bg-white p-6">
                        <h2 className="text-xl font-bold text-[var(--navy)] mb-4">Destination Info</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-semibold text-slate-500 mb-1">
                                    Destination Title
                                </label>
                                <input
                                    className="lux-field w-full px-3 py-2 text-sm"
                                    value={currentPackage.destination.title}
                                    onChange={(e) =>
                                        updateDestinationField(editPackageId, "title", e.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">
                                    Dates
                                </label>
                                <input
                                    className="lux-field w-full px-3 py-2 text-sm"
                                    value={currentPackage.destination.dates}
                                    onChange={(e) =>
                                        updateDestinationField(editPackageId, "dates", e.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">
                                    Price
                                </label>
                                <input
                                    className="lux-field w-full px-3 py-2 text-sm"
                                    value={currentPackage.destination.price}
                                    onChange={(e) =>
                                        updateDestinationField(editPackageId, "price", e.target.value)
                                    }
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-semibold text-slate-500 mb-2">
                                    Destination Image
                                </label>
                                <div className="flex gap-4 items-start">
                                    {/* Image Preview */}
                                    <div className="relative w-32 h-24 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0">
                                        {currentPackage.destination.image ? (
                                            <img
                                                src={currentPackage.destination.image}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                                                <span className="material-symbols-outlined text-3xl">image</span>
                                            </div>
                                        )}
                                    </div>
                                    {/* Upload Controls */}
                                    <div className="flex-1 space-y-2">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            id="image-upload"
                                        />
                                        <label
                                            htmlFor="image-upload"
                                            className={`inline-flex items-center gap-2 rounded-full border border-[var(--navy)] px-4 py-2 text-sm font-bold text-[var(--navy)] hover:bg-slate-50 transition-colors cursor-pointer ${uploading ? "opacity-50 pointer-events-none" : ""}`}
                                        >
                                            <span className="material-symbols-outlined text-base">upload</span>
                                            {uploading ? "Uploading..." : "Upload Image"}
                                        </label>
                                        <p className="text-xs text-slate-400">Max 5MB. Supports JPG, PNG, GIF, WebP</p>
                                        <input
                                            className="lux-field w-full px-3 py-2 text-xs text-slate-500"
                                            placeholder="Or enter image URL..."
                                            value={currentPackage.destination.image}
                                            onChange={(e) =>
                                                updateDestinationField(editPackageId, "image", e.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-semibold text-slate-500 mb-1">
                                    Quick Look
                                </label>
                                <textarea
                                    className="lux-field w-full resize-none rounded-2xl px-3 py-2 text-sm"
                                    rows={2}
                                    value={currentPackage.destination.quickLook}
                                    onChange={(e) =>
                                        updateDestinationField(editPackageId, "quickLook", e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* Itinerary */}
                    <div className="lux-card rounded-3xl bg-white p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-[var(--navy)]">Itinerary</h2>
                            <button
                                type="button"
                                onClick={() => addItineraryDay(editPackageId)}
                                className="rounded-full px-4 py-2 text-xs font-bold bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center gap-1"
                            >
                                <span className="material-symbols-outlined text-base">add</span>
                                Add Day
                            </button>
                        </div>
                        <div className="grid gap-4 lg:grid-cols-2">
                            {currentPackage.itinerary.map((day, dayIndex) => (
                                <div
                                    key={day.day}
                                    className="rounded-2xl border border-slate-200 p-5"
                                >
                                    <div className="mb-4 flex items-center gap-3">
                                        <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--navy)] text-sm font-bold text-white">
                                            {day.day}
                                        </span>
                                        <input
                                            className="lux-field flex-1 px-3 py-2 text-sm font-semibold"
                                            placeholder="Day Title"
                                            value={day.title}
                                            onChange={(e) =>
                                                updateItineraryDay(
                                                    editPackageId,
                                                    dayIndex,
                                                    "title",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        {currentPackage.itinerary.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeItineraryDay(editPackageId, dayIndex)}
                                                className="grid h-8 w-8 place-items-center rounded-full border border-red-300 text-red-500 hover:bg-red-50 transition-colors"
                                                title="Remove day"
                                            >
                                                <span className="material-symbols-outlined text-base">close</span>
                                            </button>
                                        )}
                                    </div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">
                                        Activities (one per line)
                                    </label>
                                    <textarea
                                        className="lux-field w-full resize-none rounded-2xl px-3 py-2 text-sm"
                                        rows={4}
                                        value={day.items.join("\n")}
                                        onChange={(e) =>
                                            updateItineraryDay(
                                                editPackageId,
                                                dayIndex,
                                                "items",
                                                e.target.value.split("\n")
                                            )
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Save Bar */}
                <div className="sticky bottom-0 mt-6 rounded-2xl bg-white border border-slate-200 p-4 shadow-lg">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            {saveStatus && (
                                <p
                                    className={`text-sm font-semibold ${saveStatus.includes("success")
                                        ? "text-green-600"
                                        : "text-red-600"
                                        }`}
                                >
                                    {saveStatus}
                                </p>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={saving}
                            className="cta-luxe rounded-full bg-[linear-gradient(135deg,_#ec4899,_#3b82f6)] px-8 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/30 disabled:opacity-50"
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

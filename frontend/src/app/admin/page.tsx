"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type {
    PackageDetails,
    PackageId,
    Package,
    ItineraryDay,
    ItineraryDayContent,
    ItineraryDayTranslations,
    SupportedLanguage,
    TranslatedContent,
    GalleryItem,
} from "@/types";
import { SUPPORTED_LANGUAGES, LANGUAGE_NAMES, DEFAULT_LANGUAGE, INCLUDED_SERVICES } from "@/types";
import { api, UPLOADS_URL } from "@/config/api";


interface GalleryItemWithId extends GalleryItem {
    _id: string;
}

export default function AdminPage() {
    const router = useRouter();
    const [isAuthed, setIsAuthed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [adminToken, setAdminToken] = useState("");

    // Form state
    const [saving, setSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState("");
    const [editPackageId, setEditPackageId] = useState<PackageId | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newPackageId, setNewPackageId] = useState("");
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Language state
    const [activeLanguage, setActiveLanguage] = useState<SupportedLanguage>("en");
    const [itineraryLanguage, setItineraryLanguage] = useState<SupportedLanguage>("en");

    // Data state
    const [packages, setPackages] = useState<PackageDetails>({});
    const [galleryItems, setGalleryItems] = useState<GalleryItemWithId[]>([]);

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
            headers: { Authorization: `Bearer ${token}` },
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

        // Load packages
        fetch(api.packages.list, { cache: "no-store" })
            .then((res) => res.json())
            .then((data: { packages?: PackageDetails }) => {
                if (data.packages && Object.keys(data.packages).length) {
                    const packageIds = Object.keys(data.packages) as PackageId[];
                    const firstPkg = data.packages[packageIds[0]];
                    // Use the data regardless of structure - service handles migration
                    if (firstPkg) {
                        setPackages(data.packages);
                        if (!editPackageId || !packageIds.includes(editPackageId)) {
                            setEditPackageId(packageIds[0]);
                        }
                    }
                }
            })
            .catch(() => {
                // Keep initial data
            });

        // Load gallery items for destination selection
        fetch(api.gallery.list, { cache: "no-store" })
            .then((res) => res.json())
            .then((data: GalleryItemWithId[]) => {
                setGalleryItems(data);
            })
            .catch(console.error);
    }, [isAuthed]);

    const handleSave = async () => {
        setSaving(true);
        setSaveStatus("");

        try {
            // Debug payload
            console.log('Saving packages payload:', JSON.stringify({ packages }, null, 2));

            const response = await fetch(api.packages.bulk, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${adminToken}`,
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

    const handleReset = async () => {
        // Reload packages from API
        try {
            const response = await fetch(api.packages.list, { cache: "no-store" });
            if (response.ok) {
                const data = (await response.json()) as { packages?: PackageDetails };
                if (data.packages) {
                    setPackages(data.packages);
                }
            }
        } catch (error) {
            console.error("Failed to reload packages:", error);
        }
        setSaveStatus("");
    };

    const handleLogout = () => {
        sessionStorage.removeItem("menescape-admin-token");
        router.push("/admin/login");
    };

    const updatePackageField = (
        packageId: PackageId,
        field: keyof Package,
        value: any
    ) => {
        setPackages((prev) => ({
            ...prev,
            [packageId]: { ...prev[packageId], [field]: value },
        }));
    };

    // Update translation for a specific language
    const updateTranslation = (
        packageId: PackageId,
        language: SupportedLanguage,
        field: keyof TranslatedContent,
        value: string
    ) => {
        setPackages((prev) => {
            const pkg = prev[packageId];
            const currentTranslations = pkg.translations || {
                en: { title: pkg.name, description: "", quickLook: "" },
            };

            // If we're starting a new language translation, copy from English/Fallback
            // This prevents other fields from clearing out when user edits just one field
            const fallbackContent = currentTranslations.en || { title: pkg.name, description: "", quickLook: "" };

            const currentLangContent = currentTranslations[language] || {
                title: fallbackContent.title,
                description: fallbackContent.description,
                quickLook: fallbackContent.quickLook,
            };

            const updatedTranslations = {
                ...currentTranslations,
                [language]: {
                    ...currentLangContent,
                    [field]: value,
                },
            };

            return {
                ...prev,
                [packageId]: {
                    ...pkg,
                    translations: updatedTranslations,
                },
            };
        });
    };

    // Get translation for display (with fallback to English)
    const getTranslation = (pkg: Package, language: SupportedLanguage): TranslatedContent => {
        if (pkg.translations) {
            // Try requested language, then fallback to English
            const content = pkg.translations[language] || pkg.translations.en;
            if (content) return content;
        }
        // Fallback to legacy destination or defaults
        if (pkg.destination) {
            return {
                title: pkg.destination.title,
                description: pkg.destination.quickLook || "",
                quickLook: pkg.destination.quickLook || "",
            };
        }
        return { title: pkg.name, description: "", quickLook: "" };
    };

    // Check if a language has content (for indicators)
    const hasLanguageContent = (pkg: Package, language: SupportedLanguage): boolean => {
        if (!pkg.translations) return language === "en";
        const content = pkg.translations[language];
        return !!(content && content.title && content.title.trim());
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
                    Authorization: `Bearer ${adminToken}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Upload failed");
            }

            const data = await response.json();
            const imageUrl = `${UPLOADS_URL}${data.url}`;
            if (editPackageId) {
                updatePackageField(editPackageId, "image", imageUrl);
            }
        } catch (error) {
            setSaveStatus("Image upload failed");
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    // Get itinerary content for a specific language (with fallback)
    const getItineraryDayContent = (day: ItineraryDay, language: SupportedLanguage): ItineraryDayContent => {
        if (day.translations?.[language]) {
            return day.translations[language] as ItineraryDayContent;
        }
        if (day.translations?.en) {
            return day.translations.en;
        }
        // Fallback to legacy fields
        return {
            title: day.title || `Day ${day.day}`,
            items: day.items || [],
        };
    };

    // Update itinerary day content for a specific language
    const updateItineraryDayContent = (
        packageId: PackageId,
        dayIndex: number,
        language: SupportedLanguage,
        field: keyof ItineraryDayContent,
        value: string | string[]
    ) => {
        setPackages((prev) => {
            const pkg = prev[packageId];
            const updatedItinerary = pkg.itinerary.map((day, i) => {
                if (i !== dayIndex) return day;

                const currentTranslations = day.translations || {
                    en: { title: day.title || '', items: day.items || [] }
                };

                const langContent = currentTranslations[language] || { title: '', items: [] };

                return {
                    ...day,
                    translations: {
                        ...currentTranslations,
                        [language]: {
                            ...langContent,
                            [field]: value,
                        },
                    },
                };
            });

            return {
                ...prev,
                [packageId]: {
                    ...pkg,
                    itinerary: updatedItinerary,
                },
            };
        });
    };

    // Legacy updateItineraryDay for non-translation fields (like 'day' number)
    const updateItineraryDay = (
        packageId: PackageId,
        dayIndex: number,
        field: 'day',
        value: string
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
            translations: {
                en: {
                    title: newPackageId,
                    description: "Description coming soon...",
                    quickLook: "Quick look description",
                },
            },
            dates: "TBD",
            price: "€0",
            image: "https://via.placeholder.com/400x300",
            destinationIds: [],
            departures: [new Date().toISOString().split("T")[0]],
            spots: 10,
            partner: {
                name: "Partner Name",
                url: "https://example.com",
            },
            itinerary: [
                {
                    day: "01",
                    translations: {
                        en: { title: "Day 1", items: ["Activity 1", "Activity 2"] },
                    },
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
            const nextDayNum = pkg.itinerary.length + 1;
            const nextDay = String(nextDayNum).padStart(2, "0");
            return {
                ...prev,
                [packageId]: {
                    ...pkg,
                    itinerary: [
                        ...pkg.itinerary,
                        {
                            day: nextDay,
                            translations: {
                                en: { title: `Day ${nextDayNum}`, items: ["New activity"] },
                            },
                        },
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

    const handleToggleShowOnHomepage = async (packageId: PackageId) => {
        const pkg = packages[packageId];
        const newValue = !pkg.showOnHomepage;

        // Optimistically update UI
        setPackages((prev) => ({
            ...prev,
            [packageId]: { ...prev[packageId], showOnHomepage: newValue },
        }));

        try {
            await fetch(api.packages.update(packageId), {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${adminToken}`,
                },
                body: JSON.stringify({ ...pkg, showOnHomepage: newValue }),
            });
        } catch (error) {
            console.error("Failed to toggle showOnHomepage:", error);
            // Revert on error
            setPackages((prev) => ({
                ...prev,
                [packageId]: { ...prev[packageId], showOnHomepage: !newValue },
            }));
        }
    };

    const handleToggleIsSelected = async (packageId: PackageId) => {
        const pkg = packages[packageId];
        const newValue = !pkg.isSelected;

        // If setting to selected, unselect all others
        if (newValue) {
            const updatedPackages = { ...packages };
            for (const id of Object.keys(updatedPackages) as PackageId[]) {
                updatedPackages[id] = { ...updatedPackages[id], isSelected: id === packageId };
            }
            setPackages(updatedPackages);
        } else {
            setPackages((prev) => ({
                ...prev,
                [packageId]: { ...prev[packageId], isSelected: false },
            }));
        }

        try {
            // Update all packages if selecting, otherwise just update this one
            if (newValue) {
                for (const id of Object.keys(packages) as PackageId[]) {
                    await fetch(api.packages.update(id), {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${adminToken}`,
                        },
                        body: JSON.stringify({ ...packages[id], isSelected: id === packageId }),
                    });
                }
            } else {
                await fetch(api.packages.update(packageId), {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${adminToken}`,
                    },
                    body: JSON.stringify({ ...pkg, isSelected: false }),
                });
            }
        } catch (error) {
            console.error("Failed to toggle isSelected:", error);
        }
    };

    // Set single destination
    const handleSetDestination = (packageId: PackageId, destinationId: string) => {
        setPackages((prev) => {
            const pkg = prev[packageId];
            return {
                ...prev,
                [packageId]: {
                    ...pkg,
                    destinationId: destinationId || undefined,
                },
            };
        });
    };

    // Toggle included service
    const handleToggleService = (packageId: PackageId, serviceId: string) => {
        setPackages((prev) => {
            const pkg = prev[packageId];
            const currentServices = pkg.includedServices || [];
            const newServices = currentServices.includes(serviceId)
                ? currentServices.filter((id) => id !== serviceId)
                : [...currentServices, serviceId];

            return {
                ...prev,
                [packageId]: {
                    ...pkg,
                    includedServices: newServices,
                },
            };
        });
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

    const currentPackage = editPackageId ? packages[editPackageId] : null;

    // Handle case where no package is selected or loaded
    if (!editPackageId || !currentPackage) {
        return (
            <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-[var(--navy)] border-t-transparent rounded-full mx-auto"></div>
                    <p className="mt-4 text-slate-500">Loading package data...</p>
                </div>
            </div>
        );
    }

    const currentTranslation = getTranslation(currentPackage, activeLanguage);
    const packageImage = currentPackage.image || currentPackage.destination?.image || "";

    return (
        <div className="bg-[var(--bg)] min-h-full">
            {/* Main Content - Two Column Layout */}
            <div className="mx-auto max-w-[1400px]">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-[var(--navy)]">Edit Packages</h1>
                    <p className="mt-2 text-slate-500">
                        Manage packages, translations, destinations, and itineraries
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar - Package List */}
                    <aside className="w-full lg:w-72 flex-shrink-0">
                        <div className="lg:sticky lg:top-24">
                            <div className="lux-card rounded-2xl bg-white p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-bold text-[var(--navy)]">Packages</h2>
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(true)}
                                        className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center hover:bg-green-700 transition-colors"
                                        title="Add Package"
                                    >
                                        <span className="material-symbols-outlined text-lg">add</span>
                                    </button>
                                </div>
                                <div className="flex lg:block gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 space-y-0 lg:space-y-2 lg:max-h-[40vh] lg:overflow-y-auto pr-1">
                                    {(Object.keys(packages) as PackageId[]).map((pkgId) => {
                                        const pkg = packages[pkgId];
                                        const isActive = editPackageId === pkgId;
                                        const pkgImage = pkg?.image || pkg?.destination?.image;
                                        const pkgPrice = pkg?.price || pkg?.destination?.price;
                                        return (
                                            <button
                                                key={pkgId}
                                                type="button"
                                                onClick={() => setEditPackageId(pkgId)}
                                                className={`min-w-[240px] lg:min-w-0 w-full text-left p-3 rounded-xl transition-all ${isActive
                                                    ? 'bg-[var(--navy)] text-white'
                                                    : 'bg-slate-50 hover:bg-slate-100'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    {/* Thumbnail */}
                                                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-slate-200">
                                                        {pkgImage && (
                                                            <div
                                                                className="w-full h-full bg-cover bg-center"
                                                                style={{ backgroundImage: `url(${pkgImage})` }}
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`font-semibold truncate text-sm ${isActive ? 'text-white' : 'text-[var(--navy)]'}`}>
                                                            {pkg?.name || pkgId}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            {/* Language Indicators */}
                                                            {SUPPORTED_LANGUAGES.map((lang) => (
                                                                <span
                                                                    key={lang}
                                                                    className={`text-[9px] font-bold uppercase px-1 rounded ${hasLanguageContent(pkg, lang)
                                                                        ? isActive ? 'bg-white/30 text-white' : 'bg-green-100 text-green-700'
                                                                        : isActive ? 'bg-white/10 text-white/50' : 'bg-slate-100 text-slate-400'
                                                                        }`}
                                                                >
                                                                    {lang}
                                                                </span>
                                                            ))}
                                                            <span className={`text-xs ${isActive ? 'text-white/70' : 'text-slate-400'}`}>
                                                                {pkgPrice}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="lux-card rounded-2xl bg-white p-4 mt-4 hidden lg:block">
                                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Quick Actions</h3>
                                <div className="space-y-2">
                                    {/* Show on Homepage Toggle */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">Show on Homepage</span>
                                        <button
                                            onClick={() => handleToggleShowOnHomepage(editPackageId)}
                                            className={`relative inline-flex flex-shrink-0 w-10 h-5 rounded-full transition-colors duration-200 ${currentPackage?.showOnHomepage !== false ? 'bg-green-500' : 'bg-slate-300'}`}
                                        >
                                            <span className={`inline-block w-3.5 h-3.5 bg-white rounded-full shadow transform transition-transform duration-200 mt-[3px] ${currentPackage?.showOnHomepage !== false ? 'translate-x-5' : 'translate-x-1'}`} />
                                        </button>
                                    </div>
                                    {/* Selected Toggle */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">Selected Package</span>
                                        <button
                                            onClick={() => handleToggleIsSelected(editPackageId)}
                                            className={`relative inline-flex flex-shrink-0 w-10 h-5 rounded-full transition-colors duration-200 ${currentPackage?.isSelected ? 'bg-[var(--gold)]' : 'bg-slate-300'}`}
                                        >
                                            <span className={`inline-block w-3.5 h-3.5 bg-white rounded-full shadow transform transition-transform duration-200 mt-[3px] ${currentPackage?.isSelected ? 'translate-x-5' : 'translate-x-1'}`} />
                                        </button>
                                    </div>
                                    {/* Delete Button */}
                                    <button
                                        type="button"
                                        onClick={() => handleRemovePackage(editPackageId)}
                                        className="w-full mt-2 py-2 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-1"
                                    >
                                        <span className="material-symbols-outlined text-base">delete</span>
                                        Delete Package
                                    </button>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content - Edit Form */}
                    <div className="flex-1 min-w-0">

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
                        )
                        }

                        {/* Package Details */}
                        <div className="space-y-6">
                            {/* Basic Info */}
                            <div className="lux-card rounded-3xl bg-white p-6">
                                <h2 className="text-xl font-bold text-[var(--navy)] mb-4">Package Info</h2>
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                    <div className="sm:col-span-2">
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">
                                            Package Name (Internal)
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
                                            Price
                                        </label>
                                        <input
                                            className="lux-field w-full px-3 py-2 text-sm"
                                            value={currentPackage.price || currentPackage.destination?.price || ""}
                                            onChange={(e) =>
                                                updatePackageField(editPackageId, "price", e.target.value)
                                            }
                                            placeholder="€2,499"
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
                                    <div className="sm:col-span-2">
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">
                                            Dates
                                        </label>
                                        <input
                                            className="lux-field w-full px-3 py-2 text-sm"
                                            value={currentPackage.dates || currentPackage.destination?.dates || ""}
                                            onChange={(e) =>
                                                updatePackageField(editPackageId, "dates", e.target.value)
                                            }
                                            placeholder="June 15-22, 2025"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 mt-2">
                                            Booking & Partner
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 mb-1">
                                                    Partner Name
                                                </label>
                                                <input
                                                    className="lux-field w-full px-3 py-2 text-sm"
                                                    value={currentPackage.partner?.name || ""}
                                                    onChange={(e) =>
                                                        updatePackageField(editPackageId, "partner", {
                                                            ...currentPackage.partner,
                                                            name: e.target.value
                                                        })
                                                    }
                                                    placeholder="e.g. Greek Escapes"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 mb-1">
                                                    Affiliate Link
                                                </label>
                                                <input
                                                    className="lux-field w-full px-3 py-2 text-sm"
                                                    value={currentPackage.partner?.url || ""}
                                                    onChange={(e) =>
                                                        updatePackageField(editPackageId, "partner", {
                                                            ...currentPackage.partner,
                                                            url: e.target.value
                                                        })
                                                    }
                                                    placeholder="https://..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-xs font-semibold text-slate-500 mb-2">
                                            Package Image
                                        </label>
                                        <div className="flex gap-4 items-start">
                                            {/* Image Preview */}
                                            <div className="relative w-24 h-18 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0">
                                                {packageImage ? (
                                                    <img
                                                        src={packageImage}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                                                        <span className="material-symbols-outlined text-2xl">image</span>
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
                                                    className={`inline-flex items-center gap-2 rounded-full border border-[var(--navy)] px-3 py-1.5 text-xs font-bold text-[var(--navy)] hover:bg-slate-50 transition-colors cursor-pointer ${uploading ? "opacity-50 pointer-events-none" : ""}`}
                                                >
                                                    <span className="material-symbols-outlined text-sm">upload</span>
                                                    {uploading ? "Uploading..." : "Upload"}
                                                </label>
                                                <input
                                                    className="lux-field w-full px-2 py-1.5 text-xs text-slate-500"
                                                    placeholder="Or enter image URL..."
                                                    value={packageImage}
                                                    onChange={(e) =>
                                                        updatePackageField(editPackageId, "image", e.target.value)
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Multi-Language Content */}
                            <div className="lux-card rounded-3xl bg-white p-6">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                                    <h2 className="text-xl font-bold text-[var(--navy)]">Content Translations</h2>
                                    {/* Language Tabs */}
                                    <div className="flex gap-1 bg-slate-100 rounded-full p-1 overflow-x-auto max-w-full scrollbar-hide">
                                        {SUPPORTED_LANGUAGES.map((lang) => {
                                            const hasContent = hasLanguageContent(currentPackage, lang);
                                            const isActive = activeLanguage === lang;
                                            return (
                                                <button
                                                    key={lang}
                                                    onClick={() => setActiveLanguage(lang)}
                                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all relative ${isActive
                                                        ? 'bg-[var(--navy)] text-white'
                                                        : 'text-slate-600 hover:bg-slate-200'
                                                        }`}
                                                >
                                                    {LANGUAGE_NAMES[lang]}
                                                    {!hasContent && lang !== 'en' && (
                                                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full" title="Missing translation" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Translation Warning */}
                                {activeLanguage !== 'en' && !hasLanguageContent(currentPackage, activeLanguage) && (
                                    <div className="mb-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
                                        <span className="material-symbols-outlined text-amber-500">warning</span>
                                        <p className="text-sm text-amber-800">
                                            <strong>{LANGUAGE_NAMES[activeLanguage]}</strong> translation is missing. English will be used as fallback.
                                        </p>
                                    </div>
                                )}

                                <div className="grid gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">
                                            Title ({LANGUAGE_NAMES[activeLanguage]})
                                        </label>
                                        <input
                                            className="lux-field w-full px-3 py-2 text-sm"
                                            value={currentTranslation.title}
                                            onChange={(e) =>
                                                updateTranslation(editPackageId, activeLanguage, "title", e.target.value)
                                            }
                                            placeholder={activeLanguage === 'en' ? 'Enter title...' : `Enter ${LANGUAGE_NAMES[activeLanguage]} translation...`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">
                                            Description ({LANGUAGE_NAMES[activeLanguage]})
                                        </label>
                                        <textarea
                                            className="lux-field w-full resize-none rounded-2xl px-3 py-2 text-sm"
                                            rows={3}
                                            value={currentTranslation.description}
                                            onChange={(e) =>
                                                updateTranslation(editPackageId, activeLanguage, "description", e.target.value)
                                            }
                                            placeholder={activeLanguage === 'en' ? 'Enter description...' : `Enter ${LANGUAGE_NAMES[activeLanguage]} translation...`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">
                                            Quick Look ({LANGUAGE_NAMES[activeLanguage]})
                                        </label>
                                        <input
                                            className="lux-field w-full px-3 py-2 text-sm"
                                            value={currentTranslation.quickLook}
                                            onChange={(e) =>
                                                updateTranslation(editPackageId, activeLanguage, "quickLook", e.target.value)
                                            }
                                            placeholder="Short tagline for quick preview..."
                                        />
                                    </div>
                                </div>
                            </div>


                            {/* Destination & Services */}
                            <div className="lux-card rounded-3xl bg-white p-6">
                                <h2 className="text-xl font-bold text-[var(--navy)] mb-4">
                                    Destination & Services
                                </h2>

                                <div className="space-y-6">
                                    {/* Destination Selection */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-2">
                                            Linked Destination
                                        </label>
                                        <select
                                            className="lux-field w-full px-3 py-2 text-sm"
                                            value={currentPackage.destinationId || ""}
                                            onChange={(e) =>
                                                handleSetDestination(editPackageId, e.target.value)
                                            }
                                        >
                                            <option value="">-- No Destination Linked --</option>
                                            {galleryItems.map((item) => (
                                                <option key={item._id} value={item._id}>
                                                    {item.title}
                                                </option>
                                            ))}
                                        </select>
                                        <p className="mt-1 text-xs text-slate-400">
                                            Linking a destination will use its image and title if not overridden above.
                                        </p>
                                    </div>

                                    {/* Included Services */}
                                    <label className="block text-xs font-semibold text-slate-500 mb-3">
                                        Included Services
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {INCLUDED_SERVICES.map((service) => {
                                            const isIncluded = (currentPackage.includedServices || []).includes(service.id);
                                            return (
                                                <label
                                                    key={service.id}
                                                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${isIncluded
                                                        ? "border-[var(--navy)] bg-[var(--navy)]/5"
                                                        : "border-slate-200 hover:border-slate-300"
                                                        }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        className="mt-1"
                                                        checked={isIncluded}
                                                        onChange={() => handleToggleService(editPackageId, service.id)}
                                                    />
                                                    <div className="overflow-hidden">
                                                        <span className={`block text-sm font-medium truncate ${isIncluded ? "text-[var(--navy)]" : "text-slate-600"
                                                            }`}>
                                                            <span className="material-symbols-outlined align-middle mr-1 text-lg">
                                                                {service.icon}
                                                            </span>
                                                            {service.label}
                                                        </span>
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Itinerary */}
                        <div className="lux-card rounded-3xl bg-white p-8 shadow-sm border border-slate-100">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
                                <h2 className="text-2xl font-bold text-[var(--navy)] tracking-tight">Itinerary</h2>
                                <div className="flex items-center gap-4">
                                    {/* Language Tabs - Segmented Control Style */}
                                    <div className="flex p-1 bg-slate-100 rounded-full border border-slate-200">
                                        {SUPPORTED_LANGUAGES.map((lang) => {
                                            const isActive = itineraryLanguage === lang;
                                            return (
                                                <button
                                                    key={lang}
                                                    onClick={() => setItineraryLanguage(lang)}
                                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${isActive
                                                        ? 'bg-[var(--navy)] text-white shadow-md transform scale-105'
                                                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                                                        }`}
                                                >
                                                    {LANGUAGE_NAMES[lang]}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => addItineraryDay(editPackageId)}
                                        className="rounded-full px-5 py-2.5 text-xs font-bold bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/30 hover:shadow-green-500/40 hover:-translate-y-0.5 transition-all flex items-center gap-2 group"
                                    >
                                        <span className="material-symbols-outlined text-lg group-hover:rotate-90 transition-transform">add</span>
                                        Add Day
                                    </button>
                                </div>
                            </div>

                            {/* Translation Warning for Itinerary */}
                            {itineraryLanguage !== 'en' && (
                                <div className="mb-6 px-5 py-4 bg-blue-50/50 border border-blue-100 rounded-2xl flex items-center gap-3 text-blue-800">
                                    <span className="material-symbols-outlined text-blue-500">translate</span>
                                    <p className="text-sm font-medium">
                                        Editing <strong>{LANGUAGE_NAMES[itineraryLanguage]}</strong> translations. Empty fields will fall back to English.
                                    </p>
                                </div>
                            )}

                            <div className="grid gap-6 lg:grid-cols-2">
                                {currentPackage.itinerary.map((day, dayIndex) => {
                                    const dayContent = getItineraryDayContent(day, itineraryLanguage);
                                    const enContent = getItineraryDayContent(day, 'en');
                                    const hasTranslation = itineraryLanguage === 'en' ||
                                        (day.translations?.[itineraryLanguage]?.title || day.translations?.[itineraryLanguage]?.items?.length);

                                    return (
                                        <div
                                            key={day.day}
                                            className={`rounded-3xl p-6 transition-all duration-300 group ${hasTranslation
                                                ? 'bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300'
                                                : 'bg-amber-50/30 border border-amber-200'
                                                }`}
                                        >
                                            <div className="mb-5 flex items-center gap-4">
                                                <div className="relative">
                                                    <span className="grid h-12 w-12 place-items-center rounded-full bg-[var(--navy)] text-base font-bold text-white shadow-lg shadow-blue-900/20 group-hover:scale-110 transition-transform duration-300">
                                                        {day.day}
                                                    </span>
                                                </div>
                                                <div className="flex-1">
                                                    <input
                                                        className="w-full px-5 py-3 rounded-full bg-slate-50 border border-slate-200 text-sm font-bold text-[var(--navy)] placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[var(--navy)] focus:ring-4 focus:ring-blue-500/10 transition-all"
                                                        placeholder={itineraryLanguage !== 'en' ? `${enContent.title} (English)` : "Day Title"}
                                                        value={dayContent.title}
                                                        onChange={(e) =>
                                                            updateItineraryDayContent(
                                                                editPackageId,
                                                                dayIndex,
                                                                itineraryLanguage,
                                                                "title",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>
                                                {currentPackage.itinerary.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItineraryDay(editPackageId, dayIndex)}
                                                        className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all transform hover:rotate-90"
                                                        title="Remove day"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">close</span>
                                                    </button>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between mb-2 pl-2 pr-1">
                                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-[var(--navy)] transition-colors">
                                                    Activities ({LANGUAGE_NAMES[itineraryLanguage]})
                                                </label>
                                                <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                                    {dayContent.items.filter(i => i.trim()).length} items
                                                </span>
                                            </div>
                                            <div className="relative">
                                                <textarea
                                                    className="w-full resize-none rounded-[20px] bg-slate-50 border border-slate-200 px-5 py-4 text-sm text-slate-600 focus:outline-none focus:bg-white focus:border-[var(--navy)] focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-400/70"
                                                    rows={5}
                                                    placeholder={itineraryLanguage !== 'en' && enContent.items.length
                                                        ? `English:\n${enContent.items.slice(0, 3).map(i => `• ${i}`).join('\n')}...`
                                                        : "• One activity per line..."
                                                    }
                                                    value={dayContent.items.join("\n")}
                                                    onChange={(e) =>
                                                        updateItineraryDayContent(
                                                            editPackageId,
                                                            dayIndex,
                                                            itineraryLanguage,
                                                            "items",
                                                            e.target.value.split("\n")
                                                        )
                                                    }
                                                />
                                                {/* Copy from English button for non-English languages */}
                                                {itineraryLanguage !== 'en' && !hasTranslation && (
                                                    <div className="absolute bottom-3 right-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                updateItineraryDayContent(editPackageId, dayIndex, itineraryLanguage, "title", enContent.title);
                                                                updateItineraryDayContent(editPackageId, dayIndex, itineraryLanguage, "items", enContent.items);
                                                            }}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full text-xs font-bold text-blue-600 shadow-sm border border-blue-100 hover:bg-blue-50 transition-all"
                                                        >
                                                            <span className="material-symbols-outlined text-xs">content_copy</span>
                                                            Copy English
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Save Bar */}
                    {/* Floating Save Button */}
                    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
                        {saveStatus && (
                            <div className={`px-4 py-2 rounded-full bg-white shadow-lg text-sm font-semibold ${saveStatus.includes("success")
                                ? "text-green-600"
                                : "text-red-600"
                                }`}>
                                {saveStatus}
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={saving}
                            className="cta-luxe rounded-full bg-[linear-gradient(135deg,_#ec4899,_#3b82f6)] px-8 py-4 text-sm font-bold text-white shadow-xl shadow-blue-500/30 disabled:opacity-50 hover:scale-105 transition-transform"
                        >
                            {saving ? "Saving..." : "💾 Save Changes"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

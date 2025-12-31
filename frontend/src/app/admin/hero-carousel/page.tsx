"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { HeroSlide, HeroSlideTranslatedContent, SupportedLanguage } from "@/types/hero";
import { SUPPORTED_LANGUAGES, LANGUAGE_NAMES } from "@/types";
import { api, UPLOADS_URL } from "@/config/api";
import { HeroSection } from "@/components/sections/HeroSection";

export default function HeroCarouselAdmin() {
    const router = useRouter();
    const [isAuthed, setIsAuthed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [adminToken, setAdminToken] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Data state
    const [slides, setSlides] = useState<HeroSlide[]>([]);
    const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
    const [activeLanguage, setActiveLanguage] = useState<SupportedLanguage>("en");
    const [previewLanguage, setPreviewLanguage] = useState<SupportedLanguage>("en");

    // UI state
    const [saving, setSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState("");
    const [uploading, setUploading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showPreview, setShowPreview] = useState(true);
    const [draggedSlide, setDraggedSlide] = useState<HeroSlide | null>(null);

    // Preview ref
    const heroBgRef = useRef<HTMLDivElement>(null);

    // Check auth on mount
    useEffect(() => {
        const token = sessionStorage.getItem("menescape-admin-token");
        if (!token) {
            router.push("/admin/login");
            return;
        }

        // Verify token
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

    // Load slides
    useEffect(() => {
        if (!isAuthed) return;
        loadSlides();
    }, [isAuthed]);

    const loadSlides = async () => {
        try {
            const response = await fetch(api.heroCarousel.admin, {
                headers: { Authorization: `Bearer ${adminToken}` },
            });
            if (response.ok) {
                const data = await response.json();
                setSlides(data);
                if (data.length > 0 && !editingSlide) {
                    setEditingSlide(data[0]);
                }
            }
        } catch (error) {
            console.error("Failed to load slides:", error);
        }
    };

    const handleSave = async () => {
        if (!editingSlide) return;

        setSaving(true);
        setSaveStatus("");

        try {
            const url = editingSlide._id
                ? api.heroCarousel.update(editingSlide._id)
                : api.heroCarousel.create;

            const method = editingSlide._id ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${adminToken}`,
                },
                body: JSON.stringify(editingSlide),
            });

            if (!response.ok) {
                throw new Error("Save failed");
            }

            setSaveStatus("Saved successfully!");
            await loadSlides();
            if (showAddModal) {
                setShowAddModal(false);
            }
        } catch (error) {
            setSaveStatus("Save failed. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this slide?")) return;

        try {
            const response = await fetch(api.heroCarousel.delete(id), {
                method: "DELETE",
                headers: { Authorization: `Bearer ${adminToken}` },
            });

            if (response.ok) {
                await loadSlides();
                if (editingSlide?._id === id) {
                    const remainingSlides = slides.filter(s => s._id !== id);
                    setEditingSlide(remainingSlides[0] || null);
                }
                setSaveStatus("Slide deleted successfully!");
            }
        } catch (error) {
            setSaveStatus("Delete failed.");
        }
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !editingSlide) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(api.upload.image, {
                method: "POST",
                headers: { Authorization: `Bearer ${adminToken}` },
                body: formData,
            });

            if (!response.ok) throw new Error("Upload failed");

            const data = await response.json();
            // data.url is already the full path like "/uploads/filename.jpg"
            // UPLOADS_URL is "http://localhost:3001" (without /api)
            const imageUrl = data.url.startsWith('http')
                ? data.url
                : `${UPLOADS_URL}${data.url}`;

            setEditingSlide({ ...editingSlide, imageUrl });
        } catch (error) {
            setSaveStatus("Image upload failed");
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const updateTranslation = (
        language: SupportedLanguage,
        field: keyof HeroSlideTranslatedContent,
        value: string
    ) => {
        if (!editingSlide) return;

        const currentTranslations = editingSlide.translations;
        const fallbackContent = currentTranslations.en;
        const currentLangContent = currentTranslations[language] || {
            label: fallbackContent.label,
            title: fallbackContent.title,
            highlight: fallbackContent.highlight,
            subhead: fallbackContent.subhead,
            primaryCta: fallbackContent.primaryCta,
            secondaryCta: fallbackContent.secondaryCta,
        };

        setEditingSlide({
            ...editingSlide,
            translations: {
                ...currentTranslations,
                [language]: {
                    ...currentLangContent,
                    [field]: value,
                },
            },
        });
    };

    const handleAddNew = () => {
        const newSlide: HeroSlide = {
            imageUrl: "/05.jpg",
            order: slides.length + 1,
            transitionDuration: 5000,
            isActive: true,
            translations: {
                en: {
                    label: "New Slide",
                    title: "Title",
                    highlight: "Highlight",
                    subhead: "Subheading text",
                    primaryCta: "Primary CTA",
                    secondaryCta: "Secondary CTA",
                },
            },
        };
        setEditingSlide(newSlide);
        setShowAddModal(true);
    };

    const handleLogout = () => {
        sessionStorage.removeItem("menescape-admin-token");
        router.push("/admin/login");
    };

    // Drag and drop handlers
    const handleDragStart = (slide: HeroSlide) => {
        setDraggedSlide(slide);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = async (targetSlide: HeroSlide) => {
        if (!draggedSlide || draggedSlide._id === targetSlide._id) {
            setDraggedSlide(null);
            return;
        }

        const draggedIndex = slides.findIndex(s => s._id === draggedSlide._id);
        const targetIndex = slides.findIndex(s => s._id === targetSlide._id);

        if (draggedIndex === -1 || targetIndex === -1) {
            setDraggedSlide(null);
            return;
        }

        // Reorder the slides array
        const newSlides = [...slides];
        const [removed] = newSlides.splice(draggedIndex, 1);
        newSlides.splice(targetIndex, 0, removed);

        // Update order field for all slides (starting from 1)
        const updatedSlides = newSlides.map((slide, index) => ({
            ...slide,
            order: index + 1
        }));

        setSlides(updatedSlides);
        setDraggedSlide(null);

        // Save the new order to the backend using bulk reorder endpoint
        try {
            const orderUpdates = updatedSlides.map(slide => ({
                id: slide._id!,
                order: slide.order
            }));

            const response = await fetch(api.heroCarousel.reorder, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${adminToken}`,
                },
                body: JSON.stringify(orderUpdates),
            });

            if (!response.ok) {
                throw new Error("Reorder failed");
            }

            setSaveStatus("Order updated successfully!");
            setTimeout(() => setSaveStatus(""), 3000);
        } catch (error) {
            setSaveStatus("Failed to update order");
            await loadSlides(); // Reload to reset state
        }
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

    if (!isAuthed) return null;

    const currentContent = editingSlide?.translations[activeLanguage] || editingSlide?.translations.en;

    return (
        <div className="bg-[var(--bg)] min-h-screen">
            <div className="mx-auto max-w-[1600px] p-6">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--navy)]">Hero Carousel Management</h1>
                        <p className="mt-2 text-slate-500">Manage homepage hero carousel slides</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => router.push("/admin")}
                            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            ← Back to Admin
                        </button>
                        <button
                            onClick={handleLogout}
                            className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sidebar - Slides List */}
                    <aside className="lg:col-span-1">
                        <div className="lux-card rounded-2xl bg-white p-4 sticky top-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="font-bold text-[var(--navy)]">Slides</h2>
                                    <p className="text-xs text-slate-500 mt-0.5">Drag to reorder</p>
                                </div>
                                <button
                                    onClick={handleAddNew}
                                    className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center hover:bg-green-700 transition-colors"
                                    title="Add Slide"
                                >
                                    <span className="material-symbols-outlined text-lg">add</span>
                                </button>
                            </div>

                            <div className="space-y-2 max-h-[70vh] overflow-y-auto">
                                {slides.map((slide, index) => {
                                    const isActive = editingSlide?._id === slide._id;
                                    const isDragging = draggedSlide?._id === slide._id;
                                    return (
                                        <div
                                            key={slide._id || index}
                                            draggable
                                            onDragStart={() => handleDragStart(slide)}
                                            onDragOver={handleDragOver}
                                            onDrop={() => handleDrop(slide)}
                                            onDragEnd={() => setDraggedSlide(null)}
                                            className={`w-full text-left p-3 rounded-xl transition-all cursor-move ${isDragging
                                                ? 'opacity-50 scale-95'
                                                : isActive
                                                    ? 'bg-[var(--navy)] text-white'
                                                    : 'bg-slate-50 hover:bg-slate-100'
                                                }`}
                                        >
                                            <button
                                                onClick={() => setEditingSlide(slide)}
                                                className="w-full text-left"
                                            >
                                                <div className="flex items-center gap-3">
                                                    {/* Drag Handle Icon */}
                                                    <div className={`flex-shrink-0 ${isActive ? 'text-white/70' : 'text-slate-400'}`}>
                                                        <span className="material-symbols-outlined text-lg">drag_indicator</span>
                                                    </div>

                                                    <div
                                                        className="w-12 h-12 rounded-lg bg-cover bg-center flex-shrink-0"
                                                        style={{ backgroundImage: `url(${slide.imageUrl})` }}
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`font-semibold truncate text-sm ${isActive ? 'text-white' : 'text-[var(--navy)]'
                                                            }`}>
                                                            {slide.translations.en.title}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className={`text-xs ${isActive ? 'text-white/70' : 'text-slate-400'
                                                                }`}>
                                                                Order: {slide.order}
                                                            </span>
                                                            {!slide.isActive && (
                                                                <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
                                                                    Inactive
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </aside>

                    {/* Main Content - Edit Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {editingSlide && (
                            <>
                                {/* Image & Basic Settings */}
                                <div className="lux-card rounded-3xl bg-white p-6">
                                    <h2 className="text-xl font-bold text-[var(--navy)] mb-4">Slide Settings</h2>

                                    <div className="space-y-4">
                                        <div className="sm:col-span-2">
                                            <label className="block text-xs font-semibold text-slate-500 mb-1">
                                                Background Image
                                            </label>
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-32 h-20 rounded-lg bg-cover bg-center border-2 border-slate-200"
                                                    style={{ backgroundImage: `url(${editingSlide.imageUrl})` }}
                                                />
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                />
                                                <button
                                                    onClick={() => fileInputRef.current?.click()}
                                                    disabled={uploading}
                                                    className="rounded-full bg-[var(--navy)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                                                >
                                                    {uploading ? "Uploading..." : "Upload Image"}
                                                </button>
                                            </div>
                                            <input
                                                type="text"
                                                className="lux-field w-full px-3 py-2 text-sm mt-2"
                                                value={editingSlide.imageUrl}
                                                onChange={(e) =>
                                                    setEditingSlide({ ...editingSlide, imageUrl: e.target.value })
                                                }
                                                placeholder="Or enter image URL"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 mb-1">
                                                Transition Duration
                                            </label>
                                            <select
                                                className="lux-field w-full px-3 py-2 text-sm"
                                                value={editingSlide.transitionDuration}
                                                onChange={(e) =>
                                                    setEditingSlide({
                                                        ...editingSlide,
                                                        transitionDuration: parseInt(e.target.value),
                                                    })
                                                }
                                            >
                                                <option value="3000">Fast (3 seconds)</option>
                                                <option value="5000">Normal (5 seconds)</option>
                                                <option value="7000">Slow (7 seconds)</option>
                                                <option value="10000">Very Slow (10 seconds)</option>
                                                <option value="15000">Extra Slow (15 seconds)</option>
                                            </select>
                                            <p className="text-xs text-slate-400 mt-1">
                                                How long this slide displays before transitioning
                                            </p>
                                        </div>

                                        <div className="sm:col-span-2">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={editingSlide.isActive}
                                                    onChange={(e) =>
                                                        setEditingSlide({
                                                            ...editingSlide,
                                                            isActive: e.target.checked,
                                                        })
                                                    }
                                                    className="rounded border-gray-300"
                                                />
                                                <span className="text-sm font-semibold text-slate-700">
                                                    Active (visible on homepage)
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Multi-Language Text Editor */}
                                <div className="lux-card rounded-3xl bg-white p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-xl font-bold text-[var(--navy)]">Content</h2>

                                        {/* Language Tabs */}
                                        <div className="flex gap-2">
                                            {SUPPORTED_LANGUAGES.map((lang) => (
                                                <button
                                                    key={lang}
                                                    onClick={() => setActiveLanguage(lang)}
                                                    className={` px-3 py-1.5 text-xs font-bold uppercase rounded-lg transition-colors ${activeLanguage === lang
                                                        ? 'bg-[var(--navy)] text-white'
                                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                        }`}
                                                >
                                                    {LANGUAGE_NAMES[lang]}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {currentContent && (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 mb-1">
                                                    Label
                                                </label>
                                                <input
                                                    type="text"
                                                    className="lux-field w-full px-3 py-2 text-sm"
                                                    value={currentContent.label}
                                                    onChange={(e) =>
                                                        updateTranslation(activeLanguage, "label", e.target.value)
                                                    }
                                                    placeholder="e.g., MenEscape — The Gateway"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 mb-1">
                                                    Title
                                                </label>
                                                <input
                                                    type="text"
                                                    className="lux-field w-full px-3 py-2 text-sm"
                                                    value={currentContent.title}
                                                    onChange={(e) =>
                                                        updateTranslation(activeLanguage, "title", e.target.value)
                                                    }
                                                    placeholder="e.g., Your body. Your rules."
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 mb-1">
                                                    Highlight (Gradient Text)
                                                </label>
                                                <input
                                                    type="text"
                                                    className="lux-field w-full px-3 py-2 text-sm"
                                                    value={currentContent.highlight}
                                                    onChange={(e) =>
                                                        updateTranslation(activeLanguage, "highlight", e.target.value)
                                                    }
                                                    placeholder="e.g., Your getaway."
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 mb-1">
                                                    Subheading
                                                </label>
                                                <textarea
                                                    className="lux-field w-full px-3 py-2 text-sm resize-none"
                                                    rows={3}
                                                    value={currentContent.subhead}
                                                    onChange={(e) =>
                                                        updateTranslation(activeLanguage, "subhead", e.target.value)
                                                    }
                                                    placeholder="Description text"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-500 mb-1">
                                                        Primary CTA Text
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="lux-field w-full px-3 py-2 text-sm"
                                                        value={currentContent.primaryCta}
                                                        onChange={(e) =>
                                                            updateTranslation(activeLanguage, "primaryCta", e.target.value)
                                                        }
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-500 mb-1">
                                                        Secondary CTA Text
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="lux-field w-full px-3 py-2 text-sm"
                                                        value={currentContent.secondaryCta}
                                                        onChange={(e) =>
                                                            updateTranslation(activeLanguage, "secondaryCta", e.target.value)
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        {editingSlide._id && (
                                            <button
                                                onClick={() => editingSlide._id && handleDelete(editingSlide._id)}
                                                className="rounded-full border border-red-200 px-6 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                Delete Slide
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {saveStatus && (
                                            <p className={`text-sm ${saveStatus.includes('success') ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                {saveStatus}
                                            </p>
                                        )}
                                        <button
                                            onClick={() => setShowPreview(!showPreview)}
                                            className="rounded-full border border-slate-300 px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                                        >
                                            {showPreview ? "Hide" : "Show"} Preview
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="rounded-full bg-green-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-green-700 transition-colors disabled:opacity-50"
                                        >
                                            {saving ? "Saving..." : "Save Changes"}
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Live Preview */}
                        {showPreview && (
                            <div className="lux-card rounded-3xl bg-white p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold text-[var(--navy)]">Live Preview</h2>

                                    {/* Preview Language Selector */}
                                    <div className="flex gap-2">
                                        {SUPPORTED_LANGUAGES.map((lang) => (
                                            <button
                                                key={lang}
                                                onClick={() => setPreviewLanguage(lang)}
                                                className={`px-3 py-1.5 text-xs font-bold uppercase rounded-lg transition-colors ${previewLanguage === lang
                                                    ? 'bg-[var(--gold)] text-white'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                    }`}
                                            >
                                                {LANGUAGE_NAMES[lang]}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="relative overflow-hidden rounded-2xl border-4 border-slate-200">
                                    <div className="transform scale-75 origin-top-left w-[133.33%] h-[85vh]">
                                        <HeroSection
                                            slides={editingSlide ? [editingSlide] : []}
                                            language={previewLanguage}
                                            motionEnabled={false}
                                            heroBgRef={heroBgRef}
                                        />
                                    </div>
                                </div>
                                <p className="mt-2 text-xs text-slate-500 text-center">
                                    Preview showing current slide only (scaled down). Save to see changes on homepage.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

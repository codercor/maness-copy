"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { GalleryItem } from "@/types";
import { api, UPLOADS_URL } from "@/config/api";

interface GalleryItemWithId extends GalleryItem {
    _id: string;
}

export default function AdminGalleryPage() {
    const router = useRouter();
    const [isAuthed, setIsAuthed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [adminToken, setAdminToken] = useState("");

    // Data state
    const [galleryItems, setGalleryItems] = useState<GalleryItemWithId[]>([]);
    const [editItem, setEditItem] = useState<GalleryItemWithId | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);

    // Form state
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // New item form
    const [newItem, setNewItem] = useState<Partial<GalleryItem>>({
        title: "",
        description: "",
        duration: "",
        image: "",
        quickLook: "",
        featured: false,
    });

    // Check auth on mount
    useEffect(() => {
        const token = sessionStorage.getItem("menescape-admin-token");
        if (!token) {
            router.push("/admin/login");
            return;
        }

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

    // Load gallery items
    useEffect(() => {
        if (!isAuthed) return;

        fetch(api.gallery.list, { cache: "no-store" })
            .then((res) => res.json())
            .then((data: GalleryItemWithId[]) => {
                setGalleryItems(data);
            })
            .catch(console.error);
    }, [isAuthed]);

    const handleCreate = async () => {
        setSaving(true);
        try {
            const response = await fetch(api.gallery.create, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${adminToken}`,
                },
                body: JSON.stringify(newItem),
            });

            if (response.ok) {
                const created = await response.json();
                setGalleryItems((prev) => [...prev, created]);
                setShowAddModal(false);
                setNewItem({
                    title: "",
                    description: "",
                    duration: "",
                    image: "",
                    quickLook: "",
                    featured: false,
                });
            }
        } catch (error) {
            console.error("Failed to create:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleUpdate = async () => {
        if (!editItem) return;
        setSaving(true);

        try {
            const response = await fetch(api.gallery.update(editItem._id), {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${adminToken}`,
                },
                body: JSON.stringify(editItem),
            });

            if (response.ok) {
                const updated = await response.json();
                setGalleryItems((prev) =>
                    prev.map((item) => (item._id === updated._id ? updated : item))
                );
                setEditItem(null);
            }
        } catch (error) {
            console.error("Failed to update:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this item?")) return;

        try {
            const response = await fetch(api.gallery.delete(id), {
                method: "DELETE",
                headers: { Authorization: `Bearer ${adminToken}` },
            });

            if (response.ok) {
                setGalleryItems((prev) => prev.filter((item) => item._id !== id));
            }
        } catch (error) {
            console.error("Failed to delete:", error);
        }
    };

    const handleToggleFeatured = async (item: GalleryItemWithId) => {
        const newFeatured = !item.featured;

        // Optimistically update UI
        setGalleryItems((prev) =>
            prev.map((i) => (i._id === item._id ? { ...i, featured: newFeatured } : i))
        );

        try {
            const response = await fetch(api.gallery.update(item._id), {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${adminToken}`,
                },
                body: JSON.stringify({ ...item, featured: newFeatured }),
            });

            if (!response.ok) {
                // Revert on error
                setGalleryItems((prev) =>
                    prev.map((i) => (i._id === item._id ? { ...i, featured: !newFeatured } : i))
                );
            }
        } catch (error) {
            console.error("Failed to toggle featured:", error);
            // Revert on error
            setGalleryItems((prev) =>
                prev.map((i) => (i._id === item._id ? { ...i, featured: !newFeatured } : i))
            );
        }
    };

    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
        isEdit: boolean
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(api.upload.image, {
                method: "POST",
                headers: { Authorization: `Bearer ${adminToken}` },
                body: formData,
            });

            if (response.ok) {
                const { url } = await response.json();
                const fullUrl = `${UPLOADS_URL}${url}`;
                if (isEdit && editItem) {
                    setEditItem({ ...editItem, image: fullUrl });
                } else {
                    setNewItem({ ...newItem, image: fullUrl });
                }
            }
        } catch (error) {
            console.error("Upload failed:", error);
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-[var(--navy)] border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg)]">
            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-black/10 bg-white/90 backdrop-blur">
                <div className="mx-auto flex h-20 w-[min(1400px,95vw)] items-center justify-between">
                    <Link href="/admin" className="flex items-center gap-3">
                        <div className="grid h-12 w-12 place-items-center rounded-full overflow-hidden">
                            <Image
                                src="/Logo_Sade.svg"
                                alt="MenEscape"
                                width={48}
                                height={48}
                                className="h-12 w-12 object-contain scale-[1.6]"
                            />
                        </div>
                        <div>
                            <span className="text-lg font-bold text-[var(--navy)]">MenEscape Admin</span>
                            <p className="text-xs text-slate-500">Gallery Management</p>
                        </div>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin"
                            className="rounded-full border border-[var(--navy)] px-4 py-2 text-sm font-bold text-[var(--navy)]"
                        >
                            ← Back to Packages
                        </Link>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="rounded-full bg-[var(--navy)] px-5 py-2 text-sm font-bold text-white"
                        >
                            + Add Gallery Item
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="mx-auto w-[min(1400px,95vw)] py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-[var(--navy)]">Destination Gallery</h1>
                    <p className="mt-2 text-slate-500">
                        {galleryItems.length} items in gallery
                    </p>
                </div>

                {/* Gallery Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {galleryItems.map((item) => (
                        <article
                            key={item._id}
                            className="lux-card rounded-2xl bg-white overflow-hidden"
                        >
                            <div className="h-40 bg-slate-100 relative">
                                {item.image && (
                                    <div
                                        className="absolute inset-0 bg-cover bg-center"
                                        style={{ backgroundImage: `url(${item.image})` }}
                                    />
                                )}
                                {item.featured && (
                                    <span className="absolute top-2 right-2 bg-[var(--gold)] text-white text-xs px-2 py-1 rounded-full">
                                        Featured
                                    </span>
                                )}
                            </div>
                            <div className="p-4">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <h3 className="font-bold text-[var(--navy)] flex-1 truncate">{item.title}</h3>
                                    {/* Featured Toggle Switch */}
                                    <button
                                        onClick={() => handleToggleFeatured(item)}
                                        className={`relative inline-flex flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 ${item.featured ? 'bg-[var(--gold)]' : 'bg-slate-300'
                                            }`}
                                        title={item.featured ? 'Remove from homepage' : 'Show on homepage'}
                                    >
                                        <span
                                            className={`inline-block w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 mt-1 ${item.featured ? 'translate-x-6 ml-0' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                </div>
                                <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                                    {item.description}
                                </p>
                                <div className="flex items-center justify-between mt-3">
                                    <div className="text-sm">
                                        <span className="inline-flex items-center gap-1 text-[var(--navy)] font-medium">
                                            <span className="material-symbols-outlined text-sm">schedule</span>
                                            {item.duration}
                                        </span>
                                    </div>
                                    {item.featured && (
                                        <span className="inline-flex items-center gap-1 text-xs text-[var(--gold)] font-semibold">
                                            <span className="material-symbols-outlined text-sm">star</span>
                                            Featured
                                        </span>
                                    )}
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={() => setEditItem(item)}
                                        className="flex-1 rounded-full border border-[var(--navy)] px-3 py-1.5 text-xs font-bold text-[var(--navy)]"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="rounded-full border border-red-300 px-3 py-1.5 text-xs font-bold text-red-600"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </main>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-3xl p-6 w-[min(500px,90vw)] max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-[var(--navy)] mb-4">Add Gallery Item</h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Title"
                                className="lux-field w-full px-3 py-2 text-sm"
                                value={newItem.title}
                                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                            />
                            <textarea
                                placeholder="Description"
                                className="lux-field w-full px-3 py-2 text-sm"
                                rows={3}
                                value={newItem.description}
                                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Duration (e.g., 7 nights)"
                                className="lux-field w-full px-3 py-2 text-sm"
                                value={newItem.duration}
                                onChange={(e) => setNewItem({ ...newItem, duration: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Quick Look"
                                className="lux-field w-full px-3 py-2 text-sm"
                                value={newItem.quickLook}
                                onChange={(e) => setNewItem({ ...newItem, quickLook: e.target.value })}
                            />

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">Image</label>
                                <div className="flex gap-2">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, false)}
                                        className="text-sm"
                                    />
                                    {uploading && <span className="text-xs text-slate-400">Uploading...</span>}
                                </div>
                                {newItem.image && (
                                    <div className="mt-2 h-20 w-32 bg-slate-100 rounded overflow-hidden">
                                        <div
                                            className="h-full w-full bg-cover bg-center"
                                            style={{ backgroundImage: `url(${newItem.image})` }}
                                        />
                                    </div>
                                )}
                                <input
                                    type="text"
                                    placeholder="Or enter image URL"
                                    className="lux-field w-full px-3 py-2 text-sm mt-2"
                                    value={newItem.image}
                                    onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                                />
                            </div>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={newItem.featured}
                                    onChange={(e) => setNewItem({ ...newItem, featured: e.target.checked })}
                                />
                                <span className="text-sm">Featured item</span>
                            </label>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-slate-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreate}
                                disabled={saving || !newItem.title}
                                className="flex-1 rounded-full bg-[var(--navy)] px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
                            >
                                {saving ? "Creating..." : "Create"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-3xl p-6 w-[min(500px,90vw)] max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-[var(--navy)] mb-4">Edit Gallery Item</h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Title"
                                className="lux-field w-full px-3 py-2 text-sm"
                                value={editItem.title}
                                onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                            />
                            <textarea
                                placeholder="Description"
                                className="lux-field w-full px-3 py-2 text-sm"
                                rows={3}
                                value={editItem.description}
                                onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Duration"
                                className="lux-field w-full px-3 py-2 text-sm"
                                value={editItem.duration}
                                onChange={(e) => setEditItem({ ...editItem, duration: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Quick Look"
                                className="lux-field w-full px-3 py-2 text-sm"
                                value={editItem.quickLook}
                                onChange={(e) => setEditItem({ ...editItem, quickLook: e.target.value })}
                            />

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">Image</label>
                                {editItem.image && (
                                    <div className="mb-2 h-20 w-32 bg-slate-100 rounded overflow-hidden">
                                        <div
                                            className="h-full w-full bg-cover bg-center"
                                            style={{ backgroundImage: `url(${editItem.image})` }}
                                        />
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        onChange={(e) => handleImageUpload(e, true)}
                                        className="text-sm"
                                    />
                                    {uploading && <span className="text-xs text-slate-400">Uploading...</span>}
                                </div>
                                <input
                                    type="text"
                                    placeholder="Or enter image URL"
                                    className="lux-field w-full px-3 py-2 text-sm mt-2"
                                    value={editItem.image}
                                    onChange={(e) => setEditItem({ ...editItem, image: e.target.value })}
                                />
                            </div>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={editItem.featured}
                                    onChange={(e) => setEditItem({ ...editItem, featured: e.target.checked })}
                                />
                                <span className="text-sm">Featured item</span>
                            </label>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setEditItem(null)}
                                className="flex-1 rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-slate-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdate}
                                disabled={saving}
                                className="flex-1 rounded-full bg-[var(--navy)] px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

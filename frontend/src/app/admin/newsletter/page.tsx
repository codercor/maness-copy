"use client";

import { useEffect, useState } from "react";
import { api } from "@/config/api";
import { motion } from "framer-motion";

interface Subscriber {
    _id: string;
    email: string;
    source: string;
    active: boolean;
    createdAt: string;
}

export default function NewsletterPage() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [copyStatus, setCopyStatus] = useState("");



    const totalPages = Math.ceil(total / limit);

    const fetchSubscribers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${api.newsletter.list}?page=${page}&limit=${limit}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("menescape-token")}`,
                },
            });
            if (res.ok) {
                const data = await res.json();
                setSubscribers(data.data);
                setTotal(data.total);
            }
        } catch (error) {
            console.error("Failed to fetch subscribers:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscribers();
    }, [page]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this subscriber?")) return;
        try {
            const res = await fetch(api.newsletter.delete(id), {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("menescape-token")}`,
                },
            });
            if (res.ok) {
                fetchSubscribers();
            }
        } catch (error) {
            console.error("Failed to delete subscriber:", error);
        }
    };

    const handleCopyAll = async () => {
        try {
            const res = await fetch(api.newsletter.emails, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("menescape-token")}`,
                },
            });
            if (res.ok) {
                const data = await res.json();
                await navigator.clipboard.writeText(data.emails.join(", "));
                setCopyStatus("Copied to clipboard!");
                setTimeout(() => setCopyStatus(""), 3000);
            }
        } catch (error) {
            console.error("Failed to copy emails:", error);
            setCopyStatus("Failed to copy");
        }
    };



    const handleExport = async () => {
        try {
            const res = await fetch(api.newsletter.export, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("menescape-token")}`,
                },
            });
            if (res.ok) {
                const { data } = await res.json();

                // Convert to CSV
                const headers = ["Email", "Source", "Status", "Joined Date"];
                const rows = data.map((sub: Subscriber) => [
                    sub.email,
                    sub.source,
                    sub.active ? "Active" : "Unsubscribed",
                    new Date(sub.createdAt).toLocaleDateString()
                ]);

                const csvContent = [
                    headers.join(","),
                    ...rows.map((row: string[]) => row.map(cell => `"${cell}"`).join(","))
                ].join("\n");

                const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.setAttribute("href", url);
                link.setAttribute("download", `subscribers_export_${new Date().toISOString().split('T')[0]}.csv`);
                link.style.visibility = "hidden";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (error) {
            console.error("Failed to export:", error);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--navy)]">Newsletter Subscribers</h1>
                    <p className="text-slate-500 mt-2">Manage your email list ({total} total)</p>
                </div>

                <div className="flex gap-3">


                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-sm font-semibold text-[var(--navy)]"
                    >
                        <span className="material-symbols-outlined text-[20px]">download</span>
                        Export CSV
                    </button>

                    <button
                        onClick={handleCopyAll}
                        className="flex items-center gap-2 px-4 py-2 bg-[var(--navy)] text-white rounded-xl hover:bg-blue-900 transition-colors text-sm font-semibold shadow-lg shadow-blue-900/20"
                    >
                        <span className="material-symbols-outlined text-[20px]">content_copy</span>
                        Copy All Emails
                    </button>
                </div>
            </div>

            {/* Alert Component */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-4 rounded-2xl bg-amber-50 border border-amber-100 flex items-start gap-3"
            >
                <span className="material-symbols-outlined text-amber-600 mt-0.5">info</span>
                <div>
                    <h3 className="font-semibold text-amber-900">Unsubscribe Link Required</h3>
                    <p className="text-sm text-amber-800 mt-1">
                        When sending newsletters, please remember to include the unsubscribe link:
                        <code className="mx-1 px-2 py-0.5 bg-amber-100 rounded text-amber-900 font-mono text-xs">
                            https://men-escape.com/newsletter/unsubscribe
                        </code>
                    </p>
                </div>
            </motion.div>

            {copyStatus && (
                <div className="fixed bottom-8 right-8 bg-[var(--navy)] text-white px-6 py-3 rounded-xl shadow-xl z-50">
                    {copyStatus}
                </div>
            )}

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Source</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date Joined</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">
                                        Loading subscribers...
                                    </td>
                                </tr>
                            ) : subscribers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">
                                        No subscribers found yet.
                                    </td>
                                </tr>
                            ) : (
                                subscribers.map((sub) => (
                                    <tr key={sub._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="p-4 text-sm font-medium text-[var(--navy)]">{sub.email}</td>
                                        <td className="p-4 text-sm text-slate-500 capitalize">{sub.source}</td>
                                        <td className="p-4">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sub.active
                                                    ? "bg-emerald-100 text-emerald-800"
                                                    : "bg-slate-100 text-slate-600"
                                                    }`}
                                            >
                                                {sub.active ? "Active" : "Unsubscribed"}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-slate-500">
                                            {new Date(sub.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleDelete(sub._id)}
                                                className="p-2 text-slate-400 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                                                title="Delete subscriber"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">delete</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-sm text-slate-500">
                        Page {page} of {totalPages || 1}
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-3 py-1 text-sm border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page >= totalPages}
                            className="px-3 py-1 text-sm border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

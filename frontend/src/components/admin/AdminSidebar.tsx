"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
    const pathname = usePathname();

    const links = [
        { href: "/admin", label: "Packages", icon: "inventory_2" },
        { href: "/admin/gallery", label: "Gallery", icon: "collections" },
        { href: "/admin/users", label: "Users", icon: "group" },
        { href: "/admin/settings", label: "Settings", icon: "settings" },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:sticky top-0 left-0 z-50 h-full w-64 bg-white shadow-sm border-r border-slate-100 
                transform transition-transform duration-200 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-4 h-full overflow-y-auto">
                    {/* Mobile Header */}
                    <div className="flex items-center justify-between mb-6 lg:hidden">
                        <span className="font-bold text-[var(--navy)]">Menu</span>
                        <button onClick={onClose} className="p-1 text-slate-500">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <nav className="space-y-1">
                        {links.map((link) => {
                            const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => onClose()} // Close on mobile navigation
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${isActive
                                        ? "bg-[var(--navy)] !text-white shadow-md shadow-blue-900/10"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-[var(--navy)]"
                                        }`}
                                    style={isActive ? { color: '#ffffff' } : {}}
                                >
                                    <span className="material-symbols-outlined text-[20px]">
                                        {link.icon}
                                    </span>
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </aside>
        </>
    );
}

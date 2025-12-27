"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminSidebar() {
    const pathname = usePathname();

    const links = [
        { href: "/admin", label: "Packages", icon: "inventory_2" },
        { href: "/admin/gallery", label: "Gallery", icon: "collections" },
        { href: "/admin/users", label: "Users", icon: "group" },
        { href: "/admin/settings", label: "Settings", icon: "settings" },
    ];

    return (
        <aside className="w-64 flex-shrink-0 bg-white shadow-sm border-r border-slate-100 min-h-screen">
            <div className="p-4">
                <nav className="space-y-1">
                    {links.map((link) => {
                        const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
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
    );
}

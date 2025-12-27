"use client";

import { useState, useEffect } from "react";
import { api } from "@/config/api";

interface User {
    _id: string;
    email: string;
    name: string;
    role: string;
    picture?: string;
    createdAt?: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = sessionStorage.getItem("menescape-admin-token");
        if (!token) return;

        fetch(api.users.list, {
            headers: { Authorization: `Bearer ${token}` }, // Bearer token validation
        })
            .then(async (res) => {
                if (!res.ok) throw new Error("Failed to fetch users");
                return res.json();
            })
            .then((data) => {
                setUsers(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading users...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-[var(--navy)] mb-6">User Management</h1>
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Joined</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.map((user) => (
                            <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-4 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                                        {user.picture ? (
                                            <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-[var(--navy)] text-white text-xs font-bold">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <span className="font-medium text-slate-700">{user.name}</span>
                                </td>
                                <td className="p-4 text-sm text-slate-600">{user.email}</td>
                                <td className="p-4">
                                    <span className={`inline-flex px-2 py-1 rounded text-xs font-bold uppercase ${user.role === 'admin'
                                        ? 'bg-purple-100 text-purple-700'
                                        : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-slate-500">
                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && (
                    <div className="p-8 text-center text-slate-500">No users found.</div>
                )}
            </div>
        </div>
    );
}

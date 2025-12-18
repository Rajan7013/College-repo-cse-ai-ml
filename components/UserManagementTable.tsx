'use client';

import { useEffect, useState } from 'react';
import { getAllUsers, type UserData } from '@/lib/actions/users';
import UserActions from '@/components/UserActions';
import { useUser } from '@clerk/nextjs';

export default function UserManagementTable() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const { user: currentUser } = useUser();

    useEffect(() => {
        async function fetchUsers() {
            const data = await getAllUsers();
            setUsers(data);
            setLoading(false);
        }
        fetchUsers();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="border-b border-blue-500/20">
                    <tr>
                        <th className="text-left py-4 px-4 text-xs font-bold text-blue-300 uppercase tracking-wider">User</th>
                        <th className="text-left py-4 px-4 text-xs font-bold text-blue-300 uppercase tracking-wider">Role</th>
                        <th className="text-left py-4 px-4 text-xs font-bold text-blue-300 uppercase tracking-wider">Status</th>
                        <th className="text-left py-4 px-4 text-xs font-bold text-blue-300 uppercase tracking-wider">Joined</th>
                        <th className="text-center py-4 px-4 text-xs font-bold text-blue-300 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-blue-500/10">
                    {users.map((userData) => {
                        const isCurrentUser = currentUser?.id === userData.id;
                        return (
                            <tr key={userData.id} className="hover:bg-white/5 transition-colors">
                                <td className="py-4 px-4">
                                    <div>
                                        <p className="font-bold text-white mb-0.5">{userData.profile.displayName}</p>
                                        <p className="text-sm text-blue-300">{userData.email}</p>
                                        {userData.profile.rollNumber && (
                                            <p className="text-xs text-blue-400/70 font-mono mt-0.5">{userData.profile.rollNumber}</p>
                                        )}
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${userData.role === 'admin'
                                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                                        : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                        }`}>
                                        {userData.role === 'admin' ? '👑 Admin' : '🎓 Student'}
                                    </span>
                                    {isCurrentUser && (
                                        <span className="ml-2 text-xs text-cyan-400 font-bold">(You)</span>
                                    )}
                                </td>
                                <td className="py-4 px-4">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${userData.blocked
                                        ? 'bg-red-500/20 text-red-300 border-red-500/30'
                                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                        }`}>
                                        {userData.blocked ? '🚫 Blocked' : '✓ Active'}
                                    </span>
                                </td>
                                <td className="py-4 px-4 text-sm text-blue-200">
                                    {new Date(userData.createdAt).toLocaleDateString()}
                                </td>
                                <td className="py-4 px-4">
                                    <UserActions
                                        userId={userData.id}
                                        userEmail={userData.email}
                                        currentRole={userData.role}
                                        isBlocked={userData.blocked || false}
                                        isCurrentUser={isCurrentUser}
                                    />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {users.length === 0 && (
                <div className="text-center py-8 text-blue-300">
                    No users found
                </div>
            )}
        </div>
    );
}

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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">User</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Role</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Joined</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {users.map((userData) => {
                        const isCurrentUser = currentUser?.id === userData.id;
                        return (
                            <tr key={userData.id} className="hover:bg-gray-50">
                                <td className="py-3 px-4">
                                    <div>
                                        <p className="font-medium text-gray-900">{userData.profile.displayName}</p>
                                        <p className="text-sm text-gray-500">{userData.email}</p>
                                        {userData.profile.rollNumber && (
                                            <p className="text-xs text-gray-400">{userData.profile.rollNumber}</p>
                                        )}
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${userData.role === 'admin'
                                            ? 'bg-purple-100 text-purple-800'
                                            : 'bg-blue-100 text-blue-800'
                                        }`}>
                                        {userData.role === 'admin' ? '👑 Admin' : '🎓 Student'}
                                    </span>
                                    {isCurrentUser && (
                                        <span className="ml-2 text-xs text-gray-500">(You)</span>
                                    )}
                                </td>
                                <td className="py-3 px-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${userData.blocked
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-green-100 text-green-800'
                                        }`}>
                                        {userData.blocked ? '🚫 Blocked' : '✓ Active'}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-500">
                                    {new Date(userData.createdAt).toLocaleDateString()}
                                </td>
                                <td className="py-3 px-4">
                                    <UserActions
                                        userId={userData.id}
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
                <div className="text-center py-8 text-gray-500">
                    No users found
                </div>
            )}
        </div>
    );
}

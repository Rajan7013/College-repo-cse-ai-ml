'use client';

import { useState, useEffect } from 'react';
import { addUserByEmail, getManagedUsers, removeUserByEmail } from '@/lib/actions/users';
import { Trash2, UserPlus, Shield, GraduationCap, Mail } from 'lucide-react';

interface ManagedUser {
    email: string;
    role: 'admin' | 'student';
    addedBy?: string;
    addedAt?: string;
}

export default function UserRoleManager() {
    const [managedUsers, setManagedUsers] = useState<ManagedUser[]>([]);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<'admin' | 'student'>('student');
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {
        setFetchLoading(true);
        const data = await getManagedUsers();
        setManagedUsers(data.users as ManagedUser[]);
        setIsSuperAdmin(data.isSuperAdmin);
        setFetchLoading(false);
    }

    async function handleAddUser(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const res = await addUserByEmail(email, role);
            if (res.success) {
                setMessage('User added successfully!');
                setEmail('');
                loadUsers(); // Refresh list
            } else {
                setMessage(res.message);
            }
        } catch (error) {
            setMessage('Failed to add user.');
        } finally {
            setLoading(false);
        }
    }

    async function handleRemove(targetEmail: string) {
        if (!confirm(`Are you sure you want to remove ${targetEmail} from the managed list?`)) return;

        try {
            const res = await removeUserByEmail(targetEmail);
            if (res.success) {
                loadUsers();
            } else {
                alert(res.message);
            }
        } catch (error) {
            alert('Failed to remove user');
        }
    }

    return (
        <div className="space-y-8">
            {/* Add User Form */}
            <div className="bg-slate-900/50 p-6 rounded-xl border border-blue-500/20">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-emerald-400" />
                    Add User by Email
                </h3>
                <form onSubmit={handleAddUser} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <label className="text-sm text-blue-300 mb-1 block">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="student@example.com"
                                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="w-full md:w-auto">
                        <label className="text-sm text-blue-300 mb-1 block">Role</label>
                        <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
                            <button
                                type="button"
                                onClick={() => setRole('student')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${role === 'student' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                            >
                                Student
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('admin')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${role === 'admin' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
                            >
                                Admin
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full md:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Adding...' : 'Add User'}
                    </button>
                </form>
                {message && <p className={`mt-3 text-sm ${message.includes('success') ? 'text-emerald-400' : 'text-red-400'}`}>{message}</p>}
            </div>

            {/* Managed Users List */}
            <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-purple-400" />
                    Managed Users (Whitelist)
                </h3>

                {fetchLoading ? (
                    <div className="text-center py-4 text-blue-300">Loading whitelist...</div>
                ) : (
                    <div className="overflow-x-auto bg-slate-900/30 rounded-xl border border-white/5">
                        <table className="w-full">
                            <thead className="bg-slate-900/50">
                                <tr>
                                    <th className="text-left py-3 px-4 text-xs font-bold text-blue-300 uppercase">Email</th>
                                    <th className="text-left py-3 px-4 text-xs font-bold text-blue-300 uppercase">Role</th>
                                    <th className="text-left py-3 px-4 text-xs font-bold text-blue-300 uppercase">Added By</th>
                                    <th className="text-right py-3 px-4 text-xs font-bold text-blue-300 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {managedUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="text-center py-8 text-slate-500">No users added to whitelist yet.</td>
                                    </tr>
                                ) : (
                                    managedUsers.map((u) => (
                                        <tr key={u.email} className="hover:bg-white/5">
                                            <td className="py-3 px-4 text-sm text-white font-mono">{u.email}</td>
                                            <td className="py-3 px-4">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'
                                                    }`}>
                                                    {u.role === 'admin' ? <Shield className="h-3 w-3" /> : <GraduationCap className="h-3 w-3" />}
                                                    {u.role.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-xs text-slate-400">{u.addedBy || 'System'}</td>
                                            <td className="py-3 px-4 text-right">
                                                {/* Only SuperAdmin can delete other Admins, but anyone (Admin) can delete Students. 
                                                    Logic: if user is admin, only SuperAdmin can delete. If user is student, Admin can delete.
                                                */}
                                                {(u.role !== 'admin' || isSuperAdmin) && (
                                                    <button
                                                        onClick={() => handleRemove(u.email)}
                                                        className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                        title="Remove from whitelist"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

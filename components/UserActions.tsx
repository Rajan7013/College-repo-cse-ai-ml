'use client';

import { useState } from 'react';
import { changeUserRole, toggleUserBlock, deleteUser } from '@/lib/actions/users';
import { Shield, User, UserX, Check, Trash2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UserActionsProps {
    userId: string;
    userEmail: string;
    currentRole: 'admin' | 'student';
    isBlocked: boolean;
    isCurrentUser: boolean;
}

export default function UserActions({ userId, userEmail, currentRole, isBlocked, isCurrentUser }: UserActionsProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Protect SuperAdmin from any actions
    if (userEmail === 'rajanprasaila@gmail.com') {
        return (
            <div className="flex items-center justify-center" title="Super Admin (Protected)">
                <Shield className="h-5 w-5 text-amber-500" />
            </div>
        );
    }

    const handleRoleChange = async () => {
        if (isCurrentUser) {
            alert('You cannot change your own role');
            return;
        }

        const newRole = currentRole === 'admin' ? 'student' : 'admin';
        const confirmed = confirm(`Change user role to ${newRole}?`);
        if (!confirmed) return;

        setLoading(true);
        const result = await changeUserRole(userId, newRole);

        if (result.success) {
            router.refresh();
        } else {
            alert(result.message);
            setLoading(false);
        }
    };

    const handleToggleBlock = async () => {
        if (isCurrentUser) {
            alert('You cannot block yourself');
            return;
        }

        const newStatus = !isBlocked;
        const confirmed = confirm(`${newStatus ? 'Block' : 'Unblock'} this user?`);
        if (!confirmed) return;

        setLoading(true);
        const result = await toggleUserBlock(userId, newStatus);

        if (result.success) {
            router.refresh();
        } else {
            alert(result.message);
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (isCurrentUser) {
            alert('You cannot delete yourself');
            return;
        }

        const confirmed = confirm('Are you sure you want to delete this user? This action cannot be undone.');
        if (!confirmed) return;

        setLoading(true);
        const result = await deleteUser(userId);

        if (result.success) {
            router.refresh();
        } else {
            alert(result.message);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center">
                <Loader2 className="h-5 w-5 text-cyan-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center space-x-2">
            {/* Role Toggle */}
            <button
                onClick={handleRoleChange}
                disabled={isCurrentUser}
                className={`p-1.5 rounded-lg transition-colors ${currentRole === 'admin'
                    ? 'text-purple-300 hover:bg-purple-500/20'
                    : 'text-blue-200 hover:bg-blue-500/20'
                    } disabled:opacity-30 disabled:cursor-not-allowed`}
                title={isCurrentUser ? 'Cannot change own role' : currentRole === 'admin' ? 'Demote to Student' : 'Promote to Admin'}
            >
                {currentRole === 'admin' ? (
                    <Shield className="h-4 w-4" />
                ) : (
                    <User className="h-4 w-4" />
                )}
            </button>

            {/* Block Toggle */}
            <button
                onClick={handleToggleBlock}
                disabled={isCurrentUser}
                className={`p-1.5 rounded-lg transition-colors ${isBlocked
                    ? 'text-emerald-400 hover:bg-emerald-500/20'
                    : 'text-amber-400 hover:bg-amber-500/20'
                    } disabled:opacity-30 disabled:cursor-not-allowed`}
                title={isCurrentUser ? 'Cannot block yourself' : isBlocked ? 'Unblock User' : 'Block User'}
            >
                {isBlocked ? (
                    <Check className="h-4 w-4" />
                ) : (
                    <UserX className="h-4 w-4" />
                )}
            </button>

            {/* Delete */}
            <button
                onClick={handleDelete}
                disabled={isCurrentUser}
                className="p-1.5 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title={isCurrentUser ? 'Cannot delete yourself' : 'Delete User'}
            >
                <Trash2 className="h-4 w-4" />
            </button>
        </div>
    );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Rocket, LayoutDashboard, Shield, MoreHorizontal, User } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { getUserRole } from '@/lib/actions/resources';

export default function BottomNav() {
    const pathname = usePathname();
    const { isSignedIn } = useUser();
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        async function fetchRole() {
            if (isSignedIn) {
                const role = await getUserRole();
                setUserRole(role);
            }
        }
        fetchRole();
    }, [isSignedIn]);

    const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0A1628]/95 backdrop-blur-lg border-t border-white/10 pb-safe z-50">
            <div className="grid grid-cols-5 h-16 items-center px-2">
                {/* Home */}
                <Link
                    href="/"
                    className={`flex flex-col items-center justify-center space-y-1 ${isActive('/') && pathname === '/' ? 'text-blue-400' : 'text-slate-400'}`}
                >
                    <Home size={20} className={isActive('/') && pathname === '/' ? 'fill-blue-400/20' : ''} />
                    <span className="text-[10px] font-medium">Home</span>
                </Link>

                {/* Resources */}
                <Link
                    href="/resources"
                    className={`flex flex-col items-center justify-center space-y-1 ${isActive('/resources') ? 'text-blue-400' : 'text-slate-400'}`}
                >
                    <BookOpen size={20} className={isActive('/resources') ? 'fill-blue-400/20' : ''} />
                    <span className="text-[10px] font-medium">Library</span>
                </Link>

                {/* Projects */}
                <Link
                    href="/projects"
                    className={`flex flex-col items-center justify-center space-y-1 ${isActive('/projects') ? 'text-cyan-400' : 'text-slate-400'}`}
                >
                    <Rocket size={20} className={isActive('/projects') ? 'fill-cyan-400/20' : ''} />
                    <span className="text-[10px] font-medium">Projects</span>
                </Link>

                {/* Dashboard / Profile */}
                <Link
                    href="/dashboard"
                    className={`flex flex-col items-center justify-center space-y-1 ${isActive('/dashboard') ? 'text-violet-400' : 'text-slate-400'}`}
                >
                    <LayoutDashboard size={20} className={isActive('/dashboard') ? 'fill-violet-400/20' : ''} />
                    <span className="text-[10px] font-medium">Dash</span>
                </Link>

                {/* Admin or Menu */}
                {userRole === 'admin' ? (
                    <Link
                        href="/admin/dashboard"
                        className={`flex flex-col items-center justify-center space-y-1 ${isActive('/admin') ? 'text-rose-400' : 'text-slate-400'}`}
                    >
                        <Shield size={20} className={isActive('/admin') ? 'fill-rose-400/20' : ''} />
                        <span className="text-[10px] font-medium">Admin</span>
                    </Link>
                ) : (
                    <Link
                        href="/profile"
                        className={`flex flex-col items-center justify-center space-y-1 ${isActive('/profile') ? 'text-blue-400' : 'text-slate-400'}`}
                    >
                        <User size={20} className={isActive('/profile') ? 'fill-blue-400/20' : ''} />
                        <span className="text-[10px] font-medium">Profile</span>
                    </Link>
                )}
            </div>
            {/* Safe area spacing for generic mobile/iOS bottom bar */}
            <div className="h-[env(safe-area-inset-bottom)] bg-[#0A1628]"></div>
        </div>
    );
}

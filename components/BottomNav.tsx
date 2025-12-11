'use client';

import Link from 'next/link';
import { Home, Search, BookOpen, User, ShieldCheck } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { getUserRole } from '@/lib/actions/resources';

export default function BottomNav() {
    const pathname = usePathname();
    const { isSignedIn, user } = useUser();
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        async function fetchRole() {
            if (isSignedIn && user) {
                const role = await getUserRole();
                setUserRole(role);
            } else {
                setUserRole(null);
            }
        }
        fetchRole();
    }, [isSignedIn, user]);

    const isActive = (path: string) => pathname === path;

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
            <div className="flex justify-around items-center h-16" style={{ fontFamily: 'var(--font-poppins)' }}>
                <Link
                    href="/"
                    className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/') ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <Home className={`h-6 w-6 ${isActive('/') ? 'fill-current' : ''}`} />
                    <span className="text-[10px] font-semibold tracking-wide">Home</span>
                </Link>

                {isSignedIn ? (
                    <>
                        <Link
                            href="/dashboard"
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/dashboard') ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <BookOpen className={`h-6 w-6 ${isActive('/dashboard') ? 'fill-current' : ''}`} />
                            <span className="text-[10px] font-semibold tracking-wide">Resources</span>
                        </Link>

                        {userRole === 'admin' && (
                            <Link
                                href="/admin/dashboard"
                                className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/admin/dashboard') ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <ShieldCheck className={`h-6 w-6 ${isActive('/admin/dashboard') ? 'fill-current' : ''}`} />
                                <span className="text-[10px] font-semibold tracking-wide">Admin</span>
                            </Link>
                        )}

                        <Link
                            href="/profile"
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/profile') ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <User className={`h-6 w-6 ${isActive('/profile') ? 'fill-current' : ''}`} />
                            <span className="text-[10px] font-semibold tracking-wide">Profile</span>
                        </Link>
                    </>
                ) : (
                    <Link
                        href="/sign-in"
                        className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/sign-in') ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <User className={`h-6 w-6 ${isActive('/sign-in') ? 'fill-current' : ''}`} />
                        <span className="text-[10px] font-semibold tracking-wide">Sign In</span>
                    </Link>
                )}
            </div>
        </div>
    );
}

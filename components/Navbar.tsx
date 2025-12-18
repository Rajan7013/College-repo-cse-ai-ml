'use client';

import Link from 'next/link';
import { Menu, X, GraduationCap, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useUser, SignInButton, SignOutButton } from '@clerk/nextjs';
import { getUserRole } from '@/lib/actions/resources';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isSignedIn, user } = useUser();
    const [userRole, setUserRole] = useState<string | null>(null);

    // Fetch user role when signed in
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

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14">
                    {/* Logo Section */}
                    <div className="flex items-center space-x-2">
                        <div className="bg-orange-500 p-1.5 rounded-lg shadow-md hover:bg-orange-600 transition-colors duration-300">
                            <GraduationCap className="h-6 w-6 text-white" />
                        </div>
                        <Link href="/" className="flex items-center">
                            <span className="text-xl font-bold text-white tracking-tight hover:text-orange-200 transition-colors duration-300">
                                EduNexus
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        <Link
                            href="/"
                            className="text-white text-sm font-medium hover:text-orange-300 transition-colors duration-200 px-3 py-1.5 rounded-md hover:bg-blue-500"
                        >
                            Home
                        </Link>

                        {isSignedIn ? (
                            <>
                                <Link
                                    href="/resources"
                                    className="text-white text-sm font-medium hover:text-orange-300 transition-colors duration-200 px-2 py-1.5 rounded-md hover:bg-blue-500"
                                >
                                    Resources
                                </Link>
                                <Link
                                    href="/projects"
                                    className="text-white text-sm font-medium hover:text-orange-300 transition-colors duration-200 px-2 py-1.5 rounded-md hover:bg-blue-500"
                                >
                                    Projects
                                </Link>

                                {userRole === 'admin' && (
                                    <>
                                        <Link
                                            href="/admin/curriculum"
                                            className="text-white text-sm font-medium hover:text-orange-300 transition-colors duration-200 px-2 py-1.5 rounded-md hover:bg-blue-500"
                                        >
                                            Curriculum
                                        </Link>
                                        <Link
                                            href="/admin/dashboard"
                                            className="text-white text-sm font-medium hover:text-orange-300 transition-colors duration-200 px-2 py-1.5 rounded-md hover:bg-blue-500"
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            href="/admin/upload"
                                            className="text-white text-sm font-medium hover:text-orange-300 transition-colors duration-200 px-2 py-1.5 rounded-md hover:bg-blue-500"
                                        >
                                            Upload
                                        </Link>
                                    </>
                                )}

                                <Link
                                    href="/profile"
                                    className="text-white text-sm font-medium hover:text-orange-300 transition-colors duration-200 px-2 py-1.5 rounded-md hover:bg-blue-500"
                                >
                                    Profile
                                </Link>
                                <Link
                                    href="/settings"
                                    className="text-white text-sm font-medium hover:text-orange-300 transition-colors duration-200 px-2 py-1.5 rounded-md hover:bg-blue-500"
                                >
                                    Settings
                                </Link>

                                <div className="flex items-center space-x-2 ml-1">
                                    <div className="flex items-center space-x-1.5 bg-blue-500 px-2 py-1 rounded-lg">
                                        <User className="h-3.5 w-3.5 text-white" />
                                        <span className="text-white text-xs font-medium truncate max-w-[100px]">
                                            {user?.emailAddresses[0]?.emailAddress || 'User'}
                                        </span>
                                    </div>
                                    <SignOutButton>
                                        <button className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg whitespace-nowrap">
                                            Sign Out
                                        </button>
                                    </SignOutButton>
                                </div>
                            </>
                        ) : (
                            <SignInButton mode="modal">
                                <button className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-1.5 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                                    Sign In
                                </button>
                            </SignInButton>
                        )}
                    </div>

                </div>
            </div>

            {/* Mobile Menu - Completely removed/hidden as we use BottomNav */}
            {/* {isMenuOpen && ( ... )} */}
        </nav>
    );
}
// Mobile menu removed in favor of BottomNav

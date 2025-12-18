'use client';

import Link from 'next/link';
import { Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

export default function Footer() {
    const { user } = useUser();
    const isAdmin = user?.publicMetadata?.role === 'admin';

    return (
        <footer className="relative bg-[#0A1628] border-t border-white/10 pt-8 pb-4 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="inline-block mb-3">
                            <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                                EduNexus
                            </span>
                        </Link>
                        <p className="text-blue-200/60 mb-4 text-xs leading-relaxed max-w-xs">
                            Empowering students and faculty with next-generation tools for academic excellence.
                        </p>
                        <div className="flex gap-3">
                            <a href="#" className="p-1.5 bg-white/5 rounded-full text-blue-300 hover:bg-white/10 hover:text-white transition-all">
                                <Github size={14} />
                            </a>
                            <a href="#" className="p-1.5 bg-white/5 rounded-full text-blue-300 hover:bg-white/10 hover:text-white transition-all">
                                <Twitter size={14} />
                            </a>
                            <a href="#" className="p-1.5 bg-white/5 rounded-full text-blue-300 hover:bg-white/10 hover:text-white transition-all">
                                <Linkedin size={14} />
                            </a>
                        </div>
                    </div>

                    {/* Links Column 1: Essentials (Visible to Everyone) */}
                    <div>
                        <h3 className="text-white font-bold mb-3 text-sm">Platform</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/resources" className="text-blue-200/60 hover:text-blue-300 text-xs transition-colors">
                                    Resources
                                </Link>
                            </li>
                            <li>
                                <Link href="/projects" className="text-blue-200/60 hover:text-blue-300 text-xs transition-colors">
                                    Projects
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Links Column 2: Role Based */}
                    <div>
                        {isAdmin ? (
                            <>
                                <h3 className="text-white font-bold mb-3 text-sm">Admin Tools</h3>
                                <ul className="space-y-2">
                                    <li>
                                        <Link href="/admin/upload" className="text-blue-200/60 hover:text-blue-300 text-xs transition-colors">
                                            Upload Resources
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/admin/curriculum" className="text-blue-200/60 hover:text-blue-300 text-xs transition-colors">
                                            Manage Curriculum
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/dashboard" className="text-blue-200/60 hover:text-blue-300 text-xs transition-colors">
                                            Admin Dashboard
                                        </Link>
                                    </li>
                                </ul>
                            </>
                        ) : (
                            <>
                                <h3 className="text-white font-bold mb-3 text-sm">Quick Links</h3>
                                <ul className="space-y-2">
                                    <li>
                                        <span className="text-blue-200/40 text-xs cursor-not-allowed">
                                            Student Portal (ReadOnly)
                                        </span>
                                    </li>
                                </ul>
                            </>
                        )}
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h3 className="text-white font-bold mb-3 text-sm">Contact</h3>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-blue-200/60 text-xs">
                                <Mail size={14} className="text-blue-400" />
                                <span>support@edunexus.edu</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-center items-center">
                    <p className="text-blue-200/40 text-[10px]">
                        © {new Date().getFullYear()} EduNexus. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
